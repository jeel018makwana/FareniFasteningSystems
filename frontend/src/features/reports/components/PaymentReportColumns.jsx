export const paymentReportColumns = [

    {
        accessorKey: "payment_number",
        header: "Payment No.",
    },

    {
        accessorKey: "payment_date",
        header: "Date",
    },

    {
        accessorKey: "payment_type",
        header: "Type",
    },

    {
        accessorKey: "payment_mode",
        header: "Mode",
    },

    {
        accessorKey: "customer__name",
        header: "Customer",

        cell: ({ row }) =>
            row.original.customer__name || "-",
    },

    {
        accessorKey: "supplier__name",
        header: "Supplier",

        cell: ({ row }) =>
            row.original.supplier__name || "-",
    },

    {
        accessorKey: "amount",
        header: "Amount",

        cell: ({ row }) =>
            new Intl.NumberFormat("en-IN", {
                style: "currency",
                currency: "INR",
            }).format(
                Number(row.original.amount)
            ),
    },

];