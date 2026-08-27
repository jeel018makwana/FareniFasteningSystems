import CustomerRowActions from "./CustomerRowActions";
export const customerColumns = [
  {
    accessorKey: "customer_code",
    header: "Code",
  },
  {
    accessorKey: "name",
    header: "Customer",
  },
  {
    accessorKey: "phone",
    header: "Phone",
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) =>
        row.original.email || "-",
    },
  {
    accessorKey: "opening_balance",
    header: "Balance",
    cell: ({ row }) => {
        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
        }).format(Number(row.original.opening_balance || 0));
    },
   },
   {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
        <CustomerRowActions
        customer={row.original}
        onView={row.original.onView}
        onEdit={row.original.onEdit}
        onDelete={row.original.onDelete}
        />
    ),
    },
];