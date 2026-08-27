from django.contrib import admin
from .models import Sale, SaleItem
from .services import SaleService
from logs.utils import log_activity

class SaleItemInline(admin.TabularInline):
    model = SaleItem
    extra = 1


@admin.register(Sale)
class SaleAdmin(admin.ModelAdmin):

    list_display = (
        "sale_number",
        "customer",
        "sale_date",
        "grand_total",
    )

    inlines = [SaleItemInline]

    def save_model(self, request, obj, form, change):

        super().save_model(request, obj, form, change)

        if change:
            action = "UPDATE"
            description = f"Updated Sale: {obj.sale_number}"
        else:
            action = "CREATE"
            description = f"Created Sale: {obj.sale_number}"

        log_activity(
            user=request.user,
            action=action,
            module="Sales",
            description=description,
        )

    def delete_model(self, request, obj):

        log_activity(
            user=request.user,
            action="DELETE",
            module="Sales",
            description=f"Deleted Sale: {obj.sale_number}",
        )

        SaleService.delete_sale(obj)
        
    def save_related(self, request, form, formsets, change):
        super().save_related(request, form, formsets, change)

        SaleService.update_stock(form.instance)
        SaleService.deduct_stock(sale)
        SaleService.calculate_totals(sale)