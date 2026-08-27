import { useCustomers } from "../hooks/useCustomers";
import DataTable from "@/components/tables/DataTable";
import { customerColumns } from "../components/customerColumns";
import CustomerToolbar from "../components/CustomerToolbar";
import CustomerDialog from "../components/CustomerDialog";
import { useMemo, useState } from "react";
import useDebounce from "../hooks/useDebounce";
import DataTablePagination from "@/components/tables/DataTablePagination";
import { useDeleteCustomer } from "../hooks/useDeleteCustomer";
import DeleteConfirmationDialog from "@/components/common/DeleteConfirmationDialog";
import CustomerViewDialog from "../components/CustomerViewDialog";
import DashboardLayout from "@/layouts/DashboardLayout";


export default function CustomersPage() {
    const [open, setOpen] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const handleEdit = (customer) => {
        setSelectedCustomer(customer);
        setOpen(true);
    };
    const handleView = (customer) => {
        setSelectedCustomer(customer);
        setViewOpen(true);
    };

    const handleDelete = (customer) => {
        setCustomerToDelete(customer);
        setDeleteOpen(true);
    };
    const deleteMutation = useDeleteCustomer();
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [customerToDelete, setCustomerToDelete] = useState(null);
    const [search, setSearch] = useState("");
    const debouncedSearch = useDebounce(search, 400);
    const [page, setPage] = useState(1);
    const { data, isLoading, refetch } = useCustomers({
        page,
        search:debouncedSearch,
    });
    const confirmDelete = async () => {
        if (!customerToDelete) return;

        await deleteMutation.mutateAsync(customerToDelete.id);

        setDeleteOpen(false);
        setCustomerToDelete(null);
    };
    const [viewOpen, setViewOpen] = useState(false);
    const tableData = useMemo(() => {
        return (data?.results || []).map((customer) => ({
            ...customer,
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
                <h1 className="text-3xl font-bold">Customers</h1>
                <CustomerToolbar
                    search={search}
                    setSearch={setSearch}
                    onAdd={() => setOpen(true)}
                    onRefresh={(refetch)}
                />
                <div>
                    Total Customers: {data?.count || 0}
                </div>
                <DataTable
                        columns={customerColumns}
                        data={tableData}
                        loading={isLoading}
                />
                <CustomerDialog
                    open={open}
                    customer={selectedCustomer}
                    onOpenChange={(value) => {
                        setOpen(value);
                        
                        if (!value) {
                            setSelectedCustomer(null);
                        }
                    }}
                />
                <DeleteConfirmationDialog
                    open={deleteOpen}
                    onOpenChange={setDeleteOpen}
                    loading={deleteMutation.isPending}
                    title="Delete Customer"
                    description={`Are you sure you want to delete "${customerToDelete?.name}"? This action cannot be undone.`}
                    onConfirm={confirmDelete}
                />
                <CustomerViewDialog
                    open={viewOpen}
                    onOpenChange={setViewOpen}
                    customer={selectedCustomer}
                />
                <DataTablePagination
                    page={page}
                    setPage={setPage}
                    count={data?.count || 0}
                    label="customers"
                />
            </div>
        </DashboardLayout>
    );
}