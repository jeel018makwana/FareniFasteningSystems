import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteCustomer } from "../api/customerApi";
import toast from "react-hot-toast";

export const useDeleteCustomer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteCustomer,

    onSuccess: () => {
      toast.success("Customer deleted successfully");

      queryClient.invalidateQueries({
        queryKey: ["customers"],
      });

      queryClient.invalidateQueries({
        queryKey: ["dashboard"],
      });
    },

    onError: (error) => {
      toast.error(
        error?.response?.data?.message ||
        "Failed to delete customer"
      );
    },
  });
};