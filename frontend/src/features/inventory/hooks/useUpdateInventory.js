import { useMutation, useQueryClient } from "@tanstack/react-query";

import { updateInventory } from "../api/inventoryApi";

export const useUpdateInventory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateInventory,

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