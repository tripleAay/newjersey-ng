-- Apply after 20261017_jersey_catalogue.sql. No historical order reclassification.
BEGIN;
ALTER TABLE public.products
 ADD COLUMN IF NOT EXISTS apparel_enabled boolean NOT NULL DEFAULT false,
 ADD COLUMN IF NOT EXISTS apparel_sizes text[] NOT NULL DEFAULT ARRAY[]::text[],
 ADD COLUMN IF NOT EXISTS apparel_colours text[] NOT NULL DEFAULT ARRAY[]::text[];

-- Extend only the existing artwork-type check; preserve every other constraint.
DO $migration$
DECLARE c record;
BEGIN
 FOR c IN SELECT conname,pg_get_constraintdef(oid) definition FROM pg_constraint WHERE conrelid='public.order_items'::regclass AND contype='c' AND pg_get_constraintdef(oid) LIKE '%artwork_type%' LOOP
  IF c.definition NOT LIKE '%customer-supplied%' OR c.definition NOT LIKE '%design-needed%' THEN RAISE EXCEPTION 'Unexpected artwork constraint; review before migrating'; END IF;
  EXECUTE format('ALTER TABLE public.order_items DROP CONSTRAINT %I',c.conname);
 END LOOP;
 ALTER TABLE public.order_items ADD CONSTRAINT order_items_artwork_type_check CHECK(artwork_type IN ('customer-supplied','design-needed','not-required'));
END;$migration$;

-- Server-only wrapper maintains compatibility with the existing base order writer.
-- Ready-made items have an explicit no-artwork type and never create artwork requests.
CREATE OR REPLACE FUNCTION public.create_catalogue_order(p_order jsonb,p_items jsonb)
RETURNS jsonb LANGUAGE plpgsql SECURITY INVOKER SET search_path='' AS $$
DECLARE result jsonb; normalized jsonb; entry jsonb;
BEGIN
 IF jsonb_typeof(p_items) IS DISTINCT FROM 'array' OR jsonb_array_length(p_items)=0 THEN RAISE EXCEPTION 'Order items required'; END IF;
 FOR entry IN SELECT value FROM jsonb_array_elements(p_items) LOOP
  IF entry->>'review_mode' = 'retail' THEN
   IF entry->>'artwork_type' IS DISTINCT FROM 'not-required' OR (entry->>'design_fee')::numeric IS DISTINCT FROM 0::numeric OR entry->>'product_id' NOT LIKE 'retail-%' THEN RAISE EXCEPTION 'Invalid apparel order item'; END IF;
  ELSIF entry->>'artwork_type' NOT IN ('customer-supplied','design-needed') OR entry->>'review_mode' IS DISTINCT FROM 'artwork' THEN
   RAISE EXCEPTION 'Invalid custom order item';
  END IF;
 END LOOP;
 -- Translate for the legacy writer inside this transaction; persist the
 -- explicit no-artwork type before returning. No artwork row is created.
 SELECT jsonb_agg(CASE WHEN value->>'review_mode'='retail' THEN jsonb_set(value,'{artwork_type}','"design-needed"'::jsonb) ELSE value END) INTO normalized FROM jsonb_array_elements(p_items);
 result:=public.create_newjersey_order(p_order,normalized);
 UPDATE public.order_items item SET review_mode='retail',artwork_type='not-required'
 WHERE item.order_id=(result->>'id')::uuid AND EXISTS (
 SELECT 1 FROM jsonb_array_elements(p_items) e WHERE e->>'review_mode'='retail' AND e->>'cart_item_id'=item.cart_item_id);
 RETURN result;
END;$$;
REVOKE ALL ON FUNCTION public.create_catalogue_order(jsonb,jsonb) FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.create_catalogue_order(jsonb,jsonb) TO service_role;
CREATE OR REPLACE FUNCTION public.confirm_order_pricing(p_order_id uuid, p_admin_id uuid, p_expected_updated_at timestamp with time zone, p_delivery_fee numeric, p_notes text)
 RETURNS uuid
 LANGUAGE plpgsql
 SET search_path TO ''
AS $function$
DECLARE
  saved_order public.orders%ROWTYPE;
  actor public.admin_users%ROWTYPE;
  production_amount numeric;
  design_amount numeric;
  confirmed_total numeric;
  item_total integer;
