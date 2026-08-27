import { useMutation, useQueryClient } from "@tanstack/react-query";

import { deleteInventory } from "../api/inventoryApi";

export const useDeleteInventory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteInventory,

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