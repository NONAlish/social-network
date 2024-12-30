from django.db import models
import uuid
from users.models import CustomUser
from django.utils import timezone

class Goal(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    is_private = models.BooleanField(default=False)
    start_date = models.DateField(default=timezone.now)
    end_date = models.DateField()
    creator = models.ForeignKey(CustomUser, related_name='goals', on_delete=models.CASCADE)
    participants = models.ManyToManyField(CustomUser, related_name='shared_goals', blank=True)

    
    def __str__(self):
        return self.title
    
class Achievement(models.Model):
    id = models.UUIDField(default=uuid.uuid4, primary_key=True, editable=False)
    goal = models.OneToOneField(Goal, on_delete=models.PROTECT, related_name='achievement')
    title = models.CharField(max_length=50, blank=False, null=False)
    date_earned = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Completed goal: {self.goal.title}"
    
class UserAchievement(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name="user_achievements")
    achievement = models.ForeignKey(Achievement, on_delete=models.DO_NOTHING, related_name="user_achievements")
    goal = models.ForeignKey(Goal, on_delete=models.DO_NOTHING, related_name="user_achievements")
    date_awarded = models.DateTimeField(auto_now_add=True)
    notes = models.TextField(blank=True, null=True)
    is_recognized = models.BooleanField(default=False) 

    class Meta:
        unique_together = ("user", "achievement") 
        ordering = ["-date_awarded"]
        indexes = [
            models.Index(fields=['user', 'achievement'])
        ]

    def __str__(self):
        return f"{self.user.get_username()} - {self.achievement.title}"
    
    def mark_as_recognized(self):
        self.is_recognized = True
        self.save()


