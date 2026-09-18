import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createCustomer } from "../api/customerApi";
import toast from "react-hot-toast";

export const useCreateCustomer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createCustomer,

    onSuccess: () => {
      toast.success("Customer created successfully");

      queryClient.invalidateQueries({
        queryKey: ["customers"],
      });

      
    },

    onError: (error) => {
      toast.error(
        error?.response?.data?.message ||
        "Failed to create customer"
      );
    },
  });
};