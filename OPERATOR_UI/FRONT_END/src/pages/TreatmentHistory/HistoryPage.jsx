import React, { useState, useEffect } from "react";
import Navbar from '../Components/Navbar'


const EMPTY_DATA = {
  sampleNo: "—",
  turbidity: "—",
  ph: "—",
  conductivity: "—",
  temperature: "—",
  alkalinity: "—",
};

const ANALYZED_DATA = {
  sampleNo: "S-001",
  turbidity: "48.3 NTU",
  ph: "7.2",
  conductivity: "312 µS/cm",
  temperature: "26.4 °C",
  alkalinity: "85 mg/L",
};

const PARAMETERS = [
  { label: "Sample No.", key: "sampleNo" },
  { label: "Turbidity", key: "turbidity" },
  { label: "pH", key: "ph" },
  { label: "Conductivity", key: "conductivity" },
  { label: "Temperature", key: "temperature" },
  { label: "Alkalinity", key: "alkalinity" },
];

function HistoryPage() {
  const [state, setState] = useState("idle"); // idle | no_sample | analyzing | complete
  const [samplePlaced, setSamplePlaced] = useState(false);
  const [progress, setProgress] = useState(0);
  const [data, setData] = useState(EMPTY_DATA);
  const [dosage, setDosage] = useState(null);
  const [modelStatus, setModelStatus] = useState("waiting"); // waiting | predicting | complete

  useEffect(() => {
    if (state !== "analyzing") return;
    setProgress(0);
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setData(ANALYZED_DATA);
          setModelStatus("predicting");
          setTimeout(() => {
            setDosage("24.5");
            setModelStatus("complete");
            setState("complete");
          }, 1200);
          return 100;
        }
        return prev + 2;
      });
    }, 60);
    return () => clearInterval(interval);
  }, [state]);

  const handleStartAnalysis = () => {
    if (!samplePlaced) {
      setState("no_sample");
      return;
    }
    setState("analyzing");
    setModelStatus("predicting");
  };

  const handleReset = () => {
    setState("idle");
    setSamplePlaced(false);
    setProgress(0);
    setData(EMPTY_DATA);
    setDosage(null);
    setModelStatus("waiting");
  };

  const stepIndex = state === "complete" ? 1 : 0;

  const modelSteps = [
    { key: "waiting", label: "Waiting", desc: "Awaiting water sample data" },
    { key: "predicting", label: "Predicting", desc: "Running ML inference" },
    { key: "complete", label: "Prediction Complete", desc: "Dosage ready for review" },
  ];

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-zinc-50 min-h-screen font-sans">
      {/* Header */}
      <div className="bg-white border-b border-zinc-200 px-8 py-5">
        <h1 className="text-xl font-semibold text-zinc-800 mb-1">
          Water Analysis &amp; Dosage Recommendation
        </h1>
        <p className="text-sm text-zinc-500 mb-4">
          Analyze raw water quality and review the recommended coagulant dose.
        </p>
        {/* Stepper */}
        <div className="flex items-center gap-0">
          {["Water Analysis", "Recommendation", "Operator Review"].map((step, i) => (
            <React.Fragment key={step}>
              <div className="flex items-center gap-2">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold border-2 transition-colors ${
                    i <= stepIndex
                      ? "bg-blue-600 border-blue-600 text-white"
                      : "bg-white border-zinc-300 text-zinc-400"
                  }`}
                >
                  {i < stepIndex ? (
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    i + 1
                  )}
                </div>
                <span className={`text-sm font-medium ${i === stepIndex ? "text-blue-600" : i < stepIndex ? "text-zinc-700" : "text-zinc-400"}`}>
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

      {/* Body */}
      <div className="flex-1 p-6 flex gap-6">
        {/* LEFT: Water Quality Analyzer */}
        <div className="flex-1 bg-white rounded-2xl border border-zinc-200 shadow-sm flex flex-col overflow-hidden">
          <div className="px-6 py-4 border-b border-zinc-100">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-semibold text-zinc-800">Water Quality Analyzer</h2>
                <p className="text-xs text-zinc-400 mt-0.5">1L water sample required</p>
              </div>
              {state === "complete" && (
                <span className="inline-flex items-center gap-1.5 bg-green-50 text-green-700 text-xs font-medium px-3 py-1 rounded-full border border-green-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                  Analysis Complete
                </span>
              )}
              {state === "analyzing" && (
                <span className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 text-xs font-medium px-3 py-1 rounded-full border border-blue-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                  Analyzing...
                </span>
              )}
            </div>
          </div>

          {/* No-sample notification */}
          {state === "no_sample" && (
            <div className="mx-6 mt-4 flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
              <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center shrink-0 mt-0.5">
                <svg className="w-4 h-4 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-semibold text-amber-800">Sample Not Detected</p>
                <p className="text-xs text-amber-700 mt-0.5">Please place the 1L sample to the analysis chamber before starting.</p>
              </div>
            </div>
          )}

          {/* Parameters Table */}
          <div className="flex-1 px-6 py-4">
            <table className="w-full">
              <thead>
                <tr className="border-b border-zinc-100">
                  <th className="text-left text-xs font-semibold text-zinc-400 uppercase tracking-wider pb-3 w-1/2">Parameter</th>
                  <th className="text-left text-xs font-semibold text-zinc-400 uppercase tracking-wider pb-3">Value</th>
                </tr>
              </thead>
              <tbody>
                {PARAMETERS.map(({ label, key }, i) => (
                  <tr key={key} className={i % 2 === 0 ? "bg-zinc-50/50" : ""}>
                    <td className="py-3 px-2 text-sm font-medium text-zinc-600 rounded-l">{label}</td>
                    <td className="py-3 px-2 text-sm rounded-r">
                      {state === "analyzing" && data[key] === "—" ? (
                        <div className="h-4 w-24 bg-zinc-200 rounded animate-pulse" />
                      ) : (
                        <span className={data[key] === "—" ? "text-zinc-300" : "text-zinc-800 font-semibold"}>
                          {data[key]}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Progress bar */}
          {state === "analyzing" && (
            <div className="px-6 pb-4">
              <div className="flex justify-between text-xs text-zinc-500 mb-1.5">
                <span>Running water quality analysis...</span>
                <span>{progress}%</span>
              </div>
              <div className="w-full bg-zinc-100 rounded-full h-2.5">
                <div
                  className="bg-blue-500 h-2.5 rounded-full transition-all duration-100"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          {/* Bottom Actions */}
          <div className="px-6 pb-6 pt-2 flex flex-col gap-3">
            {(state === "idle" || state === "no_sample") && (
              <label className="flex items-center gap-3 cursor-pointer select-none bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3">
                <div
                  onClick={() => setSamplePlaced((v) => !v)}
                  className={`relative w-10 h-5 rounded-full transition-colors ${samplePlaced ? "bg-blue-600" : "bg-zinc-300"}`}
                >
                  <div className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${samplePlaced ? "translate-x-5" : ""}`} />
                </div>
                <span className="text-sm text-zinc-600">
                  {samplePlaced
                    ? <span className="text-blue-700 font-medium">Sample placed in chamber</span>
                    : "Simulate: sample placed in chamber"}
                </span>
              </label>
            )}

            {(state === "idle" || state === "no_sample") && (
              <button
                onClick={handleStartAnalysis}
                className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold text-sm py-3 rounded-xl transition-colors"
              >
                Start Analysis
              </button>
            )}

            {state === "complete" && (
              <>
                <button
                  onClick={() => alert("Proceeding to validation...")}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold text-sm py-3 rounded-xl transition-colors"
                >
                  Proceed to Validation →
                </button>
                <button
                  onClick={handleReset}
                  className="w-full border border-zinc-200 text-zinc-500 hover:text-zinc-700 hover:bg-zinc-50 text-sm py-2.5 rounded-xl transition-colors"
                >
                  Reset &amp; New Analysis
                </button>
              </>
            )}
          </div>
        </div>

        {/* RIGHT: Recommended Dosage */}
        <div className="w-80 flex flex-col gap-4">
          {/* Dosage Card */}
          <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
            <div className="bg-gradient-to-br from-blue-600 to-blue-700 px-6 py-5">
              <p className="text-blue-100 text-xs font-medium uppercase tracking-widest mb-1">Recommended</p>
              <h2 className="text-white text-lg font-bold">Alum Dosage</h2>
              <p className="text-blue-200 text-xs mt-0.5">Predicted by ML Model</p>
            </div>
            <div className="px-6 py-6 flex flex-col items-center">
              {dosage ? (
                <>
                  <div className="text-5xl font-black text-zinc-800 tracking-tight">{dosage}</div>
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
                    {state === "analyzing"
                      ? "Waiting for water analysis to complete..."
                      : "Run water analysis to get the predicted dosage."}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Model Status Card */}
          <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm px-6 py-5">
            <h3 className="text-sm font-semibold text-zinc-700 mb-4">Model Status</h3>
            <div className="flex flex-col gap-3">
              {modelSteps.map(({ key, label, desc }) => {
                const isActive = modelStatus === key;
                const isPast = (key === "waiting" && modelStatus !== "waiting") || (key === "predicting" && modelStatus === "complete");
                return (
                  <div key={key} className={`flex items-start gap-3 rounded-xl px-3 py-2.5 transition-colors ${isActive ? "bg-blue-50" : ""}`}>
                    <div className={`mt-0.5 w-3 h-3 rounded-full shrink-0 border-2 transition-colors ${
                      isActive ? "bg-blue-500 border-blue-500 shadow shadow-blue-200"
                        : isPast ? "bg-zinc-300 border-zinc-300"
                        : "bg-white border-zinc-300"
                    }`} />
                    <div>
                      <p className={`text-sm font-semibold ${isActive ? "text-blue-700" : "text-zinc-400"}`}>{label}</p>
                      <p className={`text-xs mt-0.5 ${isActive ? "text-blue-500" : "text-zinc-400"}`}>{desc}</p>
                    </div>
                    {isActive && modelStatus !== "complete" && (
                      <div className="ml-auto">
                        <div className="w-3 h-3 rounded-full bg-blue-400 animate-ping opacity-75" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
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
  );
}

export default HistoryPage