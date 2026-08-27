import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Badge } from "@/components/ui/badge";

export default function InventoryViewDialog({
  open,
  onOpenChange,
  inventory,
}) {
  if (!inventory) return null;

  const stock = Number(
    inventory.current_stock || 0
  );

  const minimumStock = Number(
    inventory.minimum_stock || 0
  );

  const isOutOfStock = stock <= 0;
  const isLowStock =
    stock > 0 && stock <= minimumStock;

  const isStockOut =
    inventory.transaction_type === "STOCK_OUT" ||
    inventory.transaction_type === "SALE";

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            Inventory Transaction Details
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 gap-5 py-4 md:grid-cols-2">

          {/* Product */}
          <div>
            <p className="text-sm text-muted-foreground">
              Product
            </p>

            <p className="font-medium">
              {inventory.product_name || "—"}
            </p>

            {inventory.product_code && (
              <p className="text-xs text-muted-foreground">
                {inventory.product_code}
              </p>
            )}
          </div>

          {/* Transaction Type */}
          <div>
            <p className="text-sm text-muted-foreground">
              Transaction Type
            </p>

            <Badge>
              {inventory.transaction_type
                ?.replace("_", " ")}
            </Badge>
          </div>

          {/* Quantity */}
          <div>
            <p className="text-sm text-muted-foreground">
              Quantity
            </p>

            <p
              className={`font-semibold ${
                isStockOut
                  ? "text-red-600"
                  : "text-emerald-600"
              }`}
            >
              {isStockOut ? "-" : "+"}
              {inventory.quantity}
            </p>
          </div>

          {/* Current Stock */}
          <div>
            <p className="text-sm text-muted-foreground">
              Current Stock
            </p>

            <p className="font-semibold">
              {stock}
            </p>
          </div>

          {/* Minimum Stock */}
          <div>
            <p className="text-sm text-muted-foreground">
              Minimum Stock
            </p>

            <p className="font-medium">
              {minimumStock}
            </p>
          </div>

          {/* Stock Status */}
          <div>
            <p className="text-sm text-muted-foreground">
              Stock Status
            </p>

            {isOutOfStock ? (
              <Badge variant="destructive">
                Out of Stock
              </Badge>
            ) : isLowStock ? (
              <Badge className="bg-orange-500">
                Low Stock
              </Badge>
            ) : (
              <Badge className="bg-emerald-600">
                In Stock
              </Badge>
            )}
          </div>

          {/* Reference */}
          <div>
            <p className="text-sm text-muted-foreground">
              Reference
            </p>

            <p className="font-medium">
              {inventory.reference || "—"}
            </p>
          </div>

          {/* Created At */}
          <div>
            <p className="text-sm text-muted-foreground">
              Created At
            </p>

            <p className="font-medium">
              {inventory.created_at
                ? new Date(
                    inventory.created_at
                  ).toLocaleString("en-IN")
                : "—"}
            </p>
          </div>

          {/* Remarks */}
          <div className="md:col-span-2">
            <p className="text-sm text-muted-foreground">
              Remarks
            </p>

            <p className="font-medium">
              {inventory.remarks || "—"}
            </p>
          </div>

        </div>
      </DialogContent>
    </Dialog>
  );
}