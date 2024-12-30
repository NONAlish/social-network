import graphene 
from graphene_django import DjangoObjectType
from goals.models import Goal, Achievement, UserAchievement
from marathons.models import Category, SubCategory, Marathon, Mile, Task, MarathonParticipant, UserProgressEntity
from teams.models import Team
from users.models import CustomUser
from .typesQL.goals import GoalType, AchievementType, UserAchievementType
from .typesQL.marathons import MarathonType, MarathonParticipantType, CategoryType, SubCategoryType, MileType, TaskType, UserProgressEntityType
from .typesQL.teams import TeamType
from .typesQL.users import CustomUserType


class Query(graphene.ObjectType):

    # Goals Models
    all_goals = graphene.List(GoalType)
    goal_by_id = graphene.Field(GoalType, id=graphene.Int())
    all_achievements = graphene.List(AchievementType)
    achievement_by_id = graphene.Field(AchievementType, id=graphene.UUID())
    all_user_achievements = graphene.List(UserAchievementType)
    user_achievement_by_id = graphene.Field(UserAchievementType, id=graphene.UUID())
    # Marathon Models
    all_categories = graphene.List(CategoryType)
    all_subcategories = graphene.List(SubCategoryType)
    all_marathons = graphene.List(MarathonType)
    all_miles = graphene.List(MileType)
    all_tasks = graphene.List(TaskType)
    all_participants = graphene.List(MarathonParticipantType)
    all_user_progress_entities = graphene.List(UserProgressEntityType)

    # Teams Models
    all_teams = graphene.List(TeamType)

    # Users Models
    all_users = graphene.List(CustomUserType)

    def resolve_all_goals(root, info):
        return Goal.objects.all()

    def resolve_goal_by_id(root, info, id):
        try:
            return Goal.objects.get(id=id)
        except Goal.DoesNotExist:
            return None
    
    def resolve_all_achievements(root, info):
        return Achievement.objects.all()
    
    def resolve_achievement_by_id(root, info, id):
        return Achievement.objects.get(pk=id)
    
    def resolve_all_users(root, info):
        return CustomUser.objects.all()


class GoalMutation(graphene.Mutation):
    class Arguments:
        id = graphene.Int(required=True)
        title = graphene.String()
        description = graphene.String()
        is_private = graphene.Boolean()

    goal = graphene.Field(GoalType)

    @classmethod
    def mutate(cls, root, info, title, description, id, is_private):
        goal = Goal.objects.get(pk=id)
        goal.description = description
        goal.title = title
        goal.is_private = is_private
        goal.save()
        return GoalMutation(goal=goal)

class Mutation(graphene.ObjectType):
    update_goal = GoalMutation.Field()


schema = graphene.Schema(query=Query, mutation=Mutation)