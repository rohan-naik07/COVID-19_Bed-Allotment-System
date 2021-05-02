from django.shortcuts import render, get_object_or_404
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework_jwt.authentication import JSONWebTokenAuthentication
from rest_framework import status

from authentication.models import User
from .models import *
from rest_framework import generics
import traceback


# Create your views here.

def get_messages(chatId):
    chat = get_object_or_404(Chat, id=chatId)
    return chat.messages.order_by('-sent').all()[:10]


def get_user(email):
    user = get_object_or_404(User, email=email)
    return user


def get_current_chat(chatId):
    return get_object_or_404(Chat, id=chatId)


class CreateChatView(generics.ListCreateAPIView):
    authentication_classes = [JSONWebTokenAuthentication, ]
    permission_classes = [IsAuthenticated, ]

    def list(self, request, *args, **kwargs):
        chats = Chat.objects.filter(participants__email=request.user)
        context = []
        for chat in chats:
            context.append({
                'id': chat.id,
                'hospital_name': chat.hospital.name
            })
        return Response(data=context, status=status.HTTP_204_NO_CONTENT)

    def create(self, request, *args, **kwargs):
        try:
            chat = Chat.objects.create()
            for participant in request.data.get('participants'):
                chat.participants.add(User.objects.get(email=participant))
            chat.p2p = request.data.get('p2p')
            chat.save()

            return Response(status=status.HTTP_201_CREATED)
        except Exception as e:
            print(traceback.print_exc(e))
            return Response(status=status.HTTP_400_BAD_REQUEST)
