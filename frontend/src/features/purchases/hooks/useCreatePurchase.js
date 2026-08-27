import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { createPurchase } from "../api/purchaseApi";

export const useCreatePurchase = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createPurchase,

    onSuccess: () => {
      toast.success("Purchase created successfully");

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
        "Failed to create purchase"
      );
    },
  });
};