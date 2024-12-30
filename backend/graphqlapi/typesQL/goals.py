from graphene_django.types import DjangoObjectType
from goals.models import Goal, Achievement, UserAchievement

class GoalType(DjangoObjectType):
    class Meta:
        model = Goal
        fields = "__all__" 

class AchievementType(DjangoObjectType):
    class Meta:
        model = Achievement
        fields = "__all__"

class UserAchievementType(DjangoObjectType):
    class Meta:
        model = UserAchievement
        fields = "__all__"