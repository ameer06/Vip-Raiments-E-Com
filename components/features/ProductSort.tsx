"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

const options = [
  { value: "newest", label: "Newest" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "name-az", label: "Name: A to Z" },
] as const;

export type SortOption = (typeof options)[number]["value"];

export function ProductSort() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const current = searchParams.get("sort") ?? "newest";

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const params = new URLSearchParams(searchParams.toString());
      const value = e.target.value;
      if (value === "newest") {
        params.delete("sort");
      } else {
        params.set("sort", value);
      }
      router.push(`/products?${params.toString()}`, { scroll: false });
    },
    [router, searchParams]
  );

  return (
    <select
      value={current}
      onChange={handleChange}
      aria-label="Sort products"
      className="h-10 rounded-control border border-ink/10 bg-white px-3 text-sm text-ink focus:border-ink/30 focus:outline-none focus:ring-1 focus:ring-ink/20"
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}
