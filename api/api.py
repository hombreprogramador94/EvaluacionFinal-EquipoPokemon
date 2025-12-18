from django.urls import path
from . import views
from rest_framework_simplejwt.views import TokenObtainPairView

urlpatterns = [
    path('persona/', views.random_persona),
    path('personas/', views.get_personas),
    path('token/', TokenObtainPairView.as_view()),
]