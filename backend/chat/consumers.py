import json
from channels.generic.websocket import WebsocketConsumer, JsonWebsocketConsumer
from asgiref.sync import async_to_sync
from .models import ChatRoom, Message
from django.shortcuts import get_object_or_404
from users.models import CustomUser
from chat.api.serializers import ChatRoomSerializer, MessageSerializer


class ChatConsumer(JsonWebsocketConsumer):
    def connect(self):
        self.user = self.scope['user']
        self.chatroom_id = self.scope['url_route']['kwargs']['chatroom_id']
        self.chatroom_name = f"chatroom_{self.chatroom_id}"

        self.chatroom = ChatRoom.objects.get(pk=self.chatroom_id)

        async_to_sync(self.channel_layer.group_add)(
            self.chatroom_name,
            self.channel_name
        )

        if self.user not in self.chatroom.users_online.all():
            self.chatroom.users_online.add(self.user)
            self.update_online_count()


        self.accept()

    def disconnect(self, close_code):
        async_to_sync(self.channel_layer.group_discard)(
            self.chatroom_name, self.channel_name
        )

        if self.user in self.chatroom.users_online.all():
            self.chatroom.users_online.remove(self.user)
            self.update_online_count()



    def receive(self, text_data=None):
        text_data_json = json.loads(text_data)
        text_message = text_data_json['message']
        sender = self.scope['user'].username

        Message.objects.create(
            chat_room=self.chatroom,
            sender=sender,
            content=text_message
        )

        async_to_sync(self.channel_layer.group_send)(
            self.chatroom_name,
            {
                'type': 'chat_message',
                'message': text_message,
                'sender': sender,
            }
        )
    
    def chat_message(self, event):
        if event['message_type']=='file':
            message = Message.objects.get(pk=event['message_id'])
            message_serializer = MessageSerializer(message)

            return self.send_json({
                'message_type': 'file',
                'url': message.file.url,
                'message': message_serializer.data,
                'sender': event['sender'],
                'chatroom': self.chatroom
            })

        self.send_json({
            'message_type': 'text',
            'message': message_serializer.data,
            'sender': event['sender'],
            'chatroom': self.chatroom
        })

    def update_online_count(self):
        online_count = self.chatroom.users_online.count()

        event = {
            'type': 'online_count_handler',
            'online_count': online_count
        }

        async_to_sync(self.channel_layer.group_send)(
            self.chatroom_name, event
        )

    def online_count_handler(self, event):
        online_count = event['online_count']

        chat_messages = ChatRoom.objects.get(name=self.chatroom_name).chat_messages.all()[:30]
        author_ids = set([message.author.id for message in chat_messages])
        users = CustomUser.objects.filter(id__in=author_ids)

        self.send_json({
            'type': 'message',
            'online_count': online_count,
            'users': users,
            'chatroom' : ChatRoomSerializer(self.chatroom).data,
        })



class OnlineStatusConsumer(JsonWebsocketConsumer):

    def connect(self):
        self.user = self.scope['user']
        self.group_name = 'online-status'
        self.group = get_object_or_404(ChatRoom, name=self.group_name)

        if self.user not in self.group.users_online.all():
            self.group.users_online.add(self.user)
        async_to_sync(self.channel_layer.group_add)(
            self.group_name, self.channel_name
        )
        self.accept()
        self.online_status()


    def disconnect(self, close_code):
        if self.user in self.group.users_online.all():
            self.group.users_online.remove(self.user)

        async_to_sync(self.channel_layer.group_discard)(
            self.group_name, self.channel_name
        )
        self.online_status()
    
    def online_status(self):
        event = {
            'type': 'online_status_handler'
        }
        
        async_to_sync(self.channel_layer.group_send)(
            self.group_name, event
        )

    def online_status_handler(self, event):
        online_users = self.group.users_online.exclude(id=self.user.id)
        context = {
            "online_users": online_users
        }

        self.send_json(context)



