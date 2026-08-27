import { useEffect, useState } from "react";

import {
  useForm,
  useFieldArray,
} from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import { saleSchema } from "../schema/saleSchema";

import { useCreateSale } from "../hooks/useCreateSale";
import { useUpdateSale } from "../hooks/useUpdateSale";
import { useCustomers } from "@/features/customers/hooks/useCustomers";
import { useAllProducts } from "@/features/products/hooks/useAllProducts";
import AddCustomerDialog from "@/features/customers/components/AddCustomerDialog";
import SaleItemRow from "../components/SaleItemRow";
import SaleSummary from "../components/SaleSummary";

import {
  getCategories,
  getProductTypes,
  getProductSizes,
  getProductLengths,
} from "@/features/products/api/productApi";

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

export default function SaleForm({
  sale,
  onSuccess,
  onCreated,
}) {
  const [customerDialogOpen, setCustomerDialogOpen] =
    useState(false);

  const createSaleMutation = useCreateSale();
  const updateSaleMutation = useUpdateSale();

  const { data: customers } = useCustomers({
    page_size: 1000,
  });

  const customerList = customers?.results || [];

  const { data: products } = useAllProducts();
  const productList = products?.results || [];

  const [categories, setCategories] = useState([]);

  /*
   * IMPORTANT:
   * Dropdown data is now stored row-wise.
   *
   * Example:
   * productTypes[0] = types for row 0
   * productTypes[1] = types for row 1
   */
  const [productTypes, setProductTypes] = useState({});
  const [productSizes, setProductSizes] = useState({});
  const [productLengths, setProductLengths] = useState({});

  /*
   * ========================================================
   * LOAD CATEGORIES
   * ========================================================
   */
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await getCategories();

        setCategories(
          response?.results || response || []
        );
      } catch (error) {
        console.error(
          "Failed to load categories:",
          error
        );
      }
    };

    loadCategories();
  }, []);

  const {
    register,
    control,
    watch,
    reset,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(saleSchema),

    defaultValues: {
      customer: "",

      customer_details: {
        name: "",
        company_name: "",
        phone: "",
        email: "",
        gst_number: "",
        address: "",
        city: "",
        state: "",
        pincode: "",
        opening_balance: 0,
        is_active: true,
      },

      sale_date: new Date()
        .toISOString()
        .split("T")[0],

      discount: 0,

      remarks: "",

      items: [
        {
          category: "",
          product_type: "",
          product_size: "",
          product_length: "",
          product: "",
          quantity: 1,
          selling_price: 0,
          gst: 18,
        },
      ],
    },
  });

  const {
    fields,
    append,
    remove,
  } = useFieldArray({
    control,
    name: "items",
  });

  const items = watch("items");
  const discount = watch("discount") || 0;

  /*
   * ========================================================
   * TOTALS
   * ========================================================
   */

  const subtotal = items.reduce(
    (sum, item) => {
      const qty = Number(item.quantity) || 0;
      const price =
        Number(item.selling_price) || 0;

      return sum + qty * price;
    },
    0
  );

  const gstAmount = items.reduce(
    (sum, item) => {
      const qty = Number(item.quantity) || 0;
      const price =
        Number(item.selling_price) || 0;
      const gst = Number(item.gst) || 0;

      const total = qty * price;

      return sum + (total * gst) / 100;
    },
    0
  );

  const grandTotal =
    subtotal +
    gstAmount -
    Number(discount);

  /*
   * ========================================================
   * EDIT SALE
   * ========================================================
   */

  useEffect(() => {
    if (!sale) return;

    const saleItems =
      sale.items?.map((item) => ({
        ...item,

        category:
          item.category || "",

        product_type:
          item.product_type || "",

        product_size:
          item.product_size || "",

        product_length:
          item.product_length || "",

        product:
          item.product || "",

        quantity:
          Number(item.quantity) || 1,

        selling_price:
          Number(item.selling_price) || 0,

        gst:
          Number(item.gst) || 18,
      })) || [];

    reset({
      ...sale,

      customer:
        sale.customer || "",

      discount:
        Number(sale.discount) || 0,

      remarks:
        sale.remarks || "",

      items:
        saleItems.length > 0
          ? saleItems
          : [
              {
                category: "",
                product_type: "",
                product_size: "",
                product_length: "",
                product: "",
                quantity: 1,
                selling_price: 0,
                gst: 18,
              },
            ],
    });
  }, [sale, reset]);

  /*
   * ========================================================
   * CATEGORY CHANGE
   * ========================================================
   */

  const handleCategoryChange = async (
    index,
    categoryId
  ) => {
    const numericCategoryId =
      Number(categoryId);

    setValue(
      `items.${index}.category`,
      numericCategoryId,
      {
        shouldValidate: true,
      }
    );

    /*
     * Reset dependent fields
     */
    setValue(
      `items.${index}.product_type`,
      ""
    );

    setValue(
      `items.${index}.product_size`,
      ""
    );

    setValue(
      `items.${index}.product_length`,
      ""
    );

    setValue(
      `items.${index}.product`,
      ""
    );

    /*
     * Reset only this row's dropdown data
     */
    setProductTypes((prev) => ({
      ...prev,
      [index]: [],
    }));

    setProductSizes((prev) => ({
      ...prev,
      [index]: [],
    }));

    setProductLengths((prev) => ({
      ...prev,
      [index]: [],
    }));

    if (!categoryId) return;

    try {
      const response =
        await getProductTypes(
          numericCategoryId
        );

      setProductTypes((prev) => ({
        ...prev,
        [index]:
          response?.results ||
          response ||
          [],
      }));
    } catch (error) {
      console.error(
        "Failed to load product types:",
        error
      );
    }
  };

  /*
   * ========================================================
   * PRODUCT TYPE CHANGE
   * ========================================================
   */

  const handleProductTypeChange = async (
    index,
    typeId
  ) => {
    const numericTypeId =
      Number(typeId);

    setValue(
      `items.${index}.product_type`,
      numericTypeId
    );

    setValue(
      `items.${index}.product_size`,
      ""
    );

    setValue(
      `items.${index}.product_length`,
      ""
    );

    setValue(
      `items.${index}.product`,
      ""
    );

    setProductSizes((prev) => ({
      ...prev,
      [index]: [],
    }));

    setProductLengths((prev) => ({
      ...prev,
      [index]: [],
    }));

    if (!typeId) return;

    try {
      const response =
        await getProductSizes(
          numericTypeId
        );

      setProductSizes((prev) => ({
        ...prev,
        [index]:
          response?.results ||
          response ||
          [],
      }));
    } catch (error) {
      console.error(
        "Failed to load product sizes:",
        error
      );
    }
  };

  /*
   * ========================================================
   * PRODUCT SIZE CHANGE
   * ========================================================
   */

  const handleProductSizeChange = async (
    index,
    sizeId
  ) => {
    const numericSizeId =
      Number(sizeId);

    setValue(
      `items.${index}.product_size`,
      numericSizeId
    );

    setValue(
      `items.${index}.product_length`,
      ""
    );

    setValue(
      `items.${index}.product`,
      ""
    );

    setProductLengths((prev) => ({
      ...prev,
      [index]: [],
    }));

    if (!sizeId) return;

    try {
      const response =
        await getProductLengths(
          numericSizeId
        );

      setProductLengths((prev) => ({
        ...prev,
        [index]:
          response?.results ||
          response ||
          [],
      }));
    } catch (error) {
      console.error(
        "Failed to load product lengths:",
        error
      );
    }
  };

  /*
   * ========================================================
   * PRODUCT LENGTH CHANGE
   * ========================================================
   */

  const handleProductLengthChange = (
    index,
    lengthId
  ) => {
    setValue(
      `items.${index}.product_length`,
      Number(lengthId)
    );

    setValue(
      `items.${index}.product`,
      ""
    );
  };

  /*
   * ========================================================
   * SUBMIT
   * ========================================================
   */

  const onSubmit = async (data) => {
    try {
      const saleData = {
        customer: data.customer,

        sale_date: data.sale_date,

        discount:
          Number(data.discount || 0),

        remarks:
          data.remarks || "",

        items: data.items.map(
          (item) => ({
            product:
              Number(item.product),

            quantity:
              Number(item.quantity),

            selling_price:
              Number(
                item.selling_price
              ),

            gst:
              Number(item.gst),
          })
        ),
      };

      if (sale) {
        await updateSaleMutation.mutateAsync(
          {
            id: sale.id,
            data: saleData,
          }
        );
      } else {
        await createSaleMutation.mutateAsync(
          saleData
        );
      }

      reset();

      /*
       * Keep existing success behaviour
       */
      onSuccess?.();

      /*
       * Keep onCreated prop available
       * without changing existing flow.
       */
      onCreated?.();
    } catch (error) {
      console.error(
        "Sale creation failed:",
        error?.response?.data ||
          error
      );
    }
  };

  /*
   * ========================================================
   * RENDER
   * ========================================================
   */

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6"
    >
      {/* ====================================================
          TOP SECTION
      ==================================================== */}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* CUSTOMER */}

        <div className="space-y-3">

          <div className="flex items-center justify-between">

            <label className="text-sm font-medium">
              Customer
            </label>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() =>
                setCustomerDialogOpen(
                  true
                )
              }
            >
              + Add New Customer
            </Button>

          </div>

          <Select
            value={
              watch("customer")
                ?.toString() || ""
            }
            onValueChange={(value) =>
              setValue(
                "customer",
                Number(value),
                {
                  shouldValidate: true,
                }
              )
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Customer" />
            </SelectTrigger>

            <SelectContent>

              {customerList.map(
                (customer) => (
                  <SelectItem
                    key={customer.id}
                    value={customer.id.toString()}
                  >
                    {customer.name}

                    {customer.company_name
                      ? ` - ${customer.company_name}`
                      : ""}
                  </SelectItem>
                )
              )}

            </SelectContent>
          </Select>

          <p className="text-sm text-red-500">
            {errors.customer?.message}
          </p>

        </div>

        {/* SALE DATE */}

        <div>
          <label className="mb-2 block text-sm font-medium">
            Sale Date
          </label>

          <Input
            className="w-full"
            type="date"
            {...register("sale_date")}
          />
        </div>

      </div>

      {/* ====================================================
          PRODUCTS
      ==================================================== */}

      <div className="space-y-4">

        {fields.map(
          (field, index) => (
            <div
              key={field.id}
              className="space-y-3"
            >

              {/* CATEGORY */}

              <div>
                <label className="text-sm font-medium mb-2 block">
                  Category
                </label>

                <Select
                  value={
                    watch(
                      `items.${index}.category`
                    )?.toString() || ""
                  }
                  onValueChange={(value) =>
                    handleCategoryChange(
                      index,
                      value
                    )
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>

                  <SelectContent>

                    {categories.map(
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

              {/* PRODUCT TYPE */}

              <div>
                <label className="text-sm font-medium mb-2 block">
                  Product Type
                </label>

                <Select
                  value={
                    watch(
                      `items.${index}.product_type`
                    )?.toString() || ""
                  }
                  disabled={
                    !watch(
                      `items.${index}.category`
                    )
                  }
                  onValueChange={(value) =>
                    handleProductTypeChange(
                      index,
                      value
                    )
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Type" />
                  </SelectTrigger>

                  <SelectContent>

                    {(
                      productTypes[index] ||
                      []
                    ).map((type) => (
                      <SelectItem
                        key={type.id}
                        value={type.id.toString()}
                      >
                        {type.name}
                      </SelectItem>
                    ))}

                  </SelectContent>
                </Select>
              </div>

              {/* PRODUCT SIZE */}

              <div>
                <label className="text-sm font-medium mb-2 block">
                  Size
                </label>

                <Select
                  value={
                    watch(
                      `items.${index}.product_size`
                    )?.toString() || ""
                  }
                  disabled={
                    !watch(
                      `items.${index}.product_type`
                    )
                  }
                  onValueChange={(value) =>
                    handleProductSizeChange(
                      index,
                      value
                    )
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Size" />
                  </SelectTrigger>

                  <SelectContent>

                    {(
                      productSizes[index] ||
                      []
                    ).map((size) => (
                      <SelectItem
                        key={size.id}
                        value={size.id.toString()}
                      >
                        {size.name}
                      </SelectItem>
                    ))}

                  </SelectContent>
                </Select>
              </div>

              {/* LENGTH */}

              <div>
                <label className="text-sm font-medium mb-2 block">
                  Length
                </label>

                <Select
                  value={
                    watch(
                      `items.${index}.product_length`
                    )?.toString() || ""
                  }
                  disabled={
                    !watch(
                      `items.${index}.product_size`
                    )
                  }
                  onValueChange={(value) =>
                    handleProductLengthChange(
                      index,
                      value
                    )
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Length" />
                  </SelectTrigger>

                  <SelectContent>

                    {(
                      productLengths[index] ||
                      []
                    ).map((length) => (
                      <SelectItem
                        key={length.id}
                        value={length.id.toString()}
                      >
                        {length.name}
                      </SelectItem>
                    ))}

                  </SelectContent>
                </Select>
              </div>

              {/* SALE ITEM */}

              <SaleItemRow
                index={index}
                products={productList}
                register={register}
                watch={watch}
                setValue={setValue}
                remove={remove}
              />

            </div>
          )
        )}

        {/* ADD PRODUCT */}

        <Button
          type="button"
          variant="outline"
          onClick={() =>
            append({
              category: "",
              product_type: "",
              product_size: "",
              product_length: "",
              product: "",
              quantity: 1,
              selling_price: 0,
              gst: 18,
            })
          }
        >
          + Add Product
        </Button>

      </div>

      {/* ====================================================
          DISCOUNT
      ==================================================== */}

      <div>
        <label className="mb-2 block text-sm font-medium">
          Discount
        </label>

        <Input
          className="w-full"
          type="number"
          {...register("discount", {
            valueAsNumber: true,
          })}
        />
      </div>

      {/* ====================================================
          REMARKS
      ==================================================== */}

      <div>
        <label className="mb-2 block text-sm font-medium">
          Remarks
        </label>

        <Textarea
          rows={4}
          {...register("remarks")}
        />
      </div>

      {/* ====================================================
          SUMMARY
      ==================================================== */}

      <SaleSummary
        subtotal={subtotal}
        gstAmount={gstAmount}
        discount={watch("discount")}
        grandTotal={grandTotal}
      />

      {/* ====================================================
          BUTTONS
      ==================================================== */}

      <div className="flex justify-end gap-3">

        <Button
          type="button"
          variant="outline"
          onClick={onSuccess}
        >
          Cancel
        </Button>

        <Button
          type="submit"
          disabled={
            createSaleMutation.isPending ||
            updateSaleMutation.isPending
          }
        >
          {createSaleMutation.isPending ||
          updateSaleMutation.isPending
            ? "Saving..."
            : sale
            ? "Update Sale"
            : "Save Sale"}
        </Button>

      </div>

      {/* ====================================================
          ADD CUSTOMER DIALOG
      ==================================================== */}

      <AddCustomerDialog
        open={customerDialogOpen}
        onOpenChange={
          setCustomerDialogOpen
        }
        onCustomerCreated={(customer) => {
          setValue(
            "customer",
            customer.id,
            {
              shouldValidate: true,
            }
          );

          setCustomerDialogOpen(false);
        }}
      />

    </form>
  );
}
