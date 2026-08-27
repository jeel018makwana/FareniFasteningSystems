import { useQuery } from "@tanstack/react-query";
import { getCategories } from "../api/productApi";

export const useCategories = () => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });
};