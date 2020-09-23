from django.urls import include, path
from rest_framework import routers
from .views import MapLocationViewSet

router = routers.DefaultRouter()
router.register(r'poi', MapLocationViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
