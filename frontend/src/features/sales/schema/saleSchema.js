import { z } from "zod";

export const saleItemSchema = z.object({

    product: z
        .number({
            required_error: "Select a product",
        }),

    quantity: z
        .number()
        .min(1, "Quantity should be at least 1"),

    selling_price: z
        .number()
        .min(0.01, "Selling price is required"),

    gst: z
        .number()
        .min(0),

});

export const saleSchema = z.object({

    customer: z
        .number({
            required_error: "Select customer",
        }),

    sale_date: z.string().min(1, "Sale date is required"),

    discount: z.number().min(0),

    remarks: z.string().optional(),

    items: z
        .array(saleItemSchema)
        .min(1, "Add at least one product"),

});