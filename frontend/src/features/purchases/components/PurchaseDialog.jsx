import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import PurchaseForm from "../forms/PurchaseForm";

export default function PurchaseDialog({
  open,
  onOpenChange,
  purchase,
}) {
  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="sm:max-w-6xl max-h-[90vh] overflow-y-auto">

        <DialogHeader>
          <DialogTitle>
            {purchase
              ? "Edit Purchase"
              : "Create Purchase"}
          </DialogTitle>
        </DialogHeader>

        <PurchaseForm
          purchase={purchase}
          onSuccess={() => onOpenChange(false)}
        />

      </DialogContent>
    </Dialog>
  );
}