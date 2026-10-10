from rest_framework import serializers

# import the necessary models for the resulting water quality parameters

from api.models import ResultingWaterQuality, ValidationTrial


class ResultingWaterQualitySerializer(serializers.ModelSerializer):

    # 
    validation_trial = serializers.PrimaryKeyRelatedField(queryset = ValidationTrial.objects.all())


    class Meta:
        model = ResultingWaterQuality
        fields = [
            "id",
            "validation_trial",
            "turbidity",
            "pH",
            "conductivity",
            "temperature",
            "alkalinity",
            "recorded_at"
        ]



        read_only_fields = ["id", "recorded_at"]

    # VALIDATION FOR MULTIPLE PARAMETERS 
    def validate(self, attrs):

        # Support both create requests and partial updates.
        def get_value(field_name):
            if field_name in attrs:
                return attrs[field_name]

            if self.instance is not None:
                return getattr(self.instance, field_name)

            return None

        # These measurements cannot be negative.
        # list here the parameters that cannnot be negative
        # temperature is included here because it can be negative
        non_negative_fields = [
            "turbidity",
            "conductivity",
            "alkalinity",
        ]

        # create a dictionary to store all the erros in every parameters
        # during the individual validation
        errors = {}

        # PERFORM THE VALIDATION FOR EACH PARAMETER
        for field_name in non_negative_fields:
            value = get_value(field_name)

            if value is not None and value < 0:
                errors[field_name] = (
                    "This measurement cannot be negative."
                )

        # Valid pH measurements range from 0 to 14.
        ph_value = get_value("pH")

        if ph_value is not None and not 0 <= ph_value <= 14:
            errors["pH"] = "pH must be between 0 and 14."

        if errors:
            raise serializers.ValidationError(errors)

        return attrs

