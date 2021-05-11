import uuid

from django.utils.text import slugify
from rest_framework import serializers

from authentication.serializers import UserSerializer
from portal.serializers import HospitalSerializer
from .models import Chat


class ChatSerializer(serializers.ModelSerializer):
    user = UserSerializer(required=False)
    hospital = HospitalSerializer(required=False)

    class Meta:
        model = Chat
        fields = ['user', 'hospital', 'created', 'slug']
        lookup_fields = ['id', 'slug', 'hospital__slug']

    def create(self, validated_data):
        instance = super(ChatSerializer, self).create(validated_data)
        instance.slug = slugify(str(uuid.uuid4())[:8])
        instance.save()

        return instance
