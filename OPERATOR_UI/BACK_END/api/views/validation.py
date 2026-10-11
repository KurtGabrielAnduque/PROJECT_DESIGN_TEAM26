# SPECIAL IMPORTS
import requests
from decimal import Decimal # use for the computation part
from django.core.exceptions import ObjectDoesNotExist
# =======

from django.conf import settings
from django.db import IntegrityError, transaction

from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response


from api.models import CoagulationConfiguration, ValidationSession, ValidationTrial
from api.serializers import StartValidationSessionRequestSerializer
from api.serializers import ValidationSessionSerializer

# import the process for coagulation
from api.services.microcontroller_service import start_treatment

# imported view for the part of submission of esp32 to the bakend
from api.models import ResultingWaterQuality

from api.serializers import ResultingWaterQualitySerializer
from api.serializers import ResultingWaterQualitySubmissionSerializer

# start post treatment assessment imports
from api.serializers import StartTreatedWaterAssessmentRequestSerializer
from api.services.microcontroller_service import start_treated_water_analysis

# completion view
from api.serializers import CoagulationCompletionRequestSerializer


@api_view(["POST"])
def start_validation(request):

    # this is the data that we receive from the frontend about the 
    # current sample id that we need to validate
    # Validate the selected completed raw-water sample or validate if theres really a 
    # completed updated sample
    request_serializer = StartValidationSessionRequestSerializer(
        data=request.data
    )

    # if the data that we received was not finish the validation
    # prepared from the serializer them throw error
    if not request_serializer.is_valid():
        return Response(
            request_serializer.errors,
            status=status.HTTP_400_BAD_REQUEST,
        )

    # get the full detail of the sample base on the given id 
    sample = request_serializer.validated_data["raw_water_sample"]
    
    # get the recommendation data about this sample
    recommendation = sample.recommendation

    # Use the settings version captured for this sample.
    lab_settings_configuration = sample.lab_settings_configuration

    # Ensure the recommendation and sample use the same settings version.
    if (
        recommendation.lab_settings_configuration_id
        != sample.lab_settings_configuration_id
    ):
        return Response(
            {
                "message": (
                    "The sample and recommendation reference "
                    "different settings configurations."
                )
            },
            status=status.HTTP_409_CONFLICT,
        )

    # Check that the treatment configuration exists.
    # check kung may laman talagang configuration
    try:
        coagulation_configuration = (
            lab_settings_configuration.coagulation_config
        )
    except CoagulationConfiguration.DoesNotExist:
        return Response(
            {
                "message": (
                    "The sample's settings configuration has "
                    "no coagulation configuration."
                )
            },
            status=status.HTTP_400_BAD_REQUEST,
        )

    # Check whether this sample already has a session.
    # this is important because the sample relation to session is one to one
    # so lets avoid duplicated id pls
    session = ValidationSession.objects.filter(raw_water_sample=sample).first()

    if session is not None:
        # A failed start can retry the same trial, using the same IDs.
        if session.overall_status == "start_failed":
            trial = (
                session.validation_trials.filter(
                status="start_failed"
                )
                .order_by("-trial_no")
                .first()
            )

            if trial is None:
                return Response(
                    {
                        "message": (
                            "The existing session is marked as "
                            "start_failed, but no retryable trial "
                            "was found."
                        )
                    },
                    status=status.HTTP_409_CONFLICT,
                )

            trial.status = "starting"
            trial.save(update_fields=["status"])

            session.overall_status = "starting_treatment"
            session.save(update_fields=["overall_status"])

        else:
            # Do not issue another treatment command for a session
            # that is already active or has already been completed.
            if session.overall_status in {"completed", "validated"}:
                return Response(
                    {
                        "message": (
                            "This sample's validation session "
                            "has already been completed."
                        ),
                        "session": ValidationSessionSerializer(
                            session
                        ).data,
                    },
                    status=status.HTTP_409_CONFLICT,
                )

            return Response(
                {
                    "message": (
                        "A validation session already exists "
                        "for this sample. No duplicate treatment "
                        "command was sent."
                    ),
                    "session": ValidationSessionSerializer(
                        session
                    ).data,
                },
                status=status.HTTP_200_OK,
            )

    else:
        # 5. Create the session and initial trial together.
        try:
            with transaction.atomic():
                session = ValidationSession.objects.create(
                    raw_water_sample=sample,
                    lab_settings_configuration=(
                        lab_settings_configuration
                    ),
                    final_trial=None,
                    overall_status="starting_treatment",
                    validated_at=None,
                )

                trial = ValidationTrial.objects.create(
                    validation_session=session,
                    trial_no=1,
                    applied_dosage=recommendation.predicted_dosage,
                    applied_volume=recommendation.volume_to_dispense,
                    status="starting",
                )

        except IntegrityError:
            # A concurrent request may have created the session
            # after our initial existence check.
            existing_session = ValidationSession.objects.filter(
                raw_water_sample=sample
            ).first()

            if existing_session is not None:
                return Response(
                    {
                        "message": (
                            "A validation session was created "
                            "for this sample by another request."
                        ),
                        "session": ValidationSessionSerializer(
                            existing_session
                        ).data,
                    },
                    status=status.HTTP_409_CONFLICT,
                )

            raise

    # Save a failed-start state without deleting session/trial history.
    def mark_start_failed():
        trial.status = "start_failed"
        trial.save(update_fields=["status"])

        session.overall_status = "start_failed"
        session.save(update_fields=["overall_status"])

    # 6. Ask the ESP32 to start treatment.
    try:
        microcontroller_response = start_treatment(
            microcontroller_base_url=settings.MICROCONTROLLER_BASE_URL,
            validation_session=session,
            validation_trial=trial,
            raw_water_sample=sample,
            lab_settings_configuration=lab_settings_configuration,
            coagulation_configuration=coagulation_configuration,
        )

    except requests.exceptions.Timeout:
        mark_start_failed()
        return Response(
            {
                "message": (
                    "The ESP32 did not acknowledge the treatment "
                    "command before the timeout. Check the device "
                    "before retrying."
                )
            },
            status=status.HTTP_504_GATEWAY_TIMEOUT,
        )

    except requests.exceptions.ConnectionError:
        mark_start_failed()
        return Response(
            {
                "message": "Unable to connect to the ESP32."
            },
            status=status.HTTP_503_SERVICE_UNAVAILABLE,
        )

    except requests.exceptions.HTTPError:
        mark_start_failed()
        return Response(
            {
                "message": "The ESP32 rejected the treatment command."
            },
            status=status.HTTP_502_BAD_GATEWAY,
        )

    except (ValueError, requests.exceptions.RequestException):
        mark_start_failed()
        return Response(
            {
                "message": (
                    "The treatment command could not be "
                    "confirmed by the ESP32."
                )
            },
            status=status.HTTP_502_BAD_GATEWAY,
        )

    # 7. Record that the ESP32 acknowledged the command.
    # This means accepted, not that treatment is already complete.
    trial.status = "treating"
    trial.save(update_fields=["status"])

    session.overall_status = "in_progress"
    session.save(update_fields=["overall_status"])

    return Response(
        {
            "message": "Treatment command accepted.",
            "status": "started",
            "session": ValidationSessionSerializer(session).data,
            "validation_trial_id": trial.id,
            "microcontroller_response": microcontroller_response,
        },
        status=status.HTTP_202_ACCEPTED,
    )


