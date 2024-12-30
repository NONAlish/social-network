from graphene_django.types import DjangoObjectType
from users.models import CustomUser

class CustomUserType(DjangoObjectType):
    class Meta:
        model = CustomUser
        fields = "__all__"