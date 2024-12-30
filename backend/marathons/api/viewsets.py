from rest_framework.viewsets import ReadOnlyModelViewSet, ModelViewSet
from rest_framework.permissions import IsAuthenticatedOrReadOnly, IsAuthenticated
from rest_framework import status
from rest_framework.decorators import action
from rest_framework.response import Response
from marathons.models import Category, SubCategory, Marathon, Mile, Task, MarathonParticipant, UserProgressEntity
from .serializers import (
    CategorySerializer,
    SubCategorySerializer,
    MarathonSerializer,
    MileSerializer,
    TaskSerializer,
    MarathonParticipantSerializer,
    UserProgressEntitySerializer,
)


class CategoryViewSet(ModelViewSet):

    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [IsAuthenticatedOrReadOnly]


class SubCategoryViewSet(ModelViewSet):

    queryset = SubCategory.objects.all()
    serializer_class = SubCategorySerializer
    permission_classes = [IsAuthenticatedOrReadOnly]


class MarathonViewSet(ModelViewSet):

    queryset = Marathon.objects.all()
    serializer_class = MarathonSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(creator=self.request.user)

    @action(detail=True, methods=['post'])
    def join(self, request, pk=None):
 
        marathon = self.get_object()
        participant, created = MarathonParticipant.objects.get_or_create(
            marathon=marathon,
            user=request.user
        )
        if created:
            return Response({"message": "Successfully joined the marathon."}, status=status.HTTP_201_CREATED)
        return Response({"message": "You are already a participant."}, status=status.HTTP_400_BAD_REQUEST)


class MileViewSet(ModelViewSet):

    queryset = Mile.objects.all()
    serializer_class = MileSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]


class TaskViewSet(ModelViewSet):

    queryset = Task.objects.all()
    serializer_class = TaskSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]


class MarathonParticipantViewSet(ModelViewSet):

    queryset = MarathonParticipant.objects.all()
    serializer_class = MarathonParticipantSerializer
    permission_classes = [IsAuthenticated]


class UserProgressEntityViewSet(ModelViewSet):
    queryset = UserProgressEntity.objects.all()
    serializer_class = UserProgressEntitySerializer
    permission_classes = [IsAuthenticated]

    @action(detail=True, methods=['post'])
    def mark_complete(self, request, pk=None):
  
        progress_entity = self.get_object()
        progress_entity.mark_completed()
        return Response({"message": "Entity marked as completed."}, status=status.HTTP_200_OK)

    @action(detail=False, methods=['get'])
    def my_progress(self, request):

        progress_entities = UserProgressEntity.objects.filter(user=request.user)
        serializer = self.get_serializer(progress_entities, many=True)
        return Response(serializer.data)
