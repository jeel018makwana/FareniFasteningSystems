import { useMemo, useState } from "react";

import DataTable from "@/components/tables/DataTable";
import DataTablePagination from "@/components/tables/DataTablePagination";
import DeleteConfirmationDialog from "@/components/common/DeleteConfirmationDialog";

import { useSuppliers } from "../hooks/useSuppliers";
import { useDeleteSupplier } from "../hooks/useDeleteSupplier";
import useDebounce from "../hooks/useDebounce";

import { supplierColumns } from "../components/supplierColumns";
import SupplierToolbar from "../components/SupplierToolbar";
import SupplierDialog from "../components/SupplierDialog";
import SupplierViewDialog from "../components/SupplierViewDialog";
import DashboardLayout from "@/layouts/DashboardLayout";

export default function SuppliersPage() {
  const [open, setOpen] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState(null);

  const [viewOpen, setViewOpen] = useState(false);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [supplierToDelete, setSupplierToDelete] = useState(null);

  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 400);

  const [page, setPage] = useState(1);

  const deleteMutation = useDeleteSupplier();

  const { data, isLoading, refetch } = useSuppliers({
    page,
    search: debouncedSearch,
  });

  const handleEdit = (supplier) => {
    setSelectedSupplier(supplier);
    setOpen(true);
  };

  const handleView = (supplier) => {
    setSelectedSupplier(supplier);
    setViewOpen(true);
  };

  const handleDelete = (supplier) => {
    setSupplierToDelete(supplier);
    setDeleteOpen(true);
  };

  const confirmDelete = async () => {
    if (!supplierToDelete) return;

    await deleteMutation.mutateAsync(supplierToDelete.id);

    setDeleteOpen(false);
    setSupplierToDelete(null);
  };

  const tableData = useMemo(() => {
    return (data?.results || []).map((supplier) => ({
      ...supplier,
      onEdit: handleEdit,
      onView: handleView,
      onDelete: handleDelete,
    }));
  }, [data]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <DashboardLayout>

      <div className="space-y-4">
        <h1 className="text-3xl font-bold">Suppliers</h1>

        <SupplierToolbar
          search={search}
          setSearch={setSearch}
          onAdd={() => setOpen(true)}
          onRefresh={refetch}
        />

        <div>
          Total Suppliers: {tableData.length}
        </div>

        <DataTable
          columns={supplierColumns}
          data={tableData}
          loading={isLoading}
        />

        <SupplierDialog
          open={open}
          supplier={selectedSupplier}
          onOpenChange={(value) => {
            setOpen(value);

            if (!value) {
              setSelectedSupplier(null);
            }
          }}
        />

        <DeleteConfirmationDialog
          open={deleteOpen}
          onOpenChange={setDeleteOpen}
          loading={deleteMutation.isPending}
          title="Delete Supplier"
          description={`Are you sure you want to delete "${supplierToDelete?.name}"? This action cannot be undone.`}
          onConfirm={confirmDelete}
        />

        <SupplierViewDialog
          open={viewOpen}
          onOpenChange={setViewOpen}
          supplier={selectedSupplier}
        />

        <DataTablePagination
          page={page}
          setPage={setPage}
          count={data?.count || 0}
        />
      </div>
    </DashboardLayout>

  );
}