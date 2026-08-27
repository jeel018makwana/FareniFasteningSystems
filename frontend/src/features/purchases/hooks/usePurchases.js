import { useQuery } from "@tanstack/react-query";
import { getPurchases } from "../api/purchaseApi";

export const usePurchases = (params) => {
  return useQuery({
    queryKey: ["purchases", params],
    queryFn: () => getPurchases(params),
    keepPreviousData: true,
  });
};