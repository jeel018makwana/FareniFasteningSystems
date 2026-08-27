from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from sales.models import Sale
from purchases.models import Purchase
from products.models import Product
from payments.models import Payment
from django.db.models import Sum, F, DecimalField, ExpressionWrapper
from sales.models import SaleItem
from drf_spectacular.utils import extend_schema


@extend_schema(
    responses={200: dict}
)
class InventoryReportAPIView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):

        products = Product.objects.annotate(

            stock_value=ExpressionWrapper(
                F("current_stock") * F("purchase_price"),
                output_field=DecimalField(max_digits=15, decimal_places=2),
            )

        ).values(

            "product_code",
            "name",
            "current_stock",
            "minimum_stock",
            "purchase_price",
            "selling_price",
            "stock_value",

        )

        return Response(products)
    
@extend_schema(
    responses={200: dict}
)
class SalesReportAPIView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):

        sales = Sale.objects.all()

        start_date = request.GET.get("start_date")
        end_date = request.GET.get("end_date")
        customer = request.GET.get("customer")

        if start_date:
            sales = sales.filter(sale_date__gte=start_date)

        if end_date:
            sales = sales.filter(sale_date__lte=end_date)

        if customer:
            sales = sales.filter(customer_id=customer)

        total_sales = (
            sales.aggregate(total=Sum("grand_total"))["total"] or 0
        )

        data = sales.values(
            "sale_number",
            "sale_date",
            "customer__name",
            "grand_total",
        )

        return Response({
            "total_sales": total_sales,
            "count": sales.count(),
            "results": list(data),
        })
    
@extend_schema(
    responses={200: dict}
) 
class PurchaseReportAPIView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):

        purchases = Purchase.objects.all()

        start_date = request.GET.get("start_date")
        end_date = request.GET.get("end_date")
        supplier = request.GET.get("supplier")

        if start_date:
            purchases = purchases.filter(purchase_date__gte=start_date)

        if end_date:
            purchases = purchases.filter(purchase_date__lte=end_date)

        if supplier:
            purchases = purchases.filter(supplier_id=supplier)

        total_purchase = (
            purchases.aggregate(total=Sum("grand_total"))["total"] or 0
        )

        data = purchases.values(
            "purchase_number",
            "purchase_date",
            "supplier__name",
            "grand_total",
        )

        return Response({
            "total_purchase": total_purchase,
            "count": purchases.count(),
            "results": list(data),
        })

@extend_schema(
    responses={200: dict}
)  
class PaymentReportAPIView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):

        payments = Payment.objects.all()

        payment_type = request.GET.get("payment_type")
        payment_mode = request.GET.get("payment_mode")
        start_date = request.GET.get("start_date")
        end_date = request.GET.get("end_date")

        if payment_type:
            payments = payments.filter(payment_type=payment_type)

        if payment_mode:
            payments = payments.filter(payment_mode=payment_mode)

        if start_date:
            payments = payments.filter(payment_date__gte=start_date)

        if end_date:
            payments = payments.filter(payment_date__lte=end_date)

        total_amount = (
            payments.aggregate(total=Sum("amount"))["total"] or 0
        )

        data = payments.values(
            "payment_number",
            "payment_date",
            "payment_type",
            "payment_mode",
            "amount",
            "customer__name",
            "supplier__name",
        )

        return Response({
            "total_amount": total_amount,
            "count": payments.count(),
            "results": list(data),
        })
    
@extend_schema(
    responses={200: dict}
)
class ProfitReportAPIView(APIView):
        
        permission_classes = [IsAuthenticated]
        
        def get(self, request):
        
            sale_items = SaleItem.objects.select_related("product")
        
            start_date = request.GET.get("start_date")
            end_date = request.GET.get("end_date")
        
            if start_date:
                sale_items = sale_items.filter(
                    sale__sale_date__gte=start_date
                )
        
            if end_date:
                sale_items = sale_items.filter(
                    sale__sale_date__lte=end_date
                )
        
            report = []
        
            total_sales = 0
            total_cost = 0
            total_profit = 0
        
            for item in sale_items:
        
                sales_value = item.line_total
        
                cost_value = (
                    item.quantity *
                    item.product.purchase_price
                )
        
                profit = sales_value - cost_value
        
                total_sales += sales_value
                total_cost += cost_value
                total_profit += profit
        
                report.append({
                    "sale_number": item.sale.sale_number,
                    "product": item.product.name,
                    "quantity": item.quantity,
                    "sales_value": sales_value,
                    "cost_value": cost_value,
                    "profit": profit,
                })
        
            return Response({
                "total_sales": total_sales,
                "total_cost": total_cost,
                "gross_profit": total_profit,
                "results": report,
            })
        
@extend_schema(
    responses={200: dict}
)
class LowStockReportAPIView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):

        products = Product.objects.filter(
            current_stock__lte=F("minimum_stock")
        ).values(

            "product_code",
            "name",
            "current_stock",
            "minimum_stock",
            "purchase_price",
            "selling_price",

        )

        return Response(products)