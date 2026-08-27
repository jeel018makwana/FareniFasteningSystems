from django.db import transaction
from products.models import Product
from decimal import Decimal
from .models import Sale, SaleItem
from rest_framework.exceptions import ValidationError
from inventory.models import InventoryTransaction

class SaleService:
    @staticmethod
    @transaction.atomic
    def create_sale(validated_data):
        items_data = validated_data.pop("items")
        sale = Sale.objects.create(**validated_data)
        for item_data in items_data:
            SaleItem.objects.create(
                sale = sale,
                line_total=(
                    item_data["quantity"] *
                    item_data["selling_price"]
                ),
                **item_data,
            )
        SaleService.deduct_stock(sale)
        SaleService.calculate_totals(sale)
        return sale
    
    @staticmethod
    def calculate_totals(sale):

        subtotal = Decimal("0.00")
        gst_total = Decimal("0.00")

        for item in sale.items.all():

            item.line_total = (
                item.quantity *
                item.selling_price
            )

            item.save(update_fields=["line_total"])

            subtotal += item.line_total

            gst_total += (
                item.line_total *
                item.gst
            ) / Decimal("100")

        sale.subtotal = subtotal
        sale.gst_amount = gst_total
        sale.grand_total = (
            subtotal +
            gst_total -
            sale.discount
        )

        sale.save(
            update_fields=[
                "subtotal",
                "gst_amount",
                "grand_total",
            ]
        )
    @staticmethod
    @transaction.atomic
    def update_sale(sale, validated_data):

        items_data = validated_data.pop("items")

        # Restore previous stock
        SaleService.restore_stock(sale)

        # Update sale fields
        for field, value in validated_data.items():
            setattr(sale, field, value)

        sale.save()

        # Remove previous items
        sale.items.all().delete()

        # Create new items
        for item_data in items_data:

            SaleItem.objects.create(
                sale=sale,
                line_total=(
                    item_data["quantity"] *
                    item_data["selling_price"]
                ),
                **item_data,
            )

        # Deduct stock again
        SaleService.deduct_stock(sale)

        # Calculate totals
        SaleService.calculate_totals(sale)

        return sale
    
    
    @staticmethod
    def deduct_stock(sale):
        for item in sale.items.select_related("product"):
            product = item.product

            if product.current_stock < item.quantity:
                raise ValidationError(
                    {
                        "product": (
                            f"Insufficient stock for "
                            f"{product.name}"
                        )
                    }
                )
            product.current_stock -= item.quantity
            product.save(update_fields=["current_stock"])

            InventoryTransaction.objects.create(
                product=product,
                transaction_type="SALE",
                quantity=item.quantity,
                reference=sale.sale_number,
                remarks=f"Sale {sale.sale_number}",
            )

    @staticmethod
    def restore_stock(sale):
        for item in sale.items.select_related("product"):
            product = item.product
            product.current_stock +=item.quantity
            product.save(
                update_fields=["current_stock"]
            )
        InventoryTransaction.objects.filter(
            transaction_type="SALE",
            reference=sale.sale_number,
        ).delete()
    @staticmethod
    @transaction.atomic
    def delete_sale(sale):
        SaleService.restore_stock(sale)
        sale.delete()