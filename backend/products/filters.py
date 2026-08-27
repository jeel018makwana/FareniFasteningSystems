import django_filters

from .models import Product


class ProductFilter(django_filters.FilterSet):

    class Meta:
        model = Product

        fields = {
            "category": ["exact"],
            "product_type": ["exact"],
            "product_size": ["exact"],
            "brand": ["exact"],
            "grade": ["exact"],
            "is_active": ["exact"],
        }