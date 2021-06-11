import random
import os

from django.conf import settings
from django.core.mail import EmailMultiAlternatives, send_mail
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.viewsets import ModelViewSet
from rest_framework_jwt.authentication import JSONWebTokenAuthentication
from dotenv import load_dotenv

from .serializers import *

load_dotenv(os.path.join(os.getcwd(), '.env'))

jwt_payload_handler = api_settings.JWT_PAYLOAD_HANDLER
jwt_encode_handler = api_settings.JWT_ENCODE_HANDLER


# Create your views here.
class RegisterView(APIView):
    permission_classes = [AllowAny, ]

    def post(self, request):
        hospital_slug = request.data.get('hospital_slug', None)
        serializer = UserSerializer(data=request.data)

        if serializer.is_valid():
            user = serializer.save()
            payload = jwt_payload_handler(user)
            payload['user_id'] = user.id
            payload['hospital_slug'] = None
            jwt = jwt_encode_handler(payload)

            if user.is_staff:
                hospital = Hospital.objects.get(slug=hospital_slug)
                text = f"To,\nThe {hospital.name}"
                html = f"<h1>Click the link below to approve the" \
                       f"user named {user.first_name} {user.last_name} as staff for your hospital<h1>" \
                       f"<p><a href='{os.environ.get('API_URL')}/auth/approve?hospital={hospital.id}&user={user.id}'>" \
                       f"Send Approval</a></p>"
                message = EmailMultiAlternatives('Staff Approval', text, settings.EMAIL_HOST_USER, [
                    'newalkarpranjal2410.pn@gmail.com', 'royalronny12@gmail.com',
                    hospital.email
                ])
                message.attach_alternative(html, 'text/html')
                message.send()

            context = {
                'token': jwt,
                'message': 'Registered Successfully!',
                'success': True
            }

            return Response(context, status=status.HTTP_201_CREATED)

        context = {
            'message': 'Invalid credentials or user already exists.',
            'success': False
        }

        return Response(context, status=status.HTTP_400_BAD_REQUEST)


class LoginView(APIView):
    permission_classes = [AllowAny, ]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            context = {
                'message': 'Logged in successfully!',
                'token': serializer.data.get('token'),
                'is_staff': serializer.data.get('is_staff'),
                'success': True,
                'is_verified': serializer.data.get('is_verified')
            }
            return Response(context, status=status.HTTP_200_OK)

        context = {
            'message': 'Failed to login',
            'success': False
        }

        return Response(context, status=status.HTTP_401_UNAUTHORIZED)


class UserViewSet(ModelViewSet):
    queryset = User.objects.all()
    authentication_classes = [JSONWebTokenAuthentication, ]
    permission_classes = [IsAuthenticated, ]
    serializer_class = UserSerializer


class VerifyView(APIView):
    authentication_classes = [JSONWebTokenAuthentication, ]
    permission_classes = [IsAuthenticated, ]

    def get(self, request):
        try:
            otp = OTP.objects.get(user=request.user)
            key = random.randint(1000, 9999)
            otp.otp = key
            otp.created = datetime.now()
            otp.counter += 1
        except OTP.DoesNotExist:
            otp = OTP.objects.create(user=request.user, otp=random.randint(1000, 9999), counter=1)
        otp.save()

        try:
            send_mail(
                'OTP for Verification of email',
                f"Dear {request.user.first_name} {request.user.last_name},\nThe One Time Password required for "
                f"verification of email provided - {request.user.email} is given below.\n\nOTP : {otp.otp}\nThank you",
                settings.EMAIL_HOST_USER,
                ["rohan.nn1203@gmail.com",
                 request.user.email,
                 "newalkarpranjal2410.pn@gmail.com"],
                fail_silently=False
            )
            context = {
                'success': 'True',
                'message': 'Email sent successfully!',
            }
            return Response(context, status=status.HTTP_200_OK)
        except Exception as e:
            context = {
                'success': 'False',
                'message': 'Could not send email. Please try again later',
            }
            return Response(context, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def post(self, request):
        user = request.user
        key = request.data.get('otp')
        try:
            OTP.objects.get(user=user, otp=key)
            user.is_verified = True
            user.save()
            context = {
                'message': 'Email verified successfully!',
                'success': True,
            }
            return Response(context, status=status.HTTP_200_OK)
        except OTP.DoesNotExist:
            context = {
                'message': 'OTP entered is incorrect!',
                'success': False,
            }
            return Response(context, status=status.HTTP_406_NOT_ACCEPTABLE)


def approveView(request):
    hospital = Hospital.objects.get(pk=request.query_params.get('hospital'))
    hospital.staff = User.objects.get(pk=request.query_params.get('user'))

    hospital.save()
