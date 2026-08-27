import {
  AlertTriangle,
  Package,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function LowStock({
  products = [],
}) {
  return (
    <Card className="h-full overflow-hidden border shadow-sm">

      <CardHeader className="pb-3">

        <div className="flex items-start justify-between">

          <div>
            <CardTitle className="text-xl">
              Low Stock
            </CardTitle>

            <p className="mt-1 text-sm text-muted-foreground">
              Products that need attention
            </p>
          </div>

          <div className="rounded-xl bg-[#F45A00]/10 p-2.5">
            <AlertTriangle className="h-5 w-5 text-[#F45A00]" />
          </div>

        </div>

      </CardHeader>


      <CardContent>

        {products.length === 0 ? (
          <div
            className="
              flex
              min-h-[250px]
              flex-col
              items-center
              justify-center
              rounded-xl
              border
              border-dashed
              px-4
              text-center
            "
          >

            <div className="rounded-full bg-green-500/10 p-3">
              <Package className="h-6 w-6 text-green-600" />
            </div>

            <p className="mt-3 font-medium">
              Stock levels are healthy
            </p>

            <p className="mt-1 text-sm text-muted-foreground">
              No products are currently below minimum stock.
            </p>

          </div>
        ) : (

          <div className="space-y-3">

            {products.map((item) => {

              const currentStock = Number(
                item.current_stock || 0
              );

              const minimumStock = Number(
                item.minimum_stock || 0
              );

              const isCritical =
                currentStock <= minimumStock / 2;

              return (
                <div
                  key={item.product_code}
                  className="
                    rounded-xl
                    border
                    p-4
                    transition-all
                    duration-200
                    hover:border-[#F45A00]/30
                    hover:shadow-sm
                  "
                >

                  <div className="flex items-start justify-between gap-3">

                    <div className="min-w-0">

                      <p className="truncate font-semibold">
                        {item.name}
                      </p>

                      <p className="mt-1 text-xs text-muted-foreground">
                        {item.product_code}
                      </p>

                    </div>

                    <span
                      className={`
                        shrink-0
                        rounded-full
                        px-2.5
                        py-1
                        text-xs
                        font-semibold
                        ${
                          isCritical
                            ? "bg-red-500/10 text-red-600 dark:text-red-400"
                            : "bg-[#F45A00]/10 text-[#F45A00]"
                        }
                      `}
                    >
                      {isCritical ? "Critical" : "Low"}
                    </span>

                  </div>


                  <div className="mt-4">

                    <div className="mb-2 flex items-center justify-between text-sm">

                      <span className="text-muted-foreground">
                        Current Stock
                      </span>

                      <span className="font-semibold">
                        {currentStock}
                      </span>

                    </div>


                    <div className="h-2 overflow-hidden rounded-full bg-muted">

                      <div
                        className={`
                          h-full
                          rounded-full
                          transition-all
                          ${
                            isCritical
                              ? "bg-red-500"
                              : "bg-[#F45A00]"
                          }
                        `}
                        style={{
                          width: `${Math.min(
                            (currentStock /
                              Math.max(
                                minimumStock,
                                1
                              )) *
                              100,
                            100
                          )}%`,
                        }}
                      />

                    </div>


                    <div className="mt-2 flex justify-between text-xs text-muted-foreground">

                      <span>
                        Minimum: {minimumStock}
                      </span>

                      <span>
                        {currentStock < minimumStock
                          ? `${minimumStock - currentStock} short`
                          : "At minimum"}
                      </span>

                    </div>

                  </div>

                </div>
              );
            })}

          </div>

        )}

      </CardContent>

    </Card>
  );
}