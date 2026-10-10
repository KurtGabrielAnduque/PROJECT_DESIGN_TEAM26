from django.db import models
from .lab_settings_config import LabSettingConfiguration
from .raw_water_sample import RawWaterSample


class ValidationSession(models.Model):

    # a validation session is only referring to a one sample or current raw water quality parameters that we are trying to treat
    # so this should be one to one
    raw_water_sample = models.OneToOneField(
        RawWaterSample, 
        on_delete=models.CASCADE, 
        related_name='validation_session'
    )

    # the latest settings, is applicable to multiple session
    lab_settings_configuration = models.ForeignKey(
        LabSettingConfiguration, 
        on_delete=models.PROTECT, 
        related_name='validation_sessions'
    )

    # it is normal that our final_trial should be null because we are not testing our dosage yet
    final_trial = models.ForeignKey(
        "ValidationTrial", # make it string because ValidationTrial is declared later in the file
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True, 
        related_name='final_validation_sessions'
    )

    # overall status of the session
    overall_status = models.CharField(max_length=100)
    
    # only create when we complete the overall session or after we finished treating the water
    # that achieves the desired output
    validated_at = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f'Session for Sample: {self.raw_water_sample.sample_ref_number}'

class ValidationTrial(models.Model):
    validation_session = models.ForeignKey(ValidationSession,on_delete=models.CASCADE, related_name='validation_trials')
    # trial numbers must reset when we start another session
    trial_no = models.PositiveIntegerField()

    # this is the data that will be include in post request when we perform coagulation
    applied_dosage = models.DecimalField(max_digits=8, decimal_places=2)
    applied_volume = models.DecimalField(max_digits=8, decimal_places=2)

    # just a failsafe when the dosage not meet the standards so we can adjust to achieve the standard
    # this is necessary for future review and reference
    status = models.CharField(max_length=50)

    # Now, we must properly arrange the order of trials in a number of sesssions
    # Each session must have different trial numbers
    # So we have to create constratins
    class Meta:
        constraints = [
            models.UniqueConstraint(
                # use the validation_session and trial no variable 
                fields=['validation_session', 'trial_no'],
                name = 'unique_trial_number_per_session'
            )
        ]

    def __str__(self):
        return f'Session {self.validation_session.id} : Trial {self.trial_no}'
    

class ResultingWaterQuality(models.Model):
    validation_trial = models.OneToOneField(ValidationTrial, on_delete=models.CASCADE, related_name='resulting_water_quality')
    turbidity = models.DecimalField(max_digits=10, decimal_places=2)
    pH = models.DecimalField(max_digits=4, decimal_places=2)
    conductivity = models.DecimalField(max_digits=10, decimal_places=2)
    temperature = models.DecimalField(max_digits=5, decimal_places=2)
    alkalinity = models.DecimalField(max_digits=10, decimal_places=2)
    recorded_at = models.DateTimeField(auto_now_add=True)


