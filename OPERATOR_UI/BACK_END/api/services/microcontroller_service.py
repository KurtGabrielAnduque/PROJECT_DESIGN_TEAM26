import requests

def start_raw_water_analysis(microcontroller_base_url, analysis_configuration, analysis_request_id):

    # prepare the http url that will be use to perform analysis in microcontroller
    url = f'{microcontroller_base_url}/start_analysis/'



    # payload that will be used by the micro controller to perform that analysis
    # this will be the stirring speed and duration of the mixing
    payload = {
        'command': 'start_raw_water_analysis',
        # instead of increasing the timeout value
        # I think its better if we do a id system wherein if the microprocessor remember its identifier
        # then sends this identifier back along with the result
        'analysis_request_id': analysis_request_id, 
        'analysis_configuration': {
            'id': analysis_configuration.id,
            'stirring_speed': analysis_configuration.stirring_speed,
            'stirring_duration': analysis_configuration.stirring_duration,
        }
    }

    # wait for response from the microporcessor
    response = requests.post(url, json=payload, timeout=5)

    response.raise_for_status()

    return response