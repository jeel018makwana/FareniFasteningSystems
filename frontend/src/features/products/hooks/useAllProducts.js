import { useQuery } from "@tanstack/react-query";

import { getAllProducts } from "../api/productApi";

export const useAllProducts = () => {
  return useQuery({
    queryKey: ["all-products"],
    queryFn: getAllProducts,
  });
};