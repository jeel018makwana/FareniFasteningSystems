import {
  AreaChart,
  Area,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const ORANGE = "#F45A00";

const formatCurrency = (value) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));
};

export default function RevenueChart({ data = [] }) {
  const chartData = data.map((item) => ({
    month: new Date(item.month).toLocaleString("en-US", {
      month: "short",
    }),
    revenue: Number(item.revenue || 0),
  }));

  return (
    <Card className="h-full overflow-hidden border shadow-sm">

      <CardHeader className="pb-2">
        <CardTitle className="text-xl">
          Revenue Overview
        </CardTitle>

        <p className="text-sm text-muted-foreground">
          Monthly sales performance
        </p>
      </CardHeader>

      <CardContent>
        <div className="h-[330px] w-full">

          {chartData.length === 0 ? (
            <div className="flex h-full items-center justify-center">
              <p className="text-sm text-muted-foreground">
                No revenue data available.
              </p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={chartData}
                margin={{
                  top: 10,
                  right: 10,
                  left: 5,
                  bottom: 5,
                }}
              >

                <defs>
                  <linearGradient
                    id="fareniRevenueGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="0%"
                      stopColor={ORANGE}
                      stopOpacity={0.30}
                    />

                    <stop
                      offset="100%"
                      stopColor={ORANGE}
                      stopOpacity={0.02}
                    />
                  </linearGradient>
                </defs>

                <CartesianGrid
                  strokeDasharray="3 3"
                  className="stroke-muted"
                  vertical={false}
                />

                <XAxis
                  dataKey="month"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 12 }}
                  dy={10}
                />

                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) =>
                    `₹${Number(value).toLocaleString("en-IN")}`
                  }
                  width={75}
                />

                <Tooltip
                  cursor={{
                    stroke: ORANGE,
                    strokeWidth: 1,
                    strokeDasharray: "4 4",
                  }}
                  formatter={(value) => [
                    formatCurrency(value),
                    "Revenue",
                  ]}
                  contentStyle={{
                    borderRadius: "10px",
                    border: "1px solid #e5e7eb",
                    boxShadow:
                      "0 8px 25px rgba(0,0,0,0.10)",
                  }}
                />

                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke={ORANGE}
                  strokeWidth={3}
                  fill="url(#fareniRevenueGradient)"
                  dot={{
                    r: 4,
                    fill: ORANGE,
                    strokeWidth: 2,
                  }}
                  activeDot={{
                    r: 6,
                    fill: ORANGE,
                  }}
                />

              </AreaChart>
            </ResponsiveContainer>
          )}

        </div>
      </CardContent>

    </Card>
  );
}