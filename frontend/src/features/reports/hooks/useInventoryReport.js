import { useQuery } from "@tanstack/react-query";
import { getInventoryReport } from "../api/reportsApi";


export const useInventoryReport = () => {

    return useQuery({
        queryKey: ["inventory-report"],

        queryFn: getInventoryReport,

        keepPreviousData: true,
    });
};