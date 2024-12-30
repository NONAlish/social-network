from graphene_django.types import DjangoObjectType
from marathons.models import Category, SubCategory, Marathon, Mile, Task, MarathonParticipant, UserProgressEntity


class CategoryType(DjangoObjectType):
    class Meta:
        model = Category
        fields = "__all__"

class SubCategoryType(DjangoObjectType):
    class Meta:
        model = SubCategory
        fields = "__all__"

class MarathonType(DjangoObjectType):
    class Meta:
        model = Marathon
        fields = "__all__"

class MileType(DjangoObjectType):
    class Meta:
        model = Mile
        fields = "__all__"

class TaskType(DjangoObjectType):
    class Meta:
        model = Task
        fields = "__all__"

class MarathonParticipantType(DjangoObjectType):
    class Meta:
        model = MarathonParticipant
        fields = "__all__"

class UserProgressEntityType(DjangoObjectType):
    class Meta:
        model = UserProgressEntity
        fields = "__all__"