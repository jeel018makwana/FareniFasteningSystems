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

import { useCreateBrand } from "../hooks/useCreateBrand";

export default function AddBrandDialog({
  open,
  onOpenChange,
}) {
  const [name, setName] = useState("");

  const createMutation = useCreateBrand();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const trimmedName = name.trim();

    if (!trimmedName) {
      toast.error("Please enter brand name");
      return;
    }

    try {
      await createMutation.mutateAsync({
        name: trimmedName,
      });

      toast.success("Brand added successfully");

      setName("");
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to create brand:", error);

      const backendErrors =
        error?.response?.data?.errors;

      if (backendErrors) {
        const firstError = Object.values(
          backendErrors
        )[0];

        toast.error(
          Array.isArray(firstError)
            ? firstError[0]
            : "Failed to add brand"
        );
      } else {
        toast.error(
          error?.response?.data?.message ||
            "Failed to add brand"
        );
      }
    }
  };

  const handleOpenChange = (value) => {
    if (!value) {
      setName("");
    }

    onOpenChange(value);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={handleOpenChange}
    >
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            Add Brand
          </DialogTitle>

          <DialogDescription>
            Add a new product brand.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >
          <div>
            <label className="mb-2 block text-sm font-medium">
              Brand Name
            </label>

            <Input
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
              placeholder="e.g. TVS"
              autoFocus
            />
          </div>

          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() =>
                handleOpenChange(false)
              }
              disabled={createMutation.isPending}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={
                createMutation.isPending
              }
              className="
                bg-[#F45A00]
                text-white
                hover:bg-[#D94F00]
              "
            >
              {createMutation.isPending
                ? "Adding..."
                : "Add Brand"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}