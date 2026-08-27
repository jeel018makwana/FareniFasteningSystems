import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import SaleForm from "../forms/SaleForm";

export default function SaleDialog({
  open,
  onOpenChange,
  sale,
}) {
  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="sm:max-w-6xl max-h-[90vh] overflow-y-auto">

        <DialogHeader>
          <DialogTitle>
            {sale
              ? "Edit Sale"
              : "Create Sale"}
          </DialogTitle>
        </DialogHeader>

        <SaleForm
          sale={sale}
          onSuccess={() => onOpenChange(false)}
        />

      </DialogContent>
    </Dialog>
  );
}