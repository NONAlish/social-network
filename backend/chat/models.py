from django.db import models
from users.models import CustomUser
import uuid
import os
from PIL import Image

class ChatType(models.TextChoices):
    GROUP = "group", "Group"
    PRIVATE = "private", "Private"


class ChatRoom(models.Model):
    id = models.UUIDField(default=uuid.uuid4, primary_key=True)
    name = models.CharField(max_length=255, null=True, blank=True)
    chat_type = models.CharField(max_length=10, choices=ChatType.choices, default=ChatType.GROUP)
    members = models.ManyToManyField(CustomUser, related_name="chat_rooms")
    users_online = models.ManyToManyField(CustomUser, related_name="online_in_groups", blank=True)
    admin = models.ForeignKey(CustomUser, related_name='groupchats', blank=True, null=True, on_delete=models.SET_NULL)

    def __str__(self):
        if self.chat_type == ChatType.GROUP:
            return f"Group: {self.name}"
        else:
            return f"Private Chat: {', '.join(member.username for member in self.members.all())}"

    @classmethod
    def get_or_create_private_chat(cls, user1, user2):
        chat_room = cls.objects.filter(
            chat_type=ChatType.PRIVATE,
            members__in=[user1]
        ).filter(members__in=[user2]).distinct()

        if chat_room.exists():
            return chat_room.first()
        else:
            new_chat = ChatRoom.objects.create(chat_type=ChatType.PRIVATE)
            new_chat.members.add(user1, user2)
            return new_chat



class Message(models.Model):
    chatroom = models.ForeignKey(ChatRoom, on_delete=models.CASCADE, related_name="messages")
    sender = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    content = models.TextField(blank=True, null=True)
    file = models.FileField(upload_to="files/", blank=True, null=True)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.sender.username}: {self.content[:50]}"
    
    @property
    def filename(self):
        if self.file:
            return os.path.basename(self.file.name)
        else:
            return None

    
    class Meta:
        ordering = ['-timestamp']

    @property
    def is_image(self):
        try:
            image = Image.open(self.file)
            image.verify()
            return True
        except:
            return False