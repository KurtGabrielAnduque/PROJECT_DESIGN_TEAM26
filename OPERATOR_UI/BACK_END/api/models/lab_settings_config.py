from django.db import models


class LabSettingsConfig(models.Model):
    # name of the operator
    name = models.CharField(max_length=250)
    version = models.CharField(max_length=10)
    is_active = models.BooleanField(default=True) # after creating the next data for the lab settings I think its better that we use it already
    created_at = models.DateTimeField(auto_now_add=True)

    # print the name in the admin site
    def __str__(self):
        return f"{self.name} v{self.version}"


class CoagulationConfiguration(models.Model):
    # when the operator deletes the coagulation setting from the parent erd this must delete as well
    lab_setting_configuration = models.OneToOneField(LabSettingsConfig, on_delete=models.CASCADE, related_name='coagulation_config')

    # flash mixing configuration
    flash_mixing_speed = models.PositiveIntegerField()
    flash_mixing_duration = models.PositiveIntegerField()
    coagulant_dispense_timing = models.PositiveIntegerField()

    # slow mixing configuration
    slow_mixing_configuration = models.JSONField(default= dict)

    # settling time config
    settling_duration = models.PositiveIntegerField()
    created_at = models.DateTimeField(auto_now_add=True)


class ConcentrationConfiguration(models.Model):
    lab_setting_configuration = models.OneToOneField(LabSettingsConfig, on_delete=models.CASCADE, related_name='concentration_config')
    sample_volume = models.DecimalField(max_digits=4, decimal_places=2)
    stock_concentration = models.DecimalField(max_digits=6, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)

class RawWaterAnalysisConfiguration(models.Model):
    lab_settings_configuration = models.OneToOneField(LabSettingsConfig, on_delete=models.CASCADE, related_name='analysis_config')
    stirring_speed = models.PositiveIntegerField()
    stirring_duration = models.PositiveIntegerField()
    created_at = models.DateTimeField(auto_now_add=True)