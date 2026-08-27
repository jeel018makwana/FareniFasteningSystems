from rest_framework.routers import DefaultRouter

from .views import (
    CategoryViewSet,
    ProductTypeViewSet,
    ProductSizeViewSet,
    ProductLengthViewSet,
    BrandViewSet,
    ProductViewSet,
)


router = DefaultRouter()

router.register(
    "categories",
    CategoryViewSet,
)

router.register(
    "product-types",
    ProductTypeViewSet,
)

router.register(
    "product-sizes",
    ProductSizeViewSet,
)

router.register(
    "product-lengths",
    ProductLengthViewSet
)

router.register(
    "brands",
    BrandViewSet,
)

router.register(
    "products",
    ProductViewSet,
)


urlpatterns = router.urls