from rest_framework import viewsets

from rest_framework.permissions import IsAuthenticated

from django_filters.rest_framework import DjangoFilterBackend

from rest_framework.filters import (
    SearchFilter,
    OrderingFilter,
)

from .models import (
    Category,
    ProductType,
    ProductSize,
    ProductLength,
    Brand,
    Product,
)

from .serializers import (
    CategorySerializer,
    ProductTypeSerializer,
    ProductSizeSerializer,
    ProductLengthSerializer,
    BrandSerializer,
    ProductSerializer,
)

from .filters import ProductFilter

from logs.utils import log_activity


# =========================================================
# CATEGORY
# =========================================================

class CategoryViewSet(viewsets.ModelViewSet):

    queryset = Category.objects.all()

    serializer_class = CategorySerializer

    permission_classes = [
        IsAuthenticated
    ]

    search_fields = [
        "name",
        "description",
    ]


# =========================================================
# PRODUCT TYPE
# =========================================================

class ProductTypeViewSet(viewsets.ModelViewSet):

    queryset = ProductType.objects.select_related(
        "category"
    )

    serializer_class = ProductTypeSerializer

    permission_classes = [
        IsAuthenticated
    ]

    filter_backends = [
        DjangoFilterBackend,
        SearchFilter,
        OrderingFilter,
    ]

    filterset_fields = [
        "category",
    ]

    search_fields = [
        "name",
        "description",
        "category__name",
    ]

    ordering_fields = [
        "name",
        "category__name",
    ]

    ordering = [
        "name",
    ]


# =========================================================
# PRODUCT SIZE
# =========================================================

class ProductSizeViewSet(viewsets.ModelViewSet):

    queryset = ProductSize.objects.select_related(
        "product_type",
        "product_type__category",
    )

    serializer_class = ProductSizeSerializer

    permission_classes = [
        IsAuthenticated
    ]

    filter_backends = [
        DjangoFilterBackend,
        SearchFilter,
        OrderingFilter,
    ]

    filterset_fields = [
        "product_type",
        "product_type__category",
    ]

    search_fields = [
        "name",
        "description",
        "product_type__name",
        "product_type__category__name",
    ]

    ordering_fields = [
        "name",
        "product_type__name",
    ]

    ordering = [
        "name",
    ]


# =========================================================
# BRAND
# =========================================================

class BrandViewSet(viewsets.ModelViewSet):

    queryset = Brand.objects.all()

    serializer_class = BrandSerializer

    permission_classes = [
        IsAuthenticated
    ]

    search_fields = [
        "name",
        "description",
    ]


# =========================================================
# PRODUCT LENGTH
# =========================================================

class ProductLengthViewSet(viewsets.ModelViewSet):

    queryset = ProductLength.objects.select_related(
        "product_size",
        "product_size__product_type",
        "product_size__product_type__category",
    )

    serializer_class = ProductLengthSerializer

    permission_classes = [
        IsAuthenticated
    ]

    filter_backends = [
        DjangoFilterBackend,
        SearchFilter,
        OrderingFilter,
    ]

    filterset_fields = [
        "product_size",
        "product_size__product_type",
        "product_size__product_type__category",
    ]

    search_fields = [
        "name",
        "description",
        "product_size__name",
        "product_size__product_type__name",
        "product_size__product_type__category__name",
    ]

    ordering_fields = [
        "name",
        "product_size__name",
    ]

    ordering = [
        "name",
    ]

# =========================================================
# PRODUCT
# =========================================================

class ProductViewSet(viewsets.ModelViewSet):

    queryset = Product.objects.filter(
        is_active=True
    ).select_related(
        "category",
        "product_type",
        "product_size",
        "brand",
    )

    serializer_class = ProductSerializer

    permission_classes = [
        IsAuthenticated
    ]

    filter_backends = [
        DjangoFilterBackend,
        SearchFilter,
        OrderingFilter,
    ]

    filterset_class = ProductFilter

    search_fields = [
        "product_code",
        "name",
        "grade",
        "thread_pitch",
        "size",
        "material",

        # New fields
        "category__name",
        "product_type__name",
        "product_size__name",
        "brand__name",
    ]

    ordering_fields = [
        "name",
        "selling_price",
        "purchase_price",
        "current_stock",
    ]

    ordering = [
        "name",
    ]

    # -----------------------------------------------------
    # CREATE
    # -----------------------------------------------------

    def perform_create(self, serializer):

        product = serializer.save()

        log_activity(
            user=self.request.user,
            action="CREATE",
            module="Products",
            description=f"Created product: {product.name}",
        )

    # -----------------------------------------------------
    # UPDATE
    # -----------------------------------------------------

    def perform_update(self, serializer):

        product = serializer.save()

        log_activity(
            user=self.request.user,
            action="UPDATE",
            module="Products",
            description=f"Updated product: {product.name}",
        )

    # -----------------------------------------------------
    # DELETE
    # -----------------------------------------------------

    def perform_destroy(self, instance):
        instance.is_active = False 
        instance.save(update_fields=["is_active"])

        log_activity(
            user=self.request.user,
            action="DELETE",
            module="Products",
            description=f"Deleted product: {instance.name}",
        )