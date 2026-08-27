import DashboardLayout from "@/layouts/DashboardLayout";

import RevenueChart from "../components/charts/RevenueChart";
import SalesOverview from "../components/charts/SalesOverview";

import StatCard from "@/components/common/StatCard";
import LowStock from "@/components/common/LowStock";
import RecentSales from "@/components/tables/RecentSales";

import {
  IndianRupee,
  Package,
  Users,
  AlertTriangle,
} from "lucide-react";

import { useDashboard } from "@/features/dashboard/hooks/useDashboard";

export default function Dashboard() {
  const {
    data,
    isLoading,
    error,
  } = useDashboard();

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="text-center">
            <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-4 border-[#F45A00]/20 border-t-[#F45A00]" />

            <p className="text-sm text-muted-foreground">
              Loading dashboard...
            </p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="rounded-xl border border-red-200 bg-red-50 px-6 py-5 text-center dark:border-red-900/50 dark:bg-red-950/20">
            <p className="font-semibold text-red-600 dark:text-red-400">
              Failed to load dashboard
            </p>

            <p className="mt-1 text-sm text-muted-foreground">
              Please refresh the page and try again.
            </p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const totalSales = Number(data?.total_sales || 0);
  const totalProducts = Number(data?.total_products || 0);
  const totalCustomers = Number(data?.total_customers || 0);
  const lowStockCount = data?.low_stock_items?.length || 0;

  return (
    <DashboardLayout>
      <div className="space-y-7">

        {/* ================= HEADER ================= */}

        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              FARENI FASTENING SYSTEMS
            </h1>

            <p className="mt-2 text-sm text-muted-foreground sm:text-base">
              Here's what's happening in your business today.
            </p>
          </div>

          <div className="w-fit rounded-lg border bg-background px-5 py-3 shadow-sm">
            <p className="text-sm font-semibold">
              Fareni Fastening Systems
            </p>

            <p className="mt-0.5 text-xs text-muted-foreground">
              Business Management
            </p>
          </div>
        </div>


        {/* ================= STAT CARDS ================= */}

        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">

          <StatCard
            title="Total Sales"
            value={totalSales}
            icon={IndianRupee}
            change="All-time sales"
          />

          <StatCard
            title="Products"
            value={totalProducts}
            icon={Package}
            change="Products in catalog"
          />

          <StatCard
            title="Customers"
            value={totalCustomers}
            icon={Users}
            change="Active customers"
          />

          <StatCard
            title="Low Stock"
            value={lowStockCount}
            icon={AlertTriangle}
            change={
              lowStockCount > 0
                ? "Needs attention"
                : "Stock levels healthy"
            }
            warning={lowStockCount > 0}
          />

        </div>


        {/* ================= CHARTS ================= */}

        <div className="grid gap-5 xl:grid-cols-3">

          <div className="xl:col-span-2">
            <RevenueChart
              data={data?.monthly_sales || []}
            />
          </div>

          <div>
            <SalesOverview
              sales={data?.total_sales || 0}
              purchases={data?.total_purchases || 0}
              payments={data?.customer_payments || 0}
            />
          </div>

        </div>


        {/* ================= RECENT + LOW STOCK ================= */}

        <div className="grid gap-5 xl:grid-cols-3">

          <div className="xl:col-span-2">
            <RecentSales
              sales={data?.recent_sales || []}
            />
          </div>

          <div>
            <LowStock
              products={data?.low_stock_items || []}
            />
          </div>

        </div>

      </div>
    </DashboardLayout>
  );
}