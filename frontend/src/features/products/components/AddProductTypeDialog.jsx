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

import { useCreateProductType } from "../hooks/useCreateProductType";

export default function AddProductTypeDialog({
  open,
  onOpenChange,
  categoryId,
}) {
  const [name, setName] = useState("");

  const createMutation = useCreateProductType();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!categoryId) {
      toast.error("Please select a category first.");
      return;
    }

    if (!name.trim()) {
      toast.error("Product type name is required.");
      return;
    }

    try {
      await createMutation.mutateAsync({
        category: Number(categoryId),
        name: name.trim(),
      });

      toast.success("Product type added successfully!");

      setName("");
      onOpenChange(false);
    } catch (error) {
      console.error(error);

      const errors = error?.response?.data;

      toast.error(
        errors?.name?.[0] ||
        errors?.detail ||
        "Failed to add product type."
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
            Add Product Type
          </DialogTitle>

          <DialogDescription>
            Add a new product type under the selected category.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >

          <div>
            <label className="mb-2 block text-sm font-medium">
              Product Type
            </label>

            <Input
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
              placeholder="e.g. HT Hex Bolt"
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
                : "Save Type"}
            </Button>

          </div>

        </form>

      </DialogContent>
    </Dialog>
  );
}