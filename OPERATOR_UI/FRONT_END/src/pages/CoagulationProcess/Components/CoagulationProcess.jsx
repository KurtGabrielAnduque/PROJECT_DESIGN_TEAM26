import React from 'react'

function CoagulationProcess({treatmentProcess, setTreatedWaterSample, treatedWaterSample, handleAnalysis, treatedWaterWarning}) {
    return (
        <>
            <div className="flex flex-col bg-white border border-zinc-200 p-6 gap-6">
                {/* State 1: Idle (Empty State) */}
                {treatmentProcess === "idle" && (
                    <div className="flex-1 flex flex-col items-center justify-center text-center px-4">
                        <div className="w-16 h-16 bg-zinc-50 border border-zinc-100 rounded-full flex items-center justify-center mb-4">
                            <svg className="w-8 h-8 text-zinc-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                            </svg>
                        </div>
                        <h3 className="text-sm font-semibold text-zinc-700">Awaiting Validation</h3>
                        <p className="text-m text-zinc-900 mt-1 max-w-xs">
                            Secure the sample and start the coagulation sequence to treat the raw sample .
                        </p>
                    </div>
                )}

                {/*State 2: Treating process (this is the part where machine is performing the coagulation process) waiting for the complete response from the backend*/}
                {treatmentProcess === "treating" && (
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
                        <p className="text-m text-zinc-900 mt-1 max-w-xs">
                            Performing flash mixing, slow mixing, and settling phases. Please wait.
                        </p>
                    </div>
                )}

                {/*State 3: Complete Coagulation process the complete signal is received here*/}
                {treatmentProcess === "coagulation_complete" && (
                    <>
                        <div className="flex-1 flex flex-col items-center justify-center text-center px-4">
                            {/* Success Icon container */}
                            <div className="relative w-16 h-16 flex items-center justify-center mb-4">
                                {/* Soft background fill */}
                                <div className="absolute inset-0 bg-emerald-50 rounded-full"></div>
                                {/* Solid green outer ring */}
                                <div className="absolute inset-0 border-4 border-emerald-500 rounded-full"></div>
                                {/* Checkmark SVG */}
                                <svg className="w-8 h-8 text-emerald-600 absolute" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                </svg>
                            </div>

                            {/* Text content without the pulse animation so it looks "settled" */}
                            <h3 className="text-sm font-semibold text-emerald-700">Process Complete</h3>
                            <p className="text-m text-zinc-900 mt-1 max-w-xs">
                                Coagulation process finished successfully. All phases have settled.
                            </p>
                            <p className="text-m text-zinc-900 mt-1 max-w-l ">
                                Please take a Sample of Treated Water before proceeding to the analysis or measurements of the resulting treatment.
                            </p>
                        </div>

                        <div className="grid grid-cols-7 gap-3 mt-4 pt-4 border-t border-zinc-100">

                            {/* COLUMN 1: Toggle Switch (Takes up 5/7 of the width) */}
                            <div className="col-span-5">
                                {/* Added 'h-full' so it stretches to match the button if the text wraps */}
                                <label className="flex items-center h-full gap-3 cursor-pointer select-none bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3">
                                    <div
                                        onClick={() => setTreatedWaterSample((prev) => !prev)}
                                        className={`relative shrink-0 w-10 h-5 rounded-full transition-colors ${treatedWaterSample ? "bg-blue-600" : "bg-zinc-300"
                                            }`}
                                    >
                                        <div
                                            className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${treatedWaterSample ? "translate-x-5" : ""
                                                }`}
                                        />
                                    </div>

                                    <span className="text-sm text-zinc-600">
                                        {treatedWaterSample ? (
                                            <span className="text-blue-700 font-medium">
                                                Treated Water Sample placed in chamber
                                            </span>
                                        ) : (
                                            <span className="text-black font-medium">
                                                Please ensure that sample of treated water in a jar is properly secured in the chamber before initiating the analysis.
                                            </span>
                                        )}
                                    </span>
                                </label>
                            </div>

                            {/* COLUMN 2: Start Button (Takes up 2/7 of the width) */}
                            <div className="col-span-2">
                                {/* Added 'w-full h-full justify-center rounded-xl' for perfect alignment */}
                                <button
                                    onClick={handleAnalysis}
                                    className="w-full h-full justify-center px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm rounded-xl shadow-sm transition-colors flex items-center gap-2">
                                    Start Assessment of the Treatment
                                </button>
                            </div>

                        </div>

                        {/*Notification here*/}
                        <div className="px-1 py-1 flex flex-col">
                            {treatedWaterWarning && (
                                <div className="mt-1 flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
                                    <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center shrink-0 mt-0.5">
                                        <svg className="w-4 h-4 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-amber-800">Sample Not Detected</p>
                                        <p className="text-xs text-amber-700 mt-0.5">Please place the treated water to the chamber before starting.</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </>

                )}
            </div>
        </>
    )
}

export default CoagulationProcess