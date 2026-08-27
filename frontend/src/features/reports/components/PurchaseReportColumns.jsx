export const purchaseReportColumns = [

    {
        accessorKey: "purchase_number",
        header: "Purchase No.",
    },

    {
        accessorKey: "purchase_date",
        header: "Date",
    },

    {
        accessorKey: "supplier__name",
        header: "Supplier",
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