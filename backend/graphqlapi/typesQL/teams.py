from graphene_django.types import DjangoObjectType
from teams.models import Team


class TeamType(DjangoObjectType):
    class Meta:
        model = Team
        fields = "__all__"