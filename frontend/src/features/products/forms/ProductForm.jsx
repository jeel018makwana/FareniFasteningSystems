import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";

import { productSchema } from "../schema/productSchema";

import { useCreateProduct } from "../hooks/useCreateProduct";
import { useUpdateProduct } from "../hooks/useUpdateProduct";

import { useCategories } from "../hooks/useCategories";
import { useBrands } from "../hooks/useBrands";
import { useProductTypes } from "../hooks/useProductTypes";
import { useProductSizes } from "../hooks/useProductSizes";
import { useProductLengths } from "../hooks/useProductLengths";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import AddProductTypeDialog from "../components/AddProductTypeDialog";
import AddProductSizeDialog from "../components/AddProductSizeDialog";
import AddProductLengthDialog from "../components/AddProductLengthDialog";
import { useCreateProductType } from "../hooks/useCreateProductType";
import { useCreateProductSize } from "../hooks/useCreateProductSize";
import { useCreateProductLength } from "../hooks/useCreateProductLength";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Checkbox } from "@/components/ui/checkbox";
const emptyValues = {
  product_code: "",
  name: "",
  category: "",
  product_type: "",
  product_size: "",
  product_length:"",
  brand: "",
  standard:"",
  grade: "",
  thread_pitch: "",
  material: "",
  unit: "PCS",
  purchase_price: 0,
  selling_price: 0,
  gst: 18,
  minimum_stock: 0,
  current_stock: 0,
  is_active: true,
};

