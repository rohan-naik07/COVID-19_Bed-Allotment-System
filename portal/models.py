from django.db import models
from django.utils.text import slugify


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
    name = models.CharField(max_length=100, null=True)
    imageUrl = models.CharField(max_length=100, null=True)
    total_beds = models.IntegerField(default=30, null=True)
    available_beds = models.IntegerField(default=30, null=True)
    latitude = models.FloatField(default=0.0, null=True)
    longitude = models.FloatField(default=0.0, null=True)
    contact = models.CharField(max_length=120, null=True)
    staff = models.OneToOneField('authentication.User', on_delete=models.SET_NULL, related_name='hospital_staff',
                                 null=True)
    applicants = models.ForeignKey(Patient, on_delete=models.SET_NULL, verbose_name='Applicants', null=True)
    slug = models.SlugField(max_length=8, unique=True)

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify()

    def __str__(self):
        return self.name


class Review(models.Model):
    rating = models.FloatField(default=3.0)
    patient = models.OneToOneField(Patient, on_delete=models.CASCADE, verbose_name='Patient')
    hospital = models.OneToOneField(Hospital, on_delete=models.CASCADE, verbose_name='Hospital')

    def __str__(self):
        return self.patient.user.email + ' ' + self.rating.__str__()
