import { useQuery } from "@tanstack/react-query";
import { getSales } from "../api/salesApi";

export const useSales = (params) => {
  return useQuery({
    queryKey: ["sales", params],
    queryFn: () => getSales(params),
    keepPreviousData: true,
  });
};