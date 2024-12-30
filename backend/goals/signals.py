from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Goal, Achievement

@receiver(post_save, sender=Goal)
def check_goal_completion(sender, instance, created, **kwargs):
    if instance.status == 'Completed':
        Achievement.objects.create(
            goal = instance,
            title=f"Completed goal: {instance.title}"
        )
    

