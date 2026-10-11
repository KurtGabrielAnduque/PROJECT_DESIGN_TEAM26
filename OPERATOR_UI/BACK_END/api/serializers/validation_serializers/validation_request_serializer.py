
from decimal import Decimal
from rest_framework import serializers

from api.models import RawWaterSample, Recommendation
from api.models import ResultingWaterQuality, ValidationTrial #this is the model need for esp32 to save ther results
from api.models import ValidationSession

class StartValidationSessionRequestSerializer(serializers.Serializer):
    
    # get from the front end 
    raw_water_sample_id = serializers.PrimaryKeyRelatedField(
        queryset=RawWaterSample.objects.all(),
        source="raw_water_sample",
    )

    # cross validate if the sample id sent from the front do really exist
    def validate_raw_water_sample_id(self, sample):
        # Validation requires a completed dosage recommendation.
        recommendation_exists = Recommendation.objects.filter(
            raw_water_sample=sample
        ).exists()

        if not recommendation_exists:
            raise serializers.ValidationError(
                "This raw-water sample does not have a "
                "completed dosage recommendation."
            )

        return sample


class ResultingWaterQualitySubmissionSerializer(serializers.ModelSerializer):

    # search the id in where the esp32 will save the water quality result of the trial
    validation_trial_id = serializers.PrimaryKeyRelatedField(
        source="validation_trial",
        queryset=ValidationTrial.objects.all(),
        write_only=True,
    )

    class Meta:
        model = ResultingWaterQuality

        fields = [
            "id",
            "validation_trial_id",
            "turbidity",
            "pH",
            "conductivity",
            "temperature",
            "alkalinity",
            "recorded_at",
        ]

        read_only_fields = [
            "id",
            "recorded_at",
        ]

    # validate if the trial id where esp32 trying to save the water quality results
    # already exist
    def validate_validation_trial_id(self, trial):
        # A trial must not receive a second result record.
        if ResultingWaterQuality.objects.filter(
            validation_trial=trial
        ).exists():
            raise serializers.ValidationError(
                "Measurements have already been recorded "
                "for this trial."
            )

        return trial

    # validate each field of results
    def validate(self, attrs):
        # create a dictionary so only single announcement can  be made
        errors = {}

        # Physical measurements cannot be negative.
        for field_name in [
            "turbidity",
            "conductivity",
            "temperature",
            "alkalinity",
        ]:
            value = attrs.get(field_name)

            if value is not None and value < 0:
                errors[field_name] = (
                    "This measurement cannot be negative."
                )

        ph_value = attrs.get("pH")

        if ph_value is not None and not (
            Decimal("0") <= ph_value <= Decimal("14")
        ):
            errors["pH"] = "pH must be between 0 and 14."

        if errors:
            raise serializers.ValidationError(errors)

        return attrs

# serializer that activate if the user press the start assessment of the treatment button
class StartTreatedWaterAssessmentRequestSerializer(serializers.Serializer):
    
    validation_trial_id = serializers.PrimaryKeyRelatedField(
        queryset=ValidationTrial.objects.all(),
        source="validation_trial",
    )

    treated_water_sample_secured = serializers.BooleanField(
        required=True
    )

    def validate_treated_water_sample_secured(self, value):
        if not value:
            raise serializers.ValidationError(
                "Please secure the treated-water sample "
                "in the chamber before starting assessment."
            )

        return value



class CoagulationCompletionRequestSerializer(serializers.Serializer):
    validation_session_id = serializers.PrimaryKeyRelatedField(
        queryset=ValidationSession.objects.all(),
        source="validation_session",
    )

    validation_trial_id = serializers.PrimaryKeyRelatedField(
        queryset=ValidationTrial.objects.all(),
        source="validation_trial",
    )

    def validate(self, attrs):
        session = attrs["validation_session"]
        trial = attrs["validation_trial"]

        # Ensure the submitted trial actually belongs to
        # the submitted validation session.
        if trial.validation_session_id != session.id:
            raise serializers.ValidationError(
                {
                    "validation_trial_id": (
                        "This trial does not belong to the "
                        "specified validation session."
                    )
                }
            )

        return attrs




from decimal import Decimal

# Add ValidationSession to your existing api.models imports.
from api.models import ValidationSession


class StartNextValidationTrialRequestSerializer(serializers.Serializer):
    validation_session_id = serializers.PrimaryKeyRelatedField(
        queryset=ValidationSession.objects.all(),
        source="validation_session",
    )

    applied_dosage = serializers.DecimalField(
        max_digits=8,
        decimal_places=2,
        min_value=Decimal("0.01"),
    )

    fresh_sample_secured = serializers.BooleanField()

    def validate_fresh_sample_secured(self, value):
        if not value:
            raise serializers.ValidationError(
                "Please secure a fresh 1 L raw-water sample "
                "from the same source before retesting."
            )

        return value
