import graphene
from ..typesQL.marathons import MarathonType, MileType, TaskType
from users.models import CustomUser
from marathons.models import Marathon, Mile, Task

class CreateMarathon(graphene.Mutation):
    class Arguments:
        title = graphene.String(required=True)
        description = graphene.String()
        category = graphene.String(required=True)
        end_date = graphene.Date(required=True)
        max_participants = graphene.Int(default_value=100)
        creator_id = graphene.UUID(required=True)

    marathon = graphene.Field(MarathonType)

    def mutate(self, info, title, description, category, end_date, max_participants, creator_id):

        try:
            creator = CustomUser.objects.get(id=creator_id)
        except CustomUser.DoesNotExist:
            raise Exception("Creator with the given ID does not exist.")

        marathon = Marathon.objects.create(
            title=title,
            description=description,
            category=category,
            end_date=end_date,
            max_participants=max_participants,
            creator=creator,
        )
        return CreateMarathon(marathon=marathon)
    
class UpdateMarathon(graphene.Mutation):
    class Arguments:
        id = graphene.UUID(required=True)
        title = graphene.String()
        description = graphene.String()
        category = graphene.String()
        end_date = graphene.Date()
        max_participants = graphene.Int()

    marathon = graphene.Field(MarathonType)

    def mutate(self, info, id, **kwargs):
        try:
            marathon = Marathon.objects.get(id=id)
        except Marathon.DoesNotExist:
            raise Exception("Marathon with the given ID does not exist.")
        
        for key, value in kwargs.items():
            if value is not None:
                setattr(marathon, key, value)
        marathon.save()

        return UpdateMarathon(marathon=marathon)

class DeleteMarathon(graphene.Mutation):
    class Arguments:
        id = graphene.UUID(required=True)

    success = graphene.Boolean()
    message = graphene.String()

    def mutate(self, info, id):
        try:
            marathon = Marathon.objects.get(id=id)
            marathon.delete()
            return DeleteMarathon(success=True, message="Marathon deleted succesfully!")
        except Marathon.DoesNotExist:
            return DeleteMarathon(success=False, message="Marathon with such id was not found!")

class ManageMarathonParticipants(graphene.Mutation):
    class Arguments:
        marathon_id = graphene.UUID(required=True)
        participant_ids = graphene.List(graphene.Int, required=True)
        action = graphene.String(required=True)  # 'add' or 'remove'

    marathon = graphene.Field(MarathonType)

    def mutate(self, info, marathon_id, participant_ids, action):
        try:
            marathon = Marathon.objects.get(id=marathon_id)
        except Marathon.DoesNotExist:
            raise Exception("Marathon with the given ID does not exist.")

        participants = CustomUser.objects.filter(id__in=participant_ids)
        if not participants.exists():
            raise Exception("No valid participants found.")

        if action == "add":
            marathon.participants.add(*participants)
        elif action == "remove":
            marathon.participants.remove(*participants)
        else:
            raise Exception("Invalid action. Use 'add' or 'remove'.")

        marathon.save()
        return ManageMarathonParticipants(marathon=marathon)
    
class CreateMile(graphene.Mutation):
    class Arguments:
        marathon_id = graphene.UUID(required=True)
        title = graphene.String(required=True)
        description = graphene.String()
        order = graphene.Int(required=True)
        end_date = graphene.Date(required=True)

    mile = graphene.Field(MileType)

    def mutate(self, info, marathon_id, title, description, order, end_date):
        try:
            marathon = Marathon.objects.get(id=marathon_id)
        except Marathon.DoesNotExist:
            raise Exception("Marathon with the given ID does not exist.")

        mile = Mile.objects.create(
            marathon=marathon,
            title=title,
            description=description,
            order=order,
            end_date=end_date,
        )
        return CreateMile(mile=mile)
    

class CreateTask(graphene.Mutation):
    class Arguments:
        mile_id = graphene.Int(required=True)
        title = graphene.String(required=True)
        description = graphene.String()
        order = graphene.Int(required=True)
        status = graphene.String(default_value='Not Started')

    task = graphene.Field(TaskType)

    def mutate(self, info, mile_id, title, description, order, status):
        try:
            mile = Mile.objects.get(id=mile_id)
        except Mile.DoesNotExist:
            raise Exception("Mile with the given ID does not exist.")

        task = Task.objects.create(
            mile=mile,
            title=title,
            description=description,
            order=order,
            status=status,
        )
        return CreateTask(task=task)




class MarathonMutations(graphene.ObjectType):
    create_marathon = CreateMarathon.Field()
    update_marathon = UpdateMarathon.Field()
    delete_marathon = DeleteMarathon.Field()
    manage_marathon_participants = ManageMarathonParticipants.Field()
    create_mile = CreateMile.Field()
    create_task = CreateTask.Field()
