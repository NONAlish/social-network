import graphene
from users.models import CustomUser
from ..typesQL.users import CustomUserType

class CustomUserQuery(graphene.ObjectType):
    users = graphene.List(CustomUserType)
    user = graphene.Field(CustomUserType, id=graphene.UUID(required=True))

    def resolve_users(self, info):
        return CustomUser.objects.all()
    
    def resolve_user(self, info, id):
        return CustomUser.objects.get(pk=id)
    