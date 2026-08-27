from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.views import APIView
from django.http import HttpResponse
from rest_framework import viewsets
from rest_framework.filters import SearchFilter, OrderingFilter
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from .models import Purchase
from .serializers import PurchaseSerializer
from .services import PurchaseService
from .filters import PurchaseFilter
from .pdf import generate_purchase_invoice

class PurchaseViewSet(viewsets.ModelViewSet):

    serializer_class = PurchaseSerializer

    permission_classes = [
        IsAuthenticated,
    ]

    filter_backends = [
        DjangoFilterBackend,
        SearchFilter,
        OrderingFilter,
    ]

    search_fields = [
        "purchase_number",
        "invoice_number",
        "supplier__name",
        "items__product__name",
        "items__product__product_code",
    ]

    ordering_fields = [
        "purchase_number",
        "purchase_date",
        "grand_total",
        "subtotal",
    ]

    ordering = [
        "-purchase_date",
    ]

    filterset_class = PurchaseFilter

    def get_queryset(self):

        return (
            Purchase.objects
            .select_related(
                "supplier",
                "created_by",
            )
            .prefetch_related(
                "items__product__category",
                "items__product__product_type",
                "items__product__product_size",
                "items__product__product_length",
                "items__product__brand",
            )
            .distinct()
        )

    def perform_create(self, serializer):

        serializer.save(
            created_by=self.request.user,
        )

    def perform_destroy(self, instance):

        PurchaseService.delete_purchase(
            instance,
        )

class PurchaseInvoicePDFAPIView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request, pk):

        purchase = get_object_or_404(
            Purchase.objects
            .prefetch_related(
                "items__product__product_size",
            )
            .select_related(
                "supplier",
            ),
            pk=pk,
        )

        pdf = generate_purchase_invoice(
            purchase
        )

        response = HttpResponse(
            pdf,
            content_type="application/pdf",
        )

        response["Content-Disposition"] = (
            f'attachment; '
            f'filename="Purchase_'
            f'{purchase.purchase_number}.pdf"'
        )

        return response