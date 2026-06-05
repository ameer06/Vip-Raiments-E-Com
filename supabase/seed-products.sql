-- Optional: seed static catalog into Supabase products table

insert into public.products (
  id, slug, name, color, price_inr, stock, sizes, status, badge,
  front_image_url, hover_image_url, is_priority
) values
  (
    'prod_signal_denim',
    'signal-denim-jacket',
    'Signal Denim Jacket',
    'Washed black',
    15999,
    18,
    array['S','M','L','XL'],
    'active',
    'New',
    'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?auto=format&fit=crop&w=900&q=80',
    true
  ),
  (
    'prod_monolith_hoodie',
    'monolith-heavy-hoodie',
    'Monolith Heavy Hoodie',
    'Core black',
    10499,
    9,
    array['S','M','L','XL'],
    'active',
    'Low stock',
    'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1578768079052-aa76e52ff62e?auto=format&fit=crop&w=900&q=80',
    false
  ),
  (
    'prod_blueprint_cargo',
    'blueprint-cargo-pant',
    'Blueprint Cargo Pant',
    'Carbon grey',
    11999,
    22,
    array['28','30','32','34','36'],
    'active',
    null,
    'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1516826957135-700dedea698c?auto=format&fit=crop&w=900&q=80',
    false
  ),
  (
    'prod_night_mesh',
    'night-mesh-tee',
    'Night Mesh Tee',
    'White / electric',
    5499,
    31,
    array['XS','S','M','L','XL'],
    'active',
    'Drop',
    'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=900&q=80',
    false
  )
on conflict (id) do update set
  stock = excluded.stock,
  price_inr = excluded.price_inr,
  status = excluded.status,
  updated_at = now();
