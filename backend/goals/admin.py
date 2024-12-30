from django.contrib import admin
from goals.models import Goal, Achievement, UserAchievement


class GoalInline(admin.TabularInline):
    model = Goal
    extra = 0

class UserAchievementInline(admin.TabularInline):
    model = UserAchievement
    extra = 0

@admin.register(Goal)
class AdminGoal(admin.ModelAdmin):
    list_display = ('title', 'is_private', 'start_date', 'end_date', 'creator')
    list_filter = ('is_private', 'start_date', 'end_date', 'creator')
    search_fields = ('title', 'description')
    ordering = ('-start_date',)

    fieldsets = (
        ('Basic Info', {'fields': ('title', 'description', 'is_private', 'start_date', 'end_date')}),
        ('People', {'fields': ('creator', 'participants')}),
    )

@admin.register(Achievement)
class AdminAchievement(admin.ModelAdmin):
    list_display = ('title', 'goal', 'date_earned')
    list_filter = ('goal', 'date_earned')
    search_fields = ('goal', 'title')
    readonly_fields = ('id', 'date_earned')

    fieldsets = (
        ('Basic Info', {'fields': ('title', 'id', 'date_earned')}),
        ('Goal', {'fields': ('goal', )}),
    )

@admin.register(UserAchievement)
class AdminUserAchievement(admin.ModelAdmin):
    pass

