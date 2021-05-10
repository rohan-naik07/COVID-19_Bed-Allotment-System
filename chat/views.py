from django.shortcuts import render, get_object_or_404
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework_jwt.authentication import JSONWebTokenAuthentication
from rest_framework import status

from authentication.models import User
from .models import *
from rest_framework import generics
from .serializers import ChatSerializer


# Create your views here.

def get_messages(chatId):
    chat = get_object_or_404(Chat, id=chatId)
    return chat.messages.order_by('-sent').all()[:10]


def get_user(email):
    user = get_object_or_404(User, email=email)
    return user


def get_current_chat(chatId):
    return get_object_or_404(Chat, id=chatId)


class ChatView(generics.ListCreateAPIView):
    authentication_classes = [JSONWebTokenAuthentication, ]
    permission_classes = [IsAuthenticated, ]
    serializer_class = ChatSerializer
    queryset = Chat.objects.all()

    def get_serializer_context(self):
        context = super(ChatView, self).get_serializer_context()
        context['request'] = self.request

        return context
