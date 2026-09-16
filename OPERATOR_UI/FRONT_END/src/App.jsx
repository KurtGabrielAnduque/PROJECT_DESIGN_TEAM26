import { useState, useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'

import './App.css'

//Import DashBoardPage (main)
import DashBoardPage from './pages/DashBoard/DashBoardPage'

//Import Dosage Recommendation Page (main)
import DosageRecommendationPage from './pages/DosageRecommendation/DosageRecommendationPage'

//Import History Page (main)
import HistoryPage from './pages/TreatmentHistory/HistoryPage'


// Import Treatment Verification page (main)
import TreatmentVerificationPage from './pages/TreatmentVerification/TreatmentVerificationPage'


function App() {

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

        {/* catcher if the user type a url that doesnt even exist*/}
        <Route path='*' element={<Navigate to='/' replace />} />
      </Routes>
    </>
  )
}

export default App
