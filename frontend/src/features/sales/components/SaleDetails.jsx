
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  Card,
  CardContent,
} from "@/components/ui/card";

import {
  formatCurrency,
  formatDate,
} from "@/utils/formatters";

export default function SaleDetails({ sale }) {
  if (!sale) return null;

  return (
    <div className="space-y-6">

      {/* ====================================================
          INVOICE INFO
      ==================================================== */}

      <Card>
        <CardContent className="pt-6">

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            {/* Invoice */}

            <div>
              <p className="font-semibold text-lg">
                {sale.sale_number}
              </p>
            </div>

            {/* Customer */}

            <div>
              <p className="text-sm text-muted-foreground">
                Customer
              </p>

              <p className="font-semibold">
                {sale.customer_name}
              </p>
            </div>

            {/* Sale Date */}

            <div>
              <p className="text-sm text-muted-foreground">
                Sale Date
              </p>

              <p className="font-semibold">
                {formatDate(sale.sale_date)}
              </p>
            </div>

          </div>

        </CardContent>
      </Card>

      {/* ====================================================
          PRODUCTS
      ==================================================== */}

      <Card>
        <CardContent className="pt-6">

          <h3 className="font-semibold text-lg mb-4">
            Products
          </h3>

          <div className="w-full overflow-x-auto">

            <Table className="min-w-[900px]">

              <TableHeader>
                <TableRow>

                  <TableHead>
                    Product
                  </TableHead>

                  <TableHead>
                    Length
                  </TableHead>

                  <TableHead>
                    Grade
                  </TableHead>

                  <TableHead className="text-right">
                    Qty
                  </TableHead>

                  <TableHead className="text-right">
                    Price
                  </TableHead>

                  <TableHead className="text-right">
                    GST %
                  </TableHead>

                  <TableHead className="text-right">
                    Total
                  </TableHead>

                </TableRow>
              </TableHeader>

              <TableBody>

                {sale.items?.map((item) => (

                  <TableRow key={item.id}>

                    {/* PRODUCT */}

                    <TableCell className="font-medium">
                      {item.product_name || "-"}
                    </TableCell>

                    {/* LENGTH */}

                    <TableCell>
                      {item.product_length ||
                        "-"}
                    </TableCell>

                    {/* GRADE */}

                    <TableCell>
                      {item.grade?.name ||
                        item.grade_name ||
                        item.product_grade ||
                        item.grade ||
                        "-"}
                    </TableCell>

                    {/* QUANTITY */}

                    <TableCell className="text-right">
                      {item.quantity}
                    </TableCell>

                    {/* PRICE */}

                    <TableCell className="text-right">
                      {formatCurrency(
                        item.selling_price
                      )}
                    </TableCell>

                    {/* GST */}

                    <TableCell className="text-right">
                      {item.gst}%
                    </TableCell>

                    {/* TOTAL */}

                    <TableCell className="text-right font-medium">
                      {formatCurrency(
                        item.line_total
                      )}
                    </TableCell>

                  </TableRow>

                ))}

              </TableBody>

            </Table>

          </div>

        </CardContent>
      </Card>

      {/* ====================================================
          SUMMARY
      ==================================================== */}

      <Card>
        <CardContent className="pt-6">

          <div className="ml-auto max-w-sm space-y-3">

            <div className="flex justify-between">
              <span>
                SubTotal
              </span>

              <span>
                {formatCurrency(
                  sale.subtotal
                )}
              </span>
            </div>

            <div className="flex justify-between">
              <span>
                GST
              </span>

              <span>
                {formatCurrency(
                  sale.gst_amount
                )}
              </span>
            </div>

            <div className="flex justify-between">
              <span>
                Discount
              </span>

              <span>
                {formatCurrency(
                  sale.discount
                )}
              </span>
            </div>

            <hr />

            <div className="flex justify-between text-xl font-bold">

              <span>
                Grand Total
              </span>

              <span>
                {formatCurrency(
                  sale.grand_total
                )}
              </span>

            </div>

          </div>

        </CardContent>
      </Card>

      {/* ====================================================
          REMARKS
      ==================================================== */}

      {sale.remarks && (
        <Card>
          <CardContent className="pt-6">

            <h3 className="font-semibold mb-2">
              Remarks
            </h3>

            <p className="text-muted-foreground">
              {sale.remarks}
            </p>

          </CardContent>
        </Card>
      )}

    </div>
  );
}
