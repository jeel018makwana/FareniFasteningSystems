from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter

from .models import Customer
from .serializers import CustomerSerializer
from django.db.models.deletion import ProtectedError
from rest_framework.exceptions import ValidationError
from django.db import transaction
from sales.models import Sale
class CustomerViewSet(viewsets.ModelViewSet):

    queryset = Customer.objects.filter(is_active=True).order_by("-id")

    serializer_class = CustomerSerializer

    permission_classes = [IsAuthenticated]

    filter_backends = [
        DjangoFilterBackend,
        SearchFilter,
        OrderingFilter,
    ]

    search_fields = [
        "customer_code",
        "name",
        "company_name",
        "phone",
        "gst_number",
    ]

    filterset_fields = [
        "is_active",
    ]

    ordering_fields = [
        "id",
        "name",
        "opening_balance",
        "customer_code",
    ]

    ordering = ["-id"]

    def perform_destroy(self, instance):
        with transaction.atomic():
            Sale.objects.filter(customer=instance).delete()
            instance.delete()