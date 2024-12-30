from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .viewsets import ChatRoomViewset, MessageViewset

router = DefaultRouter()

router.register(r'chatroom', ChatRoomViewset, basename='chatrooms')
router.register(r'messages', MessageViewset, basename='messages')

urlpatterns = [
    path('', include(router.urls))
]
