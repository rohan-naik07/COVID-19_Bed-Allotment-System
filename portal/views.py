from rest_framework import status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet

from .serializers import *
from .models import *
from django.core.mail import send_mail
from django.conf import settings
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_jwt.authentication import JSONWebTokenAuthentication


# Create your views here.

class PatientViewSet(ModelViewSet):
    serializer_class = PatientSerializer
    queryset = Patient.objects.all()
    permission_classes = [IsAuthenticated, ]
    authentication_classes = [JSONWebTokenAuthentication, ]

    def get_queryset(self):
        return self.queryset.filter(hospital__staff=self.request.user)

    def perform_update(self, serializer):
        instance = serializer.save()
        if instance.accepted:
            try:
                send_mail(
                    'Application Accepted',
                    f"Dear {instance.user.first_name} {instance.user.last_name},\nYour application for a bed in the "
                    f"hospital "
                    f"{instance.hospital.name} has been accepted. You may come up with the provided documents for "
                    f"further process. "
                    f"\n\nThanks & Regards",
                    settings.EMAIL_HOST_USER,
                    [
                        'rohan.nn1203@gmail.com',
                        'newalkarpranjal2410@gmail.com',
                        instance.user.email
                    ],
                    fail_silently=False
                )
            except Exception as e:
                print(e.__str__())
        elif instance.rejected:
            try:
                send_mail(
                    'Application Rejected',
                    f"Dear {instance.user.first_name} {instance.user.last_name},\nYour application for a bed in the "
                    f"hospital "
                    f"{instance.hospital.name} has been rejected. You may apply again or please try for other hospitals"
                    f"\n\nThanks & Regards",
                    settings.EMAIL_HOST_USER,
                    [
                        'rohan.nn1203@gmail.com',
                        'newalkarpranjal2410@gmail.com',
                        instance.user.email
                    ],
                    fail_silently=False
                )
            except Exception as e:
                print(e.__str__())


class HospitalViewSet(ModelViewSet):
    serializer_class = HospitalSerializer
    queryset = Hospital.objects.all()
    authentication_classes = [JSONWebTokenAuthentication, ]
    permission_classes = [AllowAny, ]
    lookup_field = 'slug'

    def get_serializer_context(self):
        context = super(HospitalViewSet, self).get_serializer_context()
        context['request'] = self.request

        return context

    @action(methods=['GET'], detail=False, lookup_field='name')
    def search(self, request):
        params = request.query_params
        return Response(self.get_serializer(Hospital.objects.filter(name__icontains=params['name']), many=True).data,
                        status=status.HTTP_200_OK)


class ReviewViewSet(ModelViewSet):
    serializer_class = ReviewSerializer
    queryset = Review.objects.all()
    authentication_classes = [JSONWebTokenAuthentication, ]
    permission_classes = [IsAuthenticated, ]
    lookup_field = 'hospital__slug'

    def get_serializer_context(self):
        context = super(ReviewViewSet, self).get_serializer_context()
        context['request'] = self.request

        return context
