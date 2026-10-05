
# import the pathing
from django.urls import path

# import the views here after creating the models
from .views import lab_settings, dosage_prediction

urlpatterns = [
    path('api/lab-settings/current/', lab_settings.get_lab_settings), # get the current lab settings
    path('api/lab-settings/', lab_settings.create_lab_settings),
    path('api/prediction/analyze/', dosage_prediction.create_raw_water_sample),
    path('api/prediction/latest/', dosage_prediction.get_latest_prediction),
    path('api/prediction/start/', dosage_prediction.start_raw_water_analysis_command)
]