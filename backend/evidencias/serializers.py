from rest_framework import serializers
from .models import Producto, Evidencia

# evidencias/serializers.py
class ProductoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Producto
        fields = ['id', 'nombre', 'precio_unitario']

class EvidenciaSerializer(serializers.ModelSerializer):
    producto = ProductoSerializer()  # Incluir datos del producto

    class Meta:
        model = Evidencia
        fields = '__all__'