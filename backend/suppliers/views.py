from rest_framework import filters, viewsets
from rest_framework.exceptions import ValidationError
from django.db.models.deletion import ProtectedError

from .models import Supplier
from .serializers import SupplierSerializer


class SupplierViewSet(viewsets.ModelViewSet):
    queryset = Supplier.objects.filter(is_active=True)
    serializer_class = SupplierSerializer

    filter_backends = [filters.SearchFilter]

    search_fields = [
        "supplier_code",
        "name",
        "phone",
        "company_name",
    ]

    def perform_destroy(self, instance):
        try:
            instance.delete()

        except ProtectedError:
            instance.is_active = False
            instance.save(update_fields=["is_active"])