@api_view(["POST"])
def submit_resulting_water_quality(request):
    # 1. Validate the measurements and identify the trial.
    serializer = ResultingWaterQualitySubmissionSerializer(
        data=request.data
    )

    if not serializer.is_valid():
        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST,
        )

    validated_data = dict(serializer.validated_data)
    submitted_trial = validated_data.pop("validation_trial")

    # 2. Lock and retrieve the trial before saving its result.
    try:
        with transaction.atomic():
            trial = (
                ValidationTrial.objects
                .select_for_update() # I think this will protect concurrent updates
                .select_related("validation_session")
                .get(pk=submitted_trial.pk)
            )

            session = trial.validation_session

            # Accept results only for a trial that is being treated.
            if trial.status != "measuring_treated_water":
                return Response(
                    {
                        "message": (
                            "This trial has not started treated-water "
                            "measurement or cannot receive results."
                        ),
                        "trial_status": trial.status,
                    },
                    status=status.HTTP_409_CONFLICT,
                )

            if session.overall_status in {
                "completed",
                "validated",
            }:
                return Response(
                    {
                        "message": (
                            "This validation session has "
                            "already been finalized."
                        )
                    },
                    status=status.HTTP_409_CONFLICT,
                )

            # Check again inside the transaction to guard against
            # a duplicate result submission.
            if ResultingWaterQuality.objects.filter(
                validation_trial=trial
            ).exists():
                return Response(
                    {
                        "message": (
                            "Measurements have already been "
                            "recorded for this trial."
                        )
                    },
                    status=status.HTTP_409_CONFLICT,
                )

            # 3. Save the measurements against the exact trial.
            resulting_quality = ResultingWaterQuality.objects.create(
                validation_trial=trial,
                **validated_data,
            )

            # 4. Evaluate the study's turbidity criterion.
            # A result at or below 5 NTU meets this criterion.
            turbidity_limit = Decimal("5.00")

            criterion_met = (
                resulting_quality.turbidity <= turbidity_limit
            )

            trial.status = "passed" if criterion_met else "failed"
            trial.save(update_fields=["status"])

            # Do not finalize the session automatically.
            # The operator still chooses whether to save the final
            # result or perform another trial.

    except ValidationTrial.DoesNotExist:
        return Response(
            {"message": "The specified validation trial was not found."},
            status=status.HTTP_404_NOT_FOUND,
        )

    except IntegrityError:
        return Response(
            {
                "message": (
                    "A result already exists for this trial, "
                    "or the result could not be saved."
                )
            },
            status=status.HTTP_409_CONFLICT,
        )

    # 5. Return the saved measurements and evaluation.
    return Response(
        {
            "message": "Treated-water measurements recorded.",
            "validation_session_id": session.id,
            "validation_trial_id": trial.id,
            "trial_status": trial.status,
            "turbidity_evaluation": {
                "threshold_ntu": str(turbidity_limit),
                "measured_ntu": str(resulting_quality.turbidity),
                "criterion_met": criterion_met,
            },
            "resulting_water_quality": (
                ResultingWaterQualitySerializer(
                    resulting_quality
                ).data
            ),
        },
        status=status.HTTP_201_CREATED,
    )





