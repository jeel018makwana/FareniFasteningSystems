from decimal import Decimal

from django.db import transaction

from inventory.models import InventoryTransaction
from .models import Purchase, PurchaseItem


class PurchaseService:

    @staticmethod
    @transaction.atomic
    def create_purchase(validated_data):

        items_data = validated_data.pop(
            "items",
            []
        )

        purchase = Purchase.objects.create(
            **validated_data
        )

        for item_data in items_data:

            PurchaseItem.objects.create(
                purchase=purchase,
                **item_data
            )

        PurchaseService.increase_stock(
            purchase
        )

        PurchaseService.calculate_totals(
            purchase
        )

        return purchase

    @staticmethod
    def calculate_totals(purchase):

        subtotal = Decimal("0.00")
        gst_total = Decimal("0.00")

        for item in purchase.items.select_related(
            "product"
        ):

            basic_amount, item_gst = (
                item.calculate_total()
            )

            item.save(
                update_fields=["line_total"]
            )

            subtotal += basic_amount
            gst_total += item_gst

        discount = (
            purchase.discount
            or Decimal("0.00")
        )

        grand_total = (
            subtotal
            + gst_total
            - discount
        )

        purchase.subtotal = subtotal
        purchase.gst_amount = gst_total
        purchase.grand_total = grand_total

        purchase.save(
            update_fields=[
                "subtotal",
                "gst_amount",
                "grand_total",
            ]
        )

    @staticmethod
    def increase_stock(purchase):

        for item in purchase.items.select_related(
            "product"
        ):

            product = item.product

            product.current_stock += item.quantity

            product.purchase_price = (
                item.purchase_price
            )

            product.save(
                update_fields=[
                    "current_stock",
                    "purchase_price",
                ]
            )

            InventoryTransaction.objects.create(
                product=product,
                transaction_type="PURCHASE",
                quantity=item.quantity,
                reference=purchase.purchase_number,
                remarks="Stock added through Purchase",
            )

    @staticmethod
    def restore_stock(purchase):

        for item in purchase.items.select_related(
            "product"
        ):

            product = item.product

            product.current_stock -= item.quantity

            product.save(
                update_fields=[
                    "current_stock"
                ]
            )

        InventoryTransaction.objects.filter(
            transaction_type="PURCHASE",
            reference=purchase.purchase_number,
        ).delete()

    @staticmethod
    @transaction.atomic
    def update_purchase(
        purchase,
        validated_data,
    ):

        items_data = validated_data.pop(
            "items",
            []
        )

        # Remove old stock
        PurchaseService.restore_stock(
            purchase
        )

        # Update purchase fields
        for field, value in validated_data.items():

            setattr(
                purchase,
                field,
                value
            )

        purchase.save()

        # Remove old items
        purchase.items.all().delete()

        # Create new items
        for item_data in items_data:

            PurchaseItem.objects.create(
                purchase=purchase,
                **item_data
            )

        # Add new stock
        PurchaseService.increase_stock(
            purchase
        )

        # Recalculate totals
        PurchaseService.calculate_totals(
            purchase
        )

        return purchase

    @staticmethod
    @transaction.atomic
    def delete_purchase(purchase):

        # Restore stock
        PurchaseService.restore_stock(
            purchase
        )

        # Delete purchase
        purchase.delete()