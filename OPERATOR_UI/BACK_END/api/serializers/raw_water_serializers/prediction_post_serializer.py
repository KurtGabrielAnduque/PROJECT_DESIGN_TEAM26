from rest_framework import serializers

# this is the only payload that we need from the esp 32
class RawWaterAnalysisInputSerializer(serializers.Serializer):

    # Used to correlate the sensor result with
    # the analysis command that started it.
    analysis_request_id = serializers.UUIDField(
        required=False,
        allow_null=True
    )

    turbidity = serializers.DecimalField(
        max_digits=8,
        decimal_places=2,
        min_value=0
    )

    pH = serializers.DecimalField(
        max_digits=4,
        decimal_places=2,
        min_value=0, # minimum value accepted for the pH sensor
        max_value=14 # maximum value accepted for the pH sensor
    )

    conductivity = serializers.DecimalField(
        max_digits=8,
        decimal_places=2,
        min_value=0
    )

    temperature = serializers.DecimalField(
        max_digits=5,
        decimal_places=2
    )

    alkalinity = serializers.DecimalField(
        max_digits=8,
        decimal_places=2,
        min_value=0
    )

    # check the temperature sensor readings
    def validate_temperature(self, temperature):
        
        # Liquid water shouldn't exist outside these bounds normally
        if temperature <= 0 or temperature >= 60:
            raise serializers.ValidationError("Temperature reading is outside realistic bounds for raw water (0-60°C).")
        
        return temperature

    # validation for the turbidity sensor
    def validate_turbidity(self, turbidity):
        # Assuming NTU units; raw water rarely exceeds 1000-2000 NTU unless it's pure mud
        if turbidity > 2000:
            raise serializers.ValidationError("Turbidity is suspiciously high. Check sensor for fouling or blockages.")
        return turbidity

    # cross field validation because these sensors has correlations
    def validate(self, data):
        cond = data.get('conductivity')
        ph = data.get('pH')
        
        # If conductivity is absolute zero, the probes are likely out of the water
        if cond == 0:
            raise serializers.ValidationError({
                "conductivity": "Probe appears dry or disconnected. Values cannot be absolute zero in raw water."
            })

        # Extreme pH usually correlates with very high conductivity due to ion presence. 
        # If pH is 1 (battery acid) but conductivity is very low, the pH sensor is likely uncalibrated/broken.
        if (ph < 2 or ph > 12) and cond < 100:
            raise serializers.ValidationError(
                "Inconsistent readings: Extreme pH detected without expected high conductivity. Check pH calibration."
            )

        return data