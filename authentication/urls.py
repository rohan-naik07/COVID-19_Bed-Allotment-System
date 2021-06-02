from django.urls import path, include
from rest_framework import routers

from .views import *

router = routers.DefaultRouter()
router.register('users', UserViewSet, basename='users')

urlpatterns = [
    path('', include(router.urls)),
    path('register/', RegisterView.as_view(), name='register'),
    path('verify/', VerifyView.as_view(), name='verify'),
    path('login/', LoginView.as_view(), name='login')
]
