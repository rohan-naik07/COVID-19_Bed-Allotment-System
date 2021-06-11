from django.contrib.auth import authenticate
from django.contrib.auth.models import update_last_login
from rest_framework import serializers

from portal.models import Hospital
from .models import *
from rest_framework_jwt.settings import api_settings


jwt_payload_handler = api_settings.JWT_PAYLOAD_HANDLER
jwt_encode_handler = api_settings.JWT_ENCODE_HANDLER


class UserSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = ['first_name', 'last_name', 'email', 'username', 'password',
                  'contact', 'weight', 'birthday', 'id', 'is_staff']
        read_only_fields = ['id', 'password']

    def create(self, validated_data):
        try:
            user = User.objects.get(email=validated_data['email'])
        except User.DoesNotExist:
            password = validated_data.pop('password')
            user = User.objects.create(**validated_data)
            user.set_password(password)
        user.save()

        return user


class OTPSerializer(serializers.ModelSerializer):
    user = UserSerializer(required=False)
    user_id = serializers.IntegerField(write_only=True, read_only=False)

    class Meta:
        model = OTP
        fields = ['otp', 'user', 'created', 'counter', 'user_id']
        read_only_fields = ['user']


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField(max_length=255)
    password = serializers.CharField(max_length=255, write_only=True)
    token = serializers.CharField(max_length=255, read_only=True)
    is_staff = serializers.BooleanField(default=False, read_only=True)
    name = serializers.CharField(max_length=255, read_only=True)
    is_verified = serializers.BooleanField(default=False)

    def validate(self, data):
        email = data.get('email')
        password = data.get('password')

        user = authenticate(username=email, password=password)

        if user is None:
            raise serializers.ValidationError('Invalid login Credentials')

        payload = jwt_payload_handler(user)
        payload['id'] = user.id
        payload['is_staff'] = user.is_staff
        if user.is_staff and user.is_verified:
            payload['hospital_slug'] = Hospital.objects.get(staff=user).slug
        else:
            payload['hospital_slug'] = None
        token = jwt_encode_handler(payload)
        update_last_login(None, user)

        return {
            'email': user.email,
            'token': token,
            'is_staff': user.is_staff,
            'name': user.first_name + ' ' + user.last_name,
            'is_verified': user.is_verified
        }
