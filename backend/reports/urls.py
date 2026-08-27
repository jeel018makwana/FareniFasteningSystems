from django.urls import path
from .views import (
    InventoryReportAPIView,
    SalesReportAPIView,
    PurchaseReportAPIView,
    PaymentReportAPIView,
    ProfitReportAPIView,
    LowStockReportAPIView,
)

urlpatterns = [
    path(
        "inventory/",
        InventoryReportAPIView.as_view(),
        name="inventory-report",
    ),
    path(
        "low-stock/",
        LowStockReportAPIView.as_view(),
        name="low-stock-report",
    ),

    path(
        "sales/",
        SalesReportAPIView.as_view(),
        name="sales-report",
    ),

    path(
        "purchases/",
        PurchaseReportAPIView.as_view(),
        name="purchase-report",
    ),

    path(
        "payments/",
        PaymentReportAPIView.as_view(),
        name="payment-report",
    ),

    path(
        "profit/",
        ProfitReportAPIView.as_view(),
        name="profit-report",
    ),
]