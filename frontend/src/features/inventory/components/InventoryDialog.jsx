import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import InventoryForm from "./InventoryForm";

export default function InventoryDialog({
  open,
  onOpenChange,
  inventory,
}) {
  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent
        className="
          max-h-[90vh]
          overflow-y-auto
          sm:max-w-2xl
        "
      >
        <DialogHeader>
          <DialogTitle>
            {inventory
              ? "Edit Inventory Transaction"
              : "Add Inventory Transaction"}
          </DialogTitle>
        </DialogHeader>

        <InventoryForm
          inventory={inventory}
          onSuccess={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}