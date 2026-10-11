
# import the pathing
from django.urls import path

# import the views here after creating the models
from .views import lab_settings, dosage_prediction, validation

urlpatterns = [
    path('api/lab-settings/current/', lab_settings.get_lab_settings), # get the current lab settings
    path('api/lab-settings/', lab_settings.create_lab_settings),

    # for raw water analysis url
    path('api/prediction/analyze/', dosage_prediction.create_raw_water_sample),
    path('api/prediction/latest/', dosage_prediction.get_latest_prediction),
    path('api/prediction/start/', dosage_prediction.start_raw_water_analysis_command),

    # Validation
    path('api/validation/start/', validation.start_validation), # for starting validation session to esp32
    path("api/validation/results/", validation.submit_resulting_water_quality,), # for esp32 to save the results to backend
    path("api/validation/coagulation-complete/", validation.notify_coagulation_complete), # notifier if the treatment process is finished
    path("api/validation/assess/",validation.start_treated_water_assessment), # ernd point so operator can assess or measure the clarified water

]