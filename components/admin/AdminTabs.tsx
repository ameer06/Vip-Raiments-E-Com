"use client";

import { useState } from "react";
import { LayoutGrid, Package } from "lucide-react";
import { AdminDashboardClient } from "@/components/admin/AdminDashboardClient";
import { AdminOrdersTab } from "@/components/admin/AdminOrdersTab";

type Tab = "products" | "orders";

export function AdminTabs() {
  const [tab, setTab] = useState<Tab>("products");

  return (
    <div>
      <div className="mb-6 flex gap-1 rounded-card border border-ink/10 bg-white p-1 shadow-card">
        <button
          onClick={() => setTab("products")}
          className={`flex flex-1 items-center justify-center gap-2 rounded-control px-4 py-3 text-sm font-semibold transition-colors ${
            tab === "products" ? "bg-ink text-white" : "text-ink/60 hover:bg-surface"
          }`}
        >
          <LayoutGrid className="h-4 w-4" />
          Products
        </button>
        <button
          onClick={() => setTab("orders")}
          className={`flex flex-1 items-center justify-center gap-2 rounded-control px-4 py-3 text-sm font-semibold transition-colors ${
            tab === "orders" ? "bg-ink text-white" : "text-ink/60 hover:bg-surface"
          }`}
        >
          <Package className="h-4 w-4" />
          Orders
        </button>
      </div>

      {tab === "products" && <AdminDashboardClient />}
      {tab === "orders" && <AdminOrdersTab />}
    </div>
  );
}
