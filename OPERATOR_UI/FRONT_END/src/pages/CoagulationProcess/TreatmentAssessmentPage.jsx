import React from 'react'
import { useState } from 'react';

import Navbar from '../Components/Navbar'

// import the components here
import SummaryHeader from './Components/SummaryHeader';
import CoagulationProcess from './Components/CoagulationProcess';
import TreamentResult from './Components/TreamentResult';
import DosageAdjustmentModal from './Components/DosageAdjustmentModal';

// import the mock data 
import { validationResultData, finalDataForPredictionPage, initialValidationData } from './mockData'
import { data } from 'react-router-dom';

// prepare the parameters for display
const PARAMETERS = [
  { label: "Turbidity", key: "turbidity", metric: "NTU" },
  { label: "pH", key: "ph", metric: "" },
  { label: "Conductivity", key: "conductivity", metric: "µS/cm" },
  { label: "Temperature", key: "temperature", metric: "°C" },
  { label: "Alkalinity", key: "alkalinity", metric: "mg/L" },
];

const subPARAMETERS = [
  { label: "pH", key: "ph", metric: "" },
  { label: "Conductivity", key: "conductivity", metric: "µS/cm" },
  { label: "Temperature", key: "temperature", metric: "°C" },
  { label: "Alkalinity", key: "alkalinity", metric: "mg/L" },
];

