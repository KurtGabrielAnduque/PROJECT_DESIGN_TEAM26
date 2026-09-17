import React, { useState, useEffect } from "react";
import Navbar from '../Components/Navbar'

import { recommendationData } from './mockdata_recommendation'

// Set the parameters
// { label: "Sample No.", key: "sampleRefNumber" },
const PARAMETERS = [
  { label: "Turbidity", key: "turbidity" },
  { label: "pH", key: "ph" },
  { label: "Conductivity", key: "conductivity" },
  { label: "Temperature", key: "temperature" },
  { label: "Alkalinity", key: "alkalinity" },
];



function DosageRecommendationPage() {
  const [state, setState] = useState("idle"); // idle | no_sample | analyzing | complete
  const [data, setData] = useState(recommendationData[0] ?? null);

  const stepIndex = state === "complete" ? 1 : 0;

  return (
    <div className="bg-zinc-50 flex flex-row min-h-screen font-sans">
      {/*Navigation bar*/}
      <Navbar />

      {/*main content bar*/}
      <div className="flex-1 flex flex-col min-w-0 bg-zinc-50 min-h-screen font-sans">

        {/*Header part*/}
        <div className="bg-white border-b border-zinc-200 px-8 py-5">
          <h1 className="text-2xl font-bold text-zinc-800 mb-1">
            Water Analysis &amp; Dosage Recommendation
          </h1>
          <p className="text-sm text-zinc-500 mb-4">
            Analyze raw water quality and review the recommended coagulant dose.
          </p>
          {/* Progress of the page */}
          <div className="flex items-center gap-0">
            {["Water Analysis", "Recommendation", "Operator Review"].map((step, i) => (
              <React.Fragment key={step}>
                <div className="flex items-center gap-2">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold border-2 transition-colors bg-blue-600 border-blue-600 text-white`}
                  >
                    {i < stepIndex ? (
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      i + 1
                    )}
                  </div>
                  <span className={`text-sm font-medium text-blue-600`}>
                    {step}
                  </span>
                </div>
                {i < 2 && (
                  <div className={`h-px w-12 mx-2 ${i < stepIndex ? "bg-blue-600" : "bg-zinc-200"}`} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>


        {/*BODY PART*/}
        <div className="flex-1 p-6 flex gap-6">

          {/*LEFT PART NG PAGE*/}
          <div className="flex-1 bg-white rounded-2xl border border-zinc-200 shadow-sm flex flex-col overflow-hidden">
            <div className="px-6 py-4 border-b border-zinc-100">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <div>
                    <h2 className="text-2xl font-semibold text-zinc-800">
                      Water Quality Analyzer
                    </h2>

                    <p className="mt-1 text-l text-zinc-500">
                      1 L raw-water sample is required for this analysis
                    </p>
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                    <span className="text-2xl font-semibold uppercase tracking-wide text-zinc-800">
                      Sample ID:
                    </span>

                    {data ? (
                      <span className="text-2xl font-semibold text-zinc-400">
                        {data.sampleRefNumber}
                      </span>
                    ) : (
                      <span className="text-sm text-zinc-400">
                        Waiting for analysis
                      </span>
                    )}
                  </div>
                </div>

                {/*Bubble status for notif if the process is complete*/}
                {state === "complete" && (
                  <span className="inline-flex items-center gap-1.5 bg-green-50 text-green-700 text-xs font-medium px-3 py-1 rounded-full border border-green-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                    Analysis Complete
                  </span>
                )}

                {/*Bubble status for notif if the process is analyzing*/}
                {state === "analyzing" && (
                  <span className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 text-xs font-medium px-3 py-1 rounded-full border border-blue-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                    Analyzing...
                  </span>
                )}
              </div>

              {/* Parameters Table */}
              <div className="flex-1 px-6 py-4">
                <table className="w-full">
                  <thead >
                    <tr className="border-b border-zinc-100">
                      <th className="text-left text-m font-semibold text-zinc-900 uppercase tracking-wider pb-3 w-1/2">Parameter</th>
                      <th className="text-left text-m font-semibold text-zinc-900 uppercase tracking-wider pb-3">Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    {PARAMETERS.map(({ label, key }, index) => (
                      // table row
                      <tr key={key} className={index % 2 === 0 ? "bg-zinc-50/50" : ""}>
                        {/*first Column for labels*/}
                        <td className="py-3 px-2 text-sm font-medium text-zinc-600 rounded-l">{label}</td>

                        {/*second column for the data*/}
                        <td className="py-3 px-2 text-sm rounded-r">
                          {/*if may laman yung data*/}

                          {data ? (
                            <span className={data[key] === "—" ? "text-zinc-300" : "text-zinc-800 font-semibold"}>
                              {data.waterQuality[key]}
                            </span>
                          ) : (
                            //if walang laman yung data usestate
                            <span className={data[key] === "—" ? "text-zinc-300" : "text-zinc-800 font-semibold"}>
                              --
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>



            </div>
          </div>


          {/*RIGHT PAGE*/}
          <div className="w-80 flex flex-col gap-4">
            {/* Dosage Card */}
            <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
              {/*Top info card*/}
              <div className="bg-gradient-to-br from-blue-600 to-blue-700 px-6 py-5">
                <p className="text-blue-100 text-xs font-medium uppercase tracking-widest mb-1">Recommended</p>
                <h2 className="text-white text-lg font-bold">Alum Dosage</h2>
                <p className="text-blue-200 text-xs mt-0.5">Predicted by ML Model</p>
              </div>

              {/*Predicted dosage value card*/}
              <div className="px-6 py-6 flex flex-col items-center">
                {data ? (
                  <>
                    <div className="text-5xl font-black text-zinc-800 tracking-tight">{data.recommendation.predictedDosage}</div>
                    <div className="text-sm font-semibold text-zinc-400 mt-1">mg/L</div>
                    <div className="mt-4 text-xs text-zinc-500 text-center leading-relaxed">
                      Recommended alum coagulant dose for the analyzed 1L water sample.
                    </div>
                  </>
                ) : (
                  <>
                    <div className="text-5xl font-black text-zinc-200 tracking-tight">——</div>
                    <div className="text-sm font-semibold text-zinc-300 mt-1">mg/L</div>
                    <div className="mt-4 text-xs text-zinc-400 text-center leading-relaxed">
                      Run water analysis to get the predicted dosage.
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Model Status Card */}
            <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm px-6 py-5">
              status of the model to be continue
            </div>

            {/* Info card */}
            <div className="bg-zinc-800 rounded-2xl px-5 py-4 text-white">
              <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400 mb-2">About this model</p>
              <p className="text-sm text-zinc-300 leading-relaxed">
                The ML model predicts alum coagulant dosage based on turbidity, pH, conductivity, temperature, and alkalinity readings.
              </p>
            </div>
          </div>


        </div>
      </div>



    </div>


  )
}

export default DosageRecommendationPage