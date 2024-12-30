from rest_framework.viewsets import ModelViewSet
from chat.models import ChatRoom, Message
from .serializers import ChatRoomSerializer, MessageSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
from django.http import Http404
from rest_framework.response import Response
from rest_framework.status import HTTP_200_OK, HTTP_403_FORBIDDEN, HTTP_204_NO_CONTENT, HTTP_400_BAD_REQUEST, HTTP_201_CREATED
from django.shortcuts import get_object_or_404
from users.models import CustomUser
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync


class ChatRoomViewset(ModelViewSet):
    queryset = ChatRoom.objects.all()
    serializer = ChatRoomSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return self.queryset.filter(members=user)
    

    def retrieve(self, request, pk=None,  *args, **kwargs):
        chatroom = get_object_or_404(ChatRoom, pk=pk)
        chatroom_serializer = self.serializer(chatroom)
        messages = Message.objects.filter(chatroom=chatroom)
        messages_serializer = MessageSerializer(messages, many=True)

        data = chatroom_serializer.data

        data['messages'] = messages_serializer.data

        return Response({"chatroom_data": data}, status=HTTP_200_OK)
    



    @action(detail=True, methods=['post'], url_path="add-message")
    def post_message(self, request, pk=None):
        chatroom = get_object_or_404(ChatRoom, pk=pk)
        message = request.data.message

        new_message = Message.objects.create(chatroom=chatroom, sender=request.user, content=message)

        return Response({"detail": f"Message:{new_message} was added"}, status=HTTP_200_OK)
    
    @action(detail=True, methods=['delete'], url_path="delete-message")
    def delete_message(self, request, pk=None):
        chatroom = get_object_or_404(ChatRoom, pk=pk)
        message_id = request.data.message_id

        message = Message.objects.get(pk=message_id)
        message_serializer = MessageSerializer(message)
        message.delete()

        return Response({"detail": "Message: was deleted", "message_info":message_serializer.data}, status=HTTP_200_OK)

    


    

    
    @action(detail=False, methods=["post"], url_path="(?P<username>[^/.]+)")
    def start_chat(self, request, username=None):
        if request.user.username == username:
            return Response({"detail": "You cannot start a chat with yourself."}, status=HTTP_400_BAD_REQUEST)
        
        other_user = get_object_or_404(CustomUser, username=username)
        my_chatrooms = request.user.chat_rooms.filter(is_private=True)
    
        for chatroom in my_chatrooms:
            if other_user in chatroom.members.all():
                return Response({"chatroom_id": chatroom.id})
            
        chatroom = ChatRoom.get_or_create_private_chat(other_user, request.user)
        return Response({"chatroom_id": chatroom.id}, status=HTTP_201_CREATED)
    
    @action(detail=False, methods=["post"], url_path="new_groupchat")
    def new_groupchat(self, request):
        data = request.data
        data['chat_type'] = 'group'
        serializer = self.serializer(data=data)
        if serializer.is_valid():
            new_groupchat = serializer.save(admin=request.user)
        
            new_groupchat.members.add(request.user)
            
            response_serializer = self.serializer(new_groupchat)
            return Response(response_serializer.data, status=HTTP_201_CREATED)

        return Response(serializer.errors, status=HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['post'], url_path='remove_from_group')
    def remove_from_group(self, request):
        data = request.data

        chatroom_id = data.chatroom_id
        chatroom = get_object_or_404(ChatRoom, pk=chatroom_id)

        users_to_remove = data.users_to_remove

        if request.user == chatroom.admin:
            for user_pk in users_to_remove:
                user = get_object_or_404(CustomUser, pk=user_pk)
                if user in chatroom.members:
                    chatroom.members.remove(user)
            return Response({"detail": "Users removed"}, status=HTTP_200_OK)
        else:
            return Response({"detail": "No right permission"}, status=HTTP_403_FORBIDDEN)
    






    @action(detail=True, methods=['post'])
    def join(self, request, pk=None):
        chat_room = self.get_object()

        if chat_room.chat_type=='group' and request.user not in chat_room.members.all():
            raise Http404("You cannot join a private chat without an invitation.")
        chat_room.members.add(request.user)
        return Response({"detail": "You have joined the chat room."}, status=HTTP_200_OK)
    
    @action(detail=True, methods=['post'])
    def leave(self, request, pk=None):
        chat_room = self.get_object()
        if request.user not in chat_room.members.all():
            raise Http404("You are not a member of this chat room.")
        chat_room.members.remove(request.user)
        return Response({"detail": "You have left the chat room."}, status=HTTP_200_OK)
    
    @action(detail=True, methods=['post'], url_path="upload-file")
    def chat_file_upload(self, request, pk=None):
        chatroom = get_object_or_404(ChatRoom, pk=pk)
        chatroom_name = f"chatroom_{self.chatroom_id}"
        if request.FILES:
            file = request.FILES['file']
            message = Message.objects.create(
                file = file,
                sender = request.user, 
                chatroom = chatroom,
            )
            channel_layer = get_channel_layer()
            event = {
                'type': 'chat_message',
                'message': message.content,
                'message_type': 'file',
                'message_id': message.id,
            }
            async_to_sync(channel_layer.group_send)(
                chatroom_name, event
            )
        return Response({"detail": "File saved."}, status=HTTP_200_OK)
    
    def destroy(self, request, *args, **kwargs):
        chat_room = self.get_object()

        if request.user != chat_room.admin:
            return Response(
                {"detail": "Only the admin can delete this chatroom."},
                status=HTTP_403_FORBIDDEN
            )
        self.perform_destroy(chat_room)

        return Response(
            {"detail": "Chatroom deleted successfully."},
            status=HTTP_204_NO_CONTENT
        )




class MessageViewset(ModelViewSet):
    queryset = Message.objects.all()
    serializer = MessageSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        chatroom_id = self.request.query_params.get("chatroom")
        if chatroom_id:
            chatroom = get_object_or_404(ChatRoom, id=chatroom_id, members=self.request.user)
            return self.queryset.filter(chatroom=chatroom)
        return self.queryset.none()
    
    def perform_create(self, serializer):
        chatroom_id = self.request.data.get("chatroom_id")
        chatroom = get_object_or_404(ChatRoom, id=chatroom_id, members=self.request.user)
        serializer.save(sender=self.request.user, chatroom=chatroom)
