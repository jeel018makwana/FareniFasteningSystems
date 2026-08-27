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

import { useCreateProductLength } from "../hooks/useCreateProductLength";

export default function AddProductLengthDialog({
  open,
  onOpenChange,
  productSizeId,
}) {
  const [name, setName] = useState("");

  const createMutation = useCreateProductLength();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!productSizeId) {
      toast.error("Please select a product size first.");
      return;
    }

    if (!name.trim()) {
      toast.error("Product length is required.");
      return;
    }

    try {
      await createMutation.mutateAsync({
        product_size: Number(productSizeId),
        name: name.trim(),
      });

      toast.success("Product length added successfully!");

      setName("");
      onOpenChange(false);
    } catch (error) {
      console.error(error);

      const errors = error?.response?.data;

      toast.error(
        errors?.name?.[0] ||
          errors?.detail ||
          "Failed to add product length."
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
            Add Product Length
          </DialogTitle>

          <DialogDescription>
            Add a new length under the selected product size.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >

          <div>
            <label className="mb-2 block text-sm font-medium">
              Product Length
            </label>

            <Input
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
              placeholder="e.g. 25mm"
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
                : "Save Length"}
            </Button>

          </div>

        </form>

      </DialogContent>
    </Dialog>
  );
}