from rest_framework import serializers

from authentication.serializers import UserSerializer
from .models import *


class PatientSerializer(serializers.ModelSerializer):
    user = UserSerializer(required=False)

    class Meta:
        model = Patient
        fields = ['is_corona_positive', 'is_diabetic', 'is_heart_patient', 'on_medications', 'has_applied', 'user']

    def create(self, validated_data):
        return Patient(is_corona_positive=validated_data['is_corona_positive'],
                       is_diabetic=validated_data['is_diabetic'],
                       is_heart_patient=validated_data['is_heart_patient'],
                       on_medications=validated_data['on_medications'],
                       has_applied=validated_data['has_applied'])

    def update(self, patient, validated_data):
        user = UserSerializer.create(UserSerializer(), validated_data=validated_data.pop('user'))
        user = UserSerializer.update(UserSerializer(), user, data=validated_data.pop['user'])
        patient.is_corona_positive = validated_data['is_corona_positive']
        patient.is_diabetic = validated_data['is_diabetic']
        patient.is_heart_patient = validated_data['is_heart_patient']
        patient.on_medications = validated_data['on_medications']
        patient.has_applied = validated_data['has_applied']
        patient.user = user
        patient.save()

        return patient
