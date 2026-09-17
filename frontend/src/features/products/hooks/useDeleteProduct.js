import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteProduct } from "../api/productApi";
import toast from "react-hot-toast";

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteProduct,

    onSuccess: () => {
      toast.success("Product deleted successfully");

      // Refresh products
      queryClient.invalidateQueries({
        queryKey: ["products"],
      });

      // Refresh dashboard
      queryClient.invalidateQueries({
        queryKey: ["dashboard"],
      });

      // Refresh inventory-related data if used
      queryClient.invalidateQueries({
        queryKey: ["inventory"],
      });
    },

    onError: (error) => {
      toast.error(
        error?.response?.data?.message ||
          "Failed to delete product"
      );
    },
  });
};