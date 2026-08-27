import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateProduct } from "../api/productApi";
import toast from "react-hot-toast";

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateProduct,

    onSuccess: () => {
      toast.success("Product updated successfully");

      queryClient.invalidateQueries({
        queryKey: ["products"],
      });
    },

    onError: (error) => {
      toast.error(
        error?.response?.data?.message ||
          "Failed to update product"
      );
    },
  });
};