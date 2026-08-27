import { useQuery } from "@tanstack/react-query";

import { getInventory } from "../api/inventoryApi";

export const useInventory = ({
  page = 1,
  search = "",
  transaction_type = "",
}) => {
  return useQuery({
    queryKey: [
      "inventory",
      page,
      search,
      transaction_type,
    ],

    queryFn: () =>
      getInventory({
        page,
        search,
        transaction_type,
      }),
  });
};