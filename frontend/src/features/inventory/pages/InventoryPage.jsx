import {
  useEffect,
  useMemo,
  useState,
} from "react";
import DataTable from "@/components/tables/DataTable";
import DataTablePagination from "@/components/tables/DataTablePagination";
import DeleteConfirmationDialog from "@/components/common/DeleteConfirmationDialog";
import DashboardLayout from "@/layouts/DashboardLayout";
import useDebounce from "../hooks/useDebounce";
import { useInventory } from "../hooks/useInventory";
import { useDeleteInventory } from "../hooks/useDeleteInventory";

import { inventoryColumns } from "../components/InventoryColumns";
import InventoryToolbar from "../components/InventoryToolbar";
import InventoryDialog from "../components/InventoryDialog";
import InventoryViewDialog from "../components/InventoryViewDialog";

export default function InventoryPage() {
  const [open, setOpen] = useState(false);
  const [selectedInventory, setSelectedInventory] = useState(null);

  const [viewOpen, setViewOpen] = useState(false);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [inventoryToDelete, setInventoryToDelete] = useState(null);

  const [search, setSearch] = useState("");
  const [transactionType, setTransactionType] = useState("");
  const debouncedSearch = useDebounce(search, 400);

  const [page, setPage] = useState(1);
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, transactionType]);
  const { data, isLoading, refetch } = useInventory({
    page,
    search: debouncedSearch,
    transaction_type: transactionType,
  });

  const deleteMutation = useDeleteInventory();

  const handleEdit = (inventory) => {
    setSelectedInventory(inventory);
    setOpen(true);
  };

  const handleView = (inventory) => {
    setSelectedInventory(inventory);
    setViewOpen(true);
  };

  const handleDelete = (inventory) => {
    setInventoryToDelete(inventory);
    setDeleteOpen(true);
  };

  const confirmDelete = async () => {
    if (!inventoryToDelete) return;

    await deleteMutation.mutateAsync(inventoryToDelete.id);

    setDeleteOpen(false);
    setInventoryToDelete(null);
  };

  const tableData = useMemo(() => {
    return (data?.results || []).map((item) => ({
      ...item,
      onEdit: handleEdit,
      onView: handleView,
      onDelete: handleDelete,
    }));
  }, [data]);

  return (
    <DashboardLayout>

        <div className="space-y-4">

            <h1 className="text-3xl font-bold">
                Inventory
            </h1>

            <InventoryToolbar
              search={search}
              setSearch={setSearch}
              transactionType={transactionType}
              setTransactionType={setTransactionType}
              onAdd={() => setOpen(true)}
              onRefresh={refetch}
            />

            <div className="text-sm text-muted-foreground">
                Total Transactions: {data?.count || 0}
            </div>

            <DataTable
                columns={inventoryColumns}
                data={tableData}
                loading={isLoading}
            />

            <DataTablePagination
                page={page}
                setPage={setPage}
                count={data?.count || 0}
                label="transactions"
            />

            <InventoryDialog
                open={open}
                inventory={selectedInventory}
                onOpenChange={(value) => {
                    setOpen(value);

                    if (!value) {
                        setSelectedInventory(null);
                    }
                }}
            />

            <InventoryViewDialog
                open={viewOpen}
                inventory={selectedInventory}
                onOpenChange={setViewOpen}
            />

            <DeleteConfirmationDialog
                open={deleteOpen}
                onOpenChange={setDeleteOpen}
                loading={deleteMutation.isPending}
                title="Delete Transaction"
                description={`Are you sure you want to delete "${inventoryToDelete?.reference}"?`}
                onConfirm={confirmDelete}
            />

        </div>
    </DashboardLayout>

  );
}