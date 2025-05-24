from django.core.management.base import BaseCommand
from django.contrib.auth.models import User

class Command(BaseCommand):
    help = 'Crea un usuario administrador inicial'

    def handle(self, *args, **options):
        username = "admin"
        email = "admin@example.com"
        password = "k1llxenn"

        if not User.objects.filter(username=username).exists():
            User.objects.create_superuser(username, email, password)
            self.stdout.write(self.style.SUCCESS('Usuario administrador creado'))
        else:
            self.stdout.write(self.style.WARNING('El usuario ya existe'))