BEGIN
  SELECT *
  INTO actor
  FROM public.admin_users
  WHERE id = p_admin_id
    AND active = true
    AND role IN ('owner', 'admin');

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Only owners and admins can confirm pricing';
  END IF;

  IF p_delivery_fee IS NULL
     OR p_delivery_fee < 0
     OR p_delivery_fee > 9999999999
     OR p_delivery_fee <> round(p_delivery_fee, 2) THEN
    RAISE EXCEPTION 'Enter a valid delivery fee';
  END IF;

  IF length(p_notes) > 3000 THEN
    RAISE EXCEPTION 'Keep pricing notes within 3000 characters';
  END IF;

  SELECT *
  INTO saved_order
  FROM public.orders
  WHERE id = p_order_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Order not found';
  END IF;

  IF saved_order.updated_at IS DISTINCT FROM p_expected_updated_at THEN
    RAISE EXCEPTION 'Order changed. Refresh before confirming';
  END IF;

  IF saved_order.status NOT IN (
    'submitted',
    'under-review',
    'awaiting-artwork'
  ) THEN
    RAISE EXCEPTION 'Pricing cannot be confirmed in this order status';
  END IF;

  IF saved_order.final_total IS NOT NULL THEN
    RAISE EXCEPTION 'Final pricing has already been confirmed';
  END IF;

  IF saved_order.customer_id IS NULL THEN
    RAISE EXCEPTION 'This order must be linked to a customer account';
  END IF;

  IF saved_order.delivery_method = 'pickup'
     AND p_delivery_fee <> 0 THEN
    RAISE EXCEPTION 'Pickup orders must have a zero delivery fee';
  END IF;

  -- Lock the current items and artwork during confirmation.
  PERFORM id
  FROM public.order_items
  WHERE order_id = saved_order.id
  FOR UPDATE;

  PERFORM id
  FROM public.order_artworks
  WHERE order_id = saved_order.id
  FOR UPDATE;

  SELECT
    count(*),
    COALESCE(sum(total_price), 0),
    COALESCE(sum(design_fee), 0)
  INTO item_total, production_amount, design_amount
  FROM public.order_items
  WHERE order_id = saved_order.id;

  IF item_total = 0 THEN
    RAISE EXCEPTION 'This order has no items';
  END IF;

  IF EXISTS (
    SELECT 1 FROM public.order_items i
    WHERE i.order_id = saved_order.id AND i.review_mode = 'jersey'
      AND (i.specifications_approved_at IS NULL OR i.specifications_approved_by IS NULL)
  ) THEN
    RAISE EXCEPTION 'Approve jersey specifications before final pricing';
  END IF;

  -- Print items still need approved artwork.
  IF EXISTS (
    SELECT 1
    FROM public.order_items i
    WHERE i.order_id = saved_order.id
      AND i.review_mode NOT IN ('jersey', 'retail')
      AND NOT EXISTS (
        SELECT 1
        FROM public.order_artworks a
        WHERE a.order_id = saved_order.id
          AND a.order_item_id = i.id
          AND a.status = 'approved'
      )
  ) THEN
    RAISE EXCEPTION 'Every item needs approved artwork before final pricing';
  END IF;

  -- Also block unresolved additional artwork records.
  IF EXISTS (
    SELECT 1
    FROM public.order_artworks
    WHERE order_id = saved_order.id
      AND status IS DISTINCT FROM 'approved'
  ) THEN
    RAISE EXCEPTION 'Resolve all artwork requests before final pricing';
  END IF;

  IF production_amount <> saved_order.subtotal
     OR design_amount <> saved_order.design_fee THEN
    RAISE EXCEPTION 'Order and item totals differ. Review pricing before continuing';
  END IF;

  confirmed_total := round(
    production_amount + design_amount + p_delivery_fee,
    2
  );

  IF confirmed_total <= 0 THEN
    RAISE EXCEPTION 'The final total must be greater than zero';
  END IF;

  INSERT INTO public.order_pricing_history (
    order_id,
    admin_id,
    admin_name,
    production_total,
    design_fee,
    delivery_fee,
    final_total,
    notes
  )
  VALUES (
    saved_order.id,
    actor.id,
    COALESCE(NULLIF(actor.full_name, ''), 'Admin'),
    production_amount,
    design_amount,
    p_delivery_fee,
    confirmed_total,
    NULLIF(btrim(p_notes), '')
  );

  UPDATE public.orders
  SET
    delivery_fee = p_delivery_fee,
    final_total = confirmed_total,
    status = 'awaiting-payment',
    updated_at = clock_timestamp()
  WHERE id = saved_order.id;

  RETURN saved_order.id;
END;
$function$
;

-- Identical transition, payment, audit and notification checks for all product flows.
CREATE OR REPLACE FUNCTION public.update_order_production(p_order_id uuid,p_admin_id uuid,p_expected_updated_at timestamptz,p_next_status text,p_notes text)
RETURNS uuid LANGUAGE plpgsql SECURITY INVOKER SET search_path='' AS $$
DECLARE v_admin public.admin_users%ROWTYPE; v_order public.orders%ROWTYPE; v_notes text:=trim(coalesce(p_notes,''));
BEGIN
 SELECT * INTO v_admin FROM public.admin_users WHERE id=p_admin_id AND active=true AND role IN ('owner','admin','production');
 IF NOT FOUND THEN RAISE EXCEPTION 'Production access is not permitted.'; END IF;
 IF p_next_status IS NULL OR p_next_status NOT IN ('in-production','ready') THEN RAISE EXCEPTION 'Choose a valid production action.'; END IF;
 IF char_length(v_notes)>2000 THEN RAISE EXCEPTION 'Keep notes within 2,000 characters.'; END IF;
 SELECT * INTO v_order FROM public.orders WHERE id=p_order_id FOR UPDATE;
 IF NOT FOUND THEN RAISE EXCEPTION 'Order not found.'; END IF;
 IF p_expected_updated_at IS NULL OR v_order.updated_at IS DISTINCT FROM p_expected_updated_at THEN RAISE EXCEPTION 'This order changed. Refresh before continuing.'; END IF;
 IF NOT ((v_order.status='confirmed' AND p_next_status='in-production') OR (v_order.status='in-production' AND p_next_status='ready')) THEN RAISE EXCEPTION 'This production action is no longer available.'; END IF;
 IF v_order.final_total IS NULL OR v_order.final_total<=0 OR v_order.customer_id IS NULL THEN RAISE EXCEPTION 'Confirmed pricing and a customer account are required.'; END IF;
 PERFORM id FROM public.order_payments WHERE order_id=v_order.id FOR UPDATE;
 IF NOT EXISTS(SELECT 1 FROM public.order_payments WHERE order_id=v_order.id AND customer_id=v_order.customer_id AND status='verified' AND amount=v_order.final_total AND currency='NGN') THEN RAISE EXCEPTION 'A matching verified payment is required.'; END IF;
 PERFORM id FROM public.order_items WHERE order_id=v_order.id FOR UPDATE;
 PERFORM id FROM public.order_artworks WHERE order_id=v_order.id FOR UPDATE;
 IF NOT EXISTS(SELECT 1 FROM public.order_items WHERE order_id=v_order.id) THEN RAISE EXCEPTION 'This order has no production items.'; END IF;
 IF EXISTS(SELECT 1 FROM public.order_items WHERE order_id=v_order.id AND review_mode='jersey' AND (specifications_approved_at IS NULL OR specifications_approved_by IS NULL)) THEN RAISE EXCEPTION 'All jersey specifications must be approved before production.'; END IF;
 IF EXISTS(SELECT 1 FROM public.order_items i WHERE i.order_id=v_order.id AND i.review_mode NOT IN ('jersey','retail') AND NOT EXISTS(SELECT 1 FROM public.order_artworks a WHERE a.order_id=v_order.id AND a.order_item_id=i.id AND a.status='approved')) THEN RAISE EXCEPTION 'All required artwork must be approved.'; END IF;
 IF EXISTS(SELECT 1 FROM public.order_artworks a WHERE a.order_id=v_order.id AND a.status IS DISTINCT FROM 'approved' AND NOT EXISTS(SELECT 1 FROM public.order_items i WHERE i.id=a.order_item_id AND i.order_id=v_order.id AND i.review_mode IN ('jersey','retail'))) THEN RAISE EXCEPTION 'All required artwork must be approved.'; END IF;
 INSERT INTO public.order_production_history(order_id,admin_id,admin_name,previous_status,new_status,notes) VALUES(v_order.id,v_admin.id,v_admin.full_name,v_order.status,p_next_status,nullif(v_notes,''));
 UPDATE public.orders SET status=p_next_status,updated_at=clock_timestamp() WHERE id=v_order.id;
 INSERT INTO public.customer_notifications(customer_id,order_id,artwork_id,title,message,target_path) VALUES(v_order.customer_id,v_order.id,NULL,CASE WHEN p_next_status='in-production' THEN 'Your order is in production' ELSE 'Your order is ready' END,CASE WHEN p_next_status='in-production' THEN 'Production has started for order '||v_order.order_number||'.' WHEN v_order.delivery_method='pickup' THEN 'Order '||v_order.order_number||' is ready. We’ll confirm collection arrangements.' ELSE 'Order '||v_order.order_number||' is ready. Delivery arrangements will be confirmed.' END,'/shop/order/'||v_order.id::text);
 RETURN v_order.id;
END;$$;
REVOKE ALL ON FUNCTION public.update_order_production(uuid,uuid,timestamptz,text,text) FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.update_order_production(uuid,uuid,timestamptz,text,text) TO service_role;
NOTIFY pgrst,'reload schema';
COMMIT;
