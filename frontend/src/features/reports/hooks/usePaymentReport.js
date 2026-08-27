import { useQuery } from "@tanstack/react-query";
import { getPaymentReport } from "../api/reportsApi";


export const usePaymentReport = (params) => {

    return useQuery({
        queryKey: ["payment-report", params],

        queryFn: () =>
            getPaymentReport(params),

        keepPreviousData: true,
    });
};