from django.db import transaction
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import ValidationError
from rest_framework.filters import SearchFilter
from .models import InventoryTransaction
from .serializers import InventoryTransactionSerializer
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import OrderingFilter
class InventoryTransactionViewSet(viewsets.ModelViewSet):

    serializer_class = InventoryTransactionSerializer

    permission_classes = [
        IsAuthenticated,
    ]

    filter_backends = [
        SearchFilter,
        DjangoFilterBackend,
        OrderingFilter,
    ]

    search_fields = [
        "product__name",
        "product__product_code",
        "transaction_type",
        "reference",
        "remarks",
    ]

    filterset_fields = [
        "transaction_type",
        "product",
    ]

    ordering_fields = [
        "created_at",
        "quantity",
        "product__name",
        "product__current_stock",
    ]

    ordering = [
        "-created_at",
    ]

    queryset = InventoryTransaction.objects.select_related("product")

    def apply_stock(self, product, transaction_type, quantity):

        if transaction_type in [
            "STOCK_IN",
            "PURCHASE",
            "OPENING",
            "ADJUSTMENT",
        ]:
            product.current_stock += quantity

        elif transaction_type in [
            "STOCK_OUT",
            "SALE",
        ]:
            if product.current_stock < quantity:
                raise ValidationError(
                    {
                        "quantity": "Insufficient stock available."
                    }
                )

            product.current_stock -= quantity

        product.save()
        
    def reverse_stock(self, product, transaction_type, quantity):

        if transaction_type in [
            "STOCK_IN",
            "PURCHASE",
            "OPENING",
            "ADJUSTMENT",
        ]:
            if product.current_stock < quantity:
                raise ValidationError(
                    {
                        "quantity": "Stock cannot become negative."
                    }
                )

            product.current_stock -= quantity

        elif transaction_type in [
            "STOCK_OUT",
            "SALE",
        ]:
            product.current_stock += quantity

        product.save()

    @transaction.atomic
    def perform_create(self, serializer):

        inventory = serializer.save()

        self.apply_stock(
            inventory.product,
            inventory.transaction_type,
            inventory.quantity,
        )

        inventory.stock_after_transaction = (
            inventory.product.current_stock
        )

        inventory.save(
            update_fields=["stock_after_transaction"]
        )
    
    @transaction.atomic
    def perform_update(self, serializer):

        old = self.get_object()

        self.reverse_stock(
            old.product,
            old.transaction_type,
            old.quantity,
        )

        inventory = serializer.save()

        self.apply_stock(
            inventory.product,
            inventory.transaction_type,
            inventory.quantity,
        )

        inventory.stock_after_transaction = (
            inventory.product.current_stock
        )

        inventory.save(
            update_fields=["stock_after_transaction"]
        )

    @transaction.atomic
    def perform_destroy(self, instance):
        self.reverse_stock(
            instance.product,
            instance.transaction_type,
            instance.quantity,
        )
        instance.delete()