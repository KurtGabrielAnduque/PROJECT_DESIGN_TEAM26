from rest_framework import serializers
from django.db import transaction
from api.models import LabSettingConfiguration, CoagulationConfiguration, RawWaterAnalysisConfiguration, ConcentrationConfiguration, SlowMixingConfiguration
from decimal import Decimal

# create the serializer for the slow mix configuration
class SlowMixingConfigurationSerializer(serializers.ModelSerializer):
    class Meta:
        model = SlowMixingConfiguration
        fields = ['sequence_no', 'rpm', 'duration']


    def validate_sequence_no(self, sequence_no):
        if sequence_no <= 0:
            raise serializers.ValidationError(
                "Sequence number must be greater than 0."
            )
        return sequence_no

    def validate_rpm(self, rpm):
        if rpm <= 0:
            raise serializers.ValidationError(
                "Please apply appropriate motor speed in this rpm field"
            )

        return rpm

    def validate_duration(self, duration):
        if duration <= 0:
            raise serializers.ValidationError(
                "Please apply appropriate duration in this specific rpm"
            )
        return duration

# create the serializer for the coagulation configuration
class CoagulationConfigurationSerializer(serializers.ModelSerializer):
    # it must be many true since we expect alot of sequence from slow mixing
    slow_mixing_configurations = SlowMixingConfigurationSerializer( many=True )

    class Meta:
        model = CoagulationConfiguration
        fields = ['flash_mixing_speed', 'flash_mixing_duration', 'coagulant_dispense_timing',
                  'slow_mixing_configurations', 'settling_duration']

    # create validation for the flash mixing
    def validate_flash_mixing_speed(self, flash_mixing_speed):
        if flash_mixing_speed <= 0:
            raise serializers.ValidationError(
                "Please apply appropriate value to flash mixing speed"
            )

        return flash_mixing_speed

    # create validation for the flash mixing duration
    def validate_flash_mixing_duration(self, flash_mixing_duration):
        if flash_mixing_duration <= 0:
            raise serializers.ValidationError(
                "Please apply appropriate value to flash mixing duration"
            )
        return flash_mixing_duration

    # create validation for the coagulant dispensing timeing
    def validate_coagulant_dispense_timing(self, coagulant_dispense_timing):
        if coagulant_dispense_timing <= 0:
            raise serializers.ValidationError(
                "Please apply appropriate value to coagulant dispense timing"
            )

        return coagulant_dispense_timing

    def validate_settling_duration(self, settling_duration):
        if settling_duration <= 0:
            raise serializers.ValidationError(
                "Please apply appropriate value for the settling duration in seconds please"
            )

        return settling_duration

    def validate_slow_mixing_configurations(self, value):
            # check if the payload for sequence property has value
            # because this can be modify when user know how to modify payload
            if not value:
                raise serializers.ValidationError(
                    "At least one slow mixing configuration is required."
                )

            # this validation is important to make sure that the sequence to be receive
            # in the backend is sorted in increasing format although we have a safety check in models part
            sequence_numbers = [item['sequence_no'] for item in value]
    
            expected_sequence = list(range(1, len(value) + 1))
    
            if sorted(sequence_numbers) != expected_sequence:
                raise serializers.ValidationError(
                    "Slow mixing sequences must start at 1 and be sequential."
                )
    
            return value

    # Create a validation for the coagulant dispense timeing during flashmixing
    # because there is an instances that operator misinput the timing of coagulant dosage
    # larger than the time of rapid mixing
    def validate(self, attrs):

        if (attrs['coagulant_dispense_timing'] >= attrs['flash_mixing_duration']):
            raise serializers.ValidationError(
                "Coagulant dispense timing must occur during flash mixing."
            )

        return attrs

# create the serializer for the concentration configuration
class ConcentrationConfigurationSerializer(serializers.ModelSerializer):
    class Meta:
        model = ConcentrationConfiguration
        fields = ['sample_volume', 'stock_concentration']


    def validate_sample_volume(self, sample_volume):
        if sample_volume <= 0:
            raise serializers.ValidationError(
                "Please apply volume of water use in creating the stock solution"
            )
        return sample_volume

    def validate_stock_concentration(self, stock_concentration):
        if stock_concentration <= 0:
            raise serializers.ValidationError(
                "Please apply the appropriate amount of concentration used in creation the stock solution"
            )

        return stock_concentration


# create the serializer for the raw water analysis configuration
class RawWaterAnalysisConfigurationSerializer(serializers.ModelSerializer):
    class Meta:
        model = RawWaterAnalysisConfiguration
        fields = ['stirring_speed', 'stirring_duration']

    # validation for speed input
    def validate_stirring_speed(self, stirring_speed):
        if stirring_speed <= 0:
            raise serializers.ValidationError(
                "Please apply the appropriate stirring speed for the analysis of the raw water"
            )
        return stirring_speed

    # validation for the stirring duration
    def validate_stirring_duration(self, stirring_duration):
        if stirring_duration <= 0:
            raise serializers.ValidationError(
                "Please apply the appropriate stirring duration use for this specific rpm"
            )
        return stirring_duration


class LabSettingConfigurationCreateSerializer(serializers.ModelSerializer):
    coagulation_config = CoagulationConfigurationSerializer()
    concentration_config = ConcentrationConfigurationSerializer()
    analysis_config = RawWaterAnalysisConfigurationSerializer()

    class Meta:
        model = LabSettingConfiguration
        fields = ['name', 'version', 'coagulation_config',
                  'concentration_config','analysis_config',
                  'is_active']

    # create a validation for name
    def validate_name(self, name):
        name = name.strip()

        if not name:
            raise serializers.ValidationError(
                "Configuration name cannot be empty."
            )

        return name

    # create a version validation
    def validate_version(self, version):
        version = version.strip()

        if not version:
            raise serializers.ValidationError(
                "Configuration version cannot be empty."
            )

        return version

    # Creation of the custom create method for post request method
    @transaction.atomic
    def create(self, validated_data):

        # seperate the nested configurations data

        # get the property of coagulation_config 
        # and pop it at the main dictionary
        coagulation_data = validated_data.pop('coagulation_config')

        # pop the slow_mixing data here
        slow_mixing_data = coagulation_data.pop('slow_mixing_configurations')

        # get the property of  concentration_config
        # and pop it at the main dictionary
        concentration_data = validated_data.pop('concentration_config')

        # get the property of  analysis config
        # and pop it at the main dictionary
        analysis_data = validated_data.pop('analysis_config')

        # the only remaining data is
        '''
        {
            "name": "Maynilad Standard Validation Procedure",
            "version": "1.0",
            "is_active": true,
        }
        '''


        # Now deactivate the previous active settings

        if validated_data.get('is_active'):
            LabSettingConfiguration.objects.filter(is_active = True).update( is_active = False)

        # now insert the current data in the new data point
        lab_configuration = LabSettingConfiguration.objects.create(**validated_data)

        # follow up the child model or tables (Concetration configuration model)
        ConcentrationConfiguration.objects.create(lab_setting_configuration = lab_configuration, **concentration_data)

        # (raw water analysis configuration model)
        RawWaterAnalysisConfiguration.objects.create(lab_setting_configuration = lab_configuration, **analysis_data)

        # Coagulation configuration
        coagulation_configuration = CoagulationConfiguration.objects.create(lab_setting_configuration = lab_configuration, **coagulation_data)

        for slow_mix in slow_mixing_data:
            SlowMixingConfiguration.objects.create(coagulation_configuration = coagulation_configuration, **slow_mix )

        return lab_configuration


# SAMPLE REQUIRED PAYLOAD BELOW:
    
    
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