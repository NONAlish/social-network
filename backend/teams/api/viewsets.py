from rest_framework import viewsets
from teams.models import Team
from .serializers import TeamSerializer
from drf_spectacular.utils import extend_schema

class TeamViewSet(viewsets.ModelViewSet):
    queryset = Team.objects.all()
    serializer_class = TeamSerializer