function TreatmentAssessmentPage() {
  // get the data from the dosage prediction page
  const [validationData, setValidationData] = useState(initialValidationData);

  // get the first dosage and volume in the validation data since it is cosider to be the first trial
  const [currentDosage, setCurrentDosage] = useState(validationData.recommendation.predictedDosage ?? null);
  const [currentVolume, setCurrentVolume] = useState(validationData.recommendation.volumeToDispense ?? null);
  const [stockConcentration, setStockConcentration] = useState(validationData.recommendation.concentrationConfiguration.stockConcentration ?? null);

  // create a use state case to secure the var is still placed in the validation chamber
  const [rawWaterSample, setRawWaterSample] = useState(false);
  const [warning, setWarning] = useState(false);

  // check for the validation Status to hide the Start Treatment Process button
  const [treatmentProcess, setTreatmentProcess] = useState('idle'); // following statuses treating | coagulation_complete

  // check for the result of the coagulation process using the current dosage
  const [currentTrial, setCurrentTrial] = useState(null);

  // check the status of the analysis
  const [analysisStatus, setAnalysisStatus] = useState('idle');// analyzing || analysis_complete


  // check if the operator secure the sample of treated water for analysis
  const [treatedWaterSample, setTreatedWaterSample] = useState(false);
  const [treatedWaterWarning, setTreatedWaterWarning] = useState(false);

  // create a variable to save the adjusted dosage
  const [isAdjustModalOpen, setIsAdjustModalOpen] = useState(false);
  const [dosageInput, setDosageInput] = useState("");


  // Process functions HERE
  // Adjusting Dosage
  const handleSaveAdjustedDosage = () => {
    const parsedDosage = parseFloat(dosageInput);

    // Basic validation to prevent empty or negative numbers
    if (isNaN(parsedDosage) || parsedDosage <= 0) return;

    // Update the AI target to the Operator's manual target
    setCurrentDosage(parsedDosage);

    // Recalculate the physical volume for the pump
    const calculatedVolume = parsedDosage / stockConcentration;
    setCurrentVolume(calculatedVolume);

    // Reset the UI so they are forced to dispense and test the new mixture
    setTreatmentProcess('idle');
    setAnalysisStatus('idle');
    setCurrentTrial(null);
    
    // Close the modal
    setIsAdjustModalOpen(false);
  };


  const handleValidation = () => {
    if (!rawWaterSample) {
      setWarning(true);
      return;
    }

    setTreatmentProcess('treating')
    setWarning(false);
    setCurrentTrial(null);

    setTimeout(() => {
      setTreatmentProcess('coagulation_complete')
    }, 5000)

  }

  const handleAnalysis = () => {
    if (!treatedWaterSample) {
      setTreatedWaterWarning(true);
      return;
    }

    setAnalysisStatus('analyzing')
    setTreatedWaterWarning(false);
    setCurrentTrial(null);

    setTimeout(() => {
      setCurrentTrial(validationResultData[0]);
      setAnalysisStatus('analysis_complete')
    }, 5000)

  }


  return (
    // Main div container
    <div className="bg-zinc-50 flex flex-row min-h-screen font-sans">

      {/*Include the navigation bar here*/}
      <Navbar />

      {/*main app container*/}
      <div className="flex-1 flex flex-col min-w-0 bg-zinc-50 min-h-screen font-sans">
        {/*Header Part*/}
        <div className="bg-white border-b border-zinc-200 px-8 py-1 pt-3">
          <h1 className="text-2xl font-semibold text-zinc-800">
            Treatment Assessment of the Predicted Dosage
          </h1>
          <p className="text-m text-zinc-500 mt-1">
            This page serves as an assessment or validation tool to test the Effectiveness of the Dosage Predicted by the Machine learning model.
          </p>
        </div>


        <SummaryHeader
          PARAMETERS={PARAMETERS}
          validationData={validationData}
          currentDosage={currentDosage}
          treatmentProcess={treatmentProcess}
          stockConcentration={stockConcentration}
          currentVolume={currentVolume}
          setRawWaterSample={setRawWaterSample}
          rawWaterSample={rawWaterSample}
          handleValidation={handleValidation}
          warning={warning}
        />

        {/*=================================== */}
        {/*======= COAGULATION PROCESS ======= */}
        {/*=================================== */}

        <CoagulationProcess
          treatmentProcess={treatmentProcess}
          setTreatedWaterSample={setTreatedWaterSample}
          treatedWaterSample={treatedWaterSample}
          handleAnalysis={handleAnalysis}
          treatedWaterWarning={treatedWaterWarning}
        />


        {/*========================================== */}
        {/*======= COAGULATION Result Analysis ====== */}
        {/*========================================== */}


        {(analysisStatus === "idle" && treatmentProcess === 'coagulation_complete') && (
          <div className="flex flex-col bg-white border border-zinc-200 p-6 gap-6">
            <div className="flex-1 flex flex-col items-center justify-center text-center px-4">
              <div className="w-16 h-16 bg-zinc-50 border border-zinc-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-zinc-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                </svg>
              </div>
              <h3 className="text-sm font-semibold text-zinc-700">Awaiting Anaylsis of Treatment Result</h3>
              <p className="text-m text-zinc-900 mt-1 max-w-xs">
                Secure the treated water sample and start the treatment assessment to view the treated water results here.
              </p>
            </div>
          </div>
        )}

        {/*State 2: Treating process (this is the part where machine is performing the coagulation process) waiting for the complete response from the backend*/}
        {analysisStatus === "analyzing" && (
          <div className="flex flex-col bg-white border border-zinc-200 p-6 gap-6">
            <div className="flex-1 flex flex-col items-center justify-center text-center px-4">
              {/* Cool animated spinner */}
              <div className="relative w-16 h-16 flex items-center justify-center mb-4">
                <div className="absolute inset-0 border-4 border-blue-100 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
                <svg className="w-6 h-6 text-blue-600 absolute" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                </svg>
              </div>
              <h3 className="text-sm font-semibold text-blue-700 animate-pulse">Running an Analysis on the Treated Water Sample</h3>
              <p className="text-m text-zinc-900 mt-1 max-w-xs">
                Please wait while the machine is maesure the water quality parameters of the treated water
              </p>
            </div>
          </div>

        )}

        {currentTrial && (

          <div className="flex flex-col bg-white border border-zinc-200 p-6 gap-6">

            {/*Header of the raw water sample ID*/}
            <div className='mb-3'>
              <h1 className='text-xl font-semibold text-zinc-1000'>
                Sample No.:
                <span> </span>
                <span className='font-normal'>
                  {currentTrial.sampleRefNumber}
                </span>
              </h1>
            </div>


            {/*RESULT OF THE TREATMENT ASSESSMENT IN GRID FORMAT*/}
            <TreamentResult
              currentTrial={currentTrial}
              validationData={validationData}
              subPARAMETERS={subPARAMETERS}
              setCurrentTrial={setCurrentTrial}
            />

            <div className="flex flex-row items-center justify-end gap-3 pt-4 mt-2 border-t border-zinc-100">

              {/* Primary: Accept validated dose */}
              {/* What does it do? Save the overall results in the backend??*/}
              <button
                className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white border border-emerald-600 rounded-lg shadow-sm hover:bg-emerald-700 transition-colors cursor-pointer"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"
                  />
                </svg>

                <span className="text-sm font-semibold">
                  Successful Treatment Save Results
                </span>
              </button>

              {/*Adjust the Dosage*/}
              <button
                onClick={() => {
                  setDosageInput(currentDosage); // Pre-fill with current dosage
                  setIsAdjustModalOpen(true);
                }}
                className="px-5 py-2.5 bg-white text-zinc-700 border border-zinc-300 font-medium text-sm rounded-lg shadow-sm hover:bg-zinc-50 hover:text-zinc-900 transition-colors flex items-center gap-2 cursor-pointer"
              >
                Adjust the Dosage
              </button>

            </div>

          </div>
        )}

      </div>
      
      <DosageAdjustmentModal
      isAdjustModalOpen = {isAdjustModalOpen}
      setIsAdjustModalOpen = {setIsAdjustModalOpen}
      validationData = {validationData}
      dosageInput = {dosageInput}
      setDosageInput = {setDosageInput}
      stockConcentration = {stockConcentration}
      handleSaveAdjustedDosage = {handleSaveAdjustedDosage}
      />



    </div>
  )
}

export default TreatmentAssessmentPage