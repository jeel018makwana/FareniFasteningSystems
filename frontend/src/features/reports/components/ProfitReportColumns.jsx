export const profitReportColumns = [

    {
        accessorKey: "sale_number",
        header: "Invoice No.",
    },

    {
        accessorKey: "product",
        header: "Product",
    },

    {
        accessorKey: "quantity",
        header: "Quantity",
    },

    {
        accessorKey: "sales_value",
        header: "Sales Value",

        cell: ({ row }) =>
            new Intl.NumberFormat("en-IN", {
                style: "currency",
                currency: "INR",
            }).format(
                Number(row.original.sales_value)
            ),
    },

    {
        accessorKey: "cost_value",
        header: "Cost Value",

        cell: ({ row }) =>
            new Intl.NumberFormat("en-IN", {
                style: "currency",
                currency: "INR",
            }).format(
                Number(row.original.cost_value)
            ),
    },

    {
        accessorKey: "profit",
        header: "Profit",

        cell: ({ row }) =>
            new Intl.NumberFormat("en-IN", {
                style: "currency",
                currency: "INR",
            }).format(
                Number(row.original.profit)
            ),
    },

];