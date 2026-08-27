export const paymentColumns = [
  {
    accessorKey: "payment_number",
    header: "Payment No.",
  },

  {
    accessorKey: "payment_date",
    header: "Date",
    cell: ({ row }) => {
      const date = row.original.payment_date;

      if (!date) {
        return <span>—</span>;
      }

      return (
        <span className="text-sm">
          {new Date(date).toLocaleDateString(
            "en-IN",
            {
              day: "2-digit",
              month: "short",
              year: "numeric",
            }
          )}
        </span>
      );
    },
  },

  {
    accessorKey: "payment_type",
    header: "Type",
    cell: ({ row }) => {
      const type = row.original.payment_type;

      return (
        <span
          className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${
            type === "RECEIVED"
              ? "border-emerald-200 bg-emerald-50 text-emerald-700"
              : "border-red-200 bg-red-50 text-red-700"
          }`}
        >
          {type === "RECEIVED"
            ? "Received"
            : "Paid"}
        </span>
      );
    },
  },

  {
    id: "party",
    header: "Customer / Supplier",
    cell: ({ row }) => {
      const payment = row.original;

      return (
        <div>
          {payment.customer ? (
            <span>
              {payment.customer_name ||
                payment.customer}
            </span>
          ) : payment.supplier ? (
            <span>
              {payment.supplier_name ||
                payment.supplier}
            </span>
          ) : (
            "—"
          )}
        </div>
      );
    },
  },

  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }) => {
      const amount = Number(
        row.original.amount || 0
      );

      return (
        <span className="font-semibold">
          ₹ {amount.toLocaleString("en-IN", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </span>
      );
    },
  },

  {
    accessorKey: "payment_mode",
    header: "Mode",
    cell: ({ row }) => {
      return (
        <span className="text-sm font-medium">
          {row.original.payment_mode || "—"}
        </span>
      );
    },
  },

  {
    accessorKey: "reference_number",
    header: "Reference",
    cell: ({ row }) => {
      return (
        <span>
          {row.original.reference_number || "—"}
        </span>
      );
    },
  },
];