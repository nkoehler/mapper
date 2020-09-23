from rest_framework import viewsets
from .serializers import MapLocationSerializer
from .models import MapLocation


class MapLocationViewSet(viewsets.ModelViewSet):
    queryset = MapLocation.objects.all()
    serializer_class = MapLocationSerializer
