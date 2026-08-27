import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

import ProductForm from "../forms/ProductForm";

export default function ProductDialog({
  open,
  onOpenChange,
  product,
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="
          max-h-[90vh]
          w-[95vw]
          max-w-4xl
          overflow-y-auto
          p-0
        "
      >
        <DialogHeader
          className="
            sticky
            top-0
            z-10
            border-b
            bg-card
            px-6
            py-5
          "
        >
          <DialogTitle className="text-xl font-bold">
            {product ? "Edit Product" : "Add Product"}
          </DialogTitle>

          <DialogDescription>
            {product
              ? "Update the product details below."
              : "Enter the product details to add it to your inventory."}
          </DialogDescription>
        </DialogHeader>

        <div className="px-6 pb-6 pt-2">
          <ProductForm
            product={product}
            onSuccess={() => onOpenChange(false)}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}