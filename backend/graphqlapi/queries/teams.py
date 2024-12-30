import graphene
from ..typesQL.teams import TeamType
from teams.models import Team

class TeamQuery(graphene.ObjectType):
    teams = graphene.List(TeamType)
    team = graphene.Field(TeamType, id=graphene.Int(required=True))

    def resolve_teams(self, info):
        return Team.objects.all()
    
    def resolve_team(self, info, id):
        return Team.objects.get(pk=id)
