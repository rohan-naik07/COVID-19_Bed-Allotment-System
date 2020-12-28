from django.shortcuts import render
from rest_framework import status
from rest_framework.response import Response

from authentication.serializers import UserSerializer
from .serializers import *
from .models import *
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_jwt.authentication import JSONWebTokenAuthentication


# Create your views here.

class PatientView(APIView):
    permission_classes = [IsAuthenticated, ]
    authentication_classes = [JSONWebTokenAuthentication, ]

    def get(self, request):
        data = UserSerializer(request.user).data
        data += PatientSerializer(Patient.objects.get(user=request.user)).data

        context = {
            'success': True,
            'data': data
        }

        return Response(context, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = PatientSerializer(request.data)

        if serializer.is_valid(raise_exception=True):
            patient = serializer.save()
            patient.user = request.user
            patient.save()

            return Response({'success': True}, status=status.HTTP_201_CREATED)

        return Response(status=status.HTTP_406_NOT_ACCEPTABLE)
