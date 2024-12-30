import graphene
from teams.models import Team
from ..typesQL.teams import TeamType
from users.models import CustomUser

class CreateTeam(graphene.Mutation):
    class Arguments:
        name = graphene.String(required=True)
        creator_id = graphene.UUID(required=True)
        members_ids = graphene.List(graphene.UUID, required=True)

    team = graphene.Field(TeamType)

    def mutate(self, info, name, creator_id, members_ids):
        try:
            creator = CustomUser.objects.get(pk=creator_id)
        except CustomUser.DoesNotExist:
            raise Exception("Creator with the given ID does not exist.")
        
        members_users = CustomUser.objects.filter(pk__in=members_ids)
        
        team = Team.objects.create(
            name=name,
            created_by=creator,
            members=members_users
        )

        return CreateTeam(team=team)
    
class UpdateTeam(graphene.Mutation):
    class Arguments:
        id = graphene.Int(required=True)
        name = graphene.String()
        members_ids = graphene.List(graphene.UUID)

    team = graphene.Field(TeamType)

    def mutate(self, info, id, name=None, members_ids=None):
        try:
            team = Team.objects.get(pk=id)
        except Team.DoesNotExist:
            raise Exception("Team with the given ID does not exist.")
        

        if name:
            team.name = name
        
        if members_ids is not None:
            members_users = CustomUser.objects.filter(pk__in=members_ids)
            team.members.set(members_users)
        
        team.save()
        return UpdateTeam(team=team)
    

class DeleteTeam(graphene.Mutation):
    class Arguments:
        id = graphene.UUID(required=True)

    success = graphene.Boolean()
    message = graphene.String()

    def mutate(self, info, id):
        try:
            team = Team.objects.get(pk=id)
            team.delete()
            return DeleteTeam(success=True, message="Team was deleted successfully!")
        except Team.DoesNotExist:
            return DeleteTeam(success=False, message="No team with such id")

class TeamMutations(graphene.ObjectType):
    create_team = CreateTeam.Field()
    update_team = UpdateTeam.Field()
    delete_team = DeleteTeam.Field()
