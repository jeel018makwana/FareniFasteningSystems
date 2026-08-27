from rest_framework import serializers

from .models import Purchase, PurchaseItem
from .services import PurchaseService


class PurchaseItemSerializer(serializers.ModelSerializer):

    product_name = serializers.CharField(
        source="product.name",
        read_only=True,
    )

    category_name = serializers.CharField(
        source="product.category.name",
        read_only=True,
    )

    product_type_name = serializers.CharField(
        source="product.product_type.name",
        read_only=True,
    )

    product_size_name = serializers.CharField(
        source="product.product_size.name",
        read_only=True,
    )

    product_length_name = serializers.CharField(
        source="product.product_length.name",
        read_only=True,
    )

    brand_name = serializers.CharField(
        source="product.brand.name",
        read_only=True,
    )

    standard = serializers.CharField(
        source="product.standard",
        read_only=True,
    )

    grade = serializers.CharField(
        source="product.grade",
        read_only=True,
    )

    material = serializers.CharField(
        source="product.material",
        read_only=True,
    )

    class Meta:
        model = PurchaseItem
        exclude = ("purchase",)

        read_only_fields = (
            "line_total",
            "product_name",
            "category_name",
            "product_type_name",
            "product_size_name",
            "product_length_name",
            "brand_name",
            "standard",
            "grade",
            "material",
        )


class PurchaseSerializer(serializers.ModelSerializer):

    items = PurchaseItemSerializer(
        many=True
    )

    supplier_name = serializers.CharField(
        source="supplier.name",
        read_only=True,
    )

    class Meta:
        model = Purchase
        fields = "__all__"

        read_only_fields = (
            "purchase_number",
            "subtotal",
            "gst_amount",
            "grand_total",
            "created_by",
        )

    def create(self, validated_data):

        return PurchaseService.create_purchase(
            validated_data
        )

    def update(self, instance, validated_data):

        return PurchaseService.update_purchase(
            instance,
            validated_data,
        )