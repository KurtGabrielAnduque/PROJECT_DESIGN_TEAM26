

function ModelPredictionResult({data, modelSteps, modelState}) {
    return (
        <>
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
                    <h3 className="text-sm font-semibold text-zinc-700 mb-4">Model Status</h3>
                    <div className="flex flex-col gap-3">
                        {modelSteps.map((modelStatus) => (
                            <div key={modelStatus.key} className={`flex items-start gap-3 rounded-xl px-3 py-2.5 transition-colors ${modelState === modelStatus.key ? "bg-blue-50" : ""}`}>
                                <div className={`mt-0.5 w-3 h-3 rounded-full shrink-0 border-2 transition-colors 
                        ${modelState === modelStatus.key ? "bg-blue-500 border-blue-500 shadow shadow-blue-200" : "bg-white border-zinc-300"}`}
                                />
                                <div>
                                    <p className={`text-sm font-semibold ${modelState === modelStatus.key ? "text-blue-700" : "text-zinc-400"}`}>{modelStatus.label}</p>
                                    <p className={`text-xs mt-0.5 ${modelState === modelStatus.key ? "text-blue-500" : "text-zinc-400"}`}>{modelStatus.desc}</p>
                                </div>
                                {modelState === modelStatus.key && (
                                    <div className="ml-auto">
                                        <div className="w-3 h-3 rounded-full bg-blue-400 animate-ping opacity-75" />
                                    </div>
                                )}
                            </div>
                        ))}
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
        </>
    )
}

export default ModelPredictionResult