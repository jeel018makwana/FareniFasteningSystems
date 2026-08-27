from django.contrib import admin

from .models import Purchase, PurchaseItem
from logs.utils import log_activity


class PurchaseItemInline(admin.TabularInline):

    model = PurchaseItem

    extra = 1


@admin.register(Purchase)
class PurchaseAdmin(admin.ModelAdmin):

    list_display = (
        "purchase_number",
        "supplier",
        "purchase_date",
        "grand_total",
        "created_by",
    )

    search_fields = (
        "purchase_number",
        "invoice_number",
        "supplier__name",
    )

    list_filter = (
        "purchase_date",
        "supplier",
    )

    inlines = [
        PurchaseItemInline,
    ]

    def save_model(
        self,
        request,
        obj,
        form,
        change,
    ):

        super().save_model(
            request,
            obj,
            form,
            change,
        )

        if change:

            action = "UPDATE"

            description = (
                f"Updated Purchase: "
                f"{obj.purchase_number}"
            )

        else:

            action = "CREATE"

            description = (
                f"Created Purchase: "
                f"{obj.purchase_number}"
            )

        log_activity(
            user=request.user,
            action=action,
            module="Purchases",
            description=description,
        )

    def delete_model(
        self,
        request,
        obj,
    ):

        log_activity(
            user=request.user,
            action="DELETE",
            module="Purchases",
            description=(
                f"Deleted Purchase: "
                f"{obj.purchase_number}"
            ),
        )

        super().delete_model(
            request,
            obj,
        )


@admin.register(PurchaseItem)
class PurchaseItemAdmin(admin.ModelAdmin):

    list_display = (
        "purchase",
        "product",
        "quantity",
        "purchase_price",
        "gst",
        "line_total",
    )

    search_fields = (
        "purchase__purchase_number",
        "product__name",
    )