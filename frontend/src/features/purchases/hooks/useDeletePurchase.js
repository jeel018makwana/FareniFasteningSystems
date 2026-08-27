import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { deletePurchase } from "../api/purchaseApi";

export const useDeletePurchase = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deletePurchase,

    onSuccess: () => {
      toast.success("Purchase deleted successfully");

      queryClient.invalidateQueries({
        queryKey: ["purchases"],
      });

      queryClient.invalidateQueries({
        queryKey: ["inventory"],
      });

      queryClient.invalidateQueries({
        queryKey: ["products"],
      });
    },

    onError: (error) => {
      toast.error(
        error?.response?.data?.message ||
        "Failed to delete purchase"
      );
    },
  });
};