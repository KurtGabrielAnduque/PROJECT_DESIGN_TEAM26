import { useState } from "react";
import Navbar from '../Components/Navbar'
import axios from "axios";

import { recommendationData, finalDataForPredictionPage } from './mockdata_recommendation'

// import components here
import DosageHeader from "./Components/DosageHeader";
import ParameterTable from "./Components/ParameterTable";
import ModelPredictionResult from "./Components/ModelPredictionResult";

// Set the parameters
// { label: "Sample No.", key: "sampleRefNumber" },
const PARAMETERS = [
  { label: "Turbidity", key: "turbidity", metric: "NTU" },
  { label: "pH", key: "ph", metric: "" },
  { label: "Conductivity", key: "conductivity", metric: "µS/cm" },
  { label: "Temperature", key: "temperature", metric: "°C" },
  { label: "Alkalinity", key: "alkalinity", metric: "mg/L" },
];

// These are the following states of the model
const modelSteps = [
  { key: "waiting", label: "Waiting", desc: "Awaiting water sample data" },
  { key: "predicting", label: "Predicting", desc: "Running ML inference" },
  { key: "predict_complete", label: "Prediction Complete", desc: "Dosage ready for review" },
];


// GET LATEST RAW WATER QUALITY ANALYSIS
const API_BASE_URL = 'http://127.0.0.1:8000/api/prediction';

const delay = (ms) =>
  new Promise((resolve) => setTimeout(resolve, ms));

async function fetchLatestPrediction(analysisRequestId = null) {
  try {
    const url = analysisRequestId
      ? `${API_BASE_URL}/latest/?analysis_request_id=${encodeURIComponent(analysisRequestId)}`
      : `${API_BASE_URL}/latest/`;

    const response = await axios.get(url);

    return response.data;

  } catch (error) {
    if (error.response?.status === 404) {
      return null;
    }

    throw error;
  }
}
// --------------------------------------


// main function
function DosageRecommendationPage() {
  const [state, setState] = useState("idle"); // idle | analyzing | complete
  const [modelState, setModelState] = useState('waiting'); // waiting | predicting | predict_complete
  const [sample, setSample] = useState(false);
  const [data, setData] = useState(null);

  const [warning, setWarning] = useState(false);

  // Start the analysis
  const handleStartAnalysis = async () => {
    if (!sample) {
      setWarning(true);
      return;
    }

    try {

      // Update the UI.
      setState('analyzing');
      setModelState('predicting');
      setWarning(false);
      setData(null);

      // Ask Django to start the ESP32 analysis.
      const startResponse = await axios.post(`${API_BASE_URL}/start/`, {});

      console.log('Analysis command accepted:', startResponse.data);

      const analysisRequestId =
        startResponse.data.analysis_request_id;

      if (!analysisRequestId) {
        throw new Error(
          'The backend did not return an analysis request ID.'
        );
      }

      console.log(
        'Analysis command accepted:',
        startResponse.data
      );

      // Wait for the ESP32 measurements and ML result.
      const timeoutMs = 180000; // maximum of 3 minutes for waiting time to get the latest analysis
      const pollingIntervalMs = 2000;
      const startTime = Date.now();

      let completedPrediction = null;

      while (Date.now() - startTime < timeoutMs) {

        await delay(pollingIntervalMs);

        // Only retrieve the result belonging to this command.
        const latestPrediction = await fetchLatestPrediction(
          analysisRequestId
        );

        if (
          latestPrediction &&
          latestPrediction.analysis_request_id === analysisRequestId &&
          latestPrediction.recommendation
        ) {
          completedPrediction = latestPrediction;
          break;
        }
      }

      if (!completedPrediction) {
        throw new Error(
          'Timed out waiting for the result of this analysis request.'
        );
      }
      // Convert the API response to the frontend's existing data shape.
      const predictionData = {
        id: completedPrediction.id,

        sampleRefNumber:
          completedPrediction.sample_ref_number,

        waterQuality: {
          turbidity: Number(
            completedPrediction.raw_water_quality.turbidity
          ),
          ph: Number(
            completedPrediction.raw_water_quality.pH
          ),
          conductivity: Number(
            completedPrediction.raw_water_quality.conductivity
          ),
          temperature: Number(
            completedPrediction.raw_water_quality.temperature
          ),
          alkalinity: Number(
            completedPrediction.raw_water_quality.alkalinity
          )
        },

        recommendation: {
          id: completedPrediction.recommendation.id,

          predictedDosage: Number(
            completedPrediction.recommendation.predicted_dosage
          ),

          volumeToDispense: Number(
            completedPrediction.recommendation.volume_to_dispense
          ),

          concentrationConfiguration: {
            id:
              completedPrediction.recommendation
                .concentration_configuration.id,

            sampleVolume: Number(
              completedPrediction.recommendation
                .concentration_configuration.sample_volume
            ),

            stockConcentration: Number(
              completedPrediction.recommendation
                .concentration_configuration.stock_concentration
            )
          }
        },

        status: 'prediction_complete',

        analyzedAt: completedPrediction.analyzed_at
      };

      console.log(predictionData);
      // Display the real result.
      setData(predictionData);
      setState('complete');
      setModelState('predict_complete');

    } catch (error) {
      console.error(
        'Failed to complete raw-water analysis:',
        error
      );

      setState('idle');
      setModelState('idle');
      setWarning(true);
    }
  };


  // Rest the states to Perform new Analysis
  const reset = () => {
    setState('idle');
    setSample(false);
    setData(null);
    setModelState('waiting');
  }

  return (
    <div className="bg-zinc-50 flex flex-row min-h-screen font-sans">
      {/*Navigation bar*/}
      <Navbar />

      {/*main content bar*/}
      <div className="flex-1 flex flex-col min-w-0 bg-zinc-50 min-h-screen font-sans">

        {/*Header part*/}
        <DosageHeader />

        {/*BODY PART*/}
        <div className="flex-1 p-6 flex gap-6">

          {/*LEFT PART NG PAGE*/}
          <ParameterTable
            data={data} // holds the data to show analyzed water quality parameters
            state={state} // hold the state of process 
            PARAMETERS={PARAMETERS} // hold parameters label, key or name, and metric
            warning={warning} // warning state
            setSample={setSample} // state changer ng chamber if naglagay ba si operator ng 1L raw water sample
            sample={sample} // state ng chamber if meron na bang sample
            handleStartAnalysis={handleStartAnalysis} // start the process of the raw water analysis
            reset={reset} // reset all values to start another analysis and prediction
          />


          {/*RIGHT PAGE*/}
          <ModelPredictionResult
            data={data} // holds the data to show model prediction dosage
            modelSteps={modelSteps} // holds the descriptions of every steps of the model
            modelState={modelState} // track the state of model in the backend
          />

        </div>
      </div>
    </div>


  )
}

export default DosageRecommendationPage