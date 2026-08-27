from django.db import transaction

from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated

from logs.utils import log_activity

from .models import Payment
from .serializers import PaymentSerializer


class PaymentViewSet(viewsets.ModelViewSet):

    queryset = Payment.objects.select_related(
        "customer",
        "supplier",
        "sale",
        "purchase",
        "created_by",
    )

    serializer_class = PaymentSerializer

    permission_classes = [IsAuthenticated]

    @transaction.atomic
    def perform_create(self, serializer):

        payment = serializer.save(
            created_by=self.request.user
        )

        log_activity(
            user=self.request.user,
            action="CREATE",
            module="Payments",
            description=(
                f"Created Payment: "
                f"{payment.payment_number}"
            ),
        )

    @transaction.atomic
    def perform_update(self, serializer):

        payment = serializer.save()

        log_activity(
            user=self.request.user,
            action="UPDATE",
            module="Payments",
            description=(
                f"Updated Payment: "
                f"{payment.payment_number}"
            ),
        )

    @transaction.atomic
    def perform_destroy(self, instance):

        payment_number = instance.payment_number

        log_activity(
            user=self.request.user,
            action="DELETE",
            module="Payments",
            description=(
                f"Deleted Payment: "
                f"{payment_number}"
            ),
        )

        instance.delete()