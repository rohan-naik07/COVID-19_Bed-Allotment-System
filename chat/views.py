from django.shortcuts import render, get_object_or_404

from authentication.models import User
from .models import *


# Create your views here.

def get_last_10_messages(chatId):
    chat = get_object_or_404(Chat, id=chatId)
    return chat.messages.order_by('-sent').all()[:10]


def get_user(email):
    user = get_object_or_404(User, email=email)
    return user


def get_current_chat(chatId):
    return get_object_or_404(Chat, id=chatId)
