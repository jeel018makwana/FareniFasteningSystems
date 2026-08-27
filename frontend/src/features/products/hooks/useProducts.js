import { useQuery } from "@tanstack/react-query";
import { getProducts } from "../api/productApi";

export const useProducts = ({
  page = 1,
  search = "",
}) => {
  return useQuery({
    queryKey: ["products", page, search],
    queryFn: () =>
      getProducts({
        page,
        search,
      }),
  });
};