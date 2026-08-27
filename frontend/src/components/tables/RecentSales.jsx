import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const formatCurrency = (value) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));
};

const formatDate = (date) => {
  if (!date) return "-";

  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

export default function RecentSales({ sales = [] }) {
  return (
    <Card className="h-full overflow-hidden border shadow-sm">

      <CardHeader className="flex flex-row items-center justify-between pb-3">

        <div>
          <CardTitle className="text-xl">
            Recent Sales
          </CardTitle>

          <p className="mt-1 text-sm text-muted-foreground">
            Latest sales transactions
          </p>
        </div>

        {sales.length > 0 && (
          <span
            className="
              rounded-full
              bg-[#F45A00]/10
              px-3
              py-1.5
              text-xs
              font-semibold
              text-[#F45A00]
            "
          >
            {sales.length} Records
          </span>
        )}

      </CardHeader>


      <CardContent>

        {sales.length === 0 ? (
          <div
            className="
              flex
              min-h-[250px]
              items-center
              justify-center
              rounded-xl
              border
              border-dashed
            "
          >
            <div className="text-center">

              <p className="font-medium">
                No recent sales
              </p>

              <p className="mt-1 text-sm text-muted-foreground">
                Sales transactions will appear here.
              </p>

            </div>
          </div>
        ) : (

          <div className="space-y-3">

            {sales.map((sale) => (

              <div
                key={sale.sale_number}
                className="
                  group
                  flex
                  items-center
                  justify-between
                  gap-4
                  rounded-xl
                  border
                  bg-background
                  p-4
                  transition-all
                  duration-200
                  hover:border-[#F45A00]/30
                  hover:bg-[#F45A00]/[0.02]
                  hover:shadow-sm
                "
              >

                {/* LEFT SIDE */}

                <div className="min-w-0">

                  <p className="truncate font-semibold">
                    {sale.customer__name || "Walk-in Customer"}
                  </p>

                  <div className="mt-1.5 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">

                    <span>
                      {sale.sale_number}
                    </span>

                    <span>•</span>

                    <span>
                      {formatDate(sale.sale_date)}
                    </span>

                  </div>

                </div>


                {/* RIGHT SIDE */}

                <div className="shrink-0 text-right">

                  <p className="font-bold">
                    {formatCurrency(sale.grand_total)}
                  </p>

                  <span
                    className="
                      mt-1.5
                      inline-flex
                      items-center
                      rounded-full
                      bg-green-500/10
                      px-2.5
                      py-1
                      text-xs
                      font-medium
                      text-green-600
                      dark:text-green-400
                    "
                  >
                    Completed
                  </span>

                </div>

              </div>

            ))}

          </div>

        )}

      </CardContent>

    </Card>
  );
}