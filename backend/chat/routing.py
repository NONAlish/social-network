from django.urls import re_path, path
from .consumers import ChatConsumer, OnlineStatusConsumer

websocket_urlpatterns = [
    path("ws/chatroom/<chatroom_name>", ChatConsumer.as_asgi()),
    path("ws/online-status/", OnlineStatusConsumer.as_asgi())
]