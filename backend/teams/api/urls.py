from rest_framework.routers import DefaultRouter
from teams.api.viewsets import TeamViewSet

router = DefaultRouter()
router.register(r'', TeamViewSet)

urlpatterns = router.urls
