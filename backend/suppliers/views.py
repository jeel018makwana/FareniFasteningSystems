from rest_framework import filters, viewsets
from rest_framework.exceptions import ValidationError
from django.db.models.deletion import ProtectedError
from django.db import transaction
from purchases.models import Purchase

from .models import Supplier
from .serializers import SupplierSerializer


class SupplierViewSet(viewsets.ModelViewSet):
    queryset = Supplier.objects.all()
    serializer_class = SupplierSerializer

    filter_backends = [filters.SearchFilter]

    search_fields = [
        "supplier_code",
        "name",
        "phone",
        "company_name",
    ]

    def perform_destroy(self, instance):
        with transaction.atomic():
            Purchase.objects.filter(supplier=instance).delete()
            instance.delete()