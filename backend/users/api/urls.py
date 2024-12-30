from django.urls import path, include
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .viewsets import CustomTokenObtainPairView, CustomTokenRefreshView, TwoFactorAuthLoginView, VerifyOTPView, PasswordRecoveryView, ConfirmPasswordRecoveryView

urlpatterns = [
    path('api/token/', CustomTokenObtainPairView.as_view(), name='get_token'),
    path('api/token/refresh', CustomTokenRefreshView.as_view(), name='refresh_token'), 
    # path('login/', AuthenticationRouter.as_view(), name='login'),
    path('two-factor-login/', TwoFactorAuthLoginView.as_view(), name='two_factor_login'),
    path('verify-otp/', VerifyOTPView.as_view(), name='verify_otp'),
    path("password-reset/", PasswordRecoveryView.as_view(), name="password_recovery"),
    path("password-reset/<uidb64>/<token>/", ConfirmPasswordRecoveryView.as_view(), name="password_recovery_confirm"),
]
