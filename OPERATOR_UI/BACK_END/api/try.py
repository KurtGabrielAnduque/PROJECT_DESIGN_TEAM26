from models import (
    ValidationTrial,
    ResultingWaterQuality,
)

trial = ValidationTrial.objects.get(pk=1)
session = trial.validation_session

print("Session ID:", session.id)
print("Session status:", session.overall_status)
print("Trial ID:", trial.id)
print("Trial number:", trial.trial_no)
print("Trial status:", trial.status)
print("Trials in session:", session.validation_trials.count())
print(
    "Result exists:",
    ResultingWaterQuality.objects.filter(
        validation_trial=trial
    ).exists()
)