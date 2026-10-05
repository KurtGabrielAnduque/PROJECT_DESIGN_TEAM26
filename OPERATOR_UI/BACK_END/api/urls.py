
# import the pathing
from django.urls import path

# import the views here after creating the models
from .views import lab_settings

urlpatterns = [
    path('api/lab-settings/current/', lab_settings.get_lab_settings), # get the current lab settings
    path('api/lab-settings/', lab_settings.create_lab_settings)
]