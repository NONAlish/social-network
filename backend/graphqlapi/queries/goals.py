import graphene
from ..typesQL.goals import GoalType
from goals.models import Goal

class GoalQuery(graphene.ObjectType):
    goals = graphene.List(GoalType)
    goal = graphene.Field(GoalType, id=graphene.Int(required=True))
    goals_by_creator = graphene.List(GoalType, creator_id=graphene.UUID(required=True))
    goals_by_participant = graphene.List(GoalType, participant_id=graphene.UUID(required=True))
    public_goals = graphene.List(GoalType)

    def resolve_goals(self, info):
        return Goal.objects.all()

    def resolve_goal(self, info, id):
        return Goal.objects.get(pk=id)
    
    def resolve_goals_by_creator(self, info, creator_id):
        return Goal.objects.filter(creator_id=creator_id)
    
    def resolve_goals_by_participant(self, info, participant_id):
        return Goal.objects.filter(participants__id=participant_id)

    def resolve_public_goals(self, info):
        return Goal.objects.filter(is_private=False)