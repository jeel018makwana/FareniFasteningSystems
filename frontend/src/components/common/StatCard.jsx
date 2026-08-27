import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";

export default function StatCard({
  title,
  value,
  icon: Icon,
  change,
  warning = false,
}) {
  const isCurrency = title === "Total Sales";

  const formattedValue = isCurrency
    ? new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
      }).format(Number(value || 0))
    : Number(value || 0).toLocaleString("en-IN");

  return (
    <Card className="group overflow-hidden border shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">

      <CardContent className="flex items-start justify-between p-6">

        <div className="min-w-0">

          <p className="text-sm font-medium text-muted-foreground">
            {title}
          </p>

          <h2 className="mt-3 text-3xl font-bold tracking-tight">
            {formattedValue}
          </h2>

          <div
            className={`mt-3 flex items-center gap-1.5 text-sm font-medium ${
              warning
                ? "text-[#F45A00]"
                : "text-[#F45A00]"
            }`}
          >
            <TrendingUp className="h-4 w-4" />

            <span>{change}</span>
          </div>

        </div>


        <div
          className="
            flex h-14 w-14 shrink-0 items-center justify-center
            rounded-2xl
            bg-[#F45A00]/10
            transition-colors
            group-hover:bg-[#F45A00]/15
          "
        >
          <Icon className="h-7 w-7 text-[#F45A00]" />
        </div>

      </CardContent>

    </Card>
  );
}