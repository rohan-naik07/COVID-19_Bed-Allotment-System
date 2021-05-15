from django.contrib.auth import get_user_model
from asgiref.sync import async_to_sync
from channels.generic.websocket import WebsocketConsumer
import json
from .models import Message, Chat
from authentication.models import User
from .views import *

User = User


class ChatConsumer(WebsocketConsumer):

    def fetch_messages(self, data):
        messages = get_messages(data['chatSlug'])
        content = {
            'command': 'fetch_messages',
            'messages': self.messages_to_json(get_messages(get_current_chat(data['chatSlug']).slug))
        }
        self.send_message(content)

    def new_message(self, data):
        user = get_user(data['from'])
        message = Message.objects.create(
            user=user,
            text=data['message']
        )
        current_chat = get_current_chat(data['chatSlug'])
        current_chat.messages.add(message)
        current_chat.save()
        content = {
            'command': 'new_message',
            'message': self.message_to_json(message),
            'messages': self.messages_to_json(get_messages(get_current_chat(data['chatSlug']).slug))
        }
        return self.send_chat_message(content)

    def messages_to_json(self, messages):
        result = []
        for message in messages:
            result.append(self.message_to_json(message))
        return result

    def message_to_json(self, message):
        return {
            'id': message.id,
            'user': message.user.email,
            'message': message.text,
            'timestamp': message.sent.__str__()
        }

    commands = {
        'fetch_messages': fetch_messages,
        'new_message': new_message
    }

    def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['room_name']
        self.room_group_name = 'chat_%s' % self.room_name
        async_to_sync(self.channel_layer.group_add)(
            self.room_group_name,
            self.channel_name
        )
        self.accept()

    def disconnect(self, close_code):
        async_to_sync(self.channel_layer.group_discard)(
            self.room_group_name,
            self.channel_name
        )

    def receive(self, text_data):
        data = json.loads(text_data)
        self.commands[data['command']](self, data)

    def send_chat_message(self, message):
        async_to_sync(self.channel_layer.group_send)(
            self.room_group_name,
            {
                'type': 'chat_message',
                'message': message
            }
        )

    def send_message(self, message):
        self.send(text_data=json.dumps(message))

    def chat_message(self, event):
        message = event['message']
        self.send(text_data=json.dumps(message))
