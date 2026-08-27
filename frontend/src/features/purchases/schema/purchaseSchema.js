import { z } from "zod";

export const purchaseItemSchema = z.object({
  product: z.number({
    required_error: "Select a product",
  }),

  quantity: z
    .number()
    .min(1, "Quantity should be at least 1"),

  purchase_price: z
    .number()
    .min(0.01, "Purchase price is required"),

  gst: z
    .number()
    .min(0),
});

export const purchaseSchema = z.object({
  supplier: z.number({
    required_error: "Select supplier",
  }),

  purchase_date: z
    .string()
    .min(1, "Purchase date is required"),

  invoice_number: z
    .string()
    .min(1, "Invoice number is required"),

  discount: z
    .number()
    .min(0),

  remarks: z.string().optional(),

  items: z
    .array(purchaseItemSchema)
    .min(1, "Add at least one product"),
});