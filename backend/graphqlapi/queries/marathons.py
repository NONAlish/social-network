import graphene
from ..typesQL.marathons import CategoryType, SubCategoryType, MarathonType, MileType, TaskType, MarathonParticipantType, UserProgressEntityType
from marathons.models import Category, SubCategory, Marathon, Mile, Task, MarathonParticipant, UserProgressEntity


class MarathonQuery(graphene.ObjectType):

    all_categories = graphene.List(CategoryType)
    all_subcategories = graphene.List(SubCategoryType, category_name=graphene.String())
    all_marathons = graphene.List(MarathonType)
    marathon = graphene.Field(MarathonType, id=graphene.UUID(required=True))
    all_miles = graphene.List(MileType, marathon_id=graphene.UUID(required=True))
    all_tasks = graphene.List(TaskType, mile_id=graphene.Int(required=True))
    all_participants = graphene.List(MarathonParticipantType, marathon_id=graphene.UUID(required=True))
    user_progress = graphene.List(UserProgressEntityType, user_id=graphene.Int(required=True))

    def resolve_all_categories(self, info):
        return Category.objects.all()

    def resolve_all_subcategories(self, info, category_name=None):
        if category_name:
            return SubCategory.objects.filter(category__name=category_name)
        return SubCategory.objects.all()

    def resolve_all_marathons(self, info):
        return Marathon.objects.all()

    def resolve_marathon(self, info, id):
        try:
            return Marathon.objects.get(id=id)
        except Marathon.DoesNotExist:
            return None

    def resolve_all_miles(self, info, marathon_id):
        return Mile.objects.filter(marathon_id=marathon_id)

    def resolve_all_tasks(self, info, mile_id):
        return Task.objects.filter(mile_id=mile_id)

    def resolve_all_participants(self, info, marathon_id):
        return MarathonParticipant.objects.filter(marathon_id=marathon_id)

    def resolve_user_progress(self, info, user_id):
        return UserProgressEntity.objects.filter(user_id=user_id)
