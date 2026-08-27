export const inventoryReportColumns = [

    {
        accessorKey: "product_code",
        header: "Product Code",
    },

    {
        accessorKey: "name",
        header: "Product",
    },

    {
        accessorKey: "current_stock",
        header: "Current Stock",
    },

    {
        accessorKey: "minimum_stock",
        header: "Minimum Stock",
    },

    {
        accessorKey: "purchase_price",
        header: "Purchase Price",

        cell: ({ row }) =>
            new Intl.NumberFormat("en-IN", {
                style: "currency",
                currency: "INR",
            }).format(
                Number(row.original.purchase_price)
            ),
    },

    {
        accessorKey: "selling_price",
        header: "Selling Price",

        cell: ({ row }) =>
            new Intl.NumberFormat("en-IN", {
                style: "currency",
                currency: "INR",
            }).format(
                Number(row.original.selling_price)
            ),
    },

    {
        accessorKey: "stock_value",
        header: "Stock Value",

        cell: ({ row }) =>
            new Intl.NumberFormat("en-IN", {
                style: "currency",
                currency: "INR",
            }).format(
                Number(row.original.stock_value)
            ),
    },

];