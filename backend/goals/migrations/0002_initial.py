# Generated by Django 4.2.17 on 2024-12-30 20:40

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('goals', '0001_initial'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.AddField(
            model_name='userachievement',
            name='user',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='user_achievements', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='goal',
            name='creator',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='goals', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='goal',
            name='participants',
            field=models.ManyToManyField(blank=True, related_name='shared_goals', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='achievement',
            name='goal',
            field=models.OneToOneField(on_delete=django.db.models.deletion.PROTECT, related_name='achievement', to='goals.goal'),
        ),
        migrations.AddIndex(
            model_name='userachievement',
            index=models.Index(fields=['user', 'achievement'], name='goals_usera_user_id_8239d2_idx'),
        ),
        migrations.AlterUniqueTogether(
            name='userachievement',
            unique_together={('user', 'achievement')},
        ),
    ]