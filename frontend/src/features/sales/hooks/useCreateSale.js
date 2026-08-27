import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { createSale } from "../api/salesApi";

export const useCreateSale = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createSale,

    onSuccess: () => {
      toast.success("Sale created successfully");

      queryClient.invalidateQueries({
        queryKey: ["sales"],
      });

      queryClient.invalidateQueries({
        queryKey: ["inventory"],
      });

      queryClient.invalidateQueries({
        queryKey: ["products"],
      });
    },

    onError: (error) => {
      console.error(
        "SALE VALIDATION ERRORS:",
        JSON.stringify(error?.response?.data?.errors, null, 2)
      );

      toast.error(
        error?.response?.data?.message ||
        "Failed to create sale"
      );
    },
  });
};