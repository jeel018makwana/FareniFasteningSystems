import { useMemo, useState } from "react";

import DashboardLayout from "@/layouts/DashboardLayout";

import DataTable from "@/components/tables/DataTable";
import DataTablePagination from "@/components/tables/DataTablePagination";
import DeleteConfirmationDialog from "@/components/common/DeleteConfirmationDialog";

import PurchaseToolbar from "../components/PurchaseToolbar";
import PurchaseDialog from "../components/PurchaseDialog";
import PurchaseViewDialog from "../components/PurchaseViewDialog";
import { purchaseColumns } from "../components/PurchaseColumns";
import {
  downloadPurchaseInvoice,
} from "../api/purchaseApi";
import { usePurchases } from "../hooks/usePurchases";
import { useDeletePurchase } from "../hooks/useDeletePurchase";

import useDebounce from "../hooks/useDebounce";

export default function PurchasesPage() {

  const [open, setOpen] = useState(false);

  const [selectedPurchase, setSelectedPurchase] =
    useState(null);

  const [viewOpen, setViewOpen] =
    useState(false);

  const [deleteOpen, setDeleteOpen] =
    useState(false);

  const [purchaseToDelete, setPurchaseToDelete] =
    useState(null);

  const [search, setSearch] =
    useState("");

  const debouncedSearch =
    useDebounce(search, 400);

  const [page, setPage] =
    useState(1);

  const {
    data,
    isLoading,
    refetch,
  } = usePurchases({
    page,
    search: debouncedSearch,
  });

  const deleteMutation =
    useDeletePurchase();

  const handleEdit = (purchase) => {
    setSelectedPurchase(purchase);
    setOpen(true);
  };

  const handleView = (purchase) => {
    setSelectedPurchase(purchase);
    setViewOpen(true);
  };

  const handleDelete = (purchase) => {
    setPurchaseToDelete(purchase);
    setDeleteOpen(true);
  };

  const confirmDelete = async () => {

    if (!purchaseToDelete) return;

    await deleteMutation.mutateAsync(
      purchaseToDelete.id
    );

    setDeleteOpen(false);
    setPurchaseToDelete(null);

  };

  const handleDownload = async (purchase) => {
    try {
      const blob =
        await downloadPurchaseInvoice(purchase.id);

      const url =
        window.URL.createObjectURL(blob);

      const link =
        document.createElement("a");

      link.href = url;

      link.download =
        `${purchase.purchase_number}.pdf`;

      document.body.appendChild(link);

      link.click();

      link.remove();

      window.URL.revokeObjectURL(url);

    } catch (error) {
      console.error(error);
      alert("Failed to download purchase invoice.");
    }
  };

  const handlePrint = async (purchase) => {
    try {
      const blob =
        await downloadPurchaseInvoice(purchase.id);

      const url =
        window.URL.createObjectURL(blob);

      const printWindow =
        window.open(url, "_blank");

      if (!printWindow) {
        alert("Please allow popups to print the invoice.");
        return;
      }

      printWindow.onload = () => {
        printWindow.focus();
        printWindow.print();
      };

    } catch (error) {
      console.error("Purchase invoice print error:", error);
      alert("Failed to print purchase invoice.");
    }
  };

  const tableData = useMemo(() => {

    return (data?.results || []).map(
      (purchase) => ({
        ...purchase,
        onEdit: handleEdit,
        onView: handleView,
        onDelete: handleDelete,
        onDownload: handleDownload,
        onPrint: handlePrint,
      })
    );

  }, [data]);
  if (isLoading) {
    return (
      <DashboardLayout>
        <div>Loading...</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>

      <div className="space-y-4">

        <h1 className="text-3xl font-bold">
          Purchases
        </h1>

        <PurchaseToolbar
          search={search}
          setSearch={setSearch}
          onAdd={() => setOpen(true)}
          onRefresh={refetch}
        />

        <div>
          Total Purchases: {data?.count || 0}
        </div>

        <DataTable
          columns={purchaseColumns}
          data={tableData}
          loading={isLoading}
        />

        <DataTablePagination
          page={page}
          setPage={setPage}
          count={data?.count || 0}
          label="purchases"
        />

        <PurchaseDialog
          open={open}
          purchase={selectedPurchase}
          onOpenChange={(value) => {

            setOpen(value);

            if (!value) {
              setSelectedPurchase(null);
            }

          }}
        />

        <PurchaseViewDialog
          open={viewOpen}
          purchase={selectedPurchase}
          onOpenChange={setViewOpen}
        />

        <DeleteConfirmationDialog
          open={deleteOpen}
          onOpenChange={setDeleteOpen}
          loading={deleteMutation.isPending}
          title="Delete Purchase"
          description={`Are you sure you want to delete "${purchaseToDelete?.purchase_number}"?`}
          onConfirm={confirmDelete}
        />

      </div>

    </DashboardLayout>
  );
}