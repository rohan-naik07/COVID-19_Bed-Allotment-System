from django.urls import path
from .views import *

urlpatterns = [
    path('patient-details/', PatientView.as_view(), name='details'),
]
