from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.exceptions import ValidationError
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.views import APIView
from django.contrib.auth import authenticate
import random, string
from django.core.mail import send_mail
from django.conf import settings
from drf_spectacular.utils import extend_schema, OpenApiParameter
from rest_framework.permissions import AllowAny
from django.utils.timezone import timedelta, now
from datetime import datetime
from users.models import CustomUser
from django.shortcuts import redirect
from .serializers import VerifyOTPSerializer, CustomTokenObtainPairSerializer, CustomTokenRefreshSerializer, LoginSerializer, PasswordRecoverySerializer, ConfirmPasswordRecoverySerializer
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.urls import reverse 
from django.utils.encoding import force_bytes, force_str
from django.template.loader import render_to_string


token_generator = PasswordResetTokenGenerator()

# class AuthenticationRouter(APIView):
#     permission_classes = [AllowAny]

#     def post(self, request, *args, **kwargs):
#         email = request.data.get('email')
#         password = request.data.get('password')

#         user = authenticate(request, email=email, password=password)
#         if user:
#             if user.auth_method == '2FA':
#                 return redirect('two_factor_login')
#             else:
#                 return redirect('get_token')

#         return redirect('login')



class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data

        access_token = data.get("access")
        refresh_token = data.get("refresh")

        response = Response(data={
            'access': access_token
        }, status=status.HTTP_200_OK)

        response.set_cookie(
            key='refresh_token',
            value=refresh_token,
            httponly=True,
            secure=False,
            samesite='Lax'
        )

        return response



class CustomTokenRefreshView(TokenRefreshView):
    serializer_class = CustomTokenRefreshSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data={}, context={'request': request})

        try:
            serializer.is_valid(raise_exception=True)
            access_token = serializer.validated_data['access']
            refresh_token = serializer.validated_data['refresh']

            response = Response({
                "access": access_token
            }, status=status.HTTP_200_OK)

            response.set_cookie(
                key='refresh_token',
                value=refresh_token,
                httponly=True,
                max_age=60*60*24*7, 
                secure=False,  
                samesite='Lax'
            )

            return response
        
        except ValidationError as e:
            return Response(e.detail, status=status.HTTP_400_BAD_REQUEST)



class TwoFactorAuthLoginView(APIView):
    permission_classes = [AllowAny]
    @extend_schema(
        summary="Two Factor Auth",
        description="Handles two factor auth.",
        request=LoginSerializer,
        responses={200: {"type": "string", "example": "Hello, Alice!"}},
    )
    def post(self, request, *args, **kwargs):
       
        serializer = LoginSerializer(data=request.data)

        if serializer.is_valid():
            email = serializer.validated_data['email']
            password = serializer.validated_data['password']

            print(email, password)
            
            user = authenticate(email=email, password=password)
            
            if user is not None:
                otp = ''.join(random.choices(string.digits, k=6))
                expiration_time = now() + timedelta(minutes=5)

                request.session['otp'] = otp
                request.session['otp_verified'] = False
                request.session['otp_expiry'] = expiration_time.isoformat()
                request.session['user_id'] = user.id

                send_mail(
                    'Your OTP Code',
                    f'Your one-time password is: {otp}',
                    settings.EMAIL_HOST_USER,
                    [user.email],
                    fail_silently=False,
                )

                return Response({"detail": "OTP sent to your email."}, status=status.HTTP_200_OK)
            else:
                return Response({"detail": "Invalid credentials."}, status=status.HTTP_400_BAD_REQUEST)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

class VerifyOTPView(APIView):
    permission_classes = [AllowAny]

    @extend_schema(
        summary="Verify OTP",
        description="Verify 2FA.",
        request=VerifyOTPSerializer,
        responses={200: {"type": "string", "example": "Hello, Alice!"}},
    )

    def post(self, request, *args, **kwargs):
        otp = request.data.get('code')
        stored_otp = request.session.get('otp')
        expiry = request.session.get('otp_expiry')
        user_id = request.session['user_id']


        if not stored_otp or not expiry:
            return Response({"detail": "No OTP found. Please login first."}, status=status.HTTP_400_BAD_REQUEST)
        
        expiry_time = datetime.fromisoformat(expiry)

        if now() > expiry_time:
            raise ValidationError("OTP code has expired. Please request a new one.")

        if otp == stored_otp:

            request.session['otp_verified'] = True

            user = CustomUser(pk=user_id)

            access_token, refresh_token = self.create_tokens(user)

            response = Response({
                "access": access_token
            }, status=status.HTTP_200_OK)

            response.set_cookie(
                key='refresh_token',
                value=refresh_token,
                httponly=True,
                max_age=60*60*24*7,
                secure=False,
                samesite='Lax'
            )

            return response
        else:
            return Response({"detail": "Invalid OTP."}, status=status.HTTP_400_BAD_REQUEST)
        
    def create_tokens(self, user):

        refresh = RefreshToken.for_user(user)
        return str(refresh.access_token), str(refresh)


class PasswordRecoveryView(APIView):
    permission_classes = [AllowAny]

    @extend_schema(
        summary="Password Recovery",
        description="Handles password recovery by link sent to email.",
        request=PasswordRecoverySerializer,
        responses={200: {"email": "email_for_recovery@loveyou.com"}},
    )
    def post(self, request):
        email = request.data.get('email')
        print(email)
        try:
            user = CustomUser.objects.get(email=email)
        except CustomUser.DoesNotExist:
            return Response({"error": "User with this email does not exist."}, status=status.HTTP_404_NOT_FOUND)
        
        print(user, 123412341234)
        uid = urlsafe_base64_encode(force_bytes(user.pk))
        token = token_generator.make_token(user)
        reset_url = request.build_absolute_uri(
            reverse("password_recovery_confirm", kwargs={"uidb64": uid, "token": token})
        )

        subject = "Password Reset Request"
        message = render_to_string("password_reset_email.html", {
            "user": user,
            "site_name": settings.SITE_NAME,
            "reset_url": reset_url
        })
        send_mail(subject, message, settings.EMAIL_HOST_USER, [email])

        return Response({"message": "Password reset email sent."}, status=200)


class ConfirmPasswordRecoveryView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, uidb64, token):

        try:
            uid = force_str(urlsafe_base64_decode(uidb64))
            user = CustomUser.objects.get(pk=uid)
        except (ValueError, CustomUser.DoesNotExist):
            return Response({"error": "Invalid reset link."}, status=status.HTTP_400_BAD_REQUEST)

        if not token_generator.check_token(user, token):
            return Response({"error": "Invalid or expired token."}, status=status.HTTP_400_BAD_REQUEST)

        return Response({"message": "Reset link is valid."}, status=status.HTTP_200_OK)

    @extend_schema(
        summary="Password Recovery Confirmation",
        description="Handles new password to be saved.",
        request=ConfirmPasswordRecoverySerializer,
        responses={200: {"new_password": "lovEyou!1234", "confirm_password": "lovEyou!1234"}},
    )
    def post(self, request, uidb64, token):

        try:
            uid = force_str(urlsafe_base64_decode(uidb64))
            user = CustomUser.objects.get(pk=uid)
        except (ValueError, CustomUser.DoesNotExist):
            return Response({"error": "Invalid reset link."}, status=status.HTTP_400_BAD_REQUEST)

        if not token_generator.check_token(user, token):
            return Response({"error": "Invalid or expired token."}, status=status.HTTP_400_BAD_REQUEST)

        new_password = request.data.get("new_password")
        confirm_password = request.data.get("confirm_password")

        if not new_password or not confirm_password:
            return Response(
                {"error": "Both new_password and confirm_password fields are required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if new_password != confirm_password:
            return Response({"error": "Passwords do not match."}, status=status.HTTP_400_BAD_REQUEST)

        user.set_password(new_password)
        user.save()

        return Response({"message": "Password reset successful."}, status=status.HTTP_200_OK)