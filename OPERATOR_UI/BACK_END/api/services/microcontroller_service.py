import requests

# service for analysis page 
# this is where the backend signals the esp32 to perform the analysis process
def start_raw_water_analysis(microcontroller_base_url, analysis_configuration, analysis_request_id, lab_settings_configuration_id):

    # prepare the http url that will be use to perform analysis in microcontroller
    url = f'{microcontroller_base_url}/start_analysis/'



    # payload that will be used by the micro controller to perform that analysis
    # this will be the stirring speed and duration of the mixing
    payload = {
        'command': 'start_raw_water_analysis',
        # instead of increasing the timeout value
        # I think its better if we do a id system wherein if the microprocessor remember its identifier
        # then sends this identifier back along with the result
        'analysis_request_id': str(analysis_request_id), 

        # Parent settings bundle ID so we have a save lab settings once esp32 
        # intends to send the finish analysis
        'lab_settings_configuration_id': (lab_settings_configuration_id),

        
        'analysis_configuration': {
            'id': analysis_configuration.id,
            'stirring_speed': analysis_configuration.stirring_speed,
            'stirring_duration': analysis_configuration.stirring_duration,
        }
    }

    # wait for response from the microporcessor
    response = requests.post(url, json=payload, timeout=5)

    response.raise_for_status()

    return response.json()
# ====================================================



# service that backend send to the esp32 to perform the coagulation process
# using the lab settings used by the analysis id
def start_treatment(microcontroller_base_url, validation_session, validation_trial, raw_water_sample, lab_settings_configuration, coagulation_configuration):


    """
    Request the ESP32 to start one validation treatment trial.
    The ESP32 handler must acknowledge the command promptly;
    it should not wait for the full treatment process to finish.
    """
    url = (f"{microcontroller_base_url.rstrip('/')}""/start_treatment/")

    payload = {
        "command": "start_treatment",
        "validation_session_id": validation_session.id,
        "validation_trial_id": validation_trial.id,
        "trial_no": validation_trial.trial_no,
        "raw_water_sample_id": raw_water_sample.id,
        "lab_settings_configuration_id": (
            lab_settings_configuration.id
        ),

        # this should be the calculated volume to be dispense by the esp32
        "applied_dosage": str(validation_trial.applied_dosage),
        "applied_volume": str(validation_trial.applied_volume),

        # coagulation configuration sequence to follow by the esp32
        "coagulation_configuration": {
            "id": coagulation_configuration.id,
            "flash_mixing_speed": (
                coagulation_configuration.flash_mixing_speed
            ),
            "flash_mixing_duration": (
                coagulation_configuration.flash_mixing_duration
            ),
            "coagulant_dispense_timing": (
                coagulation_configuration.coagulant_dispense_timing
            ),
            "slow_mixing_configurations": [
                {
                    "sequence_no": mixing.sequence_no,
                    "rpm": mixing.rpm,
                    "duration": mixing.duration,
                }
                for mixing in (coagulation_configuration.slow_mixing_configurations.all().order_by("sequence_no"))
            ],
            "settling_duration": (
                coagulation_configuration.settling_duration
            ),
        },
    }

    # get the response from the esp32
    response = requests.post(url, json=payload, timeout=5)
    response.raise_for_status()

    # The ESP32 should acknowledge the command with a JSON response.
    return response.json()



def start_treated_water_analysis(microcontroller_base_url, validation_session, validation_trial, raw_water_sample, lab_settings_configuration, analysis_configuration):
    """
    Request the ESP32 to measure the treated-water sample.
    The ESP32 should acknowledge promptly and continue the
    measurement process asynchronously.
    """
    url = (
        f"{microcontroller_base_url.rstrip('/')}""/start_treated_water_analysis/"
    )

    payload = {
        "command": "start_treated_water_analysis",
        "validation_session_id": validation_session.id,
        "validation_trial_id": validation_trial.id,
        "trial_no": validation_trial.trial_no,
        "raw_water_sample_id": raw_water_sample.id,
        "lab_settings_configuration_id": (
            lab_settings_configuration.id
        ),
        "analysis_configuration": {
            "id": analysis_configuration.id,
            "stirring_speed": analysis_configuration.stirring_speed,
            "stirring_duration": analysis_configuration.stirring_duration,
        },
    }

    response = requests.post(url, json=payload, timeout=5)
    response.raise_for_status()

    return response.json()
