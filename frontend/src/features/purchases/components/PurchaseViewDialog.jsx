import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Separator } from "@/components/ui/separator";

export default function PurchaseViewDialog({
  open,
  purchase,
  onOpenChange,
}) {
  if (!purchase) return null;

  const formatCurrency = (value) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(Number(value || 0));

  const items = purchase.items || [];

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">

        {/* =====================================================
            HEADER
        ===================================================== */}

        <DialogHeader>
          <DialogTitle className="text-2xl">
            Purchase Details
          </DialogTitle>
        </DialogHeader>

        {/* =====================================================
            PURCHASE INFORMATION
        ===================================================== */}

        <div className="rounded-lg border p-4">

          <h3 className="mb-4 text-lg font-semibold">
            Purchase Information
          </h3>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">

            <div>
              <p className="text-sm text-muted-foreground">
                Purchase No.
              </p>

              <p className="font-semibold">
                {purchase.purchase_number || "-"}
              </p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">
                Supplier Invoice No.
              </p>

              <p className="font-semibold">
                {purchase.invoice_number || "-"}
              </p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">
                Purchase Date
              </p>

              <p className="font-semibold">
                {purchase.purchase_date || "-"}
              </p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">
                Supplier
              </p>

              <p className="font-semibold">
                {purchase.supplier_name || "-"}
              </p>
            </div>

          </div>
        </div>

        {/* =====================================================
            PRODUCTS
        ===================================================== */}

        <div className="space-y-3">

          <h3 className="text-lg font-semibold">
            Purchased Products
          </h3>

          <div className="overflow-x-auto rounded-lg border">

            <table className="w-full min-w-[1200px] text-sm">

              <thead className="bg-muted/50">

                <tr className="border-b">

                  <th className="px-4 py-3 text-left">
                    #
                  </th>

                  <th className="px-4 py-3 text-left">
                    Product
                  </th>

                  <th className="px-4 py-3 text-left">
                    Category
                  </th>

                  <th className="px-4 py-3 text-left">
                    Type
                  </th>

                  <th className="px-4 py-3 text-left">
                    Size
                  </th>

                  <th className="px-4 py-3 text-left">
                    Length
                  </th>

                  <th className="px-4 py-3 text-left">
                    Grade
                  </th>

                  <th className="px-4 py-3 text-left">
                    Brand
                  </th>

                  <th className="px-4 py-3 text-right">
                    Qty
                  </th>

                  <th className="px-4 py-3 text-right">
                    Price
                  </th>

                  <th className="px-4 py-3 text-right">
                    GST
                  </th>

                  <th className="px-4 py-3 text-right">
                    Total
                  </th>

                </tr>

              </thead>

              <tbody>

                {items.length === 0 ? (

                  <tr>
                    <td
                      colSpan={12}
                      className="px-4 py-8 text-center text-muted-foreground"
                    >
                      No products found.
                    </td>
                  </tr>

                ) : (

                  items.map((item, index) => {

                    const quantity =
                      Number(item.quantity || 0);

                    const price =
                      Number(item.purchase_price || 0);

                    const total =
                      quantity * price;

                    return (
                      <tr
                        key={item.id || index}
                        className="border-b last:border-b-0"
                      >

                        {/* Number */}

                        <td className="px-4 py-3">
                          {index + 1}
                        </td>

                        {/* Product */}

                        <td className="px-4 py-3">
                          <div className="font-medium">
                            {item.product_name || "-"}
                          </div>

                          {item.product_code && (
                            <div className="text-xs text-muted-foreground">
                              Code: {item.product_code}
                            </div>
                          )}
                        </td>

                        {/* Category */}

                        <td className="px-4 py-3">
                          {item.category_name || "-"}
                        </td>

                        {/* Type */}

                        <td className="px-4 py-3">
                          {item.product_type_name || "-"}
                        </td>

                        {/* Size */}

                        <td className="px-4 py-3">
                          {item.product_size_name || "-"}
                        </td>

                        {/* Length */}

                        <td className="px-4 py-3">
                          {item.product_length_name || "-"}
                        </td>

                        <td className="px-4 py-3">
                          {item.grade || "-"}
                        </td>

                        {/* Brand */}

                        <td className="px-4 py-3">
                          {item.brand_name || "-"}
                        </td>

                        {/* Quantity */}

                        <td className="px-4 py-3 text-right">
                          {quantity}
                        </td>

                        {/* Purchase Price */}

                        <td className="px-4 py-3 text-right">
                          {formatCurrency(price)}
                        </td>

                        {/* GST */}

                        <td className="px-4 py-3 text-right">
                          {Number(item.gst || 0)}%
                        </td>

                        {/* Total */}

                        <td className="px-4 py-3 text-right font-medium">
                          {formatCurrency(total)}
                        </td>

                      </tr>
                    );
                  })
                )}

              </tbody>

            </table>

          </div>
        </div>

        <Separator />

        {/* =====================================================
            TOTALS
        ===================================================== */}

        <div className="flex justify-end">

          <div className="w-full max-w-sm space-y-3">

            <div className="flex justify-between">
              <span className="text-muted-foreground">
                Subtotal
              </span>

              <span>
                {formatCurrency(
                  purchase.subtotal
                )}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-muted-foreground">
                GST
              </span>

              <span>
                {formatCurrency(
                  purchase.gst_amount
                )}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-muted-foreground">
                Discount
              </span>

              <span>
                {formatCurrency(
                  purchase.discount
                )}
              </span>
            </div>

            <Separator />

            <div className="flex justify-between text-lg font-bold">

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
        </div>

        {/* =====================================================
            REMARKS
        ===================================================== */}

        {purchase.remarks && (

          <>
            <Separator />

            <div>

              <h3 className="mb-2 font-semibold">
                Remarks
              </h3>

              <div className="rounded-lg border bg-muted/30 p-3 text-sm">
                {purchase.remarks}
              </div>

            </div>

          </>
        )}

      </DialogContent>
    </Dialog>
  );
}