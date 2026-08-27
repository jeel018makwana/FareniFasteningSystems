from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from .models import Sale
from .serializers import SaleSerializer
from django.http import HttpResponse
from django.shortcuts import get_object_or_404
from .services import SaleService
from .pdf import generate_invoice
from .models import Sale
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter

from .filters import SaleFilter
class SaleViewSet(viewsets.ModelViewSet):
    serializer_class = SaleSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [
        DjangoFilterBackend,
        SearchFilter,
        OrderingFilter,
    ]

    filterset_class = SaleFilter

    search_fields = [
        "sale_number",
        "customer__name",
        "customer__phone",
    ]

    ordering_fields = [
        "sale_number",
        "sale_date",
        "grand_total",
        "subtotal",
    ]

    ordering = [
        "-sale_date",
    ]

    def get_queryset(self):
        return(
            Sale.objects
            .prefetch_related(
                "items__product"
            )
            .select_related(
                "customer",
                "created_by",
            )
        )

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)
    def perform_destroy(self, instance):
        SaleService.delete_sale(instance)
    
    

class InvoicePDFAPIView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request, pk):

        sale = get_object_or_404(
            Sale.objects.prefetch_related(
                "items__product"
            ).select_related(
                "customer"
            ),
            pk=pk,
        )

        pdf = generate_invoice(sale)

        response = HttpResponse(
            pdf,
            content_type="application/pdf"
        )

        response["Content-Disposition"] = (
            f'attachment; filename="Invoice_{sale.sale_number}.pdf"'
        )

        return response