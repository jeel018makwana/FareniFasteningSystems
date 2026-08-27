from rest_framework.routers import DefaultRouter
from django.urls import path, include
from .views import PurchaseViewSet, PurchaseInvoicePDFAPIView

router = DefaultRouter()

router.register(
    "",
    PurchaseViewSet,
    basename="purchase",
)

urlpatterns = [

    path(
        "<int:pk>/invoice/",
        PurchaseInvoicePDFAPIView.as_view(),
        name="purchase-invoice",
    ),

    path("", include(router.urls)),
]