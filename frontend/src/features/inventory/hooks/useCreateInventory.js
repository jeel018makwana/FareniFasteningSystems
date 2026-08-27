import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createInventory } from "../api/inventoryApi";

export const useCreateInventory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createInventory,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["inventory"],
      });

      queryClient.invalidateQueries({
        queryKey: ["products"],
      });
    },
  });
};