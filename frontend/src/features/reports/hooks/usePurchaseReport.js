import { useQuery } from "@tanstack/react-query";
import { getPurchaseReport } from "../api/reportsApi";


export const usePurchaseReport = (params) => {

    return useQuery({
        queryKey: ["purchase-report", params],

        queryFn: () =>
            getPurchaseReport(params),

        keepPreviousData: true,
    });
};