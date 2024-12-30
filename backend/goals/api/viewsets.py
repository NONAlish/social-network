from rest_framework.response import Response
from rest_framework import status
from rest_framework.exceptions import ValidationError
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from drf_spectacular.utils import extend_schema, OpenApiParameter
from users.models import CustomUser
from goals.models import Goal
from rest_framework.viewsets import ModelViewSet
from .serializers import GoalSerializer
from .serializers import GoalSerializer
from rest_framework.decorators import action
from django.db.models import Q

class GoalViewSet(ModelViewSet):
    queryset = Goal.objects.all()
    serializer_class = GoalSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Goal.objects.filter(
            Q(is_private=False) | Q(creator=user) | Q(participants=user)
        ).distinct()


    def perform_create(self, serializer):
        serializer.save(creator=self.request.user)

    @action(detail=True, methods=['post'])
    def join(self, request, pk=None):
        goal = self.get_object()
        if request.user not in goal.participants.all():
            goal.participants.add(request.user)
            return Response({"message": "You have joined the goal!"}, status=status.HTTP_200_OK)
        return Response({"message": "You are already a participant."}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['post'])
    def leave(self, request, pk=None):
        goal = self.get_object()
        if request.user in goal.participants.all():
            goal.participants.remove(request.user)
            return Response({"message": "You have left the goal."}, status=status.HTTP_200_OK)
        return Response({"message": "You are not a participant."}, status=status.HTTP_400_BAD_REQUEST)

    
    @action(detail=False, methods=['get'])
    def my_goals(self, request):
        user_goals = Goal.objects.filter(creator=request.user)
        serializer = self.get_serializer(user_goals, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def shared_with_me(self, request):
        shared_goals = Goal.objects.filter(participants=request.user).exclude(creator=request.user)
        serializer = self.get_serializer(shared_goals, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def share(self, request, pk=None):
        goal = self.get_object()
        user_ids = request.data.get('user_ids', [])
        new_added_users = []
        already_added_users= []
        for user_id in user_ids:
            user = CustomUser.objects.get(id=user_id)
            if user and user != goal.creator and user not in goal.participants.all():
                goal.participants.add(user)
                new_added_users.append(user.username)
            elif user in goal.participants.all():
                already_added_users.append(user.username)
        if new_added_users:
            return Response({"message": f"Goal shared with: {', '.join(new_added_users)}"}, status=status.HTTP_200_OK)
        return Response({"message": "No valid users to share the goal with."}, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['get'])
    def search(self, request):
        query = request.query_params.get('q', '')
        if query:
            results = Goal.objects.filter(
                Q(title__icontains=query) | Q(description__icontains=query)
            )
            serializer = self.get_serializer(results, many=True)
            return Response(serializer.data)
        return Response({"message": "No query provided."}, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=['patch'])
    def toggle_privacy(self, request):
        goal = self.get_object()
        if goal.creator != request.user:
            return Response({"message": "You are not the creator of this goal."}, status=status.HTTP_403_FORBIDDEN)
        
        goal.is_private = not goal.is_private
        goal.save()
        privacy_status = "private" if goal.is_private else "public"
        return Response({"message": f"The goal is now {privacy_status}."}, status=status.HTTP_200_OK)





