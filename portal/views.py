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

class PatientViewSet(ModelViewSet):
    serializer_class = PatientSerializer
    queryset = Patient.objects.all()
    permission_classes = [IsAuthenticated, ]
    authentication_classes = [JSONWebTokenAuthentication, ]
    lookup_fields = ['id', 'hospital__slug']


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
