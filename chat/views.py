from django.shortcuts import render, get_object_or_404
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework_jwt.authentication import JSONWebTokenAuthentication
from rest_framework import status

from authentication.models import User
from portal.models import Hospital
from .models import *
from rest_framework import generics
from .serializers import ChatSerializer


# Create your views here.

def get_messages(chat_slug):
    chat = get_object_or_404(Chat, slug=chat_slug)
    return chat.messages.order_by('sent').all()


def get_user(email):
    user = get_object_or_404(User, email=email)
    return user


def get_current_chat(chat_slug):
    return get_object_or_404(Chat, slug=chat_slug)


class ChatView(generics.ListCreateAPIView):
    authentication_classes = [JSONWebTokenAuthentication, ]
    permission_classes = [IsAuthenticated, ]
    serializer_class = ChatSerializer
    queryset = Chat.objects.all()

    def get_serializer_context(self):
        context = super(ChatView, self).get_serializer_context()
        context['request'] = self.request

        return context

    def create(self, request, *args, **kwargs):
        try:
            chat = Chat.objects.get(user=request.user, hospital__slug=request.data['hospital'])
        except Chat.DoesNotExist:
            chat = Chat.objects.create(user=request.user,
                                       hospital=Hospital.objects.get(slug=request.data.get('hospital')))
            chat.save()

        return Response(data=ChatSerializer(chat).data, status=status.HTTP_201_CREATED)
