from django.contrib import admin
from chat.models import ChatRoom, Message


@admin.register(ChatRoom)
class AdminChatRoom(admin.ModelAdmin):
    pass

@admin.register(Message)
class AdminMessage(admin.ModelAdmin):
    pass


