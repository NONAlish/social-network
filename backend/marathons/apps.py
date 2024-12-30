from django.apps import AppConfig


class MarathonsConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'marathons'

    def ready(self):
        import marathons.signals 
