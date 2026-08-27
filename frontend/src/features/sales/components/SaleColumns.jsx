import SaleRowActions from "./SaleRowActions";

export const saleColumns = [
  {
    accessorKey: "sale_number",
    header: "Invoice No.",
  },
  {
    accessorKey: "sale_date",
    header: "Date",
  },
  {
    accessorKey: "customer_name",
    header: "Customer",
  },
  {
    accessorKey: "subtotal",
    header: "Subtotal",
    cell: ({ row }) =>
      new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
      }).format(Number(row.original.subtotal)),
  },
  {
    accessorKey: "grand_total",
    header: "Grand Total",
    cell: ({ row }) =>
      new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
      }).format(Number(row.original.grand_total)),
  },
  {
    id: "items",
    header: "Items",
    cell: ({ row }) => row.original.items?.length || 0,
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <SaleRowActions
        sale={row.original}
        onView={row.original.onView}
        onEdit={row.original.onEdit}
        onDelete={row.original.onDelete}
        onDownload={row.original.onDownload}
        onPrint={row.original.onPrint}
      />
    ),
  },
];