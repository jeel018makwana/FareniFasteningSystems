from rest_framework import serializers

from .models import (
    Category,
    ProductType,
    ProductSize,
    ProductLength,
    Brand,
    Product,
)


class CategorySerializer(serializers.ModelSerializer):

    class Meta:
        model = Category
        fields = "__all__"


class ProductTypeSerializer(serializers.ModelSerializer):

    category_name = serializers.CharField(
        source="category.name",
        read_only=True,
    )

    class Meta:
        model = ProductType
        fields = "__all__"


class ProductSizeSerializer(serializers.ModelSerializer):

    product_type_name = serializers.CharField(
        source="product_type.name",
        read_only=True,
    )

    category_name = serializers.CharField(
        source="product_type.category.name",
        read_only=True,
    )

    class Meta:
        model = ProductSize
        fields = "__all__"

class ProductLengthSerializer(serializers.ModelSerializer):

    product_size_name = serializers.CharField(
        source="product_size.name",
        read_only=True,
    )

    product_type_name = serializers.CharField(
        source="product_size.product_type.name",
        read_only=True,
    )

    category_name = serializers.CharField(
        source="product_size.product_type.category.name",
        read_only=True,
    )

    class Meta:
        model = ProductLength

        fields = "__all__"

class BrandSerializer(serializers.ModelSerializer):

    class Meta:
        model = Brand
        fields = "__all__"


class ProductSerializer(serializers.ModelSerializer):

    category_name = serializers.CharField(
        source="category.name",
        read_only=True,
    )

    product_type_name = serializers.CharField(
        source="product_type.name",
        read_only=True,
    )

    product_size_name = serializers.CharField(
        source="product_size.name",
        read_only=True,
    )

    product_length_name = serializers.CharField(
        source="product_length.name",
        read_only=True,
    )

    brand_name = serializers.CharField(
        source="brand.name",
        read_only=True,
    )

    class Meta:
        model = Product

        fields = "__all__"

    # ---------------------------------
    # Basic validation
    # ---------------------------------

    def validate_name(self, value):

        if len(value.strip()) < 2:
            raise serializers.ValidationError(
                "Product name must contain at least 2 characters."
            )

        return value

    # ---------------------------------
    # Price validation
    # ---------------------------------

    def validate_purchase_price(self, value):

        if value < 0:
            raise serializers.ValidationError(
                "Purchase price cannot be negative."
            )

        return value

    def validate_selling_price(self, value):

        if value <= 0:
            raise serializers.ValidationError(
                "Selling price must be greater than 0."
            )

        return value

    # ---------------------------------
    # GST validation
    # ---------------------------------

    def validate_gst(self, value):

        if value < 0 or value > 100:
            raise serializers.ValidationError(
                "GST must be between 0 and 100."
            )

        return value

    # ---------------------------------
    # Stock validation
    # ---------------------------------

    def validate_current_stock(self, value):

        if value < 0:
            raise serializers.ValidationError(
                "Current stock cannot be negative."
            )

        return value

    # ---------------------------------
    # Object validation
    # ---------------------------------

    def validate(self, attrs):

        purchase_price = attrs.get(
            "purchase_price"
        )

        selling_price = attrs.get(
            "selling_price"
        )

        category = attrs.get(
            "category"
        )

        product_type = attrs.get(
            "product_type"
        )

        product_size = attrs.get(
            "product_size"
        )

        product_length = attrs.get(
            "product_length"
        )


        # ---------------------------------
        # Selling price >= purchase price
        # ---------------------------------

        if (
            purchase_price is not None
            and selling_price is not None
            and selling_price < purchase_price
        ):
            raise serializers.ValidationError(
                {
                    "selling_price":
                        "Selling price should not be less than purchase price."
                }
            )

        # ---------------------------------
        # Product Type must belong to
        # selected Category
        # ---------------------------------

        if (
            category
            and product_type
            and product_type.category_id != category.id
        ):
            raise serializers.ValidationError(
                {
                    "product_type":
                        "Selected product type does not belong to the selected category."
                }
            )

        # ---------------------------------
        # Product Size must belong to
        # selected Product Type
        # ---------------------------------

        if (
            product_size
            and product_type
            and product_size.product_type_id != product_type.id
        ):
            raise serializers.ValidationError(
                {
                    "product_size":
                        "Selected product size does not belong to the selected product type."
                }
            )

        # ---------------------------------
        # Product Length must belong to
        # selected Product Size
        # ---------------------------------

        if (
            product_length
            and product_size
            and product_length.product_size_id != product_size.id
        ):
            raise serializers.ValidationError(
                {
                    "product_length":
                        "Selected product length does not belong to the selected product size."
                }
            )
        # ---------------------------------
        # Product Size → Product Type
        # must also match Category
        # ---------------------------------

        if (
            product_size
            and category
            and product_size.product_type.category_id != category.id
        ):
            raise serializers.ValidationError(
                {
                    "product_size":
                        "Selected product size does not belong to the selected category."
                }
            )

        return attrs