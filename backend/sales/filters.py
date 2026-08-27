import django_filters

from .models import Sale


class SaleFilter(django_filters.FilterSet):

    sale_date = django_filters.DateFromToRangeFilter()

    class Meta:
        model = Sale
        fields = [
            "customer",
            "sale_date",
        ]