from rest_framework import serializers
from django.db import transaction
from api.models import LabSettingConfiguration, CoagulationConfiguration, RawWaterAnalysisConfiguration, ConcentrationConfiguration, SlowMixingConfiguration

# EXPECTED PAYLOAD FROM THE BACKEND
    
    
'''
{
    "name": "Maynilad Standard Validation Procedure",
    "version": "1.0",
    "is_active": true,

    "coagulation_config": {
        "flash_mixing_speed": 185,
        "flash_mixing_duration": 8,
        "coagulant_dispense_timing": 5,

        "slow_mixing_configurations": [
            {
                "sequence_no": 1,
                "rpm": 85,
                "duration": 100
            },
            {
                "sequence_no": 2,
                "rpm": 45,
                "duration": 60
            },
            {
                "sequence_no": 3,
                "rpm": 30,
                "duration": 120
            }
        ],

        "settling_duration": 960
    },

    "concentration_config": {
        "sample_volume": 1,
        "stock_concentration": 2
    },

    "analysis_config": {
        "stirring_speed": 120,
        "stirring_duration": 60
    }
}

'''


class SlowMixingConfig(serializers.ModelSerializer):
    class Meta:
        model = SlowMixingConfiguration
        field = ['sequence_no', 'rpm', 'duration']

class CoagulationConfig(serializers.ModelSerializer):
    slow_mixing_configuration = SlowMixingConfig(many=True)

    class Meta:
        model = CoagulationConfiguration
        field = ['flash_mixing_speed', 'flash_mixing_duration', 'coagulant_dispense_timing', 'slow_mixing_configuration', 'settling_duration']

class ConcentrationConfig(serializers.ModelSerializer):
    class Meta:
        model = ConcentrationConfiguration
        field = ['sample_volume','stock_concentration']

class RawWaterAnalysisConfig(serializers.ModelSerializer):
    class Meta:
        model = RawWaterAnalysisConfiguration
        field = ['stirring_speed','stirring_duration']


class GetLabSettings(serializers.ModelSerializer):
    analysis_config = RawWaterAnalysisConfig()
    concentration_config = ConcentrationConfig()
    coagulation_config = CoagulationConfig()

    class Meta:
        model = LabSettingConfiguration
        field = ['name', 'version', 'is_active', 'coagulation_config', 'concentration_config', 'analysis_config', 'created_at']