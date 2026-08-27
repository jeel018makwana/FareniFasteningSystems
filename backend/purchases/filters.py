import django_filters

from .models import Purchase


class PurchaseFilter(django_filters.FilterSet):

    purchase_date = django_filters.DateFromToRangeFilter()

    class Meta:
        model = Purchase

        fields = [
            "supplier",
            "purchase_date",
        ]