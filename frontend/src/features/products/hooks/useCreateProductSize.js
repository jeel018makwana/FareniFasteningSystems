import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createProductSize } from "../api/productApi";

export const useCreateProductSize = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createProductSize,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["product-sizes"],
      });
    },
  });
};