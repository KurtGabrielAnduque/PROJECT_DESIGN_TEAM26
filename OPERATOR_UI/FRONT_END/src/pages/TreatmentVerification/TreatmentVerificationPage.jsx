import React, { use, useState } from 'react'
import Navbar from '../Components/Navbar'

// import mock data here
import { recommendationData } from '../DosageRecommendation/mockdata_recommendation';
import { validationResultData, dispenseResult } from './mockdata';


// import components here
import CurrentParameters from './Components/CurrentParameters';
import FlocSettings from './Components/FlocSettings';


const PARAMETERS = [
  { label: "Turbidity", key: "turbidity", metric: "NTU" },
  { label: "pH", key: "ph", metric: "" },
  { label: "Conductivity", key: "conductivity", metric: "µS/cm" },
  { label: "Temperature", key: "temperature", metric: "°C" },
  { label: "Alkalinity", key: "alkalinity", metric: "mg/L" },
];


function TreatmentVerificationPage() {
  // the data that we get from Dosage prediction page must come here
  const [data, setData] = useState(recommendationData[0] ?? null);
  const [dosage, setDosage] = useState(recommendationData[0].recommendation.predictedDosage);

  //  Flash mixing settings
  const [flashMixing, setFlashMixing] = useState(120);
  const [flashDuration, setFlashDuration] = useState(1);

  // Slow mixing settings
  const [slowMixing, setSlowMixing] = useState(30);
  const [slowDuration, setSlowDuration] = useState(20);

  // settling Duration
  const [settlingDuration, setSettlingDuration] = useState(15);

  // status for dispensing
  const [dispenseStatus, setDispenseStatus] = useState('waiting') // waiting | dispenseing | dispense_complete

  //JUST TO DOUBLE CHECK IF THE RAW WATER IS IN VALIDATION CHAMBER
  const [rawWaterSample, setRawWaterSample] = useState(false);
  // check for the state of validation chamber
  const [validationStatus, setValidationStatus] = useState('idle') // idle | validating | complete
  // check for the result of validation 
  const [validationResult, setValidationResult] = useState(null);
  // warning notification if the operator press validation button without verifying if the jar is placed in validation chamber
  const [warning, setWarning] = useState(false);




  // replace this with axios when we start implementing REST API
  const handleDispensing = () => {
    setDispenseStatus('dispensing');

    setTimeout(() => {
      setDispenseStatus(dispenseResult[0].dispenseStatus ?? null);
    }, 3000)
  }

  const handleValidation = () => {
    if (!rawWaterSample) {
      setWarning(true);
      return;
    }

    setValidationStatus('validating')
    setWarning(false);
    setValidationResult(null);

    setTimeout(() => {
      setValidationResult(validationResultData[0]);
      setValidationStatus('complete')
    }, 5000)

  }

  return (
    <div className="bg-zinc-50 flex flex-row min-h-screen font-sans">
      {/*Navigation Bar here*/}
      <Navbar />

      {/*Main content here*/}
      <div className="flex-1 flex flex-col min-w-0 bg-zinc-50 min-h-screen font-sans">

        {/* 
          Summary Card here so operator can double check the measure parameters
          and the predicted dosage
        */}
        <CurrentParameters
          PARAMETERS={PARAMETERS}
          data={data}
          dosage={dosage}
          dispenseStatus={dispenseStatus}
          setDispenseStatus={setDispenseStatus}
          handleDispensing={handleDispensing}
        />


        {/* === SECOND LAYER (Testing Settings) === */}
        <FlocSettings
          flashMixing={flashMixing}
          setFlashMixing={setFlashMixing}
          flashDuration={flashDuration}
          setFlashDuration={setFlashDuration}
          slowMixing={slowMixing}
          setSlowMixing={setSlowMixing}
          slowDuration={slowDuration}
          setSlowDuration={setSlowDuration}
          settlingDuration={settlingDuration}
          setSettlingDuration={setSettlingDuration}
          rawWaterSample={rawWaterSample}
          setRawWaterSample={setRawWaterSample}
          validationStatus={validationStatus}
          handleValidation={handleValidation}
          dispenseStatus={dispenseStatus}
          warning={warning}
        />

        {/*To fix*/}
        {/* === THIRD LAYER (Validation Result) === */}
        <div className="flex-1 flex flex-col bg-white border border-zinc-200 shadow-sm  p-6 relative overflow-hidden">

          {/* Header */}
          <div className='mb-5'>
            <h1 className="text-2xl font-semibold text-zinc-800">
              Review the Treatment Result of the Predicted Dosage
            </h1>
            <p className="text-m text-zinc-500 mt-1">
              Review the analyzed water quality parameters and recommended dosage before proceeding to treatment verification.
            </p>
          </div>

          {/* State 1: Idle (Empty State) */}
          {validationStatus === "idle" && (
            <div className="flex-1 flex flex-col items-center justify-center text-center px-4">
              <div className="w-16 h-16 bg-zinc-50 border border-zinc-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-zinc-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                </svg>
              </div>
              <h3 className="text-sm font-semibold text-zinc-700">Awaiting Validation</h3>
              <p className="text-xs text-zinc-500 mt-1 max-w-xs">
                Secure the sample and start the validation sequence above to view the treated water results here.
              </p>
            </div>
          )}

          {/* State 2: Validating (Loading State) */}
          {validationStatus === "validating" && (
            <div className="flex-1 flex flex-col items-center justify-center text-center px-4">
              {/* Cool animated spinner */}
              <div className="relative w-16 h-16 flex items-center justify-center mb-4">
                <div className="absolute inset-0 border-4 border-blue-100 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
                <svg className="w-6 h-6 text-blue-600 absolute" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                </svg>
              </div>
              <h3 className="text-sm font-semibold text-blue-700 animate-pulse">Running Flocculation Sequence...</h3>
              <p className="text-xs text-zinc-500 mt-1 max-w-xs">
                Performing flash mixing, slow mixing, and settling phases. Please wait.
              </p>
            </div>
          )}

          {/* State 3: Complete (Results Data) */}
          {(validationStatus === "complete" && validationResult) && (
            <div className="flex flex-col flex-1 animate-in fade-in duration-500">


              <div>
                <h1>
                  {validationResult.sampleRefNumber}
                </h1>
              </div>



              {/* You can build your post-treatment parameter grid here */}
              <div className="grid grid-cols-5 gap-3">
                <div className="h-24 bg-green-50 border border-green-200 rounded-xl flex items-center justify-center text-green-700 text-sm font-medium">
                  [Result Card]
                </div>
                <div className="h-24 bg-green-50 border border-green-200 rounded-xl flex items-center justify-center text-green-700 text-sm font-medium">
                  [Result Card]
                </div>
                <div className="h-24 bg-green-50 border border-green-200 rounded-xl flex items-center justify-center text-green-700 text-sm font-medium">
                  [Result Card]
                </div>
                <div className="h-24 bg-green-50 border border-green-200 rounded-xl flex items-center justify-center text-green-700 text-sm font-medium">
                  [Result Card]
                </div>
                <div className="h-24 bg-green-50 border border-green-200 rounded-xl flex items-center justify-center text-green-700 text-sm font-medium">
                  [Result Card]
                </div>
              </div>
            </div>
          )}

        </div>

      </div>


    </div>
  )
}

export default TreatmentVerificationPage