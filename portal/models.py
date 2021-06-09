from django.contrib.postgres.fields import ArrayField
from django.db import models
from django.utils.text import slugify
import uuid


# Create your models here.
from authentication.models import User


class Document(models.Model):
    application = models.ForeignKey('portal.Patient', null=True, on_delete=models.CASCADE, related_name='documents')
    file = models.FileField(upload_to=f'Documents/')


class Patient(models.Model):
    is_corona_positive = models.BooleanField(default=False)
    on_medications = models.BooleanField(default=False)
    is_diabetic = models.BooleanField(default=False)
    is_heart_patient = models.BooleanField(default=False)
    accepted = models.BooleanField(default=False)
    rejected = models.BooleanField(default=False)
    is_first_dose = models.BooleanField(default=False)
    is_second_dose = models.BooleanField(default=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, verbose_name='Patient Profile', related_name='applications')
    hospital = models.ForeignKey('portal.Hospital', on_delete=models.SET_NULL, null=True, related_name='patients')
    priority = models.IntegerField(default=1)
    applied_date = models.DateTimeField(auto_now_add=True, null=True)

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
    staff = models.OneToOneField('authentication.User', on_delete=models.SET_NULL, related_name='hospital',
                                 null=True)
    slug = models.SlugField(max_length=8, unique=True, null=True)
    email = models.EmailField(null=True)

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(str(uuid.uuid4()[:8]))
        super(Hospital, self).save(*args, **kwargs)

    def __str__(self):
        return self.name


class Review(models.Model):
    rating = models.FloatField(default=3.0)
    feedback = models.TextField(null=True)
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, verbose_name='Patient')
    hospital = models.ForeignKey(Hospital, on_delete=models.CASCADE, verbose_name='Hospital')
    created = models.DateTimeField(auto_now_add=True, null=True)

    def __str__(self):
        return self.patient.user.email + ' ' + self.rating.__str__()
