from django.db import models
from common.models import TimeStampedModel
from products.models import Product


class InventoryTransaction(TimeStampedModel):

    TRANSACTION_TYPES = (
        ("STOCK_IN", "Stock In"),
        ("STOCK_OUT", "Stock Out"),
        ("PURCHASE", "Purchase"),
        ("SALE", "Sale"),
        ("ADJUSTMENT", "Adjustment"),
        ("OPENING", "Opening Stock"),
    )

    product = models.ForeignKey(
        Product,
        on_delete=models.PROTECT,
        related_name="inventory_transactions",
    )

    transaction_type = models.CharField(
        max_length=20,
        choices=TRANSACTION_TYPES,
    )

    quantity = models.IntegerField()

    stock_after_transaction = models.IntegerField(
        default=0,
    )

    reference = models.CharField(
        max_length=100,
        blank=True,
    )

    remarks = models.TextField(
        blank=True,
    )

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.product.name} ({self.transaction_type})"