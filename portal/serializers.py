from rest_framework import serializers
from authentication.serializers import UserSerializer
from chat.models import Chat
from .models import *


class PatientSerializer(serializers.ModelSerializer):
    user = UserSerializer(required=False)

    class Meta:
        model = Patient
        fields = ['is_corona_positive', 'is_diabetic', 'is_heart_patient', 'on_medications', 'has_applied',
                  'user']


class HospitalSerializer(serializers.ModelSerializer):
    staff = UserSerializer(required=False)

    class Meta:
        model = Hospital
        fields = ['name', 'total_beds', 'imageUrl', 'available_beds', 'latitude', 'longitude', 'contact', 'staff']
        lookup_fields = ['slug', 'id']

    def create(self, validated_data):
        instance = super(HospitalSerializer, self).create(validated_data)
        instance.slug = slugify(str(uuid.uuid4())[:8])

        return instance

    def to_representation(self, instance):
        response = super().to_representation(instance)
        response['slug'] = instance.slug
        try:
            request = self.context.get('request', None)
            if request:
                response['chat_slug'] = Chat.objects.get(user=request.user, hospital=instance).slug
            else:
                response['chat_slug'] = None
        except Exception as e:
            response['chat_slug'] = None

        return response
