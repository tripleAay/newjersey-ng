const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const Module = require('node:module');
const ts = require('typescript');

function load(relative, mocks = {}) {
  const filename = path.resolve(relative);
  const code = ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, jsx: ts.JsxEmit.ReactJSX },
  }).outputText;
  const mod = new Module(filename, module);
  mod.filename = filename;
  mod.paths = Module._nodeModulePaths(path.dirname(filename));
  const original = mod.require.bind(mod);
  mod.require = name => Object.hasOwn(mocks, name) ? mocks[name] : original(name);
  mod._compile(code, filename);
  return mod.exports;
}

const catalogue = load('app/lib/newjersey/jerseys/catalogue.ts');
const row = {
  id: 1, name: 'Test home jersey', slug: 'test-home', category: 'Jerseys',
  description: 'Regular fit', price: '18000.00', currency: 'NGN', sale_mode: 'fixed',
  publication_status: 'published', jersey_enabled: true, jersey_team: 'Test team',
  jersey_season: '2026/27', jersey_kit: 'home', jersey_sizes: ['M', 'L'],
  image_url: 'https://example.com/home.jpg', image_urls: ['https://example.com/home.jpg'],
  jersey_name_fee: 500, jersey_number_fee: 700,
};
assert.deepEqual(catalogue.jerseyIssues(row), []);
assert.equal(catalogue.toJerseyProduct(row).priceMinor, 1800000);
assert.equal(catalogue.toJerseyProduct({ ...row, publication_status: 'draft' }), null);
assert.equal(catalogue.toJerseyProduct({ ...row, jersey_enabled: false }), null);
assert.equal(catalogue.toJerseyProduct({ ...row, image_url: null, image_urls: [] }), null);
assert.equal(catalogue.toJerseyProduct({ ...row, jersey_kit: 'invalid' }), null);
assert.equal(catalogue.toJerseyProduct({ ...row, jersey_sizes: [] }), null);
assert.equal(catalogue.toJerseyProduct({ ...row, jersey_name_fee: null }).nameFeeMinor, null);
assert.equal(catalogue.toJerseyProduct({ ...row, jersey_name_fee: 0 }).nameFeeMinor, 0);

const nav = load('app/components/admin/navigation.ts');
for (const item of nav.adminNavigation) {
  assert.ok(fs.existsSync(path.join('app', item.href.slice(1), 'page.tsx')), `Missing route: ${item.href}`);
}
assert.ok(nav.navigationFor('admin').some(item => item.href === '/admin/jerseys'));
assert.ok(!nav.navigationFor('production').some(item => item.href === '/admin/jerseys'));

async function actionChecks() {
  let signedIn = true;
  let captured = null;
  const dbProduct = { ...row, jersey_sizes: ['M', 'L'], image_url: row.image_url };
  const query = { select() { return this; }, eq() { return this; }, async maybeSingle() { return { data: dbProduct, error: null }; } };
  const db = { from() { return query; }, async rpc(name, args) { captured = { name, args }; return { data: { id: '12345678-1234-1234-1234-123456789abc' }, error: null }; } };
  const action = load('app/shop/jerseys/actions.tsx', {
    'next/cache': { revalidatePath() {} },
    '@/app/lib/newjersey/supabase/server': { async createClient() { return { auth: { async getUser() { return { data: { user: signedIn ? { id: 'customer' } : null }, error: null }; } } }; } },
    '@/app/lib/newjersey/supabase/admin': { getSupabaseAdmin() { return db; } },
  });
  function form() {
    const f = new FormData();
    for (const [key, value] of Object.entries({ product_id: '1', quantity: '2', printed_name: 'Shine', printed_number: '07', full_name: 'Test Customer', phone: '08000000000', email: 'test@example.com', confirmed: 'on', delivery_method: 'pickup', state: '', city: '', address: '', size: 'M', instructions: '', expected_unit_minor: '1920000' })) f.set(key, value);
    return f;
  }
  const result = await action.submitJersey(form());
  assert.ok(result.orderId);
  assert.equal(captured.name, 'create_jersey_order');
  const item = captured.args.p_items[0];
  assert.equal(item.total_price, 38400);
  assert.equal(item.selections.find(option => option.optionId === 'printed-name').choiceLabel, 'Shine');
  assert.equal(item.selections.find(option => option.optionId === 'printed-number').choiceLabel, '07');
  captured = null;
  const altered = form(); altered.set('expected_unit_minor', '1');
  assert.match((await action.submitJersey(altered)).error, /price has changed/i);
  assert.equal(captured, null);
  const missingConfirmation = form(); missingConfirmation.delete('confirmed');
  assert.match((await action.submitJersey(missingConfirmation)).error, /confirm/i);
  signedIn = false;
  assert.match((await action.submitJersey(form())).error, /sign in/i);
  assert.equal(captured, null);
}
actionChecks().then(() => console.log('PASS: catalogue visibility, image requirements, navigation routes/roles, server pricing, exact name/number, confirmation and authentication.')).catch(error => { console.error(error); process.exitCode = 1; });
