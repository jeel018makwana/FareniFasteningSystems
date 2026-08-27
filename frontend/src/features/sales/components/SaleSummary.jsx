import { Card, CardContent } from "@/components/ui/card";

export default function SaleSummary({
  subtotal,
  gstAmount,
  discount,
  grandTotal,
}) {
  const formatCurrency = (value) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(value || 0);

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="ml-auto max-w-sm space-y-3">

          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>

          <div className="flex justify-between">
            <span>GST</span>
            <span>{formatCurrency(gstAmount)}</span>
          </div>

          <div className="flex justify-between">
            <span>Discount</span>
            <span>- {formatCurrency(discount)}</span>
          </div>

          <div className="border-t pt-3 flex justify-between text-lg font-bold">
            <span>Grand Total</span>
            <span>{formatCurrency(grandTotal)}</span>
          </div>

        </div>
      </CardContent>
    </Card>
  );
}