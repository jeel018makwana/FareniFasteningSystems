import PurchaseRowActions from "./PurchaseRowActions";

export const purchaseColumns = [
  {
    accessorKey: "purchase_number",
    header: "Purchase No.",
  },
  {
    accessorKey: "invoice_number",
    header: "Invoice No.",
  },
  {
    accessorKey: "purchase_date",
    header: "Date",
  },
  {
    accessorKey: "supplier_name",
    header: "Supplier",
  },
  {
    accessorKey: "subtotal",
    header: "Subtotal",
    cell: ({ row }) =>
      new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
      }).format(
        Number(row.original.subtotal)
      ),
  },
  {
    accessorKey: "grand_total",
    header: "Grand Total",
    cell: ({ row }) =>
      new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
      }).format(
        Number(row.original.grand_total)
      ),
  },
  {
    id: "items",
    header: "Items",
    cell: ({ row }) =>
      row.original.items?.length || 0,
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <PurchaseRowActions
        purchase={row.original}
        onView={row.original.onView}
        onEdit={row.original.onEdit}
        onDelete={row.original.onDelete}
        onDownload={row.original.onDownload}
        onPrint={row.original.onPrint}
      />
    ),
  },
];