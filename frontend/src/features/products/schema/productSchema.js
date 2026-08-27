import { z } from "zod";

export const productSchema = z
  .object({
    product_code: z
      .string()
      .trim()
      .min(2, "Product code is required"),

    name: z
      .string()
      .trim()
      .min(2, "Product name is required"),

    category: z.coerce
      .number()
      .positive("Category is required"),
    
    product_type: z.coerce
      .number()
      .positive("Product type is requires"),
    
    product_size: z.coerce
      .number()
      .positive("Product size is required"),

    product_length: z.coerce
      .number()
      .positive("Product length is required"),

    brand: z.coerce
      .number()
      .positive("Brand is required"),

    standard: z
      .string()
      .trim()
      .optional(),

    grade: z
      .string()
      .trim()
      .optional(),

    thread_pitch: z
      .string()
      .trim()
      .optional(),

    material: z
      .string()
      .trim()
      .optional(),

    unit: z
      .string()
      .min(1, "Unit is required"),

    purchase_price: z.coerce
      .number()
      .min(0, "Purchase price cannot be negative"),

    selling_price: z.coerce
      .number()
      .positive("Selling price must be greater than 0"),

    gst: z.coerce
      .number()
      .min(0, "GST cannot be negative")
      .max(100, "GST cannot exceed 100%"),

    minimum_stock: z.coerce
      .number()
      .int("Minimum stock must be a whole number")
      .min(0, "Minimum stock cannot be negative"),

    current_stock: z.coerce
      .number()
      .int("Current stock must be a whole number")
      .min(0, "Current stock cannot be negative"),

    is_active: z.boolean().default(true),
  })

  .refine(
    (data) =>
      data.selling_price >= data.purchase_price,
    {
      message:
        "Selling price cannot be less than purchase price",
      path: ["selling_price"],
    }
  );