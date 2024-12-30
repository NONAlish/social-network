from django.contrib import admin
from marathons.models import Category, SubCategory, Marathon, Mile, Task, MarathonParticipant, UserProgressEntity

class SubCategoryInline(admin.StackedInline):
    model = SubCategory
    extra = 0


@admin.register(Category)
class AdminCategory(admin.ModelAdmin):
    list_display = ['name']
    search_fields = ['name']
    inlines = [SubCategoryInline]

class TaskInline(admin.TabularInline):
    model = Task
    extra = 1
    fields = ('title', 'description', 'order', 'status')
    readonly_fields = ('created_at',)
    show_change_link = True
    ordering = ('order',)


class MileInline(admin.TabularInline):
    model = Mile
    extra = 1
    fields = ('title', 'description', 'order', 'end_date')
    readonly_fields = ('created_at',)
    show_change_link = True
    ordering = ('order',)


@admin.register(Marathon)
class MarathonAdmin(admin.ModelAdmin):
    list_display = ('title', 'creator', 'category', 'start_date', 'end_date', 'max_participants')
    search_fields = ('title', 'description', 'category', 'creator__username')
    list_filter = ('category', 'start_date', 'end_date')
    ordering = ('start_date', 'end_date')
    readonly_fields = ('start_date',)
    inlines = [MileInline]


@admin.register(Mile)
class MileAdmin(admin.ModelAdmin):
    list_display = ('title', 'marathon', 'order', 'created_at', 'end_date')
    search_fields = ('title', 'description', 'marathon__title')
    list_filter = ('created_at', 'end_date')
    ordering = ('order',)
    inlines = [TaskInline]


@admin.register(Task)
class TaskAdmin(admin.ModelAdmin):
    list_display = ('title', 'mile', 'order', 'status', 'created_at')
    search_fields = ('title', 'description', 'mile__title')
    list_filter = ('status', 'created_at')
    ordering = ('order',)
    readonly_fields = ('created_at',)


@admin.register(MarathonParticipant)
class MarathonParticipantAdmin(admin.ModelAdmin):
    list_display = ('marathon', 'user', 'progress', 'rank', 'joined_at', 'can_be_till')
    search_fields = ('marathon__title', 'user__username')
    list_filter = ('joined_at', 'can_be_till')
    ordering = ('joined_at',)
    readonly_fields = ('joined_at',)


@admin.register(UserProgressEntity)
class UserProgressEntityAdmin(admin.ModelAdmin):
    list_display = ('user', 'entity_type', 'entity_id', 'progress', 'status', 'started_at', 'completed_at')
    search_fields = ('user__username', 'entity_type', 'entity_id')
    list_filter = ('entity_type', 'status', 'started_at', 'completed_at')
    ordering = ('started_at', 'completed_at')
    readonly_fields = ('started_at',)


