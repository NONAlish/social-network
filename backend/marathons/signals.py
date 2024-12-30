from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from .models import Task, UserProgressEntity, Mile, Marathon


@receiver(post_save, sender=UserProgressEntity)
def update_user_progress(sender, instance, created, **kwargs):
    if instance.status=='Completed' and instance.entity_type=='Task':
        mile = instance.mile
        marathon = mile.marathon
        mile.calculate_progress()
        marathon.calculate_progress()
    elif instance.status=='Completed' and instance.entity_type=='Mile':
        marathon = mile.marathon
        marathon.calculate_progress()
    