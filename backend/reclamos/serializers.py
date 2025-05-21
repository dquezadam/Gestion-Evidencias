from rest_framework import serializers
from .models import Reclamo

class ReclamoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Reclamo
        fields = '__all__'
        read_only_fields = ['usuario', 'resuelto']  # El frontend no puede modificar estos campos