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

export default function SaleItemRow({
  index,
  products,
  register,
  watch,
  setValue,
  remove,
}) {
  /*
   * ========================================================
   * SELECTED VALUES
   * ========================================================
   */

  const selectedCategoryId = watch(
    `items.${index}.category`
  );

  const selectedProductTypeId = watch(
    `items.${index}.product_type`
  );

  const selectedProductSizeId = watch(
    `items.${index}.product_size`
  );

  const selectedProductLengthId = watch(
    `items.${index}.product_length`
  );

  const selectedProductId = watch(
    `items.${index}.product`
  );

  /*
   * ========================================================
   * FILTER PRODUCTS
   * ========================================================
   *
   * Product will only be shown when it matches:
   *
   * Category
   *     ↓
   * Product Type
   *     ↓
   * Size
   *     ↓
   * Length
   *
   * This assumes your Product API returns these fields
   * on each product object.
   */

  const filteredProducts = products.filter(
    (product) => {
      /*
       * No category selected
       * => no products
       */
      if (!selectedCategoryId) {
        return false;
      }

      /*
       * CATEGORY
       */

      const productCategoryId =
        product.category?.id ??
        product.category;

      if (
        Number(productCategoryId) !==
        Number(selectedCategoryId)
      ) {
        return false;
      }

      /*
       * PRODUCT TYPE
       */

      if (selectedProductTypeId) {
        const productTypeId =
          product.product_type?.id ??
          product.product_type;

        if (
          Number(productTypeId) !==
          Number(selectedProductTypeId)
        ) {
          return false;
        }
      } else {
        return false;
      }

      /*
       * PRODUCT SIZE
       */

      if (selectedProductSizeId) {
        const productSizeId =
          product.product_size?.id ??
          product.product_size;

        if (
          Number(productSizeId) !==
          Number(selectedProductSizeId)
        ) {
          return false;
        }
      } else {
        return false;
      }

      /*
       * PRODUCT LENGTH
       */

      if (selectedProductLengthId) {
        const productLengthId =
          product.product_length?.id ??
          product.product_length;

        if (
          Number(productLengthId) !==
          Number(selectedProductLengthId)
        ) {
          return false;
        }
      } else {
        return false;
      }

      return true;
    }
  );

  /*
   * ========================================================
   * QUANTITY
   * ========================================================
   */

  const quantity =
    Number(
      watch(
        `items.${index}.quantity`
      )
    ) || 0;

  /*
   * ========================================================
   * SELLING PRICE
   * ========================================================
   */

  const sellingPrice =
    Number(
      watch(
        `items.${index}.selling_price`
      )
    ) || 0;

  /*
   * ========================================================
   * LINE TOTAL
   * ========================================================
   */

  const lineTotal =
    quantity * sellingPrice;

  /*
   * ========================================================
   * PRODUCT CHANGE
   * ========================================================
   */

  const handleProductChange = (
    value
  ) => {
    const product =
      products.find(
        (p) =>
          p.id === Number(value)
      );

    setValue(
      `items.${index}.product`,
      Number(value),
      {
        shouldValidate: true,
      }
    );

    /*
     * Automatically set selling price
     */

    if (product) {
      setValue(
        `items.${index}.selling_price`,
        Number(
          product.selling_price
        )
      );

      /*
       * Automatically set GST
       */

      setValue(
        `items.${index}.gst`,
        Number(product.gst)
      );
    }
  };

  return (
    <div className="grid grid-cols-14 gap-4 items-end border rounded-lg p-4">

      {/* ====================================================
          PRODUCT
      ==================================================== */}

      <div className="col-span-4">

        <label className="text-sm font-medium mb-2 block">
          Product
        </label>

        <Select
          value={
            selectedProductId
              ?.toString() || ""
          }
          disabled={
            !selectedProductLengthId
          }
          onValueChange={
            handleProductChange
          }
        >

          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select Product" />
          </SelectTrigger>

          <SelectContent className="max-h-72">

            {filteredProducts.length > 0 ? (
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
            ) : (
              <div className="px-3 py-2 text-sm text-muted-foreground">
                No products found
              </div>
            )}

          </SelectContent>

        </Select>

      </div>

      {/* ====================================================
          QUANTITY
      ==================================================== */}

      <div className="col-span-1">

        <label className="text-sm font-medium mb-2 block">
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

      {/* ====================================================
          PRICE
      ==================================================== */}

      <div className="col-span-2">

        <label className="text-sm font-medium mb-2 block">
          Price
        </label>

        <Input
          type="number"
          step="0.01"
          {...register(
            `items.${index}.selling_price`,
            {
              valueAsNumber: true,
            }
          )}
        />

      </div>

      {/* ====================================================
          GST
      ==================================================== */}

      <div className="col-span-1">

        <label className="text-sm font-medium mb-2 block">
          GST
        </label>

        <Input
          type="number"
          {...register(
            `items.${index}.gst`,
            {
              valueAsNumber: true,
            }
          )}
        />

      </div>

      {/* ====================================================
          TOTAL
      ==================================================== */}

      <div className="col-span-3">

        <label className="text-sm font-medium mb-2 block">
          Total
        </label>

        <Input
          value={lineTotal.toFixed(2)}
          readOnly
        />

      </div>

      {/* ====================================================
          DELETE
      ==================================================== */}

      <div className="col-span-1">

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
  );
}