// Integration checks against an isolated PostgreSQL fixture, never a live project.
const {PGlite}=require(process.env.PGLITE_MODULE || '@electric-sql/pglite');
const fs=require('fs');const assert=require('node:assert/strict');
(async()=>{const db=new PGlite();
await db.exec(`
create role anon; create role authenticated; create role service_role;
create table products(id bigint primary key,name text);
create table admin_users(id uuid primary key,active boolean,role text,full_name text);
create table orders(id uuid primary key default gen_random_uuid(),customer_id uuid,order_number text,customer_full_name text,customer_phone text,customer_email text,customer_organization text,delivery_method text,delivery_state text,delivery_city text,delivery_address text,delivery_landmark text,project_name text,preferred_deadline date,production_instructions text,item_count int,subtotal numeric,design_fee numeric,delivery_fee numeric,final_total numeric,status text,updated_at timestamptz default now(),created_at timestamptz default now());
create table order_items(id uuid primary key default gen_random_uuid(),order_id uuid references orders(id),cart_item_id text,product_id text,product_slug text,product_name text,product_image text,quantity int,base_price numeric,options_total numeric,unit_price numeric,total_price numeric,selections jsonb,artwork_type text check(artwork_type in ('customer-supplied','design-needed')),design_fee numeric,review_mode text default 'artwork',specifications_approved_at timestamptz,specifications_approved_by uuid);
create table order_artworks(id uuid primary key default gen_random_uuid(),order_id uuid,order_item_id uuid,status text);
create table order_pricing_history(order_id uuid,admin_id uuid,admin_name text,production_total numeric,design_fee numeric,delivery_fee numeric,final_total numeric,notes text);
create table order_payments(id uuid default gen_random_uuid(),order_id uuid,customer_id uuid,status text,amount numeric,currency text);
create table order_production_history(order_id uuid,admin_id uuid,admin_name text,previous_status text,new_status text,notes text);
create table customer_notifications(customer_id uuid,order_id uuid,artwork_id uuid,title text,message text,target_path text);
`);
const base=JSON.parse(fs.readFileSync(process.env.BASE_FUNCTIONS || "tests/fixtures/base-functions.json",'utf8')).find(x=>x.function_name==='create_newjersey_order').definition;await db.exec(base);
await db.exec(fs.readFileSync('supabase/migrations/20261017_apparel_custom_split.sql','utf8'));
// Applying twice must retain data and valid constraints.
await db.exec(fs.readFileSync('supabase/migrations/20261017_apparel_custom_split.sql','utf8'));
const admin='11111111-1111-4111-8111-111111111111',customer='22222222-2222-4222-8222-222222222222';
await db.query('insert into admin_users values($1,true,\'owner\',\'Owner\')',[admin]);
let seq=0;
async function create(modes){const items=modes.map((mode,i)=>({cart_item_id:`line-${i}`,product_id:mode==='retail'?'retail-1':'print-1',product_slug:'test',product_name:'Test',quantity:1,base_price:8500,options_total:0,unit_price:8500,total_price:8500,selections:[],design_fee:0,review_mode:mode,artwork_type:mode==='retail'?'not-required':'customer-supplied'}));const order={customer_id:customer,order_number:`TEST-${++seq}`,delivery_method:'pickup',item_count:items.length,subtotal:8500*items.length,design_fee:0,status:modes.includes('artwork')?'awaiting-artwork':'under-review'};const res=await db.query('select create_catalogue_order($1::jsonb,$2::jsonb) result',[JSON.stringify(order),JSON.stringify(items)]);return res.rows[0].result.id;}
async function timestamp(id){return (await db.query('select updated_at::text t from orders where id=$1',[id])).rows[0].t;}
async function price(id){return db.query('select confirm_order_pricing($1,$2,$3,0,\'\')',[id,admin,await timestamp(id)]);}
async function production(id,next='in-production',stamp){return db.query('select update_order_production($1,$2,$3,$4,\'test\')',[id,admin,stamp??await timestamp(id),next]);}
async function pay(id){await db.query('insert into order_payments(order_id,customer_id,status,amount,currency) select id,customer_id,\'verified\',final_total,\'NGN\' from orders where id=$1',[id]);await db.query('update orders set status=\'confirmed\' where id=$1',[id]);}
const retail=await create(['retail']);assert.equal((await db.query('select count(*)::int n from order_artworks where order_id=$1',[retail])).rows[0].n,0);assert.equal((await db.query('select review_mode,artwork_type from order_items where order_id=$1',[retail])).rows[0].artwork_type,'not-required');await price(retail);await db.query("update orders set status='confirmed' where id=$1",[retail]);await assert.rejects(()=>production(retail),/verified payment/);await pay(retail);const stale=await timestamp(retail);await production(retail);await assert.rejects(()=>production(retail,'ready',stale),/changed/);await production(retail,'ready');assert.equal((await db.query('select count(*)::int n from order_production_history where order_id=$1',[retail])).rows[0].n,2);
const mixed=await create(['retail','artwork']);await assert.rejects(()=>price(mixed),/approved artwork/);await db.query("update order_artworks set status='approved' where order_id=$1",[mixed]);await price(mixed);await pay(mixed);await production(mixed);
const jersey=await create(['artwork']);await db.query("delete from order_artworks where order_id=$1",[jersey]);await db.query("update order_items set review_mode='jersey' where order_id=$1",[jersey]);await assert.rejects(()=>price(jersey),/jersey specifications/);await db.query('update order_items set specifications_approved_at=now(),specifications_approved_by=$2 where order_id=$1',[jersey,admin]);await price(jersey);await pay(jersey);await production(jersey);
const historical=await create(['artwork']);await assert.rejects(()=>price(historical),/approved artwork/);
console.log('PASS: migration rerun, retail no artwork, mixed approval, verified payment, stale update, production history, jersey approval, historical custom requirements.');await db.close();})().catch(e=>{console.error(e);process.exit(1)});
