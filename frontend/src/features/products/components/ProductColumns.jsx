import ProductsRowActions from "./ProductsRowActions";

const formatCurrency = (value) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(Number(value || 0));
};

export const ProductColumns = [
  {
    accessorKey: "product_code",
    header: "Code",

    cell: ({ row }) => (
      <span className="font-mono text-xs font-semibold text-[#F45A00]">
        {row.original.product_code}
      </span>
    ),
  },

  {
    accessorKey: "name",
    header: "Product",

    cell: ({ row }) => (
      <span className="font-medium">
        {row.original.name}
      </span>
    ),
  },

  {
    accessorKey: "category_name",
    header: "Category",

    cell: ({ row }) => (
      <span className="text-sm">
        {row.original.category_name || "-"}
      </span>
    ),
  },
  
  {
    accessorKey: "product_size_name",
    header: "Size",

    cell: ({ row }) => (
      <span className="rounded-md bg-muted px-2 py-1 text-xs font-medium">
        {row.original.product_size_name || "-"}
      </span>
    ),
  },

  {
    accessorKey: "product_length_name",
    header: "Length",

    cell: ({ row }) => (
      <span className="text-sm">
        {row.original.product_length_name || "-"}
      </span>
    ),
  },

  
  {
    accessorKey: "grade",
    header: "Grade",
    
    cell: ({ row }) => (
      <span className="text-sm">
        {row.original.grade || "-"}
      </span>
    ),
  },
  
  {
    accessorKey: "brand_name",
    header: "Brand",

    cell: ({ row }) => (
      <span className="text-sm">
        {row.original.brand_name || "-"}
      </span>
    ),
  },
  

  {
    accessorKey: "selling_price",
    header: "Selling Price",

    cell: ({ row }) => (
      <span className="font-semibold">
        {formatCurrency(row.original.selling_price)}
      </span>
    ),
  },

  {
    accessorKey: "current_stock",
    header: "Stock",

    cell: ({ row }) => {
      const stock = Number(
        row.original.current_stock || 0
      );

      const minimumStock = Number(
        row.original.minimum_stock || 0
      );

      const isLow =
        stock <= minimumStock;

      return (
        <span
          className={`
            inline-flex
            min-w-[60px]
            justify-center
            rounded-full
            px-2.5
            py-1
            text-xs
            font-semibold
            ${
              isLow
                ? "bg-red-500/10 text-red-600 dark:text-red-400"
                : "bg-green-500/10 text-green-600 dark:text-green-400"
            }
          `}
        >
          {stock}
        </span>
      );
    },
  },

  {
    accessorKey: "is_active",
    header: "Status",

    cell: ({ row }) => {
      const active = row.original.is_active;

      return (
        <span
          className={`
            inline-flex
            rounded-full
            px-2.5
            py-1
            text-xs
            font-semibold
            ${
              active
                ? "bg-green-500/10 text-green-600 dark:text-green-400"
                : "bg-gray-500/10 text-gray-500"
            }
          `}
        >
          {active ? "Active" : "Inactive"}
        </span>
      );
    },
  },

  {
    id: "actions",
    header: "Actions",

    cell: ({ row }) => (
      <ProductsRowActions
        row={row}
      />
    ),
  },
];