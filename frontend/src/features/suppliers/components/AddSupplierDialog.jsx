import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

import SupplierForm from "./SupplierForm";

export default function AddSupplierDialog({
  open,
  onOpenChange,
  onSuccess,
}) {
  const handleSuccess = (supplier) => {
    onOpenChange(false);

    onSuccess?.(supplier);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="sm:max-w-2xl">

        <DialogHeader>
          <DialogTitle>
            Add Supplier
          </DialogTitle>

          <DialogDescription>
            Add a new supplier for your purchases.
          </DialogDescription>
        </DialogHeader>

        <SupplierForm
          onSuccess={handleSuccess}
        />

      </DialogContent>
    </Dialog>
  );
}