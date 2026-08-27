import { useQuery } from "@tanstack/react-query";
import { getProfitReport } from "../api/reportsApi";


export const useProfitReport = (params) => {

    return useQuery({
        queryKey: ["profit-report", params],

        queryFn: () =>
            getProfitReport(params),

        keepPreviousData: true,
    });
};