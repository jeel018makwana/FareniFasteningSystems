from rest_framework import serializers
from .models import Customer
import re


class CustomerSerializer(serializers.ModelSerializer):

    class Meta:
        model = Customer
        fields = "__all__"

        extra_kwargs = {
            "customer_code": {
                "required": False,
                "read_only": True,
            }
        }
    def create(self, validated_data):
        last_customer = (
            Customer.objects.order_by("-id").first()
        )

        if last_customer:
            try:
                last_number = int(
                    last_customer.customer_code.split("-")[-1]
                )
                next_number = last_number + 1
            except (ValueError, AttributeError):
                next_number = 1
        else:
            next_number = 1

        validated_data["customer_code"] = f"CUST-{next_number:03d}"

        return Customer.objects.create(**validated_data)
    
    def validate_name(self, value):
        value = value.strip()

        if len(value) < 2:
            raise serializers.ValidationError(
                "Customer name must be at least 2 characters."
            )

        return value

    def validate_phone(self, value):

        if not re.fullmatch(r"[6-9]\d{9}", value):
            raise serializers.ValidationError(
                "Enter a valid 10-digit Indian mobile number."
            )

        return value

    def validate_gst_number(self, value):

        if value:
            pattern = r"^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[A-Z0-9]{3}$"

            if not re.fullmatch(pattern, value):
                raise serializers.ValidationError(
                    "Invalid GST Number."
                )

        return value

    def validate_opening_balance(self, value):

        if value < 0:
            raise serializers.ValidationError(
                "Opening balance cannot be negative."
            )

        return value

    def validate_pincode(self, value):

        if value:

            if not re.fullmatch(r"\d{6}", value):
                raise serializers.ValidationError(
                    "Pincode must be 6 digits."
                )

        return value