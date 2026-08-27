import { useState, useMemo } from "react";

import DashboardLayout from "@/layouts/DashboardLayout";

import DataTable from "@/components/tables/DataTable";

import ReportToolbar from "../components/ReportToolbar";
import ReportSummaryCards from "../components/ReportSummaryCards";

import { salesReportColumns } from "../components/SalesReportColumns";
import { purchaseReportColumns } from "../components/PurchaseReportColumns";
import { inventoryReportColumns } from "../components/InventoryReportColumns";
import { paymentReportColumns } from "../components/PaymentReportColumns";
import { profitReportColumns } from "../components/ProfitReportColumns";
import ReportSelector from "../components/ReportSelector";
import { useSalesReport } from "../hooks/useSalesReport";
import { usePurchaseReport } from "../hooks/usePurchaseReport";
import { useInventoryReport } from "../hooks/useInventoryReport";
import { usePaymentReport } from "../hooks/usePaymentReport";
import { useProfitReport } from "../hooks/useProfitReport";
import { useLowStockReport } from "../hooks/useLowStockReport";

import { lowStockReportColumns }
from "../components/LowStockReportColumns";


export default function ReportsPage() {
    const [selectedReport, setSelectedReport] =
        useState("sales");

    const [search, setSearch] = useState("");

    const [startDate, setStartDate] = useState("");

    const [endDate, setEndDate] = useState("");


    const params = {
        start_date: startDate || undefined,
        end_date: endDate || undefined,
    };


    const salesReport =
    useSalesReport(params);


    const purchaseReport =
        usePurchaseReport(params);


    const inventoryReport =
        useInventoryReport();


    const paymentReport =
        usePaymentReport(params);


    const profitReport =
        useProfitReport(params);
    
    const lowStockReport =
        useLowStockReport();


    let reportData;
    let loading;
    let refresh;    

    switch(selectedReport){
        case "purchase":
            reportData=purchaseReport.data;
            loading = purchaseReport.isLoading;
            refresh = purchaseReport.refetch;

            break;
        case "inventory":
            reportData = inventoryReport.data;
            loading = inventoryReport.isLoading;
            refresh = inventoryReport.refetch;

            break;
        case "payment":
            reportData=paymentReport.data;
            loading = paymentReport.isLoading;
            refresh = paymentReport.refetch;
            break;
        case "profit":
            reportData = profitReport.data;
            loading = profitReport.isLoading;
            refresh = profitReport.refetch;
            break;
        case "low-stock":
            reportData = lowStockReport.data;
            loading = lowStockReport.isLoading;
            refresh = lowStockReport.refetch;

            break;
        default:
            reportData = salesReport.data;
            loading= salesReport.isLoading;
            refresh = salesReport.refetch;
    }

    const tableData = useMemo(() => {

        if(selectedReport === "inventory" || selectedReport === "low-stock"){
            return reportData || [];
        }

        return reportData?.results || [];

    }, [reportData, selectedReport]);



    const handleReset = () => {

        setSearch("");

        setStartDate("");

        setEndDate("");

    };
    const reportConfig = {
        sales: {
            columns: salesReportColumns,
            cards: [
                {
                    title: "Total Sales",
                    value:
                        `₹ ${reportData?.total_sales || 0}`,
                },
                {
                    title: "Invoices",
                    value:
                        reportData?.count || 0,
                },
            ],

        },

        purchase: {
            columns: purchaseReportColumns,
            cards: [
                {
                    title: "Total Purchase",
                    value:
                        `₹ ${reportData?.total_purchase || 0}`,
                },
                {
                    title: "Purchases",
                    value:
                        reportData?.count || 0,
                },
            ],

        },

        inventory: {
            columns: inventoryReportColumns,
            cards: [
                {
                    title: "Products",
                    value:
                        reportData?.length || 0,
                },
            ],

        },

        payment: {
            columns: paymentReportColumns,
            cards: [
                {
                    title: "Total Payment",
                    value:
                        `₹ ${reportData?.total_amount || 0}`,
                },
                {
                    title: "Payments",
                    value:
                        reportData?.count || 0,
                },
            ],

        },

        profit: {
            columns: profitReportColumns,
            cards: [
                {
                    title: "Total Sales",
                    value:
                        `₹ ${reportData?.total_sales || 0}`,
                },
                {
                    title: "Total Cost",
                    value:
                        `₹ ${reportData?.total_cost || 0}`,
                },
                {
                    title: "Gross Profit",
                    value:
                        `₹ ${reportData?.gross_profit || 0}`,
                },
            ],

        },

        "low-stock": {
            columns: lowStockReportColumns,
            cards: [
                {
                    title: "Low Stock Items",
                    value:
                        reportData?.length || 0,
                },
            ],
        },

    };



    if (loading) {

        return (

            <DashboardLayout>

                <div>
                    Loading...
                </div>

            </DashboardLayout>

        );

    }

    
    return (
        
        <DashboardLayout>


            <div className="space-y-6">


                <div>

                    <h1 className="text-3xl font-bold">
                        Reports
                    </h1>


                    <p className="text-muted-foreground">
                        Monitor your business performance
                    </p>


                </div>
            <ReportSelector
                value={selectedReport}
                onChange={setSelectedReport}
            />

                <ReportSummaryCards
                    cards={
                        reportConfig[selectedReport].cards
                    }
                />



                <ReportToolbar

                    search={search}

                    setSearch={setSearch}

                    startDate={startDate}

                    setStartDate={setStartDate}

                    endDate={endDate}

                    setEndDate={setEndDate}

                    onRefresh={refresh}

                    onReset={handleReset}

                />
                <DataTable
                    columns={
                        reportConfig[selectedReport].columns
                    }
                    data={tableData}
                    loading={loading}
                />

            </div>


        </DashboardLayout>

    );

}