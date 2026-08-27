import { z } from "zod";

export const customerSchema = z.object({
    name: z
        .string()
        .min(2, "Customer name is required"),

    company_name: z
        .string()
        .optional(),

    phone: z
        .string()
        .regex(
            /^[6-9]\d{9}$/,
            "Enter a valid 10-digit mobile number"
        ),

    email: z
        .string()
        .email("Invalid email address")
        .or(z.literal("")),

    gst_number: z
        .string()
        .optional(),

    address: z
        .string()
        .optional(),

    city: z
        .string()
        .optional(),

    state: z
        .string()
        .optional(),

    pincode: z
        .string()
        .regex(
            /^(\d{6})?$/,
            "Enter a valid 6-digit pincode"
        )
        .optional(),

    opening_balance: z
        .number()
        .min(0, "Opening balance cannot be negative")
        .optional(),

    is_active: z
        .boolean()
        .default(true),

});