from rest_framework.serializers import Serializer, ModelSerializer
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework import serializers
from rest_framework.exceptions import ValidationError
from rest_framework_simplejwt.tokens import RefreshToken
from users.models import CustomUser


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        token['name'] = f"{user.first_name}{user.last_name}"
        token['email'] = user.email

        return token

class LoginSerializer(serializers.Serializer):
    email = serializers.CharField()
    password = serializers.CharField()


class CustomTokenRefreshSerializer(Serializer):
    def validate(self, attrs):
        request = self.context.get('request')
        refresh_token = request.COOKIES.get('refresh_token')

        if not refresh_token:
            raise ValidationError({"detail": "Refresh token not found in cookies."})
        
        try:
            refresh = RefreshToken(refresh_token)
        except Exception:
            raise ValidationError({"detail": "Invalid or expired refresh token."})
        
        new_refresh_token = RefreshToken.for_user(request.user)
        
        return {
            "access": str(refresh.access_token),
            "refresh": str(new_refresh_token)
        }
    
class VerifyOTPSerializer(Serializer):
    code = serializers.CharField()


class PasswordRecoverySerializer(Serializer):
    email = serializers.EmailField()

class ConfirmPasswordRecoverySerializer(Serializer):
    new_password = serializers.CharField()
    confirm_password = serializers.CharField()


class CustomUserSerializer(ModelSerializer):
    
    class Meta:
        model = CustomUser
        fields = "__all__"