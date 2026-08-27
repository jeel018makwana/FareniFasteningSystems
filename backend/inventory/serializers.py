from rest_framework import serializers
from django.db import transaction
from products.models import Product
from .models import InventoryTransaction


class InventoryTransactionSerializer(serializers.ModelSerializer):

    product_name = serializers.CharField(
        source="product.name",
        read_only=True,
    )
    product_code = serializers.CharField(
        source="product.product_code",
        read_only=True,
    )
    minimum_stock = serializers.IntegerField(
        source="product.minimum_stock",
        read_only=True,
    )
    current_stock = serializers.IntegerField(
        source="product.current_stock",
        read_only=True,
    )
    class Meta:
        model = InventoryTransaction

        fields = (
            "id",
            "product",
            "product_name",
            "product_code",
            "current_stock",
            "minimum_stock",
            "transaction_type",
            "quantity",
            "stock_after_transaction",
            "reference",
            "remarks",
            "created_at",
            "updated_at",
        )

        read_only_fields = (
            "created_at",
            "updated_at",
            "stock_after_transaction",
        )

    def get_stock_after(self, obj):
        product = obj.product

        transactions = (
            InventoryTransaction.objects
            .filter(product=product)
            .order_by("created_at", "id")
        )

        current_stock = product.current_stock

        # Transactions after this transaction
        for transaction in reversed(list(transactions)):
            if transaction.id == obj.id:
                return current_stock

            if transaction.transaction_type in [
                "STOCK_IN",
                "PURCHASE",
                "OPENING",
                "ADJUSTMENT",
            ]:
                current_stock -= transaction.quantity

            elif transaction.transaction_type in [
                "STOCK_OUT",
                "SALE",
            ]:
                current_stock += transaction.quantity

        return current_stock
    def validate(self, attrs):

        product = attrs.get(
            "product",
            self.instance.product if self.instance else None,
        )

        qty = attrs.get(
            "quantity",
            self.instance.quantity if self.instance else None,
        )

        transaction_type = attrs.get(
            "transaction_type",
            self.instance.transaction_type
            if self.instance
            else None,
        )

        if qty is None:
            raise serializers.ValidationError(
                {
                    "quantity": "Quantity is required."
                }
            )

        if qty <= 0:
            raise serializers.ValidationError(
                {
                    "quantity": "Quantity must be greater than zero."
                }
            )

        if transaction_type in [
            "SALE",
            "STOCK_OUT",
        ]:
            current_stock = product.current_stock

            if self.instance:
                current_stock += self.instance.quantity

            if current_stock < qty:
                raise serializers.ValidationError(
                    {
                        "quantity": "Insufficient stock."
                    }
                )

        return attrs
        