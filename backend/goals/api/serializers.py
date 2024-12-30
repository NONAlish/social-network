from rest_framework import serializers
from goals.models import Goal
from users.models import CustomUser

class GoalSerializer(serializers.ModelSerializer):
    creator = serializers.StringRelatedField(read_only=True)
    participants = serializers.PrimaryKeyRelatedField(
        many=True, queryset=CustomUser.objects.all()
    )

    class Meta:
        model = Goal
        fields = [
            'id', 
            'title', 
            'description', 
            'start_date', 
            'end_date', 
            'creator', 
            'participants',
        ]
        read_only_fields = ['id', 'creator']

    def validate(self, data):
        if 'start_date' in data and 'end_date' in data:
            if data['start_date'] > data['end_date']:
                raise serializers.ValidationError("End date must be after start date.")
        return data
