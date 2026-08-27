import { useState } from "react";
import toast from "react-hot-toast";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { useCreateProductSize } from "../hooks/useCreateProductSize";

export default function AddProductSizeDialog({
  open,
  onOpenChange,
  productTypeId,
}) {
  const [name, setName] = useState("");

  const createMutation = useCreateProductSize();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!productTypeId) {
      toast.error("Please select a product type first.");
      return;
    }

    if (!name.trim()) {
      toast.error("Product size is required.");
      return;
    }

    try {
      await createMutation.mutateAsync({
        product_type: Number(productTypeId),
        name: name.trim(),
      });

      toast.success("Product size added successfully!");

      setName("");
      onOpenChange(false);
    } catch (error) {
      console.error(error);

      const errors = error?.response?.data;

      toast.error(
        errors?.name?.[0] ||
          errors?.detail ||
          "Failed to add product size."
      );
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="sm:max-w-md">

        <DialogHeader>
          <DialogTitle>
            Add Product Size
          </DialogTitle>

          <DialogDescription>
            Add a new size under the selected product type.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >

          <div>
            <label className="mb-2 block text-sm font-medium">
              Product Size
            </label>

            <Input
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
              placeholder="e.g. M6"
              autoFocus
            />
          </div>

          <div className="flex justify-end gap-3">

            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={createMutation.isPending}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={createMutation.isPending}
              className="bg-[#F45A00] text-white hover:bg-[#D94F00]"
            >
              {createMutation.isPending
                ? "Saving..."
                : "Save Size"}
            </Button>

          </div>

        </form>

      </DialogContent>
    </Dialog>
  );
}