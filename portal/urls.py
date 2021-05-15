from django.urls import path, include
from .views import *
from rest_framework import routers

router = routers.DefaultRouter()
router.register('hospitals', HospitalViewSet, basename='hospitals')
router.register('reviews', ReviewViewSet, basename='reviews')

urlpatterns = [
    path('patient-details/', PatientView.as_view(), name='details'),
    path('', include(router.urls))
]
