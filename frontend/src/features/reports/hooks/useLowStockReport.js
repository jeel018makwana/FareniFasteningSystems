import { useQuery } from "@tanstack/react-query";
import { getLowStockReport } from "../api/reportsApi";

export const useLowStockReport = () => {
    return useQuery({
        queryKey: ["low-stock-report"],
        queryFn: getLowStockReport,
    });
};