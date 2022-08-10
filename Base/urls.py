from django.urls import path
from .views import *

app_name = 'base'
urlpatterns = [
    path('',lobby,name='lobby'),
    path('room/',room,name='room'),
    path('token/',get_token,name='token'),
    path('create/',create_member,name='create'),
    path('get/',get_member,name='get'),
    path('delete/',delete_member,name='delete'),
]