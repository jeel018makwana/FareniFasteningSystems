import { useQuery } from "@tanstack/react-query";

import { getProductLengths } from "../api/productApi";

export const useProductLengths = (productSizeId) => {
  return useQuery({
    queryKey: ["product-lengths", productSizeId],
    queryFn: () => getProductLengths(productSizeId),
    enabled: !!productSizeId,
  });
};