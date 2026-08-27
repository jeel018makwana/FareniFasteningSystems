import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const COLORS = [
  "#F45A00", // FARENI Orange - Sales
  "#24292E", // Charcoal - Purchases
  "#9CA3AF", // Grey - Payments
];

const formatCurrency = (value) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));
};

export default function SalesOverview({
  sales = 0,
  purchases = 0,
  payments = 0,
}) {
  const data = [
    {
      name: "Sales",
      value: Number(sales || 0),
    },
    {
      name: "Purchases",
      value: Number(purchases || 0),
    },
    {
      name: "Payments",
      value: Number(payments || 0),
    },
  ];

  const total = data.reduce(
    (sum, item) => sum + item.value,
    0
  );

  return (
    <Card className="h-full overflow-hidden border shadow-sm">

      <CardHeader className="pb-2">
        <CardTitle className="text-xl">
          Business Overview
        </CardTitle>

        <p className="text-sm text-muted-foreground">
          Sales, purchases and payments
        </p>
      </CardHeader>

      <CardContent>

        <div className="relative h-[280px]">

          <ResponsiveContainer width="100%" height="100%">
            <PieChart>

              <Pie
                data={data}
                innerRadius={72}
                outerRadius={100}
                paddingAngle={3}
                dataKey="value"
                stroke="hsl(var(--background))"
                strokeWidth={2}
              >
                {data.map((entry, index) => (
                  <Cell
                    key={entry.name}
                    fill={COLORS[index]}
                  />
                ))}
              </Pie>

              <Tooltip
                formatter={(value) => [
                  formatCurrency(value),
                  "Amount",
                ]}
                contentStyle={{
                  borderRadius: "10px",
                  border: "1px solid #e5e7eb",
                  boxShadow:
                    "0 8px 25px rgba(0,0,0,0.10)",
                }}
              />

            </PieChart>
          </ResponsiveContainer>

          {/* Center of Donut */}
          <div
            className="
              pointer-events-none
              absolute
              inset-0
              flex
              flex-col
              items-center
              justify-center
            "
          >
            <span className="text-xs text-muted-foreground">
              Total
            </span>

            <span className="mt-1 text-xl font-bold">
              {formatCurrency(total)}
            </span>
          </div>

        </div>

        {/* Legend */}
        <div className="mt-3 space-y-4">

          {data.map((item, index) => (

            <div
              key={item.name}
              className="
                flex
                items-center
                justify-between
              "
            >

              <div className="flex items-center gap-3">

                <span
                  className="h-3 w-3 rounded-full"
                  style={{
                    backgroundColor: COLORS[index],
                  }}
                />

                <span className="text-sm font-medium">
                  {item.name}
                </span>

              </div>

              <span className="text-sm font-semibold">
                {formatCurrency(item.value)}
              </span>

            </div>

          ))}

        </div>

      </CardContent>

    </Card>
  );
}