from rest_framework import serializers
from marathons.models import Category, SubCategory, Marathon, Mile, Task, MarathonParticipant, UserProgressEntity

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__' 


class SubCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = SubCategory
        fields = '__all__'


class MarathonSerializer(serializers.ModelSerializer):
    creator = serializers.ReadOnlyField(source='creator.username')

    class Meta:
        model = Marathon
        fields = '__all__'


class MileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Mile
        fields = '__all__' 


class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = '__all__' 


class MarathonParticipantSerializer(serializers.ModelSerializer):
    user = serializers.ReadOnlyField(source='user.username')
    marathon = serializers.ReadOnlyField(source='marathon.name')

    class Meta:
        model = MarathonParticipant
        fields = '__all__' 


class UserProgressEntitySerializer(serializers.ModelSerializer):
    user = serializers.ReadOnlyField(source='user.username')
    entity_type = serializers.CharField(source='get_entity_type_display')

    class Meta:
        model = UserProgressEntity
        fields = '__all__' 
