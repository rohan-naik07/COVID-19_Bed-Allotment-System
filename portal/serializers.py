from rest_framework import serializers
from authentication.serializers import UserSerializer
from .models import *


class PatientSerializer(serializers.ModelSerializer):
    user = UserSerializer(required=False)

    class Meta:
        model = Patient
        fields = ['is_corona_positive', 'is_diabetic', 'is_heart_patient', 'on_medications', 'has_applied',
                  'user_email']


class HospitalSerializer(serializers.ModelSerializer):
    staff = UserSerializer(required=False)
    current_user = serializers.SerializerMethodField('_user')

    class Meta:
        model = Hospital
        fields = ['name', 'total_beds', 'available_beds', 'latitude', 'longitude', 'contact', 'staff_id', 'current_user']
        lookup_fields = ['slug', 'id']

    def _user(self):
        request = self.context.get('request', None)
        if request:
            return request.user

    def to_representation(self, instance):
        response = super().to_representation(instance)
        response['slug'] = instance.slug

        return response
