from django.db import models
from django.conf import settings
from common.models import TimeStampedModel
from django.db.models import Max

class Sale(TimeStampedModel):
    sale_number = models.CharField(
        max_length=30,
        unique=True,
    )

    customer = models.ForeignKey(
        "customers.Customer",
        on_delete=models.PROTECT,
        related_name="sales",
    )

    sale_date = models.DateField()

    subtotal = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        default=0,
    )

    gst_amount = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        default=0,
    )

    discount = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        default=0,
    )

    grand_total = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        default=0,
    )

    remarks = models.TextField(
        blank=True,
    )
    

    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.PROTECT,
    )
    def save(self, *args, **kwargs):
        if not self.sale_number:
            last_sale = (
                Sale.objects.aggregate(
                    max_id = Max("id")
                )["max_id"]
                or 0
            )
            self.sale_number = (
                f"INV-{last_sale + 1:06d}"
            )
        super().save(*args, **kwargs)

    class Meta:
        ordering = ["-sale_date"]

    def __str__(self):
        return self.sale_number


class SaleItem(TimeStampedModel):
    sale = models.ForeignKey(
        Sale,
        on_delete=models.CASCADE,
        related_name="items",
    )

    product = models.ForeignKey(
        "products.Product",
        on_delete=models.PROTECT,
    )

    quantity = models.PositiveIntegerField()

    selling_price = models.DecimalField(
        max_digits=12,
        decimal_places=2,
    )

    gst = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        default=18,
    )

    line_total = models.DecimalField(
        max_digits=12,
        decimal_places=2,
    )

    class Meta:
        ordering = ["id"]

    def __str__(self):
        return f"{self.product.name} ({self.quantity})"