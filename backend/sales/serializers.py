from rest_framework import serializers
from django.db import transaction

from .models import Sale, SaleItem
from .services import SaleService
from customers.models import Customer
from customers.serializers import CustomerSerializer

class SaleItemSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(
        source="product.name",
        read_only=True,
    )

    product_length = serializers.CharField(
        source="product.product_length.name",
        read_only=True,
    )

    grade = serializers.CharField(
        source="product.grade",
        read_only=True,
    )

    class Meta:
        model = SaleItem
        exclude = ("sale",)

        read_only_fields = (
            "line_total",
            "product_name",
            "product_length",
            "grade",
        )

class SaleSerializer(serializers.ModelSerializer):
    items = SaleItemSerializer(many=True)
    customer = serializers.PrimaryKeyRelatedField(
        queryset = Customer.objects.all(),
        required = False,
    )

    customer_name = serializers.CharField(
        source="customer.name",
        read_only = True,
    )
    customer_details = CustomerSerializer(
        write_only = True,
        required=False,
    )
    class Meta:
        model = Sale
        fields = [
            "id",
            "sale_number",
            "customer",
            "customer_name",
            "customer_details",
            "sale_date",
            "subtotal",
            "gst_amount",
            "discount",
            "grand_total",
            "remarks",
            "items",
            "created_at",
            "updated_at",
        ]
        read_only_fields = (
            "sale_number",
            "subtotal",
            "gst_amount",
            "grand_total",
            "created_by",
        )

    def validate(self, attrs):

        customer = attrs.get("customer")
        customer_details = attrs.get("customer_details")

        # Existing customer OR new customer
        if not customer and not customer_details:
            raise serializers.ValidationError(
                {
                    "customer":
                    "Select an existing customer or provide new customer details."
                }
            )

        # Don't allow both
        if customer and customer_details:
            raise serializers.ValidationError(
                {
                    "customer":
                    "Use either an existing customer or new customer details, not both."
                }
            )

        return attrs

    
    @transaction.atomic
    def create(self, validated_data):

        items_data = validated_data.pop("items")

        customer_details = validated_data.pop(
            "customer_details",
            None,
        )

        if customer_details:
            customer = Customer.objects.create(
                **customer_details
            )

            validated_data["customer"] = customer


        sale = Sale.objects.create(**validated_data)

        for item_data in items_data:

            quantity = item_data["quantity"]
            selling_price = item_data["selling_price"]

            line_total = quantity * selling_price

            SaleItem.objects.create(
                sale=sale,
                line_total=line_total,
                **item_data,
            )

        SaleService.deduct_stock(sale)
        SaleService.calculate_totals(sale)

        return sale
    
    @transaction.atomic
    def update(self, instance, validated_data):

        return SaleService.update_sale(
            instance,
            validated_data,
        )