

import { useQuery } from "@tanstack/react-query";

import { getProductTypes } from "../api/productApi";

export const useProductTypes = (categoryId) => {
  return useQuery({
    queryKey: ["product-types", categoryId],
    queryFn: () => getProductTypes(categoryId),
    enabled: !!categoryId,
  });
};