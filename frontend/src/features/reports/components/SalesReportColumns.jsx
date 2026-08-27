export const salesReportColumns = [
    {
        accessorKey: "sale_number",
        header: "Invoice No.",
    },

    {
        accessorKey: "sale_date",
        header: "Date",
    },

    {
        accessorKey: "customer__name",
        header: "Customer",
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
];