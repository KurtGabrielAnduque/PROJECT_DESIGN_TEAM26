# import the rest f
from rest_framework import serializers

from api.models import ValidationTrial
from .resulting_water_quality_serializer import ResultingWaterQualitySerializer


class ValidationTrialSerializer(serializers.ModelSerializer):
    # get the water quality results
    resulting_water_quality = ResultingWaterQualitySerializer(read_only=True)

    class Meta:
        model = ValidationTrial

        fields = [
            "id",
            "validation_session",
            "trial_no",
            "applied_dosage",
            "applied_volume",
            "resulting_water_quality",
            "status",
        ]

        # dont make this field modifiable
        read_only_fields = fields
