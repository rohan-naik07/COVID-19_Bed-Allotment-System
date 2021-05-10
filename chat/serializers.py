from rest_framework import serializers
from .models import Chat


class ChatSerializer(serializers.ModelSerializer):
    class Meta:
        model = Chat
        fields = ['user_email', 'hospital_slug', 'created']
        lookup_fields = ['id', 'slug']
