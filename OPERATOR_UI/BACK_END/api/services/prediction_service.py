import os
import joblib
import pandas as pd
from django.conf import settings

# use the base pathing of the django to avoid crash 
# when we deploy using nginx to be accessible in cellphone
MODEL_PATH = os.path.join(
    settings.BASE_DIR,
    'api',
    'ml_models',
    'sample_model_backend.pkl'
)


# Features expected by the current ML model.
# Update this list when the real model is trained.
MODEL_FEATURES = [
    'Raw Alkalinity (mg/L as CaCO3)',
    'Raw Turbidity (NTU)',
    'Raw pH',
    'Raw Temperature (C)',
    # 'Raw Conductivity (µS/cm)',
]


# Global variable to store the model in RAM
_ML_MODEL = None

# load the model using the joblib
# but this may change if we use to save the model as pickle file
def load_model():
    """Load the ML model only once and keep it in memory."""
    global _ML_MODEL

    if _ML_MODEL is None:
        _ML_MODEL = joblib.load(MODEL_PATH)

    return _ML_MODEL

# model predicition function here
def predict_coagulant_dose(water_quality):
    """
    Predict the required coagulant dosage using
    the validated raw-water quality parameters.
    """

    model = load_model()

    # please fix the new parameters here after completing the final model
    input_data = pd.DataFrame([{
        'Raw Alkalinity (mg/L as CaCO3)': float(water_quality['alkalinity']),
        'Raw Turbidity (NTU)': float(water_quality['turbidity']),
        'Raw pH': float(water_quality['pH']),
        'Raw Temperature (C)': float(water_quality['temperature']),
    }])

    prediction = model.predict(input_data)

    return float(prediction[0])