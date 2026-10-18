-- NewJersey digital design projects. Run after the apparel/custom migration.
BEGIN;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS design_service boolean NOT NULL DEFAULT false;
CREATE TABLE IF NOT EXISTS public.design_projects (
 order_id uuid PRIMARY KEY REFERENCES public.orders(id),
 customer_id uuid NOT NULL REFERENCES auth.users(id),
 submission_key uuid NOT NULL,
 designer text NOT NULL CHECK(designer IN ('ink','form')),
 project_type text NOT NULL,
 brief text NOT NULL CHECK(length(brief) BETWEEN 15 AND 3000),
 scope text,
 due_date date,
 included_revisions integer NOT NULL DEFAULT 0 CHECK(included_revisions BETWEEN 0 AND 10),
 revisions_used integer NOT NULL DEFAULT 0 CHECK(revisions_used BETWEEN 0 AND 10),
 round integer NOT NULL DEFAULT 0,
 revision_notes text,
 created_at timestamptz NOT NULL DEFAULT now(),
 updated_at timestamptz NOT NULL DEFAULT now(),
 UNIQUE(customer_id,submission_key)
);
CREATE TABLE IF NOT EXISTS public.design_files (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 order_id uuid NOT NULL REFERENCES public.design_projects(order_id),
 kind text NOT NULL CHECK(kind IN ('reference','delivery')),
 round integer NOT NULL,
 storage_path text NOT NULL UNIQUE,
 file_name text NOT NULL,
 mime_type text NOT NULL,
 file_size bigint NOT NULL CHECK(file_size > 0 AND file_size <= 20971520),
 created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS public.design_history (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), order_id uuid NOT NULL REFERENCES public.design_projects(order_id),
 actor_id uuid NOT NULL, event text NOT NULL, notes text, created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.design_history ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.design_history FROM PUBLIC,anon,authenticated;
GRANT ALL ON public.design_history TO service_role;
CREATE UNIQUE INDEX IF NOT EXISTS design_one_delivery_per_round ON public.design_files(order_id,round) WHERE kind='delivery';
ALTER TABLE public.design_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.design_files ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.design_projects,public.design_files FROM PUBLIC,anon,authenticated;
GRANT ALL ON public.design_projects,public.design_files TO service_role;
INSERT INTO storage.buckets(id,name,public,file_size_limit,allowed_mime_types)
VALUES('newjersey-design-files','newjersey-design-files',false,20971520,ARRAY['application/pdf','application/zip','image/jpeg','image/png','image/webp'])
ON CONFLICT(id) DO UPDATE SET public=false,file_size_limit=20971520,allowed_mime_types=EXCLUDED.allowed_mime_types;

CREATE OR REPLACE FUNCTION public.create_design_project(p_customer_id uuid,p_key uuid,p_designer text,p_type text,p_brief text,p_name text,p_email text,p_phone text,p_deadline date)
RETURNS uuid LANGUAGE plpgsql SET search_path='' AS $$
DECLARE v_id uuid; v_result jsonb;
BEGIN
 IF p_customer_id IS NULL OR p_key IS NULL OR p_designer IS NULL OR p_designer NOT IN ('ink','form') OR length(trim(coalesce(p_type,''))) NOT BETWEEN 1 AND 100 OR length(trim(coalesce(p_brief,''))) NOT BETWEEN 15 AND 3000 OR length(trim(coalesce(p_name,''))) NOT BETWEEN 1 AND 120 OR length(coalesce(p_email,'')) NOT BETWEEN 3 AND 254 OR length(trim(coalesce(p_phone,''))) NOT BETWEEN 7 AND 30 THEN
 RAISE EXCEPTION 'Check your brief and contact details.'; END IF;
 PERFORM pg_advisory_xact_lock(hashtextextended(p_customer_id::text||p_key::text,0));
 SELECT order_id INTO v_id FROM public.design_projects WHERE customer_id=p_customer_id AND submission_key=p_key;
 IF FOUND THEN RETURN v_id; END IF;
 v_result:=public.create_newjersey_order(jsonb_build_object(
 'customer_id',p_customer_id,'order_number','NJ-DS-'||upper(replace(gen_random_uuid()::text,'-','')),
 'customer_full_name',trim(p_name),'customer_phone',trim(p_phone),'customer_email',lower(trim(p_email)),
 'delivery_method','pickup','project_name',upper(p_designer)||' / '||trim(p_type),'preferred_deadline',p_deadline,
 'production_instructions',trim(p_brief),'item_count',1,'subtotal',0,'design_fee',0,'status','under-review'),
 jsonb_build_array(jsonb_build_object('cart_item_id','design-'||p_key::text,'product_id','design-service','product_slug','design-service','product_name',trim(p_type),'quantity',1,'base_price',0,'options_total',0,'unit_price',0,'total_price',0,'selections','[]'::jsonb,'artwork_type','design-needed','design_fee',0)));
 v_id:=(v_result->>'id')::uuid;
 IF v_id IS NULL THEN RAISE EXCEPTION 'Order creation returned no reference.'; END IF;
 UPDATE public.orders SET design_service=true WHERE id=v_id;
 UPDATE public.order_items SET review_mode='design-service',artwork_type='not-required' WHERE order_id=v_id;
 INSERT INTO public.design_projects(order_id,customer_id,submission_key,designer,project_type,brief) VALUES(v_id,p_customer_id,p_key,p_designer,trim(p_type),trim(p_brief));
 RETURN v_id;
END; $$;

CREATE OR REPLACE FUNCTION public.quote_design_project(p_order_id uuid,p_admin_id uuid,p_expected timestamptz,p_amount numeric,p_scope text,p_due date,p_revisions integer)
RETURNS uuid LANGUAGE plpgsql SET search_path='' AS $$
DECLARE o public.orders%ROWTYPE; d public.design_projects%ROWTYPE;
BEGIN
 IF NOT EXISTS(SELECT 1 FROM public.admin_users WHERE id=p_admin_id AND active AND role IN ('owner','admin')) THEN RAISE EXCEPTION 'Admin access required.'; END IF;
 SELECT * INTO o FROM public.orders WHERE id=p_order_id FOR UPDATE;
 SELECT * INTO d FROM public.design_projects WHERE order_id=p_order_id FOR UPDATE;
 IF d.order_id IS NULL OR o.status IS DISTINCT FROM 'under-review' OR o.final_total IS NOT NULL OR p_expected IS NULL OR d.updated_at IS DISTINCT FROM p_expected THEN RAISE EXCEPTION 'Refresh this request before quoting.'; END IF;
 IF p_amount IS NULL OR p_amount<=0 OR p_amount>99999999.99 OR p_amount<>round(p_amount,2) OR length(trim(coalesce(p_scope,''))) NOT BETWEEN 15 AND 3000 OR p_due IS NULL OR p_due<current_date OR p_revisions IS NULL OR p_revisions NOT BETWEEN 0 AND 10 THEN RAISE EXCEPTION 'Enter a price, scope, deadline and revision allowance.'; END IF;
 IF EXISTS(SELECT 1 FROM public.order_payments WHERE order_id=p_order_id) THEN RAISE EXCEPTION 'A payment already exists. Review the order.'; END IF;
 UPDATE public.design_projects SET scope=trim(p_scope),due_date=p_due,included_revisions=p_revisions,updated_at=clock_timestamp() WHERE order_id=p_order_id;
 UPDATE public.order_items SET base_price=p_amount,options_total=0,unit_price=p_amount,total_price=p_amount,design_fee=0 WHERE order_id=p_order_id;
 UPDATE public.orders SET subtotal=p_amount,design_fee=0,delivery_fee=0,final_total=p_amount,status='awaiting-payment',updated_at=clock_timestamp() WHERE id=p_order_id;
 INSERT INTO public.order_pricing_history(order_id,admin_id,admin_name,production_total,design_fee,delivery_fee,final_total,notes)
 SELECT p_order_id,id,coalesce(nullif(full_name,''),'Admin'),p_amount,0,0,p_amount,trim(p_scope) FROM public.admin_users WHERE id=p_admin_id;
 INSERT INTO public.design_history(order_id,actor_id,event,notes) VALUES(p_order_id,p_admin_id,'quote',trim(p_scope));
 INSERT INTO public.customer_notifications(customer_id,order_id,artwork_id,title,message,target_path) VALUES(d.customer_id,p_order_id,NULL,'Your design quote is ready','Review the agreed scope, deadline and price before paying.','/shop/design/'||p_order_id::text);
 RETURN p_order_id;
END; $$;

CREATE OR REPLACE FUNCTION public.attach_design_file(p_order_id uuid,p_actor_id uuid,p_kind text,p_expected timestamptz,p_path text,p_name text,p_mime text,p_size bigint)
RETURNS uuid LANGUAGE plpgsql SET search_path='' AS $$
DECLARE o public.orders%ROWTYPE; d public.design_projects%ROWTYPE; v_id uuid; v_admin boolean;
BEGIN
 SELECT * INTO o FROM public.orders WHERE id=p_order_id FOR UPDATE;
 SELECT * INTO d FROM public.design_projects WHERE order_id=p_order_id FOR UPDATE;
 IF d.order_id IS NULL OR p_expected IS NULL OR d.updated_at IS DISTINCT FROM p_expected THEN RAISE EXCEPTION 'This project changed. Refresh before uploading.'; END IF;
 SELECT EXISTS(SELECT 1 FROM public.admin_users WHERE id=p_actor_id AND active AND role IN ('owner','admin')) INTO v_admin;
 IF p_kind='reference' THEN
 IF p_actor_id IS DISTINCT FROM d.customer_id OR o.status<>'under-review' OR (SELECT count(*) FROM public.design_files WHERE order_id=p_order_id AND kind='reference')>=3 THEN RAISE EXCEPTION 'References are closed or the three-file limit was reached.'; END IF;
 ELSIF p_kind='delivery' THEN
 IF NOT v_admin OR o.status NOT IN ('confirmed','in-production') OR d.scope IS NULL OR NOT EXISTS(SELECT 1 FROM public.order_payments WHERE order_id=o.id AND customer_id=o.customer_id AND status='verified' AND amount=o.final_total AND currency='NGN') THEN RAISE EXCEPTION 'A confirmed quote and verified payment are required.'; END IF;
 ELSE RAISE EXCEPTION 'Invalid file type.'; END IF;
 IF p_path IS NULL OR p_path NOT LIKE d.customer_id::text||'/'||p_order_id::text||'/%' OR length(coalesce(p_name,'')) NOT BETWEEN 1 AND 160 OR p_size IS NULL OR p_size<=0 OR p_size>(CASE WHEN p_kind='reference' THEN 10485760 ELSE 20971520 END) OR p_mime IS NULL OR p_mime NOT IN ('application/pdf','image/jpeg','image/png','image/webp','application/zip') OR (p_kind='reference' AND p_mime='application/zip') THEN RAISE EXCEPTION 'Invalid file details.'; END IF;
 INSERT INTO public.design_files(order_id,kind,round,storage_path,file_name,mime_type,file_size) VALUES(p_order_id,p_kind,d.round,p_path,p_name,p_mime,p_size) RETURNING id INTO v_id;
 INSERT INTO public.design_history(order_id,actor_id,event,notes) VALUES(p_order_id,p_actor_id,p_kind,p_name);
 UPDATE public.design_projects SET updated_at=clock_timestamp() WHERE order_id=p_order_id;
 IF p_kind='delivery' THEN
 UPDATE public.orders SET status='completed',updated_at=clock_timestamp() WHERE id=p_order_id;
 INSERT INTO public.customer_notifications(customer_id,order_id,artwork_id,title,message,target_path) VALUES(d.customer_id,p_order_id,NULL,'Your design is ready','Download your finished design or request an included revision.','/shop/design/'||p_order_id::text);
 END IF;
 RETURN v_id;
END; $$;

CREATE OR REPLACE FUNCTION public.revise_design_project(p_order_id uuid,p_customer_id uuid,p_expected timestamptz,p_notes text)
RETURNS uuid LANGUAGE plpgsql SET search_path='' AS $$
DECLARE o public.orders%ROWTYPE; d public.design_projects%ROWTYPE;
BEGIN
 SELECT * INTO o FROM public.orders WHERE id=p_order_id FOR UPDATE;
 SELECT * INTO d FROM public.design_projects WHERE order_id=p_order_id FOR UPDATE;
 IF d.order_id IS NULL OR d.customer_id IS DISTINCT FROM p_customer_id OR o.status IS DISTINCT FROM 'completed' OR p_expected IS NULL OR d.updated_at IS DISTINCT FROM p_expected OR d.revisions_used>=d.included_revisions THEN RAISE EXCEPTION 'A revision is not available. Refresh this project.'; END IF;
 IF length(trim(coalesce(p_notes,''))) NOT BETWEEN 10 AND 2000 THEN RAISE EXCEPTION 'Describe your changes in 10 to 2,000 characters.'; END IF;
 INSERT INTO public.design_history(order_id,actor_id,event,notes) VALUES(p_order_id,p_customer_id,'revision',trim(p_notes));
 UPDATE public.design_projects SET revisions_used=revisions_used+1,round=round+1,revision_notes=trim(p_notes),updated_at=clock_timestamp() WHERE order_id=p_order_id;
 UPDATE public.orders SET status='in-production',updated_at=clock_timestamp() WHERE id=p_order_id;
 RETURN p_order_id;
END; $$;
REVOKE ALL ON FUNCTION public.create_design_project(uuid,uuid,text,text,text,text,text,text,date),public.quote_design_project(uuid,uuid,timestamptz,numeric,text,date,integer),public.attach_design_file(uuid,uuid,text,timestamptz,text,text,text,bigint),public.revise_design_project(uuid,uuid,timestamptz,text) FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.create_design_project(uuid,uuid,text,text,text,text,text,text,date),public.quote_design_project(uuid,uuid,timestamptz,numeric,text,date,integer),public.attach_design_file(uuid,uuid,text,timestamptz,text,text,text,bigint),public.revise_design_project(uuid,uuid,timestamptz,text) TO service_role;
COMMIT;
