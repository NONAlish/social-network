from django.contrib import admin
from django.urls import path, include
from drf_spectacular.views import SpectacularAPIView, SpectacularRedocView, SpectacularSwaggerView

urlpatterns = [
    path('users/', include('users.api.urls')),
    path('goals/', include('goals.api.urls')),
    path('teams/', include('teams.api.urls')),
    path('marathons/', include('marathons.api.urls')),
    path('chats/', include('chat.api.urls')),
    path('admin/', admin.site.urls),
    path('graphql/', include('graphqlapi.urls')),
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/docs/swagger/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    path('api/docs/redoc/', SpectacularRedocView.as_view(url_name='schema'), name='redoc'),
]
