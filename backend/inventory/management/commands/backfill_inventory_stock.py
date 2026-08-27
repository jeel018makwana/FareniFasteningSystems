from django.core.management.base import BaseCommand
from django.db import transaction

from inventory.models import InventoryTransaction


class Command(BaseCommand):

    help = "Backfill stock after transaction for existing inventory transactions"

    @transaction.atomic
    def handle(self, *args, **options):

        transactions = (
            InventoryTransaction.objects
            .select_related("product")
            .order_by("product_id", "created_at", "id")
        )

        stock_by_product = {}

        for inventory in transactions:

            product_id = inventory.product_id

            current_stock = stock_by_product.get(
                product_id,
                0,
            )

            if inventory.transaction_type in [
                "STOCK_IN",
                "PURCHASE",
                "OPENING",
                "ADJUSTMENT",
            ]:
                current_stock += inventory.quantity

            elif inventory.transaction_type in [
                "STOCK_OUT",
                "SALE",
            ]:
                current_stock -= inventory.quantity

            inventory.stock_after_transaction = current_stock

            inventory.save(
                update_fields=[
                    "stock_after_transaction"
                ]
            )

            stock_by_product[product_id] = current_stock

        self.stdout.write(
            self.style.SUCCESS(
                "Inventory stock history backfilled successfully."
            )
        )