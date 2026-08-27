from django.db import migrations


def populate_product_types_and_sizes(apps, schema_editor):
    Product = apps.get_model("products", "Product")
    ProductType = apps.get_model("products", "ProductType")
    ProductSize = apps.get_model("products", "ProductSize")

    for product in Product.objects.all():

        if not product.size:
            continue

        # Create / get Product Type
        product_type, _ = ProductType.objects.get_or_create(
            category=product.category,
            name=product.name,
        )

        # Create / get Product Size
        product_size, _ = ProductSize.objects.get_or_create(
            product_type=product_type,
            name=product.size,
        )

        # Connect product
        product.product_type = product_type
        product.product_size = product_size

        product.save(
            update_fields=[
                "product_type",
                "product_size",
            ]
        )


def reverse_product_types_and_sizes(apps, schema_editor):
    Product = apps.get_model("products", "Product")

    Product.objects.update(
        product_type=None,
        product_size=None,
    )


class Migration(migrations.Migration):

    dependencies = [
        (
            "products",
            "0003_productsize_product_product_size_producttype_and_more",
        ),
    ]

    operations = [
        migrations.RunPython(
            populate_product_types_and_sizes,
            reverse_product_types_and_sizes,
        ),
    ]