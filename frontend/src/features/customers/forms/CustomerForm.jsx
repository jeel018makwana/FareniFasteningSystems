import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";

import { customerSchema } from "../schema/customerSchema";
import { useCreateCustomer } from "../hooks/useCreateCustomer";
import { useUpdateCustomer } from "../hooks/useUpdateCustomer";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";

export default function CustomerForm({
    customer,
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
        resolver: zodResolver(customerSchema),

        defaultValues: {
            name: customer?.name || "",
            company_name: customer?.company_name || "",
            phone: customer?.phone || "",
            email: customer?.email || "",
            gst_number: customer?.gst_number || "",
            address: customer?.address || "",
            city: customer?.city || "",
            state: customer?.state || "",
            pincode: customer?.pincode || "",
            opening_balance: Number(customer?.opening_balance || 0),
            is_active: customer?.is_active ?? true,
        },
    });

    const createMutation = useCreateCustomer();
    const updateMutation = useUpdateCustomer();

    useEffect(() => {
        if (customer) {
            reset({
                name: customer.name || "",
                company_name: customer.company_name || "",
                phone: customer.phone || "",
                email: customer.email || "",
                gst_number: customer.gst_number || "",
                address: customer.address || "",
                city: customer.city || "",
                state: customer.state || "",
                pincode: customer.pincode || "",
                opening_balance: Number(customer.opening_balance || 0),
                is_active: customer.is_active ?? true,
            });
        } else {
            reset({
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
            });
        }
    }, [customer, reset]);

    const onSubmit = async (data) => {
        if (customer) {
            await updateMutation.mutateAsync({
                id: customer.id,
                data,
            });
        } else {
            await createMutation.mutateAsync(data);
        }

        reset();
        onSuccess?.();
    };

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6"
        >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Customer Name */}
                <div>
                    <label className="mb-2 block text-sm font-medium">
                        Customer Name
                    </label>

                    <Input
                        placeholder="Enter customer name"
                        {...register("name")}
                    />

                    <p className="text-sm text-red-500">
                        {errors.name?.message}
                    </p>
                </div>

                {/* Company */}
                <div>
                    <label className="mb-2 block text-sm font-medium">
                        Company Name
                    </label>

                    <Input
                        placeholder="Enter company name"
                        {...register("company_name")}
                    />
                </div>

                {/* Phone */}
                <div>
                    <label className="mb-2 block text-sm font-medium">
                        Phone
                    </label>

                    <Input
                        placeholder="Enter phone number"
                        {...register("phone")}
                    />

                    <p className="text-sm text-red-500">
                        {errors.phone?.message}
                    </p>
                </div>

                {/* Email */}
                <div>
                    <label className="mb-2 block text-sm font-medium">
                        Email
                    </label>

                    <Input
                        type="email"
                        placeholder="customer@example.com"
                        {...register("email")}
                    />

                    <p className="text-sm text-red-500">
                        {errors.email?.message}
                    </p>
                </div>

                {/* GST */}
                <div>
                    <label className="mb-2 block text-sm font-medium">
                        GST Number
                    </label>

                    <Input
                        placeholder="27ABCDE1234F1Z5"
                        {...register("gst_number")}
                    />

                    <p className="text-sm text-red-500">
                        {errors.gst_number?.message}
                    </p>
                </div>

                {/* City */}
                <div>
                    <label className="mb-2 block text-sm font-medium">
                        City
                    </label>

                    <Input
                        placeholder="Pune"
                        {...register("city")}
                    />

                    <p className="text-sm text-red-500">
                        {errors.city?.message}
                    </p>
                </div>

                {/* State */}
                <div>
                    <label className="mb-2 block text-sm font-medium">
                        State
                    </label>

                    <Input
                        placeholder="Maharashtra"
                        {...register("state")}
                    />

                    <p className="text-sm text-red-500">
                        {errors.state?.message}
                    </p>
                </div>

                {/* Pincode */}
                <div>
                    <label className="mb-2 block text-sm font-medium">
                        Pincode
                    </label>

                    <Input
                        placeholder="411001"
                        {...register("pincode")}
                    />

                    <p className="text-sm text-red-500">
                        {errors.pincode?.message}
                    </p>
                </div>

                {/* Opening Balance */}
                <div>
                    <label className="mb-2 block text-sm font-medium">
                        Opening Balance
                    </label>

                    <Input
                        type="number"
                        step="0.01"
                        min="0"
                        {...register("opening_balance", {
                            valueAsNumber: true,
                        })}
                    />

                    <p className="text-sm text-red-500">
                        {errors.opening_balance?.message}
                    </p>
                </div>

                {/* Active */}
                <div className="flex items-center gap-3 md:mt-7">
                    <Checkbox
                        checked={watch("is_active")}
                        onCheckedChange={(checked) =>
                            setValue("is_active", checked)
                        }
                    />

                    <label className="text-sm font-medium">
                        Active Customer
                    </label>
                </div>

            </div>

            {/* Address */}
            <div>
                <label className="mb-2 block text-sm font-medium">
                    Address
                </label>

                <Textarea
                    rows={4}
                    placeholder="Enter complete address"
                    {...register("address")}
                />

                <p className="text-sm text-red-500">
                    {errors.address?.message}
                </p>
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-3 border-t pt-5">

                <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                        reset();
                        onSuccess?.();
                    }}
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
                        : customer
                        ? "Update Customer"
                        : "Save Customer"}
                </Button>
            </div>
            
        </form>
    );
}