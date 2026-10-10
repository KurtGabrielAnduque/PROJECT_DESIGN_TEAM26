from rest_framework import serializers
from api.models import ValidationSession
from .validation_trial_serializer import ValidationTrialSerializer

class ValidationSessionSerializer(serializers.ModelSerializer):
    # make all results read only
    validation_trials = ValidationTrialSerializer(many = True, read_only=True)


    class Meta:
        model = ValidationSession

        fields = [
            "id",
            "raw_water_sample",
            "lab_settings_configuration",
            "final_trial",
            "overall_status",
            "validated_at",
            "validation_trials",
        ]


        # same with all fields 
        read_only_fields = fields