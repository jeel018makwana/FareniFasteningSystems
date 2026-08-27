from django.db import models
from common.models import TimeStampedModel


class Category(TimeStampedModel):
    """
    Product Category
    Example:
        Bolt
        Nut
        Washer
    """

    name = models.CharField(
        max_length=100,
        unique=True,
    )

    description = models.TextField(
        blank=True,
    )

    class Meta:
        ordering = ["name"]
        verbose_name = "Category"
        verbose_name_plural = "Categories"

    def __str__(self):
        return self.name
class ProductType(TimeStampedModel):
    """
    Product Type belonging to a Category.

    Example:
        Category: Bolt
        Types:
            High Tension Bolt
            Hex Bolt
            Anchor Bolt
    """

    category = models.ForeignKey(
        Category,
        on_delete=models.CASCADE,
        related_name="product_types",
    )

    name = models.CharField(
        max_length=100,
    )

    description = models.TextField(
        blank=True,
    )

    class Meta:
        ordering = ["name"]
        unique_together = ["category", "name"]
        verbose_name = "Product Type"
        verbose_name_plural = "Product Types"

    def __str__(self):
        return f"{self.category.name} - {self.name}"


class ProductSize(TimeStampedModel):
    """
    Size belonging to a Product Type.

    Example:
        High Tension Bolt:
            M10
            M12
            M16
            M20
    """

    product_type = models.ForeignKey(
        ProductType,
        on_delete=models.CASCADE,
        related_name="sizes",
    )

    name = models.CharField(
        max_length=100,
    )

    description = models.TextField(
        blank=True,
    )

    class Meta:
        ordering = ["name"]
        unique_together = ["product_type", "name"]
        verbose_name = "Product Size"
        verbose_name_plural = "Product Sizes"

    def __str__(self):
        return f"{self.product_type.name} - {self.name}"



class Brand(TimeStampedModel):
    """
    Product Brand
    Example:
        TVS
        Unbrako
    """

    name = models.CharField(
        max_length=100,
        unique=True,
    )

    description = models.TextField(
        blank=True,
    )

    class Meta:
        ordering = ["name"]

    def __str__(self):
        return self.name

class ProductLength(TimeStampedModel):
    """
    Length belonging to a Product Size

    Example: HT Hex Bolt 
                Size: M8 
                    Lengths: 
                        25MM, 
                        30MM,
                        40MM
    """
    product_size = models.ForeignKey(
        ProductSize,
        on_delete=models.CASCADE,
        related_name="lengths",
    )
    name=models.CharField(
        max_length=100,
    )

    description=models.TextField(
        blank=True,
    )

    class Meta:
        ordering=["name"]
        unique_together=["product_size", "name"]
        verbose_name = "Product Length"
        verbose_name_plural = "Product Lengths"
    def __str__(self):
        return f"{self.product_size.name} - {self.name}"

class Product(TimeStampedModel):
    """
    Product Master
    """

    product_code = models.CharField(
        max_length=30,
        unique=True,
    )

    name = models.CharField(
        max_length=200,
    )

    category = models.ForeignKey(
        Category,
        on_delete=models.PROTECT,
        related_name="products",
    )

    product_type = models.ForeignKey(
        ProductType,
        on_delete=models.PROTECT,
        related_name="products",
        null=True,
        blank=True,
    )


    brand = models.ForeignKey(
        Brand,
        on_delete=models.PROTECT,
        related_name="products",
    )

    size = models.CharField(
        max_length=100,
        blank=True,
    )

    product_size = models.ForeignKey(
        ProductSize,
        on_delete=models.PROTECT,
        related_name="products",
        null=True,
        blank=True,
    )

    product_length = models.ForeignKey(
        ProductLength,
        on_delete=models.PROTECT,
        related_name="products",
        null=True,
        blank=True,
    )

    standard = models.CharField(
        max_length=100,
         blank=True,
    )

    grade = models.CharField(
        max_length=50,
        blank=True,
    )

    thread_pitch = models.CharField(
        max_length=30,
        blank=True,
    )

    material = models.CharField(
        max_length=100,
        blank=True,
    )

    unit = models.CharField(
        max_length=20,
        default="PCS",
    )

    purchase_price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
    )

    selling_price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
    )

    gst = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        default=18,
    )

    current_stock = models.IntegerField(
        default=0,
    )

    minimum_stock = models.IntegerField(
        default=0,
    )

    is_active = models.BooleanField(
        default=True,
    )

    class Meta:
        ordering = ["name"]

    def __str__(self):
        return f"{self.product_code} - {self.name}"