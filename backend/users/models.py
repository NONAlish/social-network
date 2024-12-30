from django.db import models
from django.contrib.auth.models import BaseUserManager, AbstractBaseUser, PermissionsMixin
import uuid

class CustomUserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('The Email field must be set')
        
        email = self.normalize_email(email)
        extra_fields.setdefault('is_active', True)
        user = self.model(email=email, **extra_fields)

        user.set_password(password)
        user.save(using=self._db)

        return user
    
    def create_superuser(self, email, password, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        if not extra_fields.get('is_staff'):
            raise ValueError('Superuser must have is_staff=True.')
        if not extra_fields.get('is_superuser'):
            raise ValueError('Superuser must have is_superuser=True.')

        return self.create_user(email, password, **extra_fields)


class CustomUser(AbstractBaseUser, PermissionsMixin):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4)
    email = models.EmailField('email address', unique=True)
    first_name = models.CharField('first name', max_length=30, blank=True)
    last_name = models.CharField('last name', max_length=30, blank=True)
    is_active = models.BooleanField('active', default=True)
    is_staff = models.BooleanField('staff status', default=False)
    date_joined = models.DateTimeField('date joined', auto_now_add=True)
    profile_picture = models.ImageField(upload_to='users/profiles/', blank=True, null=True)
    bio = models.TextField()
    location = models.CharField(max_length=25, blank=True)

    PRIVACY_SETTINGS_CHOICES = [
        ('public', 'Public'),
        ('private', 'Private'),
    ]

    privacy_settings = models.CharField(max_length=25, choices=PRIVACY_SETTINGS_CHOICES, default='public')

    AUTH_METHOD_CHOICES = [
        ('1FA', 'One-Factor Authentication'),
        ('2FA', 'Two-Factor Authentication'),
    ]

    auth_method = models.CharField(
        max_length=3,
        choices=AUTH_METHOD_CHOICES,
        default='1FA',
        help_text="Choose between 1FA and 2FA"
    )

    objects = CustomUserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name', 'last_name']

    def __str__(self):
        return self.email