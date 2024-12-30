from rest_framework.serializers import ModelSerializer, SerializerMethodField
from chat.models import ChatRoom, Message

class ChatRoomSerializer(ModelSerializer):

    class Meta:
        model = ChatRoom
        fields = "__all__"
        depth = 1



class GroupChatSerializer(ModelSerializer):
    class Meta:
        model = ChatRoom
        fields = "__all__"

class PrivateChatSerializer(ModelSerializer):
    class Meta:
        model = ChatRoom
        exclude = ['']

class MessageSerializer(ModelSerializer):
    class Meta:
        model = Message
        fields = "__all__"