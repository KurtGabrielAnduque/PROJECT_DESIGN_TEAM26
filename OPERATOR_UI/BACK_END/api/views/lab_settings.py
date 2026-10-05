#import the model
from api.models import LabSettingConfiguration
from api.serializers import LabSettingConfigurationCreateSerializer
from api.serializers import GetLabSettings


# import other module utilities
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status


@api_view(['POST'])
def create_lab_settings(request):
    lab_settings = request.data

    serializer = LabSettingConfigurationCreateSerializer(data = lab_settings)

    if serializer.is_valid():
        serializer.save()

        return Response(
                    {"message": "New lab settings is updated successfully"},
                    status=status.HTTP_201_CREATED
                )
    

    return Response(serializer.errors, status = status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
def get_lab_settings(request):

    lab_settings = (
        LabSettingConfiguration.objects
        .filter(is_active=True)
        .order_by('-created_at')
        .first()
    )

    if not lab_settings:
        return Response(
            {
                "message": (
                    "No active lab settings "
                    "configuration found."
                )
            },
            status=status.HTTP_404_NOT_FOUND
        )

    serializer = GetLabSettings(lab_settings)

    return Response(
        serializer.data,
        status=status.HTTP_200_OK
    )