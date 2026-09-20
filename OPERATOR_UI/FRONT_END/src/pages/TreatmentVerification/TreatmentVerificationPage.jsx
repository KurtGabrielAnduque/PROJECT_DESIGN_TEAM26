import React, { use, useState } from 'react'
import Navbar from '../Components/Navbar'

// import mock data here
import { recommendationData } from '../DosageRecommendation/mockdata_recommendation';
import { validationResultData, dispenseResult } from './mockdata';


// import components here
import CurrentParameters from './Components/CurrentParameters';


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
        <div className="flex flex-col bg-white border border-zinc-200 shadow-sm  p-6 gap-6">

          {/* Header */}
          <div>
            <h1 className="text-2xl font-semibold text-zinc-800">
              Flocculation & Mixing Settings
            </h1>
            <p className="text-m text-zinc-500 mt-1">
              Configure the mixing speeds and durations for the jar test validation process.
            </p>
            <p className="text-m text-zinc-500 mt-1">
              The system follows a ASTM D2035-19
              <span className='font-bold p-1'>
                (Standard Practice for Coagulation-Floccuation Jar Test of Water)
              </span>
            </p>
          </div>

          {/* Settings Grid (3 columns for the 3 sequential phases) */}
          <div className="grid grid-cols-3 gap-5">

            {/* PHASE 1: Flash Mixing */}
            <div className="flex flex-col bg-zinc-50/50 border border-zinc-100 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 rounded bg-amber-100 text-amber-700 flex items-center justify-center">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h2 className="text-sm font-semibold text-zinc-800 uppercase tracking-wide">Flash Mixing</h2>
              </div>

              <div className="space-y-4">
                {/* RPM Input */}
                <div>
                  <label className="block text-xs font-medium text-zinc-600 mb-1.5">Agitator Speed</label>
                  <div className="relative">
                    {/*Lagay values dito*/}
                    <input
                      type="number"
                      value={flashMixing}
                      onChange={(e) => setFlashMixing(e.target.value)}
                      className="w-full bg-white border border-zinc-200 rounded-lg pl-3 pr-12 py-2 text-sm text-zinc-900 font-medium focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-shadow"
                    />
                    <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-xs font-semibold text-zinc-400 pointer-events-none">
                      RPM
                    </span>
                  </div>
                </div>
                {/* Duration Input */}
                <div>
                  <label className="block text-xs font-medium text-zinc-600 mb-1.5">Mixing Duration</label>
                  <div className="relative">
                    {/*Lagay values dito*/}
                    <input
                      type="number"
                      value={flashDuration}
                      onChange={(e) => setFlashDuration(e.target.value)}
                      className="w-full bg-white border border-zinc-200 rounded-lg pl-3 pr-12 py-2 text-sm text-zinc-900 font-medium focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-shadow"
                    />
                    <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-xs font-semibold text-zinc-400 pointer-events-none">
                      min
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* PHASE 2: Slow Mixing */}
            <div className="flex flex-col bg-zinc-50/50 border border-zinc-100 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 rounded bg-blue-100 text-blue-700 flex items-center justify-center">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </div>
                <h2 className="text-sm font-semibold text-zinc-800 uppercase tracking-wide">Slow Mixing</h2>
              </div>

              <div className="space-y-4">
                {/* RPM Input */}
                <div>
                  <label className="block text-xs font-medium text-zinc-600 mb-1.5">Agitator Speed</label>
                  <div className="relative">
                    <input
                      type="number"
                      value={slowMixing}
                      onChange={(e) => setSlowMixing(e.target.value)}
                      className="w-full bg-white border border-zinc-200 rounded-lg pl-3 pr-12 py-2 text-sm text-zinc-900 font-medium focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-shadow"
                    />
                    <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-xs font-semibold text-zinc-400 pointer-events-none">
                      RPM
                    </span>
                  </div>
                </div>
                {/* Duration Input */}
                <div>
                  <label className="block text-xs font-medium text-zinc-600 mb-1.5">Mixing Duration</label>
                  <div className="relative">
                    <input
                      type="number"
                      value={slowDuration}
                      onChange={(e) => setSlowDuration(e.target.value)}
                      className="w-full bg-white border border-zinc-200 rounded-lg pl-3 pr-12 py-2 text-sm text-zinc-900 font-medium focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-shadow"
                    />
                    <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-xs font-semibold text-zinc-400 pointer-events-none">
                      min
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* PHASE 3: Settling */}
            <div className="flex flex-col bg-zinc-50/50 border border-zinc-100 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 rounded bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <h2 className="text-sm font-semibold text-zinc-800 uppercase tracking-wide">Settling</h2>
              </div>

              <div className="space-y-4">
                {/* Duration Input */}
                <div>
                  <label className="block text-xs font-medium text-zinc-600 mb-1.5">Settling Duration</label>
                  <div className="relative">
                    <input
                      type="number"
                      value={settlingDuration}
                      onChange={(e) => setSettlingDuration(e.target.value)}
                      className="w-full bg-white border border-zinc-200 rounded-lg pl-3 pr-12 py-2 text-sm text-zinc-900 font-medium focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-shadow"
                    />
                    <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-xs font-semibold text-zinc-400 pointer-events-none">
                      min
                    </span>
                  </div>
                </div>

                {/* Empty space filler so the column matches the height of the others */}
                <div className="h-14"></div>
              </div>
            </div>

          </div>


          {/* Footer & Action Button */}
          {/*Show the validation only when the operator is done dispensing*/}
          {dispenseStatus === "dispense_complete" && (
            <div className="grid grid-cols-7 gap-3 mt-4 pt-4 border-t border-zinc-100">

              {/* COLUMN 1: Toggle Switch (Takes up 5/7 of the width) */}
              <div className="col-span-5">
                {/* Added 'h-full' so it stretches to match the button if the text wraps */}
                <label className="flex items-center h-full gap-3 cursor-pointer select-none bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3">
                  <div
                    onClick={() => setRawWaterSample((prev) => !prev)}
                    className={`relative shrink-0 w-10 h-5 rounded-full transition-colors ${rawWaterSample ? "bg-blue-600" : "bg-zinc-300"
                      }`}
                  >
                    <div
                      className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${rawWaterSample ? "translate-x-5" : ""
                        }`}
                    />
                  </div>

                  <span className="text-sm text-zinc-600">
                    {rawWaterSample ? (
                      <span className="text-blue-700 font-medium">
                        Sample placed in validation chamber
                      </span>
                    ) : (
                      <span className="text-black font-medium">
                        Please ensure that 1L sample jar is properly secured before initiating the sequence.
                      </span>
                    )}
                  </span>
                </label>
              </div>

              {/* COLUMN 2: Start Button (Takes up 2/7 of the width) */}
              <div className="col-span-2">
                {/* Added 'w-full h-full justify-center rounded-xl' for perfect alignment */}
                <button
                  onClick={handleValidation}
                  className="w-full h-full justify-center px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm rounded-xl shadow-sm transition-colors flex items-center gap-2">
                  Start Validation
                </button>
              </div>

            </div>
          )}

          {/*Notification here*/}
          {/*To fix: masyadong wide!!!*/}
          <div className="px-6 pb-6 pt-2 flex flex-col gap-3">
            {warning && (
              <div className="mt-4 flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
                <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center shrink-0 mt-0.5">
                  <svg className="w-4 h-4 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-semibold text-amber-800">Sample Not Detected</p>
                  <p className="text-xs text-amber-700 mt-0.5">Please place the 1L sample to the validation chamber before starting.</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/*To fix*/}
        {/* === THIRD LAYER (Validation Result) === */}
        <div className="flex-1 flex flex-col bg-white border border-zinc-200 shadow-sm rounded-2xl p-6 relative overflow-hidden">

          <h2 className="text-xl font-semibold text-zinc-800 mb-6">Validation Result</h2>

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
              {/* You can build your post-treatment parameter grid here */}
              <div className="grid grid-cols-4 gap-4">
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