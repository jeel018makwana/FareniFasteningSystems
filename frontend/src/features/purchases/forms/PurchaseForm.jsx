import { useEffect, useState } from "react";

import {
  useForm,
  useFieldArray,
} from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import { purchaseSchema } from "../schema/purchaseSchema";

import { useCreatePurchase } from "../hooks/useCreatePurchase";
import { useUpdatePurchase } from "../hooks/useUpdatePurchase";

import { useSuppliers } from "@/features/suppliers/hooks/useSuppliers";
import { useAllProducts } from "@/features/products/hooks/useAllProducts";

import SupplierForm from "@/features/suppliers/forms/SupplierForm";

import PurchaseItemRow from "../components/PurchaseItemRow";
import PurchaseSummary from "../components/PurchaseSummary";

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

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function PurchaseForm({
  purchase,
  onSuccess,
}) {

  // =====================================================
  // STATE
  // =====================================================

  const [
    isSupplierDialogOpen,
    setIsSupplierDialogOpen,
  ] = useState(false);

  // =====================================================
  // MUTATIONS
  // =====================================================

  const createMutation =
    useCreatePurchase();

  const updateMutation =
    useUpdatePurchase();

  // =====================================================
  // SUPPLIERS
  // =====================================================

  const {
    data: suppliers,
  } = useSuppliers({
    page_size: 1000,
  });

  // =====================================================
  // PRODUCTS
  // =====================================================

  const {
    data: products,
  } = useAllProducts();

  const supplierList =
    suppliers?.results || [];

  const productList =
    products?.results || [];

  // =====================================================
  // FORM
  // =====================================================

  const {
    register,
    control,
    watch,
    reset,
    setValue,
    handleSubmit,

    formState: {
      errors,
    },

  } = useForm({

    resolver:
      zodResolver(purchaseSchema),

    defaultValues: {

      supplier: "",

      invoice_number: "",

      purchase_date:
        new Date()
          .toISOString()
          .split("T")[0],

      discount: 0,

      remarks: "",

      items: [
        {
          product: "",
          category: "",
          product_type: "",
          product_size: "",
          product_length: "",
          quantity: 1,
          purchase_price: 0,
          gst: 18,
        },
      ],

    },

  });

  // =====================================================
  // FIELD ARRAY
  // =====================================================

  const {
    fields,
    append,
    remove,
  } = useFieldArray({

    control,

    name: "items",

  });

  // =====================================================
  // WATCH
  // =====================================================

  const items =
    watch("items") || [];

  const discount =
    Number(
      watch("discount")
    ) || 0;

  // =====================================================
  // SUBTOTAL
  // =====================================================

  const subtotal =
    items.reduce(
      (sum, item) => {

        const qty =
          Number(item.quantity) || 0;

        const price =
          Number(item.purchase_price) || 0;

        return (
          sum +
          qty * price
        );

      },
      0
    );

  // =====================================================
  // GST
  // =====================================================

  const gstAmount =
    items.reduce(
      (sum, item) => {

        const qty =
          Number(item.quantity) || 0;

        const price =
          Number(item.purchase_price) || 0;

        const gst =
          Number(item.gst) || 0;

        const total =
          qty * price;

        return (
          sum +
          (total * gst) / 100
        );

      },
      0
    );

  // =====================================================
  // GRAND TOTAL
  // =====================================================

  const grandTotal =
    subtotal +
    gstAmount -
    discount;

  // =====================================================
  // EDIT PURCHASE
  // =====================================================

  useEffect(() => {

    if (!purchase) {
      return;
    }

    reset({

      supplier:
        purchase.supplier,

      invoice_number:
        purchase.invoice_number || "",

      purchase_date:
        purchase.purchase_date,

      discount:
        Number(purchase.discount) || 0,

      remarks:
        purchase.remarks || "",

      items:
        purchase.items || [],

    });

  }, [
    purchase,
    reset,
  ]);

  // =====================================================
  // NEW SUPPLIER CREATED
  // =====================================================

  const handleSupplierCreated = (
    createdSupplier
  ) => {

    // Close dialog
    setIsSupplierDialogOpen(false);

    // If supplier was returned,
    // automatically select it.
    if (createdSupplier?.id) {

      setValue(
        "supplier",
        Number(createdSupplier.id),
        {
          shouldValidate: true,
          shouldDirty: true,
        }
      );

    }

  };

  // =====================================================
  // SUBMIT
  // =====================================================

  const onSubmit = async (
    data
  ) => {

    try {

      if (purchase) {

        await updateMutation
          .mutateAsync({

            id: purchase.id,

            data,

          });

      } else {

        await createMutation
          .mutateAsync(data);

      }

      reset();

      onSuccess?.();

    } catch (error) {

      console.error(
        "Purchase save error:",
        error?.response?.data ||
        error
      );

    }

  };

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <>
      <form
        onSubmit={
          handleSubmit(onSubmit)
        }
        className="space-y-6"
      >

        {/* =================================================
            TOP SECTION
        ================================================= */}

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

          {/* =================================================
              SUPPLIER
          ================================================= */}

          <div>

            <label className="mb-2 block text-sm font-medium">
              Supplier
            </label>

            <div className="flex gap-2">

              <Select
                value={
                  watch("supplier")
                    ?.toString() || ""
                }
                onValueChange={(
                  value
                ) => {

                  setValue(
                    "supplier",
                    Number(value),
                    {
                      shouldValidate:
                        true,

                      shouldDirty:
                        true,
                    }
                  );

                }}
              >

                <SelectTrigger className="w-full">

                  <SelectValue
                    placeholder="Select Supplier"
                  />

                </SelectTrigger>

                <SelectContent>

                  {supplierList.length ===
                  0 ? (

                    <div className="px-3 py-2 text-sm text-muted-foreground">
                      No suppliers found
                    </div>

                  ) : (

                    supplierList.map(
                      (supplier) => (

                        <SelectItem
                          key={supplier.id}
                          value={supplier.id.toString()}
                        >
                          {supplier.name}
                          {supplier.company_name
                            ? ` - ${supplier.company_name}`
                            : ""}
                        </SelectItem>

                      )
                    )

                  )}

                </SelectContent>

              </Select>

              {/* NEW SUPPLIER */}

              <Button
                type="button"
                variant="outline"
                className="shrink-0"
                onClick={() =>
                  setIsSupplierDialogOpen(
                    true
                  )
                }
              >
                + New Supplier
              </Button>

            </div>

            <p className="mt-1 text-sm text-red-500">
              {errors.supplier?.message}
            </p>

          </div>

          {/* =================================================
              PURCHASE DATE
          ================================================= */}

          <div>

            <label className="mb-2 block text-sm font-medium">
              Purchase Date
            </label>

            <Input
              className="w-full"
              type="date"
              {...register(
                "purchase_date"
              )}
            />

            <p className="mt-1 text-sm text-red-500">
              {errors.purchase_date?.message}
            </p>

          </div>

          {/* =================================================
              INVOICE NUMBER
          ================================================= */}

          <div>

            <label className="mb-2 block text-sm font-medium">
              Invoice Number
            </label>

            <Input
              placeholder="Supplier Invoice Number"
              {...register(
                "invoice_number"
              )}
            />

            <p className="mt-1 text-sm text-red-500">
              {errors.invoice_number?.message}
            </p>

          </div>

          {/* =================================================
              DISCOUNT
          ================================================= */}

          <div>

            <label className="mb-2 block text-sm font-medium">
              Discount
            </label>

            <Input
              type="number"
              min="0"
              step="0.01"
              {...register(
                "discount",
                {
                  valueAsNumber:
                    true,
                }
              )}
            />

            <p className="mt-1 text-sm text-red-500">
              {errors.discount?.message}
            </p>

          </div>

        </div>

        {/* =================================================
            PRODUCTS
        ================================================= */}

        <div className="space-y-4">

          {fields.map(
            (
              field,
              index
            ) => (

              <PurchaseItemRow
                key={field.id}
                index={index}
                products={
                  productList
                }
                register={
                  register
                }
                watch={watch}
                setValue={
                  setValue
                }
                remove={
                  remove
                }
              />

            )
          )}

          {/* ADD PRODUCT */}

          <Button
            type="button"
            variant="outline"
            onClick={() =>
              append({

                product: "",

                category: "",

                product_type:
                  "",

                product_size:
                  "",

                product_length:
                  "",

                quantity: 1,

                purchase_price:
                  0,

                gst: 18,

              })
            }
          >
            + Add Product
          </Button>

        </div>

        {/* =================================================
            REMARKS
        ================================================= */}

        <div>

          <label className="mb-2 block text-sm font-medium">
            Remarks
          </label>

          <Textarea
            rows={4}
            placeholder="Purchase remarks..."
            {...register(
              "remarks"
            )}
          />

        </div>

        {/* =================================================
            SUMMARY
        ================================================= */}

        <PurchaseSummary
          subtotal={
            subtotal
          }
          gstAmount={
            gstAmount
          }
          discount={
            discount
          }
          grandTotal={
            grandTotal
          }
        />

        {/* =================================================
            BUTTONS
        ================================================= */}

        <div className="flex justify-end gap-3">

          <Button
            type="button"
            variant="outline"
            onClick={
              onSuccess
            }
          >
            Cancel
          </Button>

          <Button
            type="submit"
            disabled={
              createMutation.isPending ||
              updateMutation.isPending
            }
          >

            {createMutation.isPending ||
            updateMutation.isPending
              ? "Saving..."
              : purchase
                ? "Update Purchase"
                : "Save Purchase"}

          </Button>

        </div>

      </form>

      {/* ===================================================
          NEW SUPPLIER DIALOG
      =================================================== */}

      <Dialog
        open={
          isSupplierDialogOpen
        }
        onOpenChange={
          setIsSupplierDialogOpen
        }
      >

        <DialogContent
          className="max-w-3xl max-h-[90vh] overflow-y-auto"
        >

          <DialogHeader>

            <DialogTitle>
              Add New Supplier
            </DialogTitle>

          </DialogHeader>

          <SupplierForm
            onSuccess={
              handleSupplierCreated
            }
          />

        </DialogContent>

      </Dialog>
    </>
  );
}