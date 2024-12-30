from django.contrib import admin
from .models import CustomUser
from goals.admin import GoalInline, UserAchievementInline

admin.site.site_header = "Vutura Administration"
admin.site.site_title = "Admin Portal"
admin.site.index_title = "Vutura"

class UserInline(admin.StackedInline):
    model = CustomUser
    extra=1

def mark_as_private(modeladmin, request, queryset):
    queryset.update(privacy_settings='private')
mark_as_private.short_description = 'Mark users private'

def mark_as_public(modeladmin, request, queryset):
    queryset.update(privacy_settings='public')
mark_as_public.short_description = 'Mark users public'

@admin.register(CustomUser)
class UserAdmin(admin.ModelAdmin):
    inlines = [GoalInline, UserAchievementInline]
    actions = [mark_as_private, mark_as_public]

