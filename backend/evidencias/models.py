from django.db import models

class Producto(models.Model):
    codigo = models.CharField(max_length=50, unique=True)
    nombre = models.CharField(max_length=100)
    descripcion = models.TextField(blank=True)
    precio_unitario = models.DecimalField(max_digits=10, decimal_places=2)
    
    def __str__(self):
        return f"{self.codigo} - {self.nombre}"
    
class Evidencia(models.Model):
    ESTADOS = [
        ('PEND', 'Pendiente'),
        ('APROB', 'Aprobado'),
        ('RECHAZ', 'Rechazado'),
    ]
    
    producto = models.ForeignKey(Producto, on_delete=models.CASCADE)
    usuario = models.ForeignKey('usuarios.Usuario', on_delete=models.CASCADE)
    archivo = models.FileField(upload_to='evidencias/')
    fecha_subida = models.DateTimeField(auto_now_add=True)
    estado = models.CharField(max_length=6, choices=ESTADOS, default='PEND')
    observaciones = models.TextField(blank=True)
    
    def __str__(self):
        return f"Evidencia #{self.id} - {self.producto.nombre}"