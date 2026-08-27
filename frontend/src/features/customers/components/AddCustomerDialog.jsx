import { useState } from "react";
import toast from "react-hot-toast";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { useCreateCustomer } from "../hooks/useCreateCustomer";

export default function AddCustomerDialog({
  open,
  onOpenChange,
  onCustomerCreated,
}) {
  const createMutation = useCreateCustomer();

  const [form, setForm] = useState({
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
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name.trim()) {
      toast.error("Customer name is required.");
      return;
    }

    if (!form.phone.trim()) {
      toast.error("Phone number is required.");
      return;
    }

    try {
      const customer = await createMutation.mutateAsync({
        ...form,
        opening_balance: Number(form.opening_balance) || 0,
        is_active: true,
      });

      toast.success("Customer added successfully!");

      onCustomerCreated?.(customer);

      setForm({
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
      });

      onOpenChange(false);

    } catch (error) {
      console.error("Failed to create customer:", error);

      const errors = error?.response?.data;

      toast.error(
        errors?.name?.[0] ||
        errors?.phone?.[0] ||
        errors?.customer_code?.[0] ||
        errors?.detail ||
        "Failed to add customer."
      );
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">

        <DialogHeader>
          <DialogTitle>
            Add New Customer
          </DialogTitle>

          <DialogDescription>
            Add customer details directly while creating the sale.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >

          {/* Customer Code + Name */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="mb-2 block text-sm font-medium">
                Customer Name *
              </label>

              <Input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Enter customer name"
              />
            </div>

          </div>

          {/* Company + Phone */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <div>
              <label className="mb-2 block text-sm font-medium">
                Company Name
              </label>

              <Input
                name="company_name"
                value={form.company_name}
                onChange={handleChange}
                placeholder="Company name"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Phone *
              </label>

              <Input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="10-digit mobile number"
                maxLength={10}
              />
            </div>

          </div>

          {/* Email + GST */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <div>
              <label className="mb-2 block text-sm font-medium">
                Email
              </label>

              <Input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="customer@email.com"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                GST Number
              </label>

              <Input
                name="gst_number"
                value={form.gst_number}
                onChange={handleChange}
                placeholder="GSTIN"
              />
            </div>

          </div>

          {/* Address */}
          <div>
            <label className="mb-2 block text-sm font-medium">
              Address
            </label>

            <Input
              name="address"
              value={form.address}
              onChange={handleChange}
              placeholder="Customer address"
            />
          </div>

          {/* City State Pincode */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

            <div>
              <label className="mb-2 block text-sm font-medium">
                City
              </label>

              <Input
                name="city"
                value={form.city}
                onChange={handleChange}
                placeholder="City"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                State
              </label>

              <Input
                name="state"
                value={form.state}
                onChange={handleChange}
                placeholder="State"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Pincode
              </label>

              <Input
                name="pincode"
                value={form.pincode}
                onChange={handleChange}
                placeholder="6-digit pincode"
                maxLength={6}
              />
            </div>

          </div>

          {/* Opening Balance */}
          <div>
            <label className="mb-2 block text-sm font-medium">
              Opening Balance
            </label>

            <Input
              name="opening_balance"
              type="number"
              min="0"
              value={form.opening_balance}
              onChange={handleChange}
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3">

            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={createMutation.isPending}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={createMutation.isPending}
            >
              {createMutation.isPending
                ? "Saving..."
                : "Save Customer"}
            </Button>

          </div>

        </form>

      </DialogContent>
    </Dialog>
  );
}