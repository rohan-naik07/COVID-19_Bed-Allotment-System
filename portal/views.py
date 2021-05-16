from rest_framework import status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet

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
        try:
            data = PatientSerializer(Patient.objects.get(user=request.user)).data
        except Patient.DoesNotExist:
            data = {'user': UserSerializer(request.user).data}

        context = {
            'success': True,
            'data': data
        }

        return Response(context, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = PatientSerializer(data=request.data)

        if serializer.is_valid(raise_exception=True):
            try:
                patient = serializer.save(patient=Patient.objects.get(user=request.user))
            except Patient.DoesNotExist:
                patient = serializer.save()
            patient.user = request.user
            patient.save()

            return Response({'success': True}, status=status.HTTP_201_CREATED)

        return Response(status=status.HTTP_406_NOT_ACCEPTABLE)


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
        return Response(self.get_serializer(Hospital.objects.filter(name__contains=params['name']), many=True).data,
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
