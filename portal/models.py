from django.db import models


# Create your models here.
from authentication.models import User


class Patient(models.Model):
    is_corona_positive = models.BooleanField(default=False)
    on_medications = models.BooleanField(default=False)
    is_diabetic = models.BooleanField(default=False)
    is_heart_patient = models.BooleanField(default=False)
    has_applied = models.BooleanField(default=False)
    user = models.OneToOneField(User, on_delete=models.CASCADE, verbose_name='Patient Profile')

    def __str__(self):
        return self.user.username
