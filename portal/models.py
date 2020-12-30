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


class Hospital(models.Model):
    name = models.CharField(max_length=100)
    total_beds = models.IntegerField(default=30)
    available_beds = models.IntegerField(default=30)
    latitude = models.FloatField(default=0.0)
    longitude = models.FloatField(default=0.0)
    applicants = models.ForeignKey(Patient, on_delete=models.SET_NULL, verbose_name='Applicants', null=True)

    def __str__(self):
        return self.name


class Review(models.Model):
    rating = models.FloatField(default=3.0)
    patient = models.OneToOneField(Patient, on_delete=models.CASCADE, verbose_name='Patient')
    hospital = models.OneToOneField(Hospital, on_delete=models.CASCADE, verbose_name='Hospital')

    def __str__(self):
        return self.patient.user.email + ' ' + self.rating.__str__()
