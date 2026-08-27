import { supplierSchema } from "../schema/supplierSchema";
import { useCreateSupplier } from "../hooks/useCreateSupplier";
import { useUpdateSupplier } from "../hooks/useUpdateSupplier";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function SupplierForm({
  supplier,
  onSuccess,
}) {
  const createMutation = useCreateSupplier();
  const updateMutation = useUpdateSupplier();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(supplierSchema),

    defaultValues: {
      supplier_code: supplier?.supplier_code || "",
      name: supplier?.name || "",
      company_name: supplier?.company_name || "",
      phone: supplier?.phone || "",
      email: supplier?.email || "",
      gst_number: supplier?.gst_number || "",
      address: supplier?.address || "",
    },
  });

  const isPending =
    createMutation.isPending ||
    updateMutation.isPending;

  const onSubmit = async (data) => {
    try {
      console.log("Supplier data:", data);

      if (supplier) {
        await updateMutation.mutateAsync({
          id: supplier.id,
          data,
        });
      } else {
        await createMutation.mutateAsync(data);
      }

      reset();
      onSuccess?.();

    } catch (error) {
        console.error(
            "Supplier save error:",
            error
        );

        console.log(
            "VALIDATION ERRORS:",
            JSON.stringify(
            error?.response?.data?.errors,
            null,
            2
            )
        );
        }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6"
    >

      {/* Supplier Details */}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

        {/* Supplier Code */}

        <div>
          <label className="mb-2 block text-sm font-medium">
            Supplier Code
          </label>

          <Input
            placeholder="SUP001"
            {...register("supplier_code")}
          />

          {errors.supplier_code && (
            <p className="mt-1 text-sm text-red-500">
              {errors.supplier_code.message}
            </p>
          )}
        </div>

        {/* Supplier Name */}

        <div>
          <label className="mb-2 block text-sm font-medium">
            Supplier Name
          </label>

          <Input
            placeholder="Supplier name"
            {...register("name")}
          />

          {errors.name && (
            <p className="mt-1 text-sm text-red-500">
              {errors.name.message}
            </p>
          )}
        </div>

        {/* Company */}

        <div>
          <label className="mb-2 block text-sm font-medium">
            Company Name
          </label>

          <Input
            placeholder="Company name"
            {...register("company_name")}
          />

          {errors.company_name && (
            <p className="mt-1 text-sm text-red-500">
              {errors.company_name.message}
            </p>
          )}
        </div>

        {/* Phone */}

        <div>
          <label className="mb-2 block text-sm font-medium">
            Phone
          </label>

          <Input
            placeholder="10-digit mobile number"
            {...register("phone")}
          />

          {errors.phone && (
            <p className="mt-1 text-sm text-red-500">
              {errors.phone.message}
            </p>
          )}
        </div>

        {/* Email */}

        <div>
          <label className="mb-2 block text-sm font-medium">
            Email
          </label>

          <Input
            type="email"
            placeholder="supplier@example.com"
            {...register("email")}
          />

          {errors.email && (
            <p className="mt-1 text-sm text-red-500">
              {errors.email.message}
            </p>
          )}
        </div>

        {/* GST */}

        <div>
          <label className="mb-2 block text-sm font-medium">
            GST Number
          </label>

          <Input
            placeholder="GST number"
            {...register("gst_number")}
          />

          {errors.gst_number && (
            <p className="mt-1 text-sm text-red-500">
              {errors.gst_number.message}
            </p>
          )}
        </div>

      </div>

      {/* Address */}

      <div>
        <label className="mb-2 block text-sm font-medium">
          Address
        </label>

        <Textarea
          rows={4}
          placeholder="Supplier address"
          {...register("address")}
        />

        {errors.address && (
          <p className="mt-1 text-sm text-red-500">
            {errors.address.message}
          </p>
        )}
      </div>

      {/* Buttons */}

      <div className="flex justify-end gap-2">

        <Button
          type="button"
          variant="outline"
          onClick={onSuccess}
          disabled={isPending}
        >
          Cancel
        </Button>

        <Button
          type="submit"
          disabled={isPending}
        >
          {isPending
            ? "Saving..."
            : supplier
              ? "Update Supplier"
              : "Save Supplier"}
        </Button>

      </div>

    </form>
  );
}