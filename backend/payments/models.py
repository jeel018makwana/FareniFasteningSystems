from django.db import models
from django.conf import settings
from common.models import TimeStampedModel
from sales.models import Sale
from purchases.models import Purchase

class Payment(TimeStampedModel):

    PAYMENT_TYPES = (
        ("RECEIVED", "Received"),
        ("PAID", "Paid"),
    )

    PAYMENT_MODES = (
        ("CASH", "Cash"),
        ("UPI", "UPI"),
        ("BANK", "Bank Transfer"),
        ("CHEQUE", "Cheque"),
    )

    payment_number = models.CharField(
        max_length=30,
        unique=True,
    )

    payment_date = models.DateField()

    payment_type = models.CharField(
        max_length=10,
        choices=PAYMENT_TYPES,
    )

    customer = models.ForeignKey(
        "customers.Customer",
        on_delete=models.PROTECT,
        null=True,
        blank=True,
        related_name="payments",
    )

    supplier = models.ForeignKey(
        "suppliers.Supplier",
        on_delete=models.PROTECT,
        null=True,
        blank=True,
        related_name="payments",
    )

    sale = models.ForeignKey(
        Sale,
        on_delete=models.PROTECT,
        null=True,
        blank=True,
        related_name="payments",
    )

    purchase = models.ForeignKey(
        Purchase,
        on_delete=models.PROTECT,
        null=True,
        blank=True,
        related_name="payments",
    )

    amount = models.DecimalField(
        max_digits=12,
        decimal_places=2,
    )

    payment_mode = models.CharField(
        max_length=20,
        choices=PAYMENT_MODES,
    )

    reference_number = models.CharField(
        max_length=100,
        blank=True,
    )

    remarks = models.TextField(
        blank=True,
    )

    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.PROTECT,
    )

    def save(self, *args, **kwargs):

        if not self.payment_number:

            last_payment = (
                Payment.objects
                .order_by("-id")
                .first()
            )

            if last_payment:
                number = last_payment.id + 1
            else:
                number = 1

            self.payment_number = (
                f"PAY-{number:06d}"
            )

        super().save(*args, **kwargs)

    class Meta:
        ordering = ["-payment_date"]

    def __str__(self):
        return self.payment_number
    
    