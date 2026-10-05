import { useState, useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import axios from 'axios'

import './App.css'

//Import DashBoardPage (main)
import DashBoardPage from './pages/DashBoard/DashBoardPage'

//Import Dosage Recommendation Page (main)
import DosageRecommendationPage from './pages/DosageRecommendation/DosageRecommendationPage'

//Import History Page (main)
import HistoryPage from './pages/TreatmentHistory/HistoryPage'


// Import Treatment Verification page (main)
import TreatmentVerificationPage from './pages/TreatmentVerification/TreatmentVerificationPage'

// Import Treatment Assessment page (main)
import TreatmentAssessmentPage from './pages/CoagulationProcess/TreatmentAssessmentPage'

import LabSettingsConfigPage from './pages/LabSettingsConfig/LabSettingsConfigPage'

function App() {
  // State to hold the current active settings from backend
  const [activeSettings, setActiveSettings] = useState(null); // hold the data sent from the backend
  const [isLoading, setIsLoading] = useState(true);
  
  const loadLabSettings = async () => {
    try {
      setIsLoading(true); // Ensure loading is true when we start fetching
      let labSettings = await axios.get('http://127.0.0.1:8000/api/lab-settings/current/');
      console.log(labSettings.data);
      setActiveSettings(labSettings.data);
    } catch (error) {
      console.log(`Error Fetching Data: ${error}`);
      setActiveSettings(null); // Ensure it resets on error so the "Empty State" triggers
    } finally {
      // 2. Use 'finally' so loading stops whether the request succeeds or fails
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadLabSettings();
  }, [])


  return (
    <>

      <Routes>
        {/*DashBoard route page note: place attributes later when we start creating the parameters*/}
        <Route index element={
          <DashBoardPage

          />
        }>

        </Route>

        {/*DosageRecommendation route page note: place attributes later when we start creating the parameters*/}
        <Route path='/DosageRecommendation' element={
          <DosageRecommendationPage

          />
        }>

        </Route>


        {/*History route page note: place attributes later when we start creating the parameters*/}
        <Route path='/History' element={
          <HistoryPage

          />
        }>

        </Route>

        {/*Treatment Verification route page note: place attributes later when we start creating the parameters*/}
        <Route path='/TreatmentVerification' element={
          <TreatmentVerificationPage

          />
        }>

        </Route>

        {/*Treatment Verification route page note: place attributes later when we start creating the parameters*/}
        <Route path='/TreatmentAssessment' element={
          <TreatmentAssessmentPage
          />
        }>

        </Route>


        <Route path='/LabSettings' element={
          <LabSettingsConfigPage
            activeSettings={activeSettings}
            setActiveSettings={setActiveSettings}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
            loadLabSettings={loadLabSettings}
          />
        }>


        </Route>

        {/* catcher if the user type a url that doesnt even exist*/}
        <Route path='*' element={<Navigate to='/' replace />} />
      </Routes>
    </>
  )
}

export default App
