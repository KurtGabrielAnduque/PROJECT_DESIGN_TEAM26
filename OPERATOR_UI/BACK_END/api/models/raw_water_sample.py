from django.db import models
from .lab_settings_config import LabSettingsConfig


class RawWaterSample(models.Model):
    sample_ref_number = models.CharField(max_length=20, unique=True, editable=False)
    # bro dont delete the LAB CONFIGURATION if you want to delete smoe of the history
    lab_settings_configuration = models.ForeignKey(LabSettingsConfig, on_delete=models.PROTECT, related_name='raw_water_samples')
    analyzed_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'ID: {self.sample_ref_number}'

class RawWaterQuality(models.Model):
    # of course a water quality belongs only to one sample
    raw_water_sample= models.OneToOneField(RawWaterSample, on_delete=models.CASCADE, related_name='raw_water_quality')
    turbidity = models.DecimalField(max_digits=10, decimal_places=2)
    pH = models.DecimalField(max_digits=4, decimal_places=2)
    conductivity = models.DecimalField(max_digits=10, decimal_places=2)
    temperature = models.DecimalField(max_digits=5, decimal_places=2)
    alkalinity = models.DecimalField(max_digits=10, decimal_places=2)

class ModelRecommendation(models.Model):
    # the prediction of a model is only for a one sample
    # impossible for model to have prediction for multiple sample
    raw_water_sample= models.OneToOneField(RawWaterSample, on_delete=models.CASCADE, related_name='recommendation')
    lab_settings_configuration = models.ForeignKey(LabSettingsConfig, on_delete=models.PROTECT, related_name='recommendations')
    predicted_dosage = models.DecimalField(max_digits=8, decimal_places=2)
    volume_to_dispense = models.DecimalField(max_digits=8, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)
