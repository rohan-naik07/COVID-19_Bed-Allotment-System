from rest_framework import serializers
from authentication.serializers import UserSerializer
from chat.models import Chat
from .models import *
import traceback


class DocumentSerializer(serializers.ModelSerializer):

    class Meta:
        model = Document
        fields = ['file', ]

    def to_internal_value(self, data):
        return {'file': data}

    def to_representation(self, instance):
        if instance:
            return instance.file.url
        else:
            return instance


class PatientSerializer(serializers.ModelSerializer):
    user = UserSerializer(required=False)
    user_id = serializers.IntegerField(write_only=True, required=True)
    hospital_slug = serializers.SlugField(write_only=True, required=True)
    documents = DocumentSerializer(many=True, default=[])

    class Meta:
        model = Patient
        fields = ['id', 'is_corona_positive', 'is_diabetic', 'is_heart_patient', 'on_medications', 'accepted', 'rejected',
                  'is_first_dose', 'is_second_dose', 'priority',
                  'user', 'user_id', 'hospital_slug', 'documents']
        read_only_fields = ['id', 'user', 'applied_date']

    def create(self, validated_data):
        hospital_slug = validated_data.pop('hospital_slug')
        documents = validated_data.pop('documents')
        patient = Patient.objects.create(**validated_data, hospital=Hospital.objects.get(slug=hospital_slug))

        for document in documents:
            doc = Document(application=patient, **document)
            doc.save()

        patient.save()

        return patient


class HospitalSerializer(serializers.ModelSerializer):
    staff = UserSerializer(required=False)
    required_documents = serializers.ListField(child=serializers.CharField(max_length=20), required=False)
    patients = PatientSerializer(required=False, many=True)

    class Meta:
        model = Hospital
        fields = ['name', 'total_beds', 'imageUrl', 'available_beds', 'latitude', 'longitude', 'contact', 'staff',
                  'patients', 'required_documents']
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
                if request.user.is_staff:
                    response['chats'] = [{'chat_slug': chat.slug,
                                          'name': f'{chat.user.first_name} {chat.user.last_name}',
                                          'user_email': chat.user.email,
                                          'last_message': chat.messages.last().text}
                                         for chat in Chat.objects.filter(hospital=instance)]
                else:
                    try:
                        response['chat_slug'] = Chat.objects.get(user=request.user, hospital=instance).slug
                    except Chat.DoesNotExist:
                        response['chat_slug'] = None
            else:
                response['chat_slug'] = None
        except Exception as e:
            print(e.__str__())
            response['chat_slug'] = None

        return response


class ReviewSerializer(serializers.ModelSerializer):
    patient = PatientSerializer(required=False, many=True)
    hospital = HospitalSerializer(required=False, many=True)

    class Meta:
        model = Review
        fields = ['patient', 'hospital', 'rating', 'feedback', 'created']
        lookup_fields = ['id', 'hospital__slug', 'user__email']
