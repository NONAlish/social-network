from rest_framework.routers import DefaultRouter
from django.urls import path, include
from .viewsets import (
    CategoryViewSet,
    SubCategoryViewSet,
    MarathonViewSet,
    MileViewSet,
    TaskViewSet,
    MarathonParticipantViewSet,
    UserProgressEntityViewSet
)

router = DefaultRouter()
router.register(r'categories', CategoryViewSet, basename='category')
router.register(r'subcategories', SubCategoryViewSet, basename='subcategory')
router.register(r'marathons', MarathonViewSet, basename='marathon')
router.register(r'miles', MileViewSet, basename='mile')
router.register(r'tasks', TaskViewSet, basename='task')
router.register(r'participants', MarathonParticipantViewSet, basename='participant')
router.register(r'progress', UserProgressEntityViewSet, basename='progress')

urlpatterns = [
    path('', include(router.urls)),
]
