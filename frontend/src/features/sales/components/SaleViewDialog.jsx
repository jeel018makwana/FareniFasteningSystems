
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import SaleDetails from "./SaleDetails";

export default function SaleViewDialog({
  open,
  onOpenChange,
  sale,
}) {
  if (!sale) return null;

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent
        className="
          w-[98vw]
          max-w-[1500px]
          max-h-[95vh]
          overflow-y-auto
          p-6
        "
      >
        <DialogHeader>
          <DialogTitle className="text-2xl">
            Sale Details
          </DialogTitle>
        </DialogHeader>

        <SaleDetails sale={sale} />

      </DialogContent>
    </Dialog>
  );
}
