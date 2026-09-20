import React from 'react'

function ParameterTable({data, state, PARAMETERS, warning, setSample, sample, handleStartAnalysis, reset}) {
    return (
        <>
            <div className="flex-1 bg-white rounded-2xl border border-zinc-200 shadow-sm flex flex-col overflow-hidden">

                {/*Header Part of the Left page*/}
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
                                    <span className="text-2xl font-semibold text-zinc-400">
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

                </div>

                {/* Parameters Table */}
                <div className="flex-1 px-6 py-4">
                    <div className="p-3 mb-5">
                        <h1 className="font-bold text-2xl text-center">
                            Water Quality Parameters Results
                        </h1>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        {PARAMETERS.map(({ label, key, metric }) => {

                            // Extract value to keep JSX clean
                            const value = data?.waterQuality?.[key];
                            const hasValue = value && value !== "—";

                            return (
                                <div
                                    key={key}
                                    className="bg-zinc-50/50 border border-zinc-200 rounded-xl p-4 flex flex-col justify-between"
                                >
                                    {/* Label */}
                                    <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                                        {label}
                                    </span>

                                    {/* Value & Unit */}
                                    <div className="mt-3 flex items-baseline gap-1.5">
                                        {hasValue ? (
                                            <>
                                                {/* tabular-nums ensures numbers don't shift weirdly if they change in real-time */}
                                                <span className="text-2xl font-semibold text-zinc-900 tracking-tight tabular-nums">
                                                    {value}
                                                </span>

                                                <span className="text-l font-medium text-zinc-500">
                                                    {metric}
                                                </span>

                                            </>
                                        ) : (
                                            <span className="text-2xl font-semibold text-zinc-300">
                                                --
                                            </span>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/*Buttons Part*/}
                <div className="px-6 pb-6 pt-2 flex flex-col gap-3">
                    {/* No-sample notification */}
                    {warning && (
                        <div className="mt-4 flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
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

                    {/*Toggle Button to remind operator to place 1 Liter sample*/}
                    {(state == 'idle') && (
                        <label className="flex items-center gap-3 cursor-pointer select-none bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3">
                            <div
                                // just reverse the state of the sample here
                                onClick={() => setSample((prev) => !prev)}
                                className={`relative w-10 h-5 rounded-full transition-colors ${sample ? "bg-blue-600" : "bg-zinc-300"
                                    }`}
                            >
                                <div
                                    className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${sample ? "translate-x-5" : ""
                                        }`}
                                />
                            </div>

                            <span className="text-sm text-zinc-600">
                                {sample ? (
                                    <span className="text-blue-700 font-medium">
                                        Sample placed in chamber
                                    </span>
                                ) : (
                                    <span className="text-black font-medium">
                                        Check only if the 1L raw water sample is placed in the chamber
                                    </span>
                                )}
                            </span>
                        </label>
                    )}


                    {/*Start the analysis upon click here*/}
                    {(state === 'idle') && (
                        <button
                            className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold text-sm py-3 rounded-xl transition-colors"
                            onClick={handleStartAnalysis}
                        >
                            Start the Analysis
                        </button>
                    )}

                    {/* Loading Button (Analyzing) */}
                    {(state === 'analyzing') && (
                        <button
                            disabled
                            className="w-full bg-blue-400 text-white font-semibold text-sm py-3 rounded-xl flex items-center justify-center gap-2 cursor-not-allowed mt-2"
                        >
                            {/* Small Spinner inside the button */}
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            Analyzing Sample...
                        </button>
                    )}


                    {data && (
                        // Added 'gap-4' to space the buttons apart, and 'items-center' to align them
                        <div className="flex flex-row gap-4 items-center mt-6">

                            {/* PRIMARY BUTTON */}
                            <div className="flex-1">
                                <button
                                    className="w-full px-5 py-2.5 bg-blue-600 text-white font-medium text-sm rounded-lg shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200"
                                >
                                    Validate Predicted Dosage
                                </button>
                            </div>

                            {/* SECONDARY BUTTON */}
                            <div className="flex-1">
                                <button
                                    onClick={reset}
                                    className="w-full px-5 py-2.5 bg-white text-zinc-700 border border-zinc-300 font-medium text-sm rounded-lg shadow-sm hover:bg-zinc-50 hover:text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2 transition-all duration-200"
                                >
                                    Perform New Analysis
                                </button>
                            </div>

                        </div>
                    )}



                </div>
            </div>
        </>
    )
}

export default ParameterTable