import { useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  Package,
} from "lucide-react";

import DataTable from "@/components/tables/DataTable";
import { ProductColumns } from "./ProductColumns";

export default function ProductGroup({
  name,
  products = [],
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="mb-4 overflow-hidden rounded-xl border bg-card shadow-sm">

      {/* Group Header */}
      <button
        type="button"
        className="
          flex w-full items-center justify-between
          px-5 py-4
          text-left
          transition-colors
          hover:bg-orange-500/5
        "
        onClick={() => setOpen((prev) => !prev)}
      >
        <div className="flex items-center gap-3">

          {/* Expand Icon */}
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-500/10 text-orange-500">
            {open ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </div>

          {/* Product Icon */}
          <div className="flex h-9 w-9 items-center justify-center rounded-lg border bg-background">
            <Package className="h-5 w-5 text-orange-500" />
          </div>

          {/* Product Name */}
          <div>
            <h2 className="font-semibold">
              {name}
            </h2>

            <p className="text-xs text-muted-foreground">
              Product variants
            </p>
          </div>
        </div>

        {/* Variant Count */}
        <span className="
          rounded-full
          border
          border-orange-500/20
          bg-orange-500/10
          px-3
          py-1
          text-xs
          font-medium
          text-orange-500
        ">
          {products.length}{" "}
          {products.length === 1 ? "Variant" : "Variants"}
        </span>
      </button>

      {/* Product Variants */}
      {open && (
        <div className="border-t bg-background/40">

          {products.length > 0 ? (
            <div className="overflow-x-auto">
              <DataTable
                columns={ProductColumns}
                data={products}
              />
            </div>
          ) : (
            <div className="p-8 text-center">
              <p className="text-sm text-muted-foreground">
                No variants available.
              </p>
            </div>
          )}

        </div>
      )}
    </div>
  );
}