import requests
# import the identifier system
import uuid

# import decimal
from decimal import Decimal


#import the model
from api.models import RawWaterSample, RawWaterQuality, Recommendation
from api.models import LabSettingConfiguration # it will be use to get the concentration configuration of the latest lab settings
from api.serializers import RawWaterAnalysisInputSerializer
from api.serializers import PredictionSampleSerializer


from api.services import predict_coagulant_dose # service for model prediction
from api.services import start_raw_water_analysis

# import other module utilities
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

# django configurations
from django.conf import settings
from django.db import transaction

# This is a post request method that will be use by the esp32 to send measured water quality parameters
@api_view(['POST'])
@transaction.atomic
def create_raw_water_sample(request):

    # get the payload from the esp 32
    serializer = RawWaterAnalysisInputSerializer(data = request.data)

    # validate the data received
    # but we still dont validation in the prediction_post_serializer.py
    if not serializer.is_valid():
        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )

    # get the latest active lab settings configuration
    active_configuration = (
        LabSettingConfiguration.objects.filter(is_active = True).order_by('-created_at').first()
    )

    # if there are no current active lab configurations
    # inform the operator
    if not active_configuration:
        return Response(
            {
                'message': 'No active lab settings configuration found.'
            },
            status=status.HTTP_400_BAD_REQUEST
        )

    # save the validated sensor data to simplify
    water_quality_data = serializer.validated_data

    # GENERATE THE NEXT SAMPLE REFERENCE NUMBER
    last_sample = (
        RawWaterSample.objects
        .order_by('-id')
        .first()
    )

    if last_sample:
        last_number = int(
            last_sample.sample_ref_number.split('-')[-1]
        )
        next_number = last_number + 1
    else:
        next_number = 1

    sample_ref_number = f'SMPL-{next_number:04d}'
    # --------------------------------------------

    # create the sample reference id to save the received measure raw water quality parameters
    raw_water_sample = RawWaterSample.objects.create(
        sample_ref_number = sample_ref_number,
        lab_settings_configuration = active_configuration
    )

    # save the raw water quality to the parent table
    RawWaterQuality.objects.create(
        raw_water_sample = raw_water_sample, ** water_quality_data
    )

    # give feed the data from the sensors to the machine learning
    # let it predict 
    predicted_dosage = Decimal(str(predict_coagulant_dose(water_quality_data)))

    # get the concentration configuration of the current active lab settings 
    concentration_config = active_configuration.concentration_config

    # Calculate the required stock-solution volume:
    # get the specific parameters need for the computation
    sample_volume = concentration_config.sample_volume # volume or water used in creating the solution
    stock_concentration = concentration_config.stock_concentration # concentration of solution amoun of alum sulfate used

    # g/L → mg/L
    stock_concentration_mg_per_l = (stock_concentration * Decimal('1000'))

    # compute the required volume to dispense
    required_coagulant_mass = predicted_dosage * sample_volume
    volume_to_dispense = (required_coagulant_mass / stock_concentration_mg_per_l) * Decimal('1000')

    # save the prediction to the database
    Recommendation.objects.create(
        raw_water_sample = raw_water_sample,
        lab_settings_configuration = active_configuration,
        predicted_dosage = predicted_dosage,
        volume_to_dispense = volume_to_dispense
    )


    ## return a success response
    return Response(
        {
            "message": 'Raw-water sample analyzed successfully.',
            "sample_id": raw_water_sample.id,
            "sample_ref_number": raw_water_sample.sample_ref_number,
            "predicted_dosage": predicted_dosage,
            "volume_to_dispense": volume_to_dispense
        },
        status=status.HTTP_201_CREATED
    )



# GET endpoint used by the frontend to retrieve
# the latest completed raw-water analysis and prediction.
@api_view(['GET'])
def get_latest_prediction(request):

    # Get the latest sample that already has a recommendation.
    latest_sample = (
        RawWaterSample.objects
        .filter(recommendation__isnull=False)
        .order_by('-analyzed_at')
        .first()
    )

    # If no completed prediction exists yet
    if not latest_sample:
        return Response(
            {
                'message': 'No completed prediction found.'
            },
            status=status.HTTP_404_NOT_FOUND
        )

    # Serialize the complete prediction data
    serializer = PredictionSampleSerializer(
        latest_sample
    )

    return Response(
        {
            **serializer.data,
            'status': 'prediction_complete'
        },
        status=status.HTTP_200_OK
    )



# POST endpoint used by the frontend to request
# the start of raw-water analysis.
@api_view(['POST'])
def start_raw_water_analysis_command(request):


    # Get the current active lab settings configuration
    active_configuration = (LabSettingConfiguration.objects.filter(is_active=True).order_by('-created_at').first())

    # If there is no active configuration,
    # the analysis cannot start.
    if not active_configuration:
        return Response(
            {
                'message': 'No active lab settings configuration found.'
            },
            status=status.HTTP_400_BAD_REQUEST
        )

    # Get the raw-water analysis configuration
    analysis_configuration = (active_configuration.analysis_config)

    # generate the identifier here
    analysis_request_id = str(uuid.uuid4())

    # Send the command and configuration to themicrocontroller
    try:

        microcontroller_response = start_raw_water_analysis(settings.MICROCONTROLLER_BASE_URL, analysis_configuration, analysis_request_id)

    except requests.exceptions.Timeout:

        return Response(
            {
                'message': (
                    'The microcontroller did not acknowledge '
                    'the analysis command within the timeout.'
                )
            },
            status=status.HTTP_504_GATEWAY_TIMEOUT
        )

    except requests.exceptions.ConnectionError:

        return Response(
            {
                'message': 'Unable to connect to the microcontroller.'
            },
            status=status.HTTP_503_SERVICE_UNAVAILABLE
        )

    except requests.exceptions.HTTPError:

        return Response(
            {
                'message': 'Microcontroller rejected the analysis command.'
            },
            status=status.HTTP_502_BAD_GATEWAY
        )

    # Return success to the frontend
    return Response(
        {
            'message': 'Raw-water analysis command accepted.',
            'status': 'started',
            'analysis_request_id': analysis_request_id,
            'analysis_configuration': {
                'id': analysis_configuration.id,
                'stirring_speed': analysis_configuration.stirring_speed,
                'stirring_duration': analysis_configuration.stirring_duration
            },
            'microcontroller_response': microcontroller_response
        },
        status=status.HTTP_202_ACCEPTED
    )