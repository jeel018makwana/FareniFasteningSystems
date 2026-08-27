from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.db.models import Sum, F
from products.models import Product
from customers.models import Customer
from suppliers.models import Supplier
from purchases.models import Purchase
from sales.models import Sale
from payments.models import Payment
from drf_spectacular.utils import extend_schema
from django.db.models.functions import TruncMonth

@extend_schema(
    responses={
        200: {
            "type": "object",
            "properties": {
                "total_products": {"type": "integer"},
                "total_customers": {"type": "integer"},
                "total_suppliers": {"type": "integer"},
                "total_sales": {"type": "number"},
                "total_purchases": {"type": "number"},
                "customer_payments": {"type": "number"},
                "supplier_payments": {"type": "number"},
                "current_inventory": {"type": "number"},
                "low_stock_products": {"type": "integer"},
            }
        }
    }
)
class DashboardAPIView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):

        total_products = Product.objects.count()

        total_customers = Customer.objects.count()

        total_suppliers = Supplier.objects.count()

        total_sales = (
            Sale.objects.aggregate(
                total=Sum("grand_total")
            )["total"] or 0
        )

        total_purchases = (
            Purchase.objects.aggregate(
                total=Sum("grand_total")
            )["total"] or 0
        )

        customer_payments = (
            Payment.objects.filter(
                payment_type="RECEIVED"
            ).aggregate(
                total=Sum("amount")
            )["total"] or 0
        )

        supplier_payments = (
            Payment.objects.filter(
                payment_type="PAID"
            ).aggregate(
                total=Sum("amount")
            )["total"] or 0
        )

        current_inventory = (
            Product.objects.aggregate(
                total=Sum("current_stock")
            )["total"] or 0
        )

        low_stock = Product.objects.filter(
            current_stock__lte=F("minimum_stock")
        ).count()

        low_stock_items = list(
            Product.objects.filter(
                current_stock__lte=F("minimum_stock")
            )
            .values(
                "product_code",
                "name",
                "current_stock",
                "minimum_stock",
            )[:5]
        )

        recent_sales = list(
            Sale.objects.order_by("-sale_date")
            .values(
                "sale_number",
                "customer__name",
                "grand_total",
                "sale_date",
            )[:5]
        )

        recent_purchases = list(
            Purchase.objects.order_by("-purchase_date")
            .values(
                "purchase_number",
                "grand_total",
                "purchase_date",
            )[:5]
        )

        monthly_sales = list(
            Sale.objects
            .annotate(
                month=TruncMonth("sale_date")
            )
            .values("month")
            .annotate(
                revenue=Sum("grand_total")
            )
            .order_by("month")
        )

        return Response({

            "total_products": total_products,

            "total_customers": total_customers,

            "total_suppliers": total_suppliers,

            "total_sales": total_sales,

            "total_purchases": total_purchases,

            "customer_payments": customer_payments,

            "supplier_payments": supplier_payments,

            "current_inventory": current_inventory,

            "low_stock_products": low_stock,

            "low_stock_items": low_stock_items,

            "monthly_sales": monthly_sales,

            "recent_sales": recent_sales,

            "recent_purchases": recent_purchases,

        })