from django.urls import path
from . import views

urlpatterns = [
    path('create-chat/', views.ChatView)
]