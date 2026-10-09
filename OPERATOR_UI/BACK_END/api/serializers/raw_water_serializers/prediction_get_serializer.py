from rest_framework import serializers
from api.models import RawWaterSample, RawWaterQuality, Recommendation # get the models from raw_water_sample.py
from ..lab_settings_serializers.lab_settings_configuration_get_serializer import ConcentrationConfig # reuse the Concentration configuration serializer for computation


# Serialize the raw-water quality measurements
class RawWaterQualitySerializer(serializers.ModelSerializer):
    class Meta:
        model = RawWaterQuality
        fields = [
            'turbidity',
            'pH',
            'conductivity',
            'temperature',
            'alkalinity'
        ]


# Serialize the dosage recommendation
class RecommendationSerializer(serializers.ModelSerializer):
    concentration_configuration = ConcentrationConfig(
        source='lab_settings_configuration.concentration_config',
        read_only=True
    )

    class Meta:
        model = Recommendation
        fields = [
            'id',
            'predicted_dosage',
            'volume_to_dispense',
            'concentration_configuration'
        ]

# Serialize the complete data needed by the Prediction page
class PredictionSampleSerializer(serializers.ModelSerializer):
    raw_water_quality = RawWaterQualitySerializer(
        read_only=True
    )

    recommendation = RecommendationSerializer(
        read_only=True
    )

    class Meta:
        model = RawWaterSample
        fields = [
            'id',
            'sample_ref_number',
            'raw_water_quality',
            'recommendation',
            'analyzed_at'
        ]