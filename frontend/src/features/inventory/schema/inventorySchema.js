import { z } from "zod";

export const inventorySchema = z.object({
  product: z.number({
    required_error: "Product is required",
  }),

  transaction_type: z.string().min(1, "Transaction type is required"),

  quantity: z
    .number({
      required_error: "Quantity is required",
    })
    .positive("Quantity must be greater than 0"),

  reference: z
    .string()
    .max(100, "Reference cannot exceed 100 characters")
    .optional(),

  remarks: z.string().optional(),
});