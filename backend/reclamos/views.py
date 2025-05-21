from rest_framework import viewsets, permissions
from django.utils import timezone
from .models import Reclamo
from .serializers import ReclamoSerializer
from evidencias.permissions import EsLogisticaClientes  # Importa desde evidencias o reclamos

class ReclamoViewSet(viewsets.ModelViewSet):
    serializer_class = ReclamoSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Lógica existente: Operativo CD solo ve sus reclamos
        if self.request.user.tipo_usuario == 'OP_CD':
            return Reclamo.objects.filter(usuario=self.request.user)
        return Reclamo.objects.all()

    def get_permissions(self):
        # Solo Logística Clientes puede actualizar (marcar como resuelto)
        if self.action in ['update', 'partial_update']:
            return [EsLogisticaClientes()]
        return super().get_permissions()

    def perform_create(self, serializer):
        # Asigna automáticamente el usuario al crear
        serializer.save(usuario=self.request.user)

    def perform_update(self, serializer):
        # Si se marca como resuelto, añade la fecha actual
        if serializer.validated_data.get('resuelto', False):
            serializer.save(resuelto=True, fecha_resolucion=timezone.now())
        else:
            serializer.save()