@api_view(["POST"])
def start_treated_water_assessment(request):
    # Validate the request.
    serializer = StartTreatedWaterAssessmentRequestSerializer(
        data=request.data
    )

    if not serializer.is_valid():
        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST,
        )

    trial_id = serializer.validated_data[
        "validation_trial"
    ].id

    # Retrieve the trial and its related session, sample,
    # and configuration.
    try:
        trial = (
            ValidationTrial.objects
            .select_related(
                "validation_session__raw_water_sample",
                "validation_session__lab_settings_configuration",
            )
            .get(pk=trial_id)
        )
    except ValidationTrial.DoesNotExist:
        return Response(
            {"message": "Validation trial not found."},
            status=status.HTTP_404_NOT_FOUND,
        )

    session = trial.validation_session
    sample = session.raw_water_sample
    lab_configuration = session.lab_settings_configuration

    # Only assess a trial whose coagulation process is complete.
    # The ESP32 completion callback must set this status first.
    if trial.status != "awaiting_measurement":
        return Response(
            {
                "message": (
                    "This trial is not ready for treated-water "
                    "assessment. Complete coagulation first."
                ),
                "trial_status": trial.status,
            },
            status=status.HTTP_409_CONFLICT,
        )

    if session.overall_status in {"completed", "validated"}:
        return Response(
            {
                "message": (
                    "This validation session has already "
                    "been finalized."
                )
            },
            status=status.HTTP_409_CONFLICT,
        )

    # Retrieve the analysis settings from the same
    # configuration version used by this validation session.
    try:
        analysis_configuration = lab_configuration.analysis_config
    except ObjectDoesNotExist:
        return Response(
            {
                "message": (
                    "The session's settings configuration has "
                    "no raw-water analysis configuration."
                )
            },
            status=status.HTTP_400_BAD_REQUEST,
        )

    # 5. Send the assessment command to the ESP32.
    try:
        microcontroller_response = start_treated_water_analysis(
            microcontroller_base_url=settings.MICROCONTROLLER_BASE_URL,
            validation_session=session,
            validation_trial=trial,
            raw_water_sample=sample,
            lab_settings_configuration=lab_configuration,
            analysis_configuration=analysis_configuration,
        )

    except requests.exceptions.Timeout:
        # Keep the trial awaiting measurement. A timeout doesn't
        # prove the ESP32 failed to receive the command.
        return Response(
            {
                "message": (
                    "Timed out waiting for the ESP32 acknowledgement. "
                    "Check the device before retrying."
                )
            },
            status=status.HTTP_504_GATEWAY_TIMEOUT,
        )

    except requests.exceptions.ConnectionError:
        return Response(
            {
                "message": "Unable to connect to the ESP32."
            },
            status=status.HTTP_503_SERVICE_UNAVAILABLE,
        )

    except requests.exceptions.HTTPError:
        return Response(
            {
                "message": "The ESP32 rejected the assessment command."
            },
            status=status.HTTP_502_BAD_GATEWAY,
        )

    except (ValueError, requests.exceptions.RequestException):
        return Response(
            {
                "message": (
                    "The assessment command could not be "
                    "confirmed by the ESP32."
                )
            },
            status=status.HTTP_502_BAD_GATEWAY,
        )

    # 6. Record that the measurement command was accepted.
    # This does not mean that measurements are already available.
    trial.status = "measuring_treated_water"
    trial.save(update_fields=["status"])

    return Response(
        {
            "message": "Treated-water assessment command accepted.",
            "status": "measuring_treated_water",
            "validation_session_id": session.id,
            "validation_trial_id": trial.id,
            "microcontroller_response": microcontroller_response,
        },
        status=status.HTTP_202_ACCEPTED,
    )


@api_view(["POST"])
def notify_coagulation_complete(request):
    serializer = CoagulationCompletionRequestSerializer(
        data=request.data
    )

    if not serializer.is_valid():
        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST,
        )

    submitted_session = serializer.validated_data[
        "validation_session"
    ]
    submitted_trial = serializer.validated_data[
        "validation_trial"
    ]

    with transaction.atomic():
        try:
            trial = (
                ValidationTrial.objects
                .select_for_update()
                .select_related("validation_session")
                .get(pk=submitted_trial.pk)
            )
        except ValidationTrial.DoesNotExist:
            return Response(
                {"message": "Validation trial not found."},
                status=status.HTTP_404_NOT_FOUND,
            )

        session = trial.validation_session

        # Recheck the relationship against the locked database record.
        if session.id != submitted_session.id:
            return Response(
                {
                    "message": (
                        "The trial does not belong to this session."
                    )
                },
                status=status.HTTP_409_CONFLICT,
            )

        if session.overall_status in {"completed", "validated"}:
            return Response(
                {"message": "This session has already been finalized."},
                status=status.HTTP_409_CONFLICT,
            )

        # Normal transition after the coagulation sequence finishes.
        if trial.status == "treating":
            trial.status = "awaiting_measurement"
            trial.save(update_fields=["status"])

            return Response(
                {
                    "message": "Coagulation process completed.",
                    "validation_session_id": session.id,
                    "validation_trial_id": trial.id,
                    "trial_status": trial.status,
                    "next_action": "await_treated_water_assessment",
                },
                status=status.HTTP_200_OK,
            )

        # A repeated or delayed callback must not move the trial
        # backwards after it has already progressed.
        if trial.status in {
            "awaiting_measurement",
            "measuring_treated_water",
            "passed",
            "failed",
        }:
            return Response(
                {
                    "message": (
                        "Coagulation completion was already recorded "
                        "or the trial has already progressed."
                    ),
                    "validation_session_id": session.id,
                    "validation_trial_id": trial.id,
                    "trial_status": trial.status,
                    "already_processed": True,
                },
                status=status.HTTP_200_OK,
            )

        return Response(
            {
                "message": (
                    "Coagulation completion cannot be recorded "
                    "for the trial's current state."
                ),
                "trial_status": trial.status,
            },
            status=status.HTTP_409_CONFLICT,
        )