import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createProductLength } from "../api/productApi";

export const useCreateProductLength = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createProductLength,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["product-lengths"],
      });
    },
  });
};