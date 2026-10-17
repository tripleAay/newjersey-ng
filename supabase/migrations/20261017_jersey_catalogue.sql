-- Additive migration. Existing orders keep artwork review by default.
BEGIN;
ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS jersey_enabled boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS jersey_team text,
  ADD COLUMN IF NOT EXISTS jersey_season text,
  ADD COLUMN IF NOT EXISTS jersey_kit text,
  ADD COLUMN IF NOT EXISTS jersey_sizes text[] NOT NULL DEFAULT ARRAY['S','M','L','XL','XXL'],
  ADD COLUMN IF NOT EXISTS jersey_name_fee numeric(12,2),
  ADD COLUMN IF NOT EXISTS jersey_number_fee numeric(12,2);
ALTER TABLE public.order_items
  ADD COLUMN IF NOT EXISTS review_mode text NOT NULL DEFAULT 'artwork',
  ADD COLUMN IF NOT EXISTS specifications_approved_at timestamptz,
  ADD COLUMN IF NOT EXISTS specifications_approved_by uuid;

CREATE OR REPLACE FUNCTION public.create_jersey_order(p_order jsonb, p_items jsonb)
RETURNS jsonb LANGUAGE plpgsql SET search_path = '' AS $$
DECLARE result jsonb;
BEGIN
  result := public.create_newjersey_order(p_order, p_items);
  UPDATE public.order_items SET review_mode = 'jersey'
  WHERE order_id = (result->>'id')::uuid;
  RETURN result;
END;
$$;
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
      AND i.review_mode <> 'jersey'
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
CREATE OR REPLACE FUNCTION public.confirm_order_pricing_with_specs(
  p_order_id uuid, p_admin_id uuid, p_expected_updated_at timestamptz,
  p_delivery_fee numeric, p_notes text, p_approve_jerseys boolean
) RETURNS uuid LANGUAGE plpgsql SET search_path = '' AS $$
DECLARE saved_order public.orders%ROWTYPE;
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM public.admin_users WHERE id = p_admin_id
      AND active = true AND role IN ('owner','admin')
  ) THEN RAISE EXCEPTION 'Only owners and admins can confirm pricing'; END IF;
  SELECT * INTO saved_order FROM public.orders WHERE id = p_order_id FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'Order not found'; END IF;
  IF saved_order.updated_at IS DISTINCT FROM p_expected_updated_at THEN
    RAISE EXCEPTION 'Order changed. Refresh before confirming';
  END IF;
  PERFORM id FROM public.order_items WHERE order_id = p_order_id FOR UPDATE;
  IF EXISTS (SELECT 1 FROM public.order_items WHERE order_id = p_order_id AND review_mode = 'jersey') THEN
    IF p_approve_jerseys IS DISTINCT FROM true THEN
      RAISE EXCEPTION 'Confirm that you have reviewed the jersey specifications';
    END IF;
    UPDATE public.order_items
    SET specifications_approved_at = clock_timestamp(), specifications_approved_by = p_admin_id
    WHERE order_id = p_order_id AND review_mode = 'jersey';
  END IF;
  RETURN public.confirm_order_pricing(p_order_id, p_admin_id, p_expected_updated_at, p_delivery_fee, p_notes);
END;
$$;
REVOKE ALL ON FUNCTION public.create_jersey_order(jsonb,jsonb) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.create_jersey_order(jsonb,jsonb) TO service_role;
REVOKE ALL ON FUNCTION public.confirm_order_pricing_with_specs(uuid,uuid,timestamptz,numeric,text,boolean) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.confirm_order_pricing_with_specs(uuid,uuid,timestamptz,numeric,text,boolean) TO service_role;
REVOKE ALL ON FUNCTION public.confirm_order_pricing(uuid,uuid,timestamptz,numeric,text) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.confirm_order_pricing(uuid,uuid,timestamptz,numeric,text) TO service_role;
-- The base function accepts server-prepared totals and must not be public.
REVOKE ALL ON FUNCTION public.create_newjersey_order(jsonb,jsonb) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.create_newjersey_order(jsonb,jsonb) TO service_role;
COMMIT;
