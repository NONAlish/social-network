from rest_framework.serializers import ModelSerializer, SerializerMethodField
from teams.models import Team
from users.api.serializers import CustomUserSerializer

class TeamSerializer(ModelSerializer):
    members = SerializerMethodField()
    class Meta:
        model = Team
        fields = "__all__"

    def get_members(self, obj):
        members = obj.members
        serializer = CustomUserSerializer(data=members, many=True)
        return serializer.data