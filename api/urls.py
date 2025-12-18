from django.urls import path
from . import views
from rest_framework_simplejwt.views import TokenObtainPairView

urlpatterns = [
    # --- ENDPOINTS DE DATOS (API) ---
    # Nota: Ya no ponemos "api/" al principio porque Django lo agrega automático
    path('persona/', views.random_persona),        # Queda en: /api/persona/
    path('personas/', views.get_personas),         # Queda en: /api/personas/
    path('token/', TokenObtainPairView.as_view()), # Queda en: /api/token/

    # --- VISTAS DEL FRONTEND (HTML) ---
    path('', views.vista_home, name='home'),             # Queda en: /api/
    path('con-token/', views.vista_token, name='token'), # Queda en: /api/con-token/
]