from rest_framework.routers import DefaultRouter

from .views import InventoryTransactionViewSet

router = DefaultRouter()

router.register(
    "",
    InventoryTransactionViewSet,
    basename="inventory",
)

urlpatterns = router.urls