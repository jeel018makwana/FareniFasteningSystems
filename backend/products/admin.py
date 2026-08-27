from django.contrib import admin
from .models import Category, Brand, Product


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "name",
        "description",
        "created_at",
    )

    search_fields = (
        "name",
    )

    ordering = (
        "name",
    )


@admin.register(Brand)
class BrandAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "name",
        "description",
        "created_at",
    )

    search_fields = (
        "name",
    )

    ordering = (
        "name",
    )


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = (
        "product_code",
        "name",
        "category",
        "brand",
        "grade",
        "thread_pitch",
        "size",
        "purchase_price",
        "selling_price",
        "current_stock",
        "is_active",
    )

    list_filter = (
        "category",
        "brand",
        "grade",
        "is_active",
    )

    search_fields = (
        "product_code",
        "name",
        "grade",
        "size",
    )

    autocomplete_fields = (
        "category",
        "brand",
    )

    ordering = (
        "name",
    )