import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import CustomerForm from "../forms/CustomerForm";

export default function CustomerDialog({
  open,
  onOpenChange,
  customer,
  onCreated,
}) {
  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>
            {customer ? "Edit Customer" : "Add Customer"}
          </DialogTitle>
        </DialogHeader>

        <CustomerForm
          customer={customer}
          onSuccess={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}