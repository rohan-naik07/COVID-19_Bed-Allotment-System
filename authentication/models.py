from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils import timezone


# Create your models here.
class User(AbstractUser):
    username = models.EmailField(unique=True)
    birthday = models.DateField(auto_now=False, auto_now_add=False,null=True)
    contact = models.PositiveBigIntegerField(unique=True,null=True)
    weight = models.FloatField(default=70)
    is_verified = models.BooleanField(default=False)

    def __str__(self):
        return self.username


class OTP(models.Model):
    otp = models.IntegerField(default=0)
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='otp')
    created = models.DateTimeField(auto_now_add=True)
    counter = models.IntegerField(default=0)

    @property
    def is_valid(self):
        change = timezone.now() - self.created.replace(tzinfo=None)
        seconds = change.seconds
        day = change.days

        return day == 0 and seconds <= 600

    def __str__(self):
        if self.is_valid:
            return self.user.email + ' ' + self.otp.__str__()
        return 'EXPIRED'
