import { useState } from "react";
import Navbar from '../Components/Navbar'

import { recommendationData } from './mockdata_recommendation'

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


// main function
function DosageRecommendationPage() {
  const [state, setState] = useState("idle"); // idle | analyzing | complete
  const [modelState, setModelState] = useState('waiting'); // waiting | predicting | predict_complete
  const [sample, setSample] = useState(false);
  const [data, setData] = useState(null);

  const [warning, setWarning] = useState(false);

  // Start the analysis
  const handleStartAnalysis = () => {
    if (!sample) {
      setWarning(true);
      return;
    }

    // Set state to analyzing to trigger the loading screen
    setState('analyzing');
    setModelState('predicting');
    setWarning(false);
    setData(null); // ensure table is empty while loading

    // Simulate waiting for the backend using setTimeout (e.g., 3 seconds delay)
    setTimeout(() => {
      // This block runs after 3 seconds
      // TODO: Replace this with actual Axios request later
      setData(recommendationData[0]);
      setState('complete');
      setModelState('predict_complete');
    }, 3000);
  }

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
        <DosageHeader
          state={state} // the state will be use to track changes in the process
        />

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