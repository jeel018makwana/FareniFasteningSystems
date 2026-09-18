import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteSupplier } from "../api/supplierApi";
import toast from "react-hot-toast";

export const useDeleteSupplier = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteSupplier,

    onSuccess: () => {
      toast.success("Supplier deleted successfully");

      queryClient.invalidateQueries({
        queryKey: ["suppliers"],
      });

      queryClient.invalidateQueries({
        queryKey: ["dashboard"],
      });
    },

    onError: (error) => {
      toast.error(
        error?.response?.data?.message ||
        "Failed to delete supplier"
      );
    },
  });
};