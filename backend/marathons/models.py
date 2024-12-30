from django.db import models
from users.models import CustomUser
import uuid

class Category(models.Model):
    name = models.CharField(primary_key=True, max_length=20)

class SubCategory(models.Model):
    name = models.CharField(primary_key=True, max_length=20)
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='sub_categories')


class Marathon(models.Model):
    id = models.UUIDField(primary_key=True, editable=False, default=uuid.uuid4)
    creator = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='created_marathons')
    title = models.CharField(max_length=40)
    description = models.CharField(max_length=100)
    category = models.CharField(max_length=50)
    start_date = models.DateField(auto_now_add=True)
    end_date = models.DateField()
    max_participants = models.IntegerField(default=100)
    
    def __str__(self):
        return self.title
    

class Mile(models.Model):
    marathon = models.ForeignKey(Marathon, on_delete=models.CASCADE, related_name='miles')
    title = models.CharField(max_length=25)
    description = models.TextField(blank=True, null=True)
    order = models.IntegerField(help_text='The sequence of this mile in the marathon.')
    created_at = models.DateTimeField(auto_now_add=True)
    end_date = models.DateField()

    def __str__(self):
        return f"{self.title} (Marathon: {self.marathon.title})"


class Task(models.Model):
    mile = models.ForeignKey(Mile, on_delete=models.CASCADE, related_name='tasks')
    title = models.CharField(max_length=50)
    description = models.TextField(blank=True, null=True)
    order = models.IntegerField(help_text='The sequence of this task in the mile.')
    status = models.CharField(max_length=20, choices=[
        ('Not Started', 'Not Started'),
        ('In Progress', 'In Progress'),
        ('Completed', 'Completed')
    ], default='Not Started')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.title} (Mile: {self.mile.title})"


class MarathonParticipant(models.Model):
    marathon = models.ForeignKey(Marathon, on_delete=models.CASCADE, related_name='participants')
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='marathons')
    progress = models.FloatField(default=0)
    rank = models.IntegerField(blank=True, null=True)
    joined_at = models.DateTimeField(auto_now_add=True)
    can_be_till = models.DateTimeField(blank=True)

class UserProgressEntity(models.Model):
    ENTITY_TYPES = [
        ('Marathon', 'marathon'),
        ('Mile', 'mile'),
        ('Task', 'task')
    ]

    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='all_progress_types')
    entity_type = models.CharField(max_length=20, choices=ENTITY_TYPES)
    entity_id = models.PositiveIntegerField()
    progress = models.FloatField(null=True, blank=True)
    status = models.CharField(max_length=20, choices=[
        ('Not Started', 'Not Started'),
        ('In Progress', 'In Progress'),
        ('Completed', 'Completed')
    ], default='Not Started')
    started_at = models.DateTimeField(auto_now_add=True)
    completed_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        unique_together = ('user', 'entity_type', 'entity_id')
        indexes = [
            models.Index(fields=['user', 'entity_type', 'entity_id']),
        ]

    def __str__(self):
        return f"{self.user.username} - {self.entity_type} {self.entity_id}: {self.status}"
    
    def mark_completed(self):
        self.progress = 100
        self.status = 'Completed'
        self.completed_at = models.DateTimeField(auto_now=True)
        self.save()

    def calculate_progress(self):
        if self.entity_type == 'Marathon':
            miles = UserProgressEntity.objects.filter(
                user=self.user, entity_type='Mile', entity_id__in=self.get_related_mile_ids()
            )
            total_miles = miles.count()
            completed_miles = miles.filter(status='Completed').count()

            if total_miles > 0:
                self.progress = (completed_miles/total_miles) * 100
                self.status = 'Completed' if completed_miles==total_miles else 'In Progress'
            else:
                self.progress = 0.0
                self.status = 'Not Started'
            
            self.save()

        elif self.entity_type=='Mile':
            tasks = UserProgressEntity.objects.filter(
                user=self.user, entity_type='Task', entity_id__in=self.get_related_task_ids()
            )
            total_tasks = tasks.count()
            completed_tasks = tasks.filter(status='Completed').count()

            if total_tasks > 0:
                self.progress = (completed_tasks/total_tasks) * 100
                self.status = 'Completed' if completed_tasks==total_tasks else 'In Progress'
            else:
                self.progress = 0.0
                self.status = 'Not Started'

            self.save()

    
    def get_related_task_ids(self):
        return Task.objects.filter(mile=self.entity_id).values_list('id', flat=True)
    
    def get_related_mile_ids(self):
        return Mile.objects.filter(marathon=self.entity_id).values_list('id', flat=True)
