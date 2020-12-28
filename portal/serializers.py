from rest_framework import serializers
from .models import *


class PatientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Patient
        fields = ['is_corona_positive', 'is_diabetic', 'is_heart_patient', 'on_medications', 'has_applied']

    def create(self, validated_data):
        return Patient.objects.create(is_corona_positive=validated_data['is_corona_positive'],
                                      is_diabetic=validated_data['is_diabetic'],
                                      is_heart_patient=validated_data['is_heart_patient'],
                                      on_medications=validated_data['on_medications'],
                                      has_applied=validated_data['has_applied'])