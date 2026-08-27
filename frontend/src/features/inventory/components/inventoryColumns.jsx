import InventoryRowActions from "./InventoryRowActions";

export const inventoryColumns = [
  {
    accessorKey: "product_name",
    header: "Product",
    cell: ({ row }) => (
      <div>
        <p className="font-medium">
          {row.original.product_name || "—"}
        </p>

        {row.original.product_code && (
          <p className="text-xs text-muted-foreground">
            {row.original.product_code}
          </p>
        )}
      </div>
    ),
  },

  {
    accessorKey: "transaction_type",
    header: "Type",
    cell: ({ row }) => {
      const type = row.original.transaction_type;

      const styles = {
        PURCHASE:
          "bg-emerald-50 text-emerald-700 border-emerald-200",

        SALE:
          "bg-red-50 text-red-700 border-red-200",

        ADJUSTMENT:
          "bg-orange-50 text-orange-700 border-orange-200",
      };

      return (
        <span
          className={`
            inline-flex
            items-center
            rounded-full
            border
            px-3
            py-1
            text-xs
            font-semibold
            ${styles[type] || "bg-gray-50 text-gray-700 border-gray-200"}
          `}
        >
          {type || "—"}
        </span>
      );
    },
  },

  {
    accessorKey: "quantity",
    header: "Quantity",
    cell: ({ row }) => {
      const quantity = Number(row.original.quantity || 0);
      const type = row.original.transaction_type;

      const isOut =
        type === "SALE" ||
        type === "STOCK_OUT";

      const isAdjustment =
        type === "ADJUSTMENT";

      return (
        <span
          className={`
            font-semibold
            ${
              isOut
                ? "text-red-600"
                : isAdjustment
                ? "text-orange-600"
                : "text-emerald-600"
            }
          `}
        >
          {isOut ? "-" : "+"}
          {quantity}
        </span>
      );
    },
  },

  {
    accessorKey: "stock_after_transaction",
    header: "Stock After",
    cell: ({ row }) => {
      const stock = Number(
        row.original.stock_after_transaction ?? 0
      );

      return (
        <span
          className={`
            font-semibold
            ${
              stock <= 0
                ? "text-red-600"
                : stock <= 10
                ? "text-orange-600"
                : "text-foreground"
            }
          `}
        >
          {stock}
        </span>
      );
    },
  },

  
  {
    id: "stock_status",
    header: "Stock Status",
    cell: ({ row }) => {
      const stock = Number(
        row.original.current_stock || 0
      );

      const minimumStock = Number(
        row.original.minimum_stock || 0
      );

      if (stock <= 0) {
        return (
          <span className="rounded-full border border-red-200 bg-red-50 px-3 py-1 text-xs font-semibold text-red-700">
            Out of Stock
          </span>
        );
      }

      if (stock <= minimumStock) {
        return (
          <span className="rounded-full border border-orange-200 bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-700">
            Low Stock
          </span>
        );
      }

      return (
        <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
          In Stock
        </span>
      );
    },
  },

  {
    accessorKey: "reference",
    header: "Reference",
    cell: ({ row }) => (
      <span className="font-medium">
        {row.original.reference || "—"}
      </span>
    ),
  },

  {
    accessorKey: "created_at",
    header: "Date",
    cell: ({ row }) => {
      const date = row.original.created_at;

      if (!date) {
        return <span>—</span>;
      }

      return (
        <div className="text-sm text-muted-foreground">
          {new Date(date).toLocaleDateString(
            "en-IN",
            {
              day: "2-digit",
              month: "short",
              year: "numeric",
            }
          )}
        </div>
      );
    },
  },

  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <InventoryRowActions row={row} />
    ),
  },
];