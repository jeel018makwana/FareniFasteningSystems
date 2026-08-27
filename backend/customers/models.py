from django.db import models
from common.models import TimeStampedModel


class Customer(TimeStampedModel):
    customer_code = models.CharField(
        max_length=20,
        unique=True,
        blank=True,
    )

    name = models.CharField(
        max_length=200,
    )

    company_name = models.CharField(
        max_length=200,
        blank=True,
    )

    phone = models.CharField(
        max_length=20,
    )

    email = models.EmailField(
        blank=True,
    )

    gst_number = models.CharField(
        max_length=20,
        blank=True,
    )

    address = models.TextField(
        blank=True,
    )

    city = models.CharField(
        max_length=100,
        blank=True,
    )

    state = models.CharField(
        max_length=100,
        blank=True,
    )

    pincode = models.CharField(
        max_length=10,
        blank=True,
    )

    opening_balance = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        default=0,
    )

    is_active = models.BooleanField(
        default=True,
    )

    class Meta:
        ordering = ["name"]

    def save(self, *args, **kwargs):
        if not self.customer_code:
            last_customer = (
                Customer.objects.filter(customer_code_startswith="CUS")
                .order_by("-id")
                .first()
            )

            if last_customer:
                try:
                    last_number = int(
                        last_customer.customer_code.replace("CUS","")
                    )
                except ValueError:
                    last_number = 0
            else:
                last_number = 0

            self.customer_code = f"CUS{last_number + 1:03d}"
        super().save(*args,**kwargs)
    def __str__(self):
        return f"{self.customer_code} - {self.name}"