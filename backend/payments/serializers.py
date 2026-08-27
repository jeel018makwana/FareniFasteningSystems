from rest_framework import serializers

from .models import Payment
from sales.models import Sale
from purchases.models import Purchase


class PaymentSerializer(serializers.ModelSerializer):

    class Meta:
        model = Payment
        fields = "__all__"

        read_only_fields = [
            "created_by",
            "payment_number",
        ]

    def validate(self, attrs):

        payment_type = attrs.get("payment_type")
        customer = attrs.get("customer")
        supplier = attrs.get("supplier")
        sale = attrs.get("sale")
        purchase = attrs.get("purchase")
        amount = attrs.get("amount")

        # -----------------------------------------
        # RECEIVED PAYMENT
        # -----------------------------------------

        if payment_type == "RECEIVED":

            if not customer:
                raise serializers.ValidationError({
                    "customer": "Customer is required for received payments."
                })

            if supplier:
                raise serializers.ValidationError({
                    "supplier": "Supplier cannot be selected for received payments."
                })

            if purchase:
                raise serializers.ValidationError({
                    "purchase": "Purchase cannot be linked to received payments."
                })

            if sale and sale.customer_id != customer.id:
                raise serializers.ValidationError({
                    "sale": "Selected sale does not belong to this customer."
                })

        # -----------------------------------------
        # PAID PAYMENT
        # -----------------------------------------

        elif payment_type == "PAID":

            if not supplier:
                raise serializers.ValidationError({
                    "supplier": "Supplier is required for paid payments."
                })

            if customer:
                raise serializers.ValidationError({
                    "customer": "Customer cannot be selected for paid payments."
                })

            if sale:
                raise serializers.ValidationError({
                    "sale": "Sale cannot be linked to paid payments."
                })

            if purchase and purchase.supplier_id != supplier.id:
                raise serializers.ValidationError({
                    "purchase": (
                        "Selected purchase does not belong "
                        "to this supplier."
                    )
                })

        # -----------------------------------------
        # PAYMENT AMOUNT
        # -----------------------------------------

        if amount is not None and amount <= 0:
            raise serializers.ValidationError({
                "amount": "Payment amount must be greater than zero."
            })

        # -----------------------------------------
        # SALE PAYMENT LIMIT
        # -----------------------------------------

        if sale:

            previous_payments = (
                Payment.objects
                .filter(
                    sale=sale,
                    payment_type="RECEIVED",
                )
            )

            if self.instance:
                previous_payments = previous_payments.exclude(
                    id=self.instance.id
                )

            already_paid = sum(
                payment.amount
                for payment in previous_payments
            )

            if amount is not None:

                outstanding = (
                    sale.grand_total - already_paid
                )

                if amount > outstanding:
                    raise serializers.ValidationError({
                        "amount": (
                            f"Payment cannot exceed "
                            f"outstanding amount "
                            f"₹{outstanding}."
                        )
                    })

        # -----------------------------------------
        # PURCHASE PAYMENT LIMIT
        # -----------------------------------------

        if purchase:

            previous_payments = (
                Payment.objects
                .filter(
                    purchase=purchase,
                    payment_type="PAID",
                )
            )

            if self.instance:
                previous_payments = previous_payments.exclude(
                    id=self.instance.id
                )

            already_paid = sum(
                payment.amount
                for payment in previous_payments
            )

            if amount is not None:

                outstanding = (
                    purchase.grand_total - already_paid
                )

                if amount > outstanding:
                    raise serializers.ValidationError({
                        "amount": (
                            f"Payment cannot exceed "
                            f"outstanding amount "
                            f"₹{outstanding}."
                        )
                    })

        return attrs