from django.urls import path
from . import views

urlpatterns = [
    path('chat/<str:prompt>/', views.chat, name='chat'),
    path('test', views.test, name='chat'),
]