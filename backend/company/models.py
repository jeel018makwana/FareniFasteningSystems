from django.db import models


class Company(models.Model):
    name = models.CharField(max_length=200, help_text="Company Name, e.g. FARENI")

    logo = models.ImageField(
        upload_to="company/",
        blank=True,
        null=True,
        help_text="Comapany logo/ branding image"
    )

    tagline = models.CharField(
        max_length=200,
        blank=True,
        default="FASTENING SYSTEMS",
    )

    business_type = models.CharField(
        max_length=200,
        blank=True,
        default="STOCKIST | SUPPLIER | EXPORTER",
    )

    business_description = models.CharField(
        max_length=250,
        blank=True,
        default="OF HIGH TENSILE FASTENERS",
    )

    gst_number = models.CharField(
        max_length=20,
        blank=True,
    )

    pan_number = models.CharField(
        max_length=20,
        blank=True,
    )

    phone = models.CharField(
        max_length=20,
    )

    email = models.EmailField(
        blank=True,
    )

    website = models.URLField(
        blank=True,
    )

    address = models.TextField()

    bank_name = models.CharField(
        max_length=100,
        blank=True,
    )

    account_number = models.CharField(
        max_length=50,
        blank=True,
    )

    ifsc_code = models.CharField(
        max_length=20,
        blank=True,
    )

    def __str__(self):
        return self.name