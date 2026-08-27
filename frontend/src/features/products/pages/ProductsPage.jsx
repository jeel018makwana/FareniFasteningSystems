import { useMemo, useState } from "react";

import DataTablePagination from "@/components/tables/DataTablePagination";
import DeleteConfirmationDialog from "@/components/common/DeleteConfirmationDialog";
import DashboardLayout from "@/layouts/DashboardLayout";

import useDebounce from "../hooks/useDebounce";
import { useProducts } from "../hooks/useProducts";
import { useDeleteProduct } from "../hooks/useDeleteProduct";

import ProductViewDialog from "../components/ProductViewDialog";
import ProductDialog from "../components/ProductDialog";
import ProductGroup from "../components/ProductGroup";
import ProductsToolbar from "../components/ProductsToolbar";

export default function ProductsPage() {
  const [open, setOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [viewOpen, setViewOpen] = useState(false);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 400);

  const [page, setPage] = useState(1);

  const {
    data,
    isLoading,
    refetch,
  } = useProducts({
    page,
    search: debouncedSearch,
  });

  const deleteMutation = useDeleteProduct();

  // Reset pagination when search changes
  const handleSearchChange = (value) => {
    setSearch(value);
    setPage(1);
  };

  // Add Product
  const handleAdd = () => {
    setSelectedProduct(null);
    setOpen(true);
  };

  // Edit Product
  const handleEdit = (product) => {
    setSelectedProduct(product);
    setOpen(true);
  };

  // View Product
  const handleView = (product) => {
    setSelectedProduct(product);
    setViewOpen(true);
  };

  // Delete Product
  const handleDelete = (product) => {
    setProductToDelete(product);
    setDeleteOpen(true);
  };

  // Confirm Delete
  const confirmDelete = async () => {
    if (!productToDelete) return;

    try {
      await deleteMutation.mutateAsync(productToDelete.id);

      setDeleteOpen(false);
      setProductToDelete(null);

      // Refresh product list
      refetch();
    } catch (error) {
      console.error("Failed to delete product:", error);
    }
  };

  // Prepare table data
  const tableData = useMemo(() => {
    return (data?.results || []).map((product) => ({
      ...product,
      onEdit: handleEdit,
      onView: handleView,
      onDelete: handleDelete,
    }));
  }, [data]);

  // Group products by name
  const groupedByCategory = useMemo(() => {
    const groups = {};

    tableData.forEach((product) => {
      const categoryId = product.category;
      const categoryName = product.category_name || "Uncategorized";


      if (!groups[categoryId]) {
        groups[categoryId] = {
          id: categoryId,
          name: categoryName,
          products: [],
        };
      }
      groups[categoryId].products.push(product);  
    });

    return Object.values(groups);
  }, [tableData]);

  const groupProductsByType = (products) => {
    const groups={};
    products.forEach((product) => {
      const typeId = product.product_type;

      const typeName = product.product_type_name || product.name;

      if (!groups[typeId]) {
        groups[typeId] ={
          id: typeId,
          name: typeName,
          variants: [],
        };
      }
      groups[typeId].variants.push(product);
    });
    return Object.values(groups);
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">

        {/* Page Header */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Products
            </h1>

            <p className="text-sm text-muted-foreground">
              Manage your fastening products, pricing and stock details.
            </p>
          </div>

          <div className="rounded-lg border border-orange-500/20 bg-orange-500/10 px-4 py-2 text-sm">
            <span className="font-medium text-orange-500">
              Fareni Fastening Systems
            </span>
          </div>
        </div>

        {/* Toolbar */}
        <ProductsToolbar
          search={search}
          setSearch={handleSearchChange}
          onAdd={handleAdd}
          onRefresh={refetch}
        />

        {/* Product Count */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {isLoading
              ? "Loading products..."
              : `Total Products: ${data?.count || 0}`}
          </p>
        </div>

        {/* Products */}
        {isLoading ? (
          <div className="rounded-xl border bg-card p-10 text-center">
            <p className="text-sm text-muted-foreground">
              Loading products...
            </p>
          </div>
        ) : groupedByCategory.length === 0 ? (
          <div className="rounded-xl border bg-card p-12 text-center">
            <h3 className="text-lg font-semibold">
              No products found
            </h3>

            <p className="mt-1 text-sm text-muted-foreground">
              Try changing your search or add a new product.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {groupedByCategory.map((category) => (
              <div key={category.id} className="space-y-3">
                {/*Category Header*/}
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold">
                      {category.name}
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      {category.products.length} products
                    </p>
                  </div>
                </div>

                {/* Products inside category*/}
                <div className="space-y-3">
                  {groupProductsByType(category.products).map(
                    (productType) => (
                      <ProductGroup key={productType.id} name={productType.name} products={productType.variants} />
                    )
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        <DataTablePagination
          page={page}
          setPage={setPage}
          count={data?.count || 0}
          label="products"
        />

        {/* Add / Edit Product */}
        <ProductDialog
          open={open}
          product={selectedProduct}
          onOpenChange={(value) => {
            setOpen(value);

            if (!value) {
              setSelectedProduct(null);
            }
          }}
        />

        {/* View Product */}
        <ProductViewDialog
          open={viewOpen}
          product={selectedProduct}
          onOpenChange={(value) => {
            setViewOpen(value);

            if (!value) {
              setSelectedProduct(null);
            }
          }}
        />

        {/* Delete Confirmation */}
        <DeleteConfirmationDialog
          open={deleteOpen}
          onOpenChange={setDeleteOpen}
          loading={deleteMutation.isPending}
          title="Delete Product"
          description={
            productToDelete
              ? `Are you sure you want to delete "${productToDelete.name}"? This action cannot be undone.`
              : "Are you sure you want to delete this product?"
          }
          onConfirm={confirmDelete}
        />

      </div>
    </DashboardLayout>
  );
}