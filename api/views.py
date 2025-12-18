from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from .models import Persona
from .serializers import PersonaSerializer
import random

# Endpoint 1: Persona Aleatoria (Público)
@api_view(['GET'])
def random_persona(request):
    pks = Persona.objects.values_list('pk', flat=True)
    if not pks:
        return Response({"error": "No hay personas en la BD"}, status=404)
    
    random_pk = random.choice(pks)
    persona = Persona.objects.get(pk=random_pk)
    
    serializer = PersonaSerializer(persona)
    return Response(serializer.data)

# Endpoint 2: Todas las personas (Privado - Requiere Token)
@api_view(['GET'])
@permission_classes([IsAuthenticated]) 
def get_personas(request):
    personas = Persona.objects.all()
    serializer = PersonaSerializer(personas, many=True)
    return Response(serializer.data)

from django.shortcuts import render 

# Vistas para el Frontend
def vista_home(request):
    return render(request, 'index.html')

def vista_token(request):
    return render(request, 'con_token.html')