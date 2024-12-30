from django.contrib import admin
from teams.models import Team
from django.db.models import Count


class MembersCountFilter(admin.SimpleListFilter):
    title = 'Members Count'
    parameter_name = 'members_count'

    def lookups(self, request, model_admin):
        return [
            ('1-5', '1-5'),
            ('6-10', '6-10'),
            ('11-50', '11-50'),
            ('50+', '50+'),
        ]

    def queryset(self, request, queryset):
        if self.value() == '1-5':
            return queryset.annotate(members_count=Count('members')).filter(members_count__gte=1, members_count__lte=5)
        elif self.value() == '6-10':
            return queryset.annotate(members_count=Count('members')).filter(members_count__gte=6, members_count__lte=10)
        elif self.value() == '11-50':
            return queryset.annotate(members_count=Count('members')).filter(members_count__gte=11, members_count__lte=50)
        elif self.value() == '50+':
            return queryset.annotate(members_count=Count('members')).filter(members_count__gt=50)


@admin.register(Team)
class TeamAdmin(admin.ModelAdmin):
    list_display = ('name', 'created_by', 'members_count', 'created_at')
    search_fields = ('name', 'created_by__username', 'members__username')
    list_filter = (MembersCountFilter, 'created_at')
    ordering = ('-created_at',)
    readonly_fields = ('created_at',)
    filter_horizontal = ('members',)
    actions = ['export_to_csv']

    def members_count(self, obj):
        return obj.members.count()
    members_count.short_description = 'Members Count'

    def export_to_csv(self, request, queryset):
        import csv
        from django.http import HttpResponse

        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = 'attachment; filename="teams.csv"'

        writer = csv.writer(response)
        writer.writerow(['Name', 'Created By', 'Members Count', 'Created At'])

        for team in queryset:
            writer.writerow([team.name, team.created_by.username, team.members.count(), team.created_at])

        return response
    export_to_csv.short_description = 'Export Selected Teams to CSV'
