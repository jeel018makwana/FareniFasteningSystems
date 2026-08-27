import { useQuery } from "@tanstack/react-query";
import { getSalesReport } from "../api/reportsApi";


export const useSalesReport = (params) => {

    return useQuery({
        queryKey: ["sales-report", params],

        queryFn: () =>
            getSalesReport(params),

        keepPreviousData: true,
    });
};