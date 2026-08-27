import { useMemo, useState } from "react";

import DashboardLayout from "@/layouts/DashboardLayout";

import DataTable from "@/components/tables/DataTable";
import DataTablePagination from "@/components/tables/DataTablePagination";
import DeleteConfirmationDialog from "@/components/common/DeleteConfirmationDialog";

import { paymentColumns } from "../components/PaymentColumns";
import PaymentToolbar from "../components/PaymentToolbar";
import PaymentDialog from "../components/PaymentDialog";
import PaymentRowActions from "../components/PaymentRowActions";

import useDebounce from "../hooks/useDebounce";
import { usePayments } from "../hooks/usePayments";
import { useDeletePayment } from "../hooks/useDeletePayment";


export default function PaymentsPage() {

  const [search, setSearch] = useState("");

  const debouncedSearch = useDebounce(
    search,
    400
  );

  const [page, setPage] = useState(1);

  // Add / Edit dialog
  const [paymentDialogOpen, setPaymentDialogOpen] =
    useState(false);

  const [paymentToEdit, setPaymentToEdit] =
    useState(null);

  // Delete dialog
  const [deleteOpen, setDeleteOpen] =
    useState(false);

  const [paymentToDelete, setPaymentToDelete] =
    useState(null);


  // Payments
  const {
    data,
    isLoading,
    refetch,
  } = usePayments({
    page,
    search: debouncedSearch,
  });


  // Delete mutation
  const deleteMutation =
    useDeletePayment();


  // =========================
  // ADD PAYMENT
  // =========================

  const handleAdd = () => {

    setPaymentToEdit(null);

    setPaymentDialogOpen(true);
  };


  // =========================
  // EDIT PAYMENT
  // =========================

  const handleEdit = (payment) => {

    setPaymentToEdit(payment);

    setPaymentDialogOpen(true);
  };


  // =========================
  // DELETE PAYMENT
  // =========================

  const handleDelete = (payment) => {

    setPaymentToDelete(payment);

    setDeleteOpen(true);
  };


  const confirmDelete = async () => {

    if (!paymentToDelete) return;

    await deleteMutation.mutateAsync(
      paymentToDelete.id
    );

    setDeleteOpen(false);

    setPaymentToDelete(null);
  };


  // =========================
  // TABLE DATA
  // =========================

  const tableData = useMemo(() => {

    return data?.results || [];

  }, [data]);


  // =========================
  // TABLE COLUMNS
  // =========================

  const columns = useMemo(() => {

    return [
      ...paymentColumns,

      {
        id: "actions",
        header: "Actions",

        cell: ({ row }) => {

          const payment =
            row.original;

          return (
            <PaymentRowActions
              payment={payment}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          );
        },
      },
    ];

  }, []);


  return (

    <DashboardLayout>

      <div className="space-y-6">


        {/* =========================
            HEADER
        ========================== */}

        <div>

          <h1 className="text-3xl font-bold">
            Payments
          </h1>

          <p className="text-muted-foreground">
            Manage customer and supplier payments
          </p>

        </div>


        {/* =========================
            TOOLBAR
        ========================== */}

        <PaymentToolbar
          search={search}
          setSearch={(value) => {

            setSearch(value);

            setPage(1);

          }}
          onAdd={handleAdd}
          onRefresh={refetch}
        />


        {/* =========================
            COUNT
        ========================== */}

        <div className="text-sm text-muted-foreground">

          Total Payments:{" "}
          {data?.count || 0}

        </div>


        {/* =========================
            TABLE
        ========================== */}

        <DataTable
          columns={columns}
          data={tableData}
          loading={isLoading}
        />


        {/* =========================
            PAGINATION
        ========================== */}

        <DataTablePagination
          page={page}
          setPage={setPage}
          count={data?.count || 0}
          label="payments"
        />


        {/* =========================
            ADD / EDIT PAYMENT
        ========================== */}

        <PaymentDialog
          open={paymentDialogOpen}
          payment={paymentToEdit}
          onOpenChange={(open) => {

            setPaymentDialogOpen(open);

            if (!open) {
              setPaymentToEdit(null);
            }

          }}
        />


        {/* =========================
            DELETE CONFIRMATION
        ========================== */}

        <DeleteConfirmationDialog
          open={deleteOpen}
          onOpenChange={setDeleteOpen}
          loading={deleteMutation.isPending}
          title="Delete Payment"
          description={
            `Are you sure you want to delete "${paymentToDelete?.payment_number}"?`
          }
          onConfirm={confirmDelete}
        />


      </div>

    </DashboardLayout>
  );
}