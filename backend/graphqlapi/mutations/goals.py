import graphene
from graphqlapi.typesQL.goals import GoalType, Goal
from users.models import CustomUser

class CreateGoal(graphene.Mutation):
    class Arguments:
        title = graphene.String(required=True)
        description = graphene.String(required=True)
        is_private = graphene.Boolean(default_value=False)
        start_date = graphene.Date(required=True)
        end_date = graphene.Date(required=True)
        creator_id = graphene.Int(required=True)
        participant_ids = graphene.List(graphene.Int, required=False)

    goal = graphene.Field(GoalType)

    def mutate(self, info, title, end_date, creator_id, participant_ids=None, **kwargs):

        try:
            creator = CustomUser.objects.get(id=creator_id)
        except CustomUser.DoesNotExist:
            raise Exception("Creator with the given ID does not exist.")

        goal = Goal.objects.create(
            title=title,
            description=kwargs.get("description", ""),
            is_private=kwargs.get("is_private", False),
            start_date=kwargs.get("start_date"),
            end_date=end_date,
            creator=creator,
        )

        if participant_ids:
            participants = CustomUser.objects.filter(id__in=participant_ids)
            goal.participants.add(*participants)

        return CreateGoal(goal=goal)


class UpdateGoal(graphene.Mutation):
    class Arguments:
        id = graphene.Int(required=True)
        title = graphene.String()
        description = graphene.String()
        is_private = graphene.Boolean()
        start_date = graphene.Date()
        end_date = graphene.Date()
        participant_ids = graphene.List(graphene.UUID, required=False)

    goal = graphene.Field(GoalType)

    def mutate(self, info, id, participant_ids, **kwargs):
        try:
            goal = Goal.objects.get(pk=id)
        except Goal.DoesNotExist:
            raise Exception("Goal with the given ID does not exist.")
        
        for field, value in kwargs.items():
            if value is not None:
                setattr(goal, field, value)
        goal.save()

        if participant_ids is not None:
            participants = CustomUser.objects.filter(id__in=participant_ids)
            goal.participants.set(participants)
        
        return UpdateGoal(goal=goal)

class DeleteGoal(graphene.Mutation):
    class Arguments:
        id = graphene.Int(required=True)
    
    success = graphene.Boolean()
    message = graphene.String()
    def mutate(self, info, id):
        try:
            goal = Goal.objects.get(pk=id)
            goal.delete()
            return DeleteGoal(success=True, message="Goal was deleted successfully")
        except Goal.DoesNotExist:
            return DeleteGoal(success=False, message="No goal with such id was found")
        
        
class GoalMutations(graphene.ObjectType):
    create_goal = CreateGoal.Field()
    update_goal = UpdateGoal.Field()
    delete_goal = DeleteGoal.Field()