export default function ProductForm({
  product,
  onSuccess,
}) {

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(productSchema),
    
    defaultValues: emptyValues,
  });

  const { data: categories = [] } = useCategories();
  const { data: brands = [] } = useBrands();
  const [addTypeOpen, setAddTypeOpen] = useState(false);
  const [addSizeOpen, setAddSizeOpen] = useState(false);
  const [addLengthOpen, setAddLengthOpen] = useState(false);

  const createMutation = useCreateProduct();
  const updateMutation = useUpdateProduct();
  const selectedCategory = watch("category");
  const selectedProductType = watch("product_type");
  const selectedProductSize = watch("product_size");
  const createTypeMutation = useCreateProductType();
  const createSizeMutation = useCreateProductSize();
  const createLengthMutation = useCreateProductLength();
  const { data: productTypes = [] } =
    useProductTypes(selectedCategory);
  const { data: productSizes = [] } =
    useProductSizes(selectedProductType);
  const { data: productLengths = [] } =
    useProductLengths(selectedProductSize);
  const categoryList = categories?.results || [];
  const brandList = brands?.results || [];
  const productTypeList = productTypes?.results || [];
  const productSizeList = productSizes?.results || [];
  const productLengthList =
      productLengths?.results || [];

  /* -----------------------------
  Load Product for Edit
  ----------------------------- */

  useEffect(() => {
    if (product) {
      reset({
        product_code: product.product_code || "",
        name: product.name || "",

        category: product.category ?? "",
        product_type: product.product_type ?? "",
        product_size: product.product_size ?? "",
        product_length: product.product_length ?? "",
        brand: product.brand ?? "",
        standard: product.standard || "",
        grade: product.grade || "",
        thread_pitch: product.thread_pitch || "",
        material: product.material || "",

        unit: product.unit || "PCS",

        purchase_price: Number(product.purchase_price || 0),
        selling_price: Number(product.selling_price || 0),

        gst: Number(product.gst || 18),

        minimum_stock: Number(product.minimum_stock || 0),
        current_stock: Number(product.current_stock || 0),

        is_active: product.is_active ?? true,
      });
    } else {
      reset(emptyValues);
    }
  }, [product, reset]);

  /* ===========================
      CATEGORY CHANGE
  =============================*/
  const handleCategoryChange = (
    value
  ) => {
    const categoryId = Number(value);
    setValue("category", categoryId, {shouldValidate:true,});

    // Reset dependent fields
    setValue(
      "product_type",
      "",
      {shouldValidate: true,}
    );

    setValue(
      "product_size",
      "",
      {shouldValidate: true,}
    );
    setValue("product_length", "", {
      shouldValidate: true,
    });
  };

  /* =========================
     PRODUCT TYPE CHANGE
  ========================== */

  const handleProductTypeChange = (
      value
    ) => {

      const productTypeId =
        Number(value);

      setValue(
        "product_type",
        productTypeId,
        {
          shouldValidate: true,
        }
      );


      // Reset size

      setValue(
        "product_size",
        "",
        {
          shouldValidate: true,
        }
      );
       setValue("product_length", "", {
        shouldValidate: true,
      });
    };

  /* -----------------------------
     Submit
  ----------------------------- */

  const onSubmit = async (data) => {
    try {
      if (product) {
        await updateMutation.mutateAsync({
          id: product.id,
          data,
        });

        toast.success("Product updated successfully");
      } else {
        await createMutation.mutateAsync(data);

        toast.success("Product added successfully");
      }

      reset(emptyValues);

      onSuccess?.();

    } catch (error) {
      console.error("Product save error:", error);

      const backendErrors =
        error?.response?.data?.errors;

      if (backendErrors) {
        const firstError = Object.values(
          backendErrors
        )[0];

        toast.error(
          Array.isArray(firstError)
            ? firstError[0]
            : "Failed to save product"
        );
      } else {
        toast.error(
          error?.response?.data?.message ||
          "Failed to save product"
        );
      }
    }
  };

  const isSubmitting =
    createMutation.isPending ||
    updateMutation.isPending;

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-8"
    >

      {/* =========================
          BASIC INFORMATION
      ========================== */}

      <div>
        <div className="mb-5">
          <h3 className="text-base font-semibold">
            Basic Information
          </h3>

          <p className="text-sm text-muted-foreground">
            Enter the basic product identification details.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

          {/* Product Code */}
          <div>
            <label className="mb-2 block text-sm font-medium">
              Product Code
            </label>

            <Input
              {...register("product_code")}
              placeholder="e.g. HTB-M16-100"
              className="focus-visible:ring-[#F45A00]"
            />

            {errors.product_code && (
              <p className="mt-1 text-sm text-red-500">
                {errors.product_code.message}
              </p>
            )}
          </div>

          {/* Product Name */}
          <div>
            <label className="mb-2 block text-sm font-medium">
              Product Name
            </label>

            <Input
              {...register("name")}
              placeholder="e.g. High Tension Bolt"
              className="focus-visible:ring-[#F45A00]"
            />

            {errors.name && (
              <p className="mt-1 text-sm text-red-500">
                {errors.name.message}
              </p>
            )}
          </div>

          {/* Category */}
          <div>
            <label className="mb-2 block text-sm font-medium">
              Category
            </label>

            <Select
              value={watch("category")?.toString()}
              onValueChange= {
                handleCategoryChange
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>

              <SelectContent>
                {categoryList.map((category) => (
                  <SelectItem
                    key={category.id}
                    value={category.id.toString()}
                  >
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {errors.category && (
              <p className="mt-1 text-sm text-red-500">
                {errors.category.message}
              </p>
            )}
          </div>
          
          {/* Product Type */}
          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="block text-sm font-medium">
                Product Type
              </label>

              <button
                type="button"
                onClick={() => setAddTypeOpen(true)}
                disabled={!selectedCategory}
                className="text-sm font-medium text-[#F45A00] hover:underline disabled:cursor-not-allowed disabled:opacity-50"
              >
                + Add Type
              </button>
            </div>

            <Select
              value={watch("product_type")?.toString()}
              onValueChange={handleProductTypeChange}
              disabled={!selectedCategory}
            >
              <SelectTrigger className="w-full">
                <SelectValue
                  placeholder={
                    selectedCategory
                      ? "Select product type"
                      : "Select category first"
                  }
                />
              </SelectTrigger>

              <SelectContent>
                {productTypeList.map((type) => (
                  <SelectItem
                    key={type.id}
                    value={type.id.toString()}
                  >
                    {type.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {errors.product_type && (
              <p className="mt-1 text-sm text-red-500">
                {errors.product_type.message}
              </p>
            )}
          </div>


          {/* Product Size */}
          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="block text-sm font-medium">
                Product Size
              </label>

              <button
                type="button"
                onClick={() => setAddSizeOpen(true)}
                disabled={!selectedProductType}
                className="text-sm font-medium text-[#F45A00] hover:underline disabled:cursor-not-allowed disabled:opacity-50"
              >
                + Add Size
              </button>
            </div>

            <Select
              value={
                watch("product_size")?.toString()
              }
              onValueChange={(value) => {
                setValue(
                  "product_size",
                  Number(value),
                  {
                    shouldValidate: true,
                  }
                );
                setValue(
                  "product_length",
                  "",
                  {shouldValidate:true,}
                );
              }
              }
              disabled={
                !selectedProductType
              }
            >

              <SelectTrigger className="w-full">

                <SelectValue
                  placeholder={
                    selectedProductType
                      ? "Select product size"
                      : "Select product type first"
                  }
                />

              </SelectTrigger>


              <SelectContent>

                {productSizeList.map(
                  (size) => (

                    <SelectItem
                      key={size.id}
                      value={
                        size.id.toString()
                      }
                    >

                      {size.name}

                    </SelectItem>

                  )
                )}

              </SelectContent>

            </Select>
            {errors.product_size && (
              <p className="mt-1 text-sm text-red-500">
                {errors.product_size.message}
              </p>
            )}
          </div>

          {/* Product Length */}
          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="block text-sm font-medium">
                Product Length
              </label>

              <button
                type="button"
                onClick={() => setAddLengthOpen(true)}
                disabled={!selectedProductSize}
                className="text-sm font-medium text-[#F45A00] hover:underline disabled:cursor-not-allowed disabled:opacity-50"
              >
                + Add Length
              </button>
            </div>

            <Select
              value={watch("product_length")?.toString()}
              onValueChange={(value) =>
                setValue(
                  "product_length",
                  Number(value),
                  {
                    shouldValidate: true,
                  }
                )
              }
              disabled={!selectedProductSize}
            >
              <SelectTrigger className="w-full">
                <SelectValue
                  placeholder={
                    selectedProductSize
                      ? "Select product length"
                      : "Select product size first"
                  }
                />
              </SelectTrigger>

              <SelectContent>
                {productLengthList.map((length) => (
                  <SelectItem
                    key={length.id}
                    value={length.id.toString()}
                  >
                    {length.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {errors.product_length && (
              <p className="mt-1 text-sm text-red-500">
                {errors.product_length.message}
              </p>
            )}
          </div>

          {/* Brand */}
          <div>
            <label className="mb-2 block text-sm font-medium">
              Brand
            </label>

            <Select
              value={watch("brand")?.toString()}
              onValueChange={(value) =>
                setValue(
                  "brand",
                  Number(value),
                  { shouldValidate: true }
                )
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select brand" />
              </SelectTrigger>

              <SelectContent>
                {brandList.map((brand) => (
                  <SelectItem
                    key={brand.id}
                    value={brand.id.toString()}
                  >
                    {brand.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {errors.brand && (
              <p className="mt-1 text-sm text-red-500">
                {errors.brand.message}
              </p>
            )}
          </div>

        </div>
      </div>

      {/* =========================
          SPECIFICATIONS
      ========================== */}

      <div className="border-t pt-6">

        <div className="mb-5">
          <h3 className="text-base font-semibold">
            Product Specifications
          </h3>

          <p className="text-sm text-muted-foreground">
            Define the technical specifications of the product.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {/* standard */}
          <div>
            <label className="mb-2 block text-sm font-medium">
              Standard
            </label>

            <Input
              {...register("standard")}
              placeholder="e.g. IS 1363, DIN 933, ISO 4017"
            />

            {errors.standard && (
              <p className="mt-1 text-sm text-red-500">
                {errors.standard.message}
              </p>
            )}
          </div>
          {/* Grade */}
          <div>
            <label className="mb-2 block text-sm font-medium">
              Grade
            </label>

            <Input
              {...register("grade")}
              placeholder="e.g. 8.8"
            />
          </div>

          {/* Thread Pitch */}
          <div>
            <label className="mb-2 block text-sm font-medium">
              Thread Pitch
            </label>

            <Input
              {...register("thread_pitch")}
              placeholder="e.g. 1.25"
            />

            {errors.thread_pitch && (
              <p className="mt-1 text-sm text-red-500">
                {errors.thread_pitch.message}
              </p>
            )}
          </div>

          {/* Material */}
          <div>
            <label className="mb-2 block text-sm font-medium">
              Material
            </label>

            <Input
              {...register("material")}
              placeholder="e.g. Steel"
            />
          </div>

          {/* Unit */}
          <div>
            <label className="mb-2 block text-sm font-medium">
              Unit
            </label>

            <Select
              value={watch("unit")}
              onValueChange={(value) =>
                setValue("unit", value)
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="PCS">
                  Pieces (PCS)
                </SelectItem>

                <SelectItem value="BOX">
                  Box
                </SelectItem>

                <SelectItem value="KG">
                  Kilogram (KG)
                </SelectItem>

                <SelectItem value="SET">
                  Set
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

        </div>
      </div>

      {/* =========================
          PRICING
      ========================== */}

      <div className="border-t pt-6">

        <div className="mb-5">
          <h3 className="text-base font-semibold">
            Pricing & Tax
          </h3>

          <p className="text-sm text-muted-foreground">
            Configure purchase, selling price and GST.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">

          {/* Purchase Price */}
          <div>
            <label className="mb-2 block text-sm font-medium">
              Purchase Price
            </label>

            <Input
              type="number"
              step="0.01"
              {...register("purchase_price", {
                valueAsNumber: true,
              })}
              placeholder="0.00"
            />

            {errors.purchase_price && (
              <p className="mt-1 text-sm text-red-500">
                {errors.purchase_price.message}
              </p>
            )}
          </div>

          {/* Selling Price */}
          <div>
            <label className="mb-2 block text-sm font-medium">
              Selling Price
            </label>

            <Input
              type="number"
              step="0.01"
              {...register("selling_price", {
                valueAsNumber: true,
              })}
              placeholder="0.00"
            />

            {errors.selling_price && (
              <p className="mt-1 text-sm text-red-500">
                {errors.selling_price.message}
              </p>
            )}
          </div>

          {/* GST */}
          <div>
            <label className="mb-2 block text-sm font-medium">
              GST %
            </label>

            <Input
              type="number"
              step="0.01"
              {...register("gst", {
                valueAsNumber: true,
              })}
              placeholder="18"
            />

            {errors.gst && (
              <p className="mt-1 text-sm text-red-500">
                {errors.gst.message}
              </p>
            )}
          </div>

        </div>
      </div>

      {/* =========================
          INVENTORY
      ========================== */}

      <div className="border-t pt-6">

        <div className="mb-5">
          <h3 className="text-base font-semibold">
            Inventory
          </h3>

          <p className="text-sm text-muted-foreground">
            Configure stock levels and inventory alerts.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

          {/* Current Stock */}
          <div>
            <label className="mb-2 block text-sm font-medium">
              Current Stock
            </label>

            <Input
              type="number"
              {...register("current_stock", {
                valueAsNumber: true,
              })}
              placeholder="0"
            />

            {errors.current_stock && (
              <p className="mt-1 text-sm text-red-500">
                {errors.current_stock.message}
              </p>
            )}
          </div>

          {/* Minimum Stock */}
          <div>
            <label className="mb-2 block text-sm font-medium">
              Minimum Stock
            </label>

            <Input
              type="number"
              {...register("minimum_stock", {
                valueAsNumber: true,
              })}
              placeholder="0"
            />

            {errors.minimum_stock && (
              <p className="mt-1 text-sm text-red-500">
                {errors.minimum_stock.message}
              </p>
            )}
          </div>

        </div>
      </div>

      {/* =========================
          STATUS
      ========================== */}

      <div className="border-t pt-6">

        <div className="flex items-center justify-between rounded-xl border p-4">

          <div>
            <p className="font-medium">
              Active Product
            </p>

            <p className="text-sm text-muted-foreground">
              Active products are available for sales and purchases.
            </p>
          </div>

          <Checkbox
            checked={watch("is_active")}
            onCheckedChange={(checked) =>
              setValue("is_active", checked)
            }
          />

        </div>
      </div>

      {/* =========================
          ACTIONS
      ========================== */}

      <div
        className="
          flex
          justify-end
          gap-3
          border-t
          pt-5
        "
      >

        <Button
          type="button"
          variant="outline"
          onClick={() => {
            if (product) {
              reset({
                product_code:
                  product.product_code || "",
                name:
                  product.name || "",
                category:
                  product.category ?? "",
                product_type: product.product_type ?? "",
                product_size: product.product_size ?? "",
                brand: product.brand ?? "",
                grade: product.grade || "",
                thread_pitch: product.thread_pitch || "",
                material: product.material || "",
                unit: product.unit || "PCS",
                purchase_price: Number(product.purchase_price || 0),
                selling_price: Number(product.selling_price || 0),
                gst: Number(product.gst || 18),
                minimum_stock: Number(product.minimum_stock || 0),
                current_stock: Number(product.current_stock || 0),
                is_active: product.is_active ?? true,
              });
            } else {
              reset(emptyValues);
            }
          }}
          disabled={isSubmitting}
        >
          Cancel
        </Button>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="
            min-w-[140px]
            bg-[#F45A00]
            text-white
            hover:bg-[#D94F00]
          "
        >
          {isSubmitting
            ? "Saving..."
            : product
              ? "Update Product"
              : "Save Product"}
        </Button>
      </div>
      <AddProductTypeDialog
        open={addTypeOpen}
        onOpenChange={setAddTypeOpen}
        categoryId={selectedCategory}
      />

      <AddProductSizeDialog
        open={addSizeOpen}
        onOpenChange={setAddSizeOpen}
        productTypeId={selectedProductType}
      />

      <AddProductLengthDialog
        open={addLengthOpen}
        onOpenChange={setAddLengthOpen}
        productSizeId={selectedProductSize}
      />

    </form>
    
  );
}