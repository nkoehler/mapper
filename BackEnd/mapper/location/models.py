from django.db import models


class MapLocation(models.Model):
    id = models.AutoField(null=False, primary_key=True)
    title = models.CharField(null=False, max_length=256)
    longitude = models.DecimalField(
        null=False, decimal_places=9, max_digits=21)
    latitude = models.DecimalField(null=False, decimal_places=9, max_digits=21)
