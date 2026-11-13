import os
import joblib
import pandas as pd
from django.conf import settings
import sys
# import from training
import pandas as pd
import numpy as np
from sklearn.base import BaseEstimator, RegressorMixin, clone
from sklearn.model_selection import cross_val_predict, train_test_split
from xgboost import XGBRegressor
from sklearn.ensemble import RandomForestRegressor
from skopt import BayesSearchCV
from skopt.space import Real, Integer

# use the base pathing of the django to avoid crash 
# when we deploy using nginx to be accessible in cellphone
MODEL_PATH = os.path.join(
    settings.BASE_DIR,
    'api',
    'ml_models',
    'best_design.pkl'
)

SCALER_PATH = os.path.join(
    settings.BASE_DIR, 
    'api', 
    'ml_models', 
    'optidose_scaler.pkl'
)


# winning function:
# 1. Create the Custom Residual Ensemble Class
class ResidualEnhancedEnsemble(BaseEstimator, RegressorMixin):
    def __init__(self, primary_model, compensator_model):
        self.primary_model = primary_model
        self.compensator_model = compensator_model

    def fit(self, X, y):
        # Clone models to maintain clean base estimators
        self.primary_model_ = clone(self.primary_model)
        self.compensator_model_ = clone(self.compensator_model)

        # ENGINEERING PRINCIPLE: Out-of-fold predictions to prevent data leakage
        # We generate baseline predictions using 5-fold cross-validation
        y1_hat_oof = cross_val_predict(self.primary_model_, X, y, cv=5)

        # Calculate the actual training residuals (r = Actual - Predicted)
        residuals = y - y1_hat_oof

        # Train both models on the full dataset for final deployment
        self.primary_model_.fit(X, y)
        self.compensator_model_.fit(X, residuals)

        return self

    def predict(self, X):
        # ENGINEERING PRINCIPLE: Integration Phase (Summation Node)
        # Final y-hat = y1-hat + r-hat
        y1_hat = self.primary_model_.predict(X)
        r_hat = self.compensator_model_.predict(X)

        return y1_hat + r_hat

# register the custom class under __main__ for compatibility.
sys.modules["__main__"].ResidualEnhancedEnsemble = (
    ResidualEnhancedEnsemble
)


# Features expected by the current ML model.
# Update this list when the real model is trained.
MODEL_FEATURES = [
                'Conductivity (uS/cm)', 
                # 'Alkalinity (mg/L)', 
                'pH Raw', 
                'Temperature (C) Raw', 
                'Raw Turbidity'
                ]


# Global variable to store the model in RAM
_ML_MODEL = None
_ML_SCALER = None

def load_ml_assets():
    """Load the ML model and scaler only once and keep them in memory."""
    global _ML_MODEL, _ML_SCALER

    if _ML_MODEL is None or _ML_SCALER is None:
        _ML_MODEL = joblib.load(MODEL_PATH)
        _ML_SCALER = joblib.load(SCALER_PATH)

    return _ML_MODEL, _ML_SCALER

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
    the validated and scaled raw-water quality parameters.
    """
    model, scaler = load_ml_assets()

    # Construct the dataframe. 
    # Passing the MODEL_FEATURES list to the 'columns' argument enforces 
    # the exact structural order the scaler requires.
    input_data = pd.DataFrame([{
        'Conductivity (uS/cm)': float(water_quality['conductivity']),
        # 'Alkalinity (mg/L)': float(water_quality['alkalinity']),
        'pH Raw': float(water_quality['pH']),
        'Temperature (C) Raw': float(water_quality['temperature']),
        'Raw Turbidity': float(water_quality['turbidity']),
    }], columns=MODEL_FEATURES)

    # Apply the standard scaling to the live ESP32 data
    scaled_data = scaler.transform(input_data)

    # Predict using the mathematically scaled array
    prediction = model.predict(scaled_data)

    # Ensure the prediction does not drop below 0 mg/L in edge cases
    final_dose = max(0.0, float(prediction[0]))
    
    return final_dose