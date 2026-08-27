import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { inventorySchema } from "../schema/inventorySchema";

import { useCreateInventory } from "../hooks/useCreateInventory";
import { useUpdateInventory } from "../hooks/useUpdateInventory";
import { useAllProducts } from "@/features/products/hooks/useAllProducts";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function InventoryForm({
  inventory,
  onSuccess,
}) {
  const { data: products = {} } = useAllProducts();

  const productList = products?.results || [];

  const createMutation = useCreateInventory();
  const updateMutation = useUpdateInventory();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(inventorySchema),

    defaultValues: {
      product: inventory?.product || "",
      transaction_type: inventory?.transaction_type || "STOCK_IN",
      quantity: inventory?.quantity || 1,
      reference: inventory?.reference || "",
      remarks: inventory?.remarks || "",
    },
  });

  useEffect(() => {
    if (inventory) {
      reset({
        product: inventory.product || "",
        transaction_type: inventory.transaction_type || "STOCK_IN",
        quantity: inventory.quantity || 1,
        reference: inventory.reference || "",
        remarks: inventory.remarks || "",
      });
    } else {
      reset({
        product: "",
        transaction_type: "STOCK_IN",
        quantity: 1,
        reference: "",
        remarks: "",
      });
    }
  }, [inventory, reset]);

  const transactionType = watch("transaction_type");
  const selectedProductId = watch("product");

  const selectedProduct = productList.find(
    (product) =>
      Number(product.id) === Number(selectedProductId)
  );

  const currentStock = Number(
    selectedProduct?.current_stock || 0
  );
  const onSubmit = async (data) => {
    try {
      if (inventory) {
        await updateMutation.mutateAsync({
          id: inventory.id,
          data,
        });
      } else {
        await createMutation.mutateAsync(data);
      }

      reset();
      onSuccess?.();
    } catch (error) {
      console.error("Inventory transaction failed:", error);
    }
  };

  const isSubmitting =
    createMutation.isPending ||
    updateMutation.isPending;

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6"
    >
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

        {/* Product */}
        <div>
          <label className="mb-2 block text-sm font-medium">
            Product
          </label>

          <Select
            value={watch("product")?.toString() || ""}
            onValueChange={(value) =>
              setValue("product", Number(value), {
                shouldValidate: true,
              })
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Product" />
            </SelectTrigger>

            <SelectContent>
              {productList.map((product) => (
                <SelectItem
                  key={product.id}
                  value={product.id.toString()}
                >
                  {product.product_code} • {product.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {errors.product && (
            <p className="mt-1 text-sm text-red-500">
              {errors.product.message}
            </p>
          )}
        </div>

        {/* Transaction Type */}
        <div>
          <label className="mb-2 block text-sm font-medium">
            Transaction Type
          </label>

          <Select
            value={transactionType}
            onValueChange={(value) =>
              setValue("transaction_type", value, {
                shouldValidate: true,
              })
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Type" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="STOCK_IN">
                Stock In
              </SelectItem>

              <SelectItem value="STOCK_OUT">
                Stock Out
              </SelectItem>

              <SelectItem value="OPENING">
                Opening Stock
              </SelectItem>
            </SelectContent>
          </Select>

          {errors.transaction_type && (
            <p className="mt-1 text-sm text-red-500">
              {errors.transaction_type.message}
            </p>
          )}
        </div>

        {/* Quantity */}
        <div>
          <label className="mb-2 block text-sm font-medium">
            Quantity
          </label>

          <Input
            type="number"
            min="1"
            max={
              transactionType === "STOCK_OUT"
                ? currentStock
                : undefined
            }
            {...register("quantity", {
              valueAsNumber: true,
            })}
          />

          {errors.quantity && (
            <p className="mt-1 text-sm text-red-500">
              {errors.quantity.message}
            </p>
          )}
        </div>

        {transactionType === "STOCK_OUT" && (
          <p
            className={`mt-1 text-sm ${
              currentStock <= 0
                ? "text-red-500"
                : "text-muted-foreground"
            }`}
          >
            {currentStock <= 0
              ? "No stock available."
              : `Available stock: ${currentStock}`}
          </p>
        )}

        {/* Reference */}
        <div>
          <label className="mb-2 block text-sm font-medium">
            Reference
          </label>

          <Input
            {...register("reference")}
            placeholder="Invoice / Bill No."
          />

          {errors.reference && (
            <p className="mt-1 text-sm text-red-500">
              {errors.reference.message}
            </p>
          )}
        </div>
      </div>

      {/* Transaction Information */}
      <div className="rounded-lg border bg-muted/30 p-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">
            Transaction
          </span>

          <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
            {transactionType?.replace("_", " ")}
          </span>
        </div>
      </div>

      {/* Remarks */}
      <div>
        <label className="mb-2 block text-sm font-medium">
          Remarks
        </label>

        <Textarea
          rows={4}
          {...register("remarks")}
          placeholder="Optional remarks..."
        />

        {errors.remarks && (
          <p className="mt-1 text-sm text-red-500">
            {errors.remarks.message}
          </p>
        )}
      </div>

      {/* Buttons */}
      <div className="flex justify-end gap-3 border-t pt-5">
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            reset();
            onSuccess?.();
          }}
          disabled={isSubmitting}
        >
          Cancel
        </Button>

        <Button
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting
            ? inventory
              ? "Updating..."
              : "Saving..."
            : inventory
              ? "Update Transaction"
              : "Save Transaction"}
        </Button>
      </div>
    </form>
  );
}