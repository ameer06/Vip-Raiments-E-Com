-- Atomic stock deduction function
-- Prevents overselling by checking and deducting stock in a single DB transaction

CREATE OR REPLACE FUNCTION public.deduct_stock(
  p_product_id text,
  p_quantity integer
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_current_stock integer;
BEGIN
  SELECT stock INTO v_current_stock
  FROM public.products
  WHERE id = p_product_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RETURN false;
  END IF;

  IF v_current_stock < p_quantity THEN
    RETURN false;
  END IF;

  UPDATE public.products
  SET stock = stock - p_quantity,
      updated_at = now()
  WHERE id = p_product_id;

  RETURN true;
END;
$$;
