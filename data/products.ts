export type Product = {
  id: string;
  slug: string;
  name: string;
  color: string;
  price: number;
  stock: number;
  sizes: string[];
  status: "active" | "draft" | "archived";
  badge?: string;
  images: [string, string];
  isPriority?: boolean;
  category?: string;
};

export const trendingDrops = [
  "Signal denim",
  "Night mesh tee",
  "Blueprint cargo",
  "Monolith hoodie",
  "Chrome knit"
];

export const featuredProducts: Product[] = [
  {
    id: "prod_signal_denim",
    slug: "signal-denim-jacket",
    name: "Signal Denim Jacket",
    color: "Washed black",
    price: 15999,
    stock: 18,
    sizes: ["S", "M", "L", "XL"],
    status: "active",
    badge: "New",
    category: "t-shits",
    isPriority: true,
    images: [
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?auto=format&fit=crop&w=900&q=80"
    ]
  },
  {
    id: "prod_monolith_hoodie",
    slug: "monolith-heavy-hoodie",
    name: "Monolith Heavy Hoodie",
    color: "Core black",
    price: 10499,
    stock: 9,
    sizes: ["S", "M", "L", "XL"],
    status: "active",
    badge: "Low stock",
    category: "t-shits",
    images: [
      "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=900&q=80"
    ]
  },
  {
    id: "prod_blueprint_cargo",
    slug: "blueprint-cargo-pant",
    name: "Blueprint Cargo Pant",
    color: "Carbon grey",
    price: 11999,
    stock: 22,
    sizes: ["28", "30", "32", "34", "36"],
    status: "active",
    category: "pants",
    images: [
      "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1516826957135-700dedea698c?auto=format&fit=crop&w=900&q=80"
    ]
  },
  {
    id: "prod_night_mesh",
    slug: "night-mesh-tee",
    name: "Night Mesh Tee",
    color: "White / electric",
    price: 5499,
    stock: 31,
    sizes: ["XS", "S", "M", "L", "XL"],
    status: "active",
    badge: "Drop",
    category: "pants",
    images: [
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=900&q=80"
    ]
  }
];
