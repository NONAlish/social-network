from django.db import models
from users.models import CustomUser

class Team(models.Model):
    name = models.CharField(max_length=100)
    created_by = models.ForeignKey(CustomUser, on_delete=models.DO_NOTHING)
    members = models.ManyToManyField(CustomUser, related_name="teams")
    created_at = models.DateTimeField(auto_now_add=True)

