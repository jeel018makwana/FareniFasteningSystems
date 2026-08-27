import { useMemo, useState } from "react";

import DashboardLayout from "@/layouts/DashboardLayout";

import DataTable from "@/components/tables/DataTable";
import DataTablePagination from "@/components/tables/DataTablePagination";
import DeleteConfirmationDialog from "@/components/common/DeleteConfirmationDialog";

import SaleToolbar from "../components/SaleToolbar";
import SaleDialog from "../components/SaleDialog";
import SaleViewDialog from "../components/SaleViewDialog";
import SaleRowActions from "../components/SaleRowActions";
import { downloadInvoice } from "../api/salesApi";
import { saleColumns } from "../components/SaleColumns";

import { useSales } from "../hooks/useSales";
import { useDeleteSale } from "../hooks/useDeleteSale";
import useDebounce from "../hooks/useDebounce";

export default function SalesPage() {

    const [open, setOpen] = useState(false);

    const [selectedSale, setSelectedSale] =
        useState(null);

    const [viewOpen, setViewOpen] =
        useState(false);

    const [deleteOpen, setDeleteOpen] =
        useState(false);

    const [saleToDelete, setSaleToDelete] =
        useState(null);

    const [search, setSearch] = useState("");

    const debouncedSearch =
        useDebounce(search, 400);

    const [page, setPage] = useState(1);

    const { data, isLoading, refetch } =
        useSales({
        page,
        search: debouncedSearch,
        });

    const deleteMutation =
        useDeleteSale();
    const handleEdit = (sale) => {
        setSelectedSale(sale);
        setOpen(true);
    };

    const handleView = (sale) => {
        setSelectedSale(sale);
        setViewOpen(true);
    };

    const handleDelete = (sale) => {
        setSaleToDelete(sale);
        setDeleteOpen(true);
    };

    const confirmDelete = async () => {

        if (!saleToDelete) return;

        await deleteMutation.mutateAsync(
            saleToDelete.id
        );

        setDeleteOpen(false);
        setSaleToDelete(null);
    };
    const handleDownload = async (sale) => {
        try{
            const blob =
                await downloadInvoice(sale.id);
            const url =
                window.URL.createObjectURL(blob);
            const link =
                document.createElement("a");
            link.href = url;
            link.download = `${sale.sale_number}.pdf`;
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error(error);
            alert("Failed to download invoice.");
        }
    };

    const handlePrint = async (sale) => {
        try {
            const blob = await downloadInvoice(sale.id);

            const url = window.URL.createObjectURL(blob);

            const printWindow = window.open(
                url,
                "_blank"
            );

            if (!printWindow) {
                alert("Please allow popups to print the invoice.");
                return;
            }

            printWindow.onload = () => {
                printWindow.focus();
                printWindow.print();
            };

        } catch (error) {
            console.error(error);
            alert("Failed to print invoice.");
        }
    };

    const tableData = useMemo(() => {
        return (data?.results ||[]).map((sale) => ({
            ...sale,
            onEdit: handleEdit,
            onView: handleView,
            onDelete: handleDelete,
            onDownload: handleDownload,
            onPrint: handlePrint,
        }));
    }, [data]);

    if (isLoading) {
        return(
            <DashboardLayout>
                <div>Loading..</div>
            </DashboardLayout>
        )
    }
    return(
        <DashboardLayout>
            <div className="space-y-4">
                <h1 className="text-3xl font-bold text-[#20252B]">
                    Sales
                </h1>
                <SaleToolbar
                    search={search}
                    setSearch={setSearch}
                    onAdd={() => setOpen(true)}
                    onRefresh={refetch}
                />

                <div>
                    Total Sales: {data?.count || 0}
                </div>

                <DataTable
                    columns={saleColumns}
                    data={tableData}
                    loading={isLoading}
                />

                <DataTablePagination
                    page={page}
                    setPage={setPage}
                    count={data?.count || 0}
                    label="sales"
                />
                
                <SaleDialog
                    open={open}
                    sale={selectedSale}
                    onOpenChange={(value) => {
                        setOpen(value);

                        if (!value) {
                            setSelectedSale(null);
                        }
                    }}
                />
                
                <SaleViewDialog
                    open={viewOpen}
                    sale={selectedSale}
                    onOpenChange={setViewOpen}
                />
                <DeleteConfirmationDialog
                    open={deleteOpen}
                    onOpenChange={setDeleteOpen}
                    loading={deleteMutation.isPending}
                    title="Delete Sale"
                    description={`Are you sure you want to delete "${saleToDelete?.sale_number}"?`}
                    onConfirm={confirmDelete}
                />
            </div>
        </DashboardLayout>
    )
 
}