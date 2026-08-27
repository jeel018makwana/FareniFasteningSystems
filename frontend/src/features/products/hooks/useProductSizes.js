import { useQuery } from "@tanstack/react-query";

import { getProductSizes } from "../api/productApi";

export const useProductSizes = (productTypeId) => {
  return useQuery({
    queryKey: ["product-sizes", productTypeId],
    queryFn: () => getProductSizes(productTypeId),
    enabled: !!productTypeId,
  });
};