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

export default function PurchaseDetails({
  purchase,
}) {
  if (!purchase) return null;

  return (
    <div className="space-y-6">

      {/* Purchase Info */}

      <Card>
        <CardContent className="pt-6">

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

            <div>
              <p className="font-semibold text-lg">
                {purchase.purchase_number}
              </p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">
                Supplier
              </p>

              <p className="font-semibold">
                {purchase.supplier_name}
              </p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">
                Invoice No.
              </p>

              <p className="font-semibold">
                {purchase.invoice_number}
              </p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">
                Purchase Date
              </p>

              <p className="font-semibold">
                {formatDate(
                  purchase.purchase_date
                )}
              </p>
            </div>

          </div>

        </CardContent>
      </Card>

      {/* Products */}

      <Card>
        <CardContent className="pt-6">

          <h3 className="font-semibold text-lg mb-4">
            Products
          </h3>

          <Table>

            <TableHeader>

              <TableRow>

                <TableHead>
                  Product
                </TableHead>

                <TableHead className="text-right">
                  Qty
                </TableHead>

                <TableHead className="text-right">
                  Purchase Price
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

              {purchase.items.map((item) => (

                <TableRow key={item.id}>

                  <TableCell className="font-medium">
                    {item.product_name}
                  </TableCell>

                  <TableCell className="text-right">
                    {item.quantity}
                  </TableCell>

                  <TableCell className="text-right">
                    {formatCurrency(
                      item.purchase_price
                    )}
                  </TableCell>

                  <TableCell className="text-right">
                    {item.gst}%
                  </TableCell>

                  <TableCell className="text-right">
                    {formatCurrency(
                      item.line_total
                    )}
                  </TableCell>

                </TableRow>

              ))}

            </TableBody>

          </Table>

        </CardContent>
      </Card>

      {/* Summary */}

      <Card>

        <CardContent className="pt-6">

          <div className="ml-auto max-w-sm space-y-3">

            <div className="flex justify-between">
              <span>Subtotal</span>

              <span>
                {formatCurrency(
                  purchase.subtotal
                )}
              </span>
            </div>

            <div className="flex justify-between">
              <span>GST</span>

              <span>
                {formatCurrency(
                  purchase.gst_amount
                )}
              </span>
            </div>

            <div className="flex justify-between">
              <span>Discount</span>

              <span>
                {formatCurrency(
                  purchase.discount
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
                  purchase.grand_total
                )}
              </span>

            </div>

          </div>

        </CardContent>

      </Card>

      {/* Remarks */}

      {purchase.remarks && (

        <Card>

          <CardContent className="pt-6">

            <h3 className="font-semibold mb-2">
              Remarks
            </h3>

            <p className="text-muted-foreground">
              {purchase.remarks}
            </p>

          </CardContent>

        </Card>

      )}

    </div>
  );
}