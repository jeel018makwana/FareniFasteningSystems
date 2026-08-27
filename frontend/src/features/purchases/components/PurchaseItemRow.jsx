import { Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

import { useCategories } from "@/features/products/hooks/useCategories";
import { useProductTypes } from "@/features/products/hooks/useProductTypes";
import { useProductSizes } from "@/features/products/hooks/useProductSizes";
import { useProductLengths } from "@/features/products/hooks/useProductLengths";

export default function PurchaseItemRow({
  index,
  products,
  register,
  watch,
  setValue,
  remove,
}) {
  // =====================================================
  // SELECTED VALUES
  // =====================================================

  const selectedCategory = watch(
    `items.${index}.category`
  );

  const selectedProductType = watch(
    `items.${index}.product_type`
  );

  const selectedProductSize = watch(
    `items.${index}.product_size`
  );

  const selectedProductLength = watch(
    `items.${index}.product_length`
  );

  const selectedProductId = watch(
    `items.${index}.product`
  );

  // =====================================================
  // FETCH CATEGORY
  // =====================================================

  const { data: categories = [] } =
    useCategories();

  // =====================================================
  // FETCH PRODUCT TYPES
  // =====================================================

  const { data: productTypes = [] } =
    useProductTypes(selectedCategory);

  // =====================================================
  // FETCH PRODUCT SIZES
  // =====================================================

  const { data: productSizes = [] } =
    useProductSizes(selectedProductType);

  // =====================================================
  // FETCH PRODUCT LENGTHS
  // =====================================================

  const { data: productLengths = [] } =
    useProductLengths(selectedProductSize);

  // =====================================================
  // LISTS
  // =====================================================

  const categoryList =
    categories?.results || [];

  const productTypeList =
    productTypes?.results || [];

  const productSizeList =
    productSizes?.results || [];

  const productLengthList =
    productLengths?.results || [];

  // =====================================================
  // PRODUCTS FILTER
  // =====================================================

  const filteredProducts = products.filter(
    (product) => {

      if (
        !selectedCategory ||
        !selectedProductType ||
        !selectedProductSize ||
        !selectedProductLength
      ) {
        return false;
      }

      return (
        Number(product.category) ===
          Number(selectedCategory) &&

        Number(product.product_type) ===
          Number(selectedProductType) &&

        Number(product.product_size) ===
          Number(selectedProductSize) &&

        Number(product.product_length) ===
          Number(selectedProductLength)
      );
    }
  );

  // =====================================================
  // SELECTED PRODUCT
  // =====================================================

  const selectedProduct =
    products.find(
      (product) =>
        product.id ===
        Number(selectedProductId)
    );

  // =====================================================
  // VALUES
  // =====================================================

  const quantity =
    Number(
      watch(
        `items.${index}.quantity`
      )
    ) || 0;

  const purchasePrice =
    Number(
      watch(
        `items.${index}.purchase_price`
      )
    ) || 0;

  const lineTotal =
    quantity * purchasePrice;

  // =====================================================
  // CATEGORY CHANGE
  // =====================================================

  const handleCategoryChange = (
    value
  ) => {

    const categoryId =
      Number(value);

    setValue(
      `items.${index}.category`,
      categoryId,
      {
        shouldValidate: true,
        shouldDirty: true,
      }
    );

    // Reset dependent fields

    setValue(
      `items.${index}.product_type`,
      "",
      {
        shouldValidate: true,
      }
    );

    setValue(
      `items.${index}.product_size`,
      "",
      {
        shouldValidate: true,
      }
    );

    setValue(
      `items.${index}.product_length`,
      "",
      {
        shouldValidate: true,
      }
    );

    setValue(
      `items.${index}.product`,
      "",
      {
        shouldValidate: true,
      }
    );
  };

  // =====================================================
  // TYPE CHANGE
  // =====================================================

  const handleProductTypeChange = (
    value
  ) => {

    const productTypeId =
      Number(value);

    setValue(
      `items.${index}.product_type`,
      productTypeId,
      {
        shouldValidate: true,
        shouldDirty: true,
      }
    );

    // Reset size, length and product

    setValue(
      `items.${index}.product_size`,
      "",
      {
        shouldValidate: true,
      }
    );

    setValue(
      `items.${index}.product_length`,
      "",
      {
        shouldValidate: true,
      }
    );

    setValue(
      `items.${index}.product`,
      "",
      {
        shouldValidate: true,
      }
    );
  };

  // =====================================================
  // SIZE CHANGE
  // =====================================================

  const handleProductSizeChange = (
    value
  ) => {

    const productSizeId =
      Number(value);

    setValue(
      `items.${index}.product_size`,
      productSizeId,
      {
        shouldValidate: true,
        shouldDirty: true,
      }
    );

    // Reset length and product

    setValue(
      `items.${index}.product_length`,
      "",
      {
        shouldValidate: true,
      }
    );

    setValue(
      `items.${index}.product`,
      "",
      {
        shouldValidate: true,
      }
    );
  };

  // =====================================================
  // LENGTH CHANGE
  // =====================================================

  const handleProductLengthChange = (
    value
  ) => {

    const productLengthId =
      Number(value);

    setValue(
      `items.${index}.product_length`,
      productLengthId,
      {
        shouldValidate: true,
        shouldDirty: true,
      }
    );

    // Reset product

    setValue(
      `items.${index}.product`,
      "",
      {
        shouldValidate: true,
      }
    );
  };

  // =====================================================
  // PRODUCT CHANGE
  // =====================================================

  const handleProductChange = (
    value
  ) => {

    const productId =
      Number(value);

    const product =
      products.find(
        (p) =>
          p.id === productId
      );

    setValue(
      `items.${index}.product`,
      productId,
      {
        shouldValidate: true,
        shouldDirty: true,
      }
    );

    if (product) {

      setValue(
        `items.${index}.purchase_price`,
        Number(
          product.purchase_price
        ),
        {
          shouldValidate: true,
        }
      );

      setValue(
        `items.${index}.gst`,
        Number(product.gst),
        {
          shouldValidate: true,
        }
      );
    }
  };

  return (
    <div className="space-y-5 rounded-lg border p-4">

      {/* =================================================
          PRODUCT IDENTIFICATION
      ================================================= */}

      <div>
        <h3 className="mb-1 text-sm font-semibold">
          Product Details
        </h3>

        <p className="text-xs text-muted-foreground">
          Select category, type, size, length and product.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-5">

        {/* =================================================
            CATEGORY
        ================================================= */}

        <div>

          <label className="mb-2 block text-sm font-medium">
            Category
          </label>

          <Select
            value={
              selectedCategory?.toString() ||
              ""
            }
            onValueChange={
              handleCategoryChange
            }
          >

            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>

            <SelectContent>

              {categoryList.map(
                (category) => (

                  <SelectItem
                    key={category.id}
                    value={category.id.toString()}
                  >
                    {category.name}
                  </SelectItem>

                )
              )}

            </SelectContent>

          </Select>

        </div>

        {/* =================================================
            PRODUCT TYPE
        ================================================= */}

        <div>

          <label className="mb-2 block text-sm font-medium">
            Product Type
          </label>

          <Select
            value={
              selectedProductType?.toString() ||
              ""
            }
            onValueChange={
              handleProductTypeChange
            }
            disabled={
              !selectedCategory
            }
          >

            <SelectTrigger className="w-full">

              <SelectValue
                placeholder={
                  selectedCategory
                    ? "Select type"
                    : "Select category first"
                }
              />

            </SelectTrigger>

            <SelectContent>

              {productTypeList.map(
                (type) => (

                  <SelectItem
                    key={type.id}
                    value={type.id.toString()}
                  >
                    {type.name}
                  </SelectItem>

                )
              )}

            </SelectContent>

          </Select>

        </div>

        {/* =================================================
            PRODUCT SIZE
        ================================================= */}

        <div>

          <label className="mb-2 block text-sm font-medium">
            Product Size
          </label>

          <Select
            value={
              selectedProductSize?.toString() ||
              ""
            }
            onValueChange={
              handleProductSizeChange
            }
            disabled={
              !selectedProductType
            }
          >

            <SelectTrigger className="w-full">

              <SelectValue
                placeholder={
                  selectedProductType
                    ? "Select size"
                    : "Select type first"
                }
              />

            </SelectTrigger>

            <SelectContent>

              {productSizeList.map(
                (size) => (

                  <SelectItem
                    key={size.id}
                    value={size.id.toString()}
                  >
                    {size.name}
                  </SelectItem>

                )
              )}

            </SelectContent>

          </Select>

        </div>

        {/* =================================================
            PRODUCT LENGTH
        ================================================= */}

        <div>

          <label className="mb-2 block text-sm font-medium">
            Product Length
          </label>

          <Select
            value={
              selectedProductLength?.toString() ||
              ""
            }
            onValueChange={
              handleProductLengthChange
            }
            disabled={
              !selectedProductSize
            }
          >

            <SelectTrigger className="w-full">

              <SelectValue
                placeholder={
                  selectedProductSize
                    ? "Select length"
                    : "Select size first"
                }
              />

            </SelectTrigger>

            <SelectContent>

              {productLengthList.map(
                (length) => (

                  <SelectItem
                    key={length.id}
                    value={length.id.toString()}
                  >
                    {length.name}
                  </SelectItem>

                )
              )}

            </SelectContent>

          </Select>

        </div>

        {/* =================================================
            PRODUCT
        ================================================= */}

        <div>

          <label className="mb-2 block text-sm font-medium">
            Product
          </label>

          <Select
            value={
              selectedProductId?.toString() ||
              ""
            }
            onValueChange={
              handleProductChange
            }
            disabled={
              !selectedProductLength
            }
          >

            <SelectTrigger className="w-full">

              <SelectValue
                placeholder={
                  selectedProductLength
                    ? "Select product"
                    : "Select length first"
                }
              />

            </SelectTrigger>

            <SelectContent className="max-h-72">

              {filteredProducts.length === 0 ? (

                <div className="px-3 py-2 text-sm text-muted-foreground">
                  No products found
                </div>

              ) : (

                filteredProducts.map(
                  (product) => (

                    <SelectItem
                      key={product.id}
                      value={product.id.toString()}
                    >
                      {product.name}
                    </SelectItem>

                  )
                )

              )}

            </SelectContent>

          </Select>

        </div>

      </div>

      {/* =================================================
          SELECTED PRODUCT INFO
      ================================================= */}

      {selectedProduct && (

        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">

          {/* Brand */}

          <div>

            <label className="mb-2 block text-sm font-medium">
              Brand
            </label>

            <Input
              value={
                selectedProduct.brand_name ||
                ""
              }
              readOnly
            />

          </div>

          {/* Standard */}

          <div>

            <label className="mb-2 block text-sm font-medium">
              Standard
            </label>

            <Input
              value={
                selectedProduct.standard ||
                ""
              }
              readOnly
            />

          </div>

          {/* Grade */}

          <div>

            <label className="mb-2 block text-sm font-medium">
              Grade
            </label>

            <Input
              value={
                selectedProduct.grade ||
                ""
              }
              readOnly
            />

          </div>

          {/* Material */}

          <div>

            <label className="mb-2 block text-sm font-medium">
              Material
            </label>

            <Input
              value={
                selectedProduct.material ||
                ""
              }
              readOnly
            />

          </div>

        </div>

      )}

      {/* =================================================
          PURCHASE DETAILS
      ================================================= */}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-5">

        {/* Quantity */}

        <div>

          <label className="mb-2 block text-sm font-medium">
            Qty
          </label>

          <Input
            type="number"
            min="1"
            {...register(
              `items.${index}.quantity`,
              {
                valueAsNumber: true,
              }
            )}
          />

        </div>

        {/* Purchase Price */}

        <div>

          <label className="mb-2 block text-sm font-medium">
            Purchase Price
          </label>

          <Input
            type="number"
            step="0.01"
            {...register(
              `items.${index}.purchase_price`,
              {
                valueAsNumber: true,
              }
            )}
          />

        </div>

        {/* GST */}

        <div>

          <label className="mb-2 block text-sm font-medium">
            GST %
          </label>

          <Input
            type="number"
            step="0.01"
            {...register(
              `items.${index}.gst`,
              {
                valueAsNumber: true,
              }
            )}
          />

        </div>

        {/* Total */}

        <div>

          <label className="mb-2 block text-sm font-medium">
            Total
          </label>

          <Input
            value={lineTotal.toFixed(2)}
            readOnly
          />

        </div>

        {/* Delete */}

        <div className="flex items-end">

          <Button
            type="button"
            variant="destructive"
            size="icon"
            onClick={() =>
              remove(index)
            }
          >
            <Trash2 className="h-4 w-4" />
          </Button>

        </div>

      </div>

    </div>
  );
}