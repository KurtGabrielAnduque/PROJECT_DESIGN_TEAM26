import React from 'react'

function SummaryHeader({PARAMETERS, validationData, currentDosage, treatmentProcess, stockConcentration, currentVolume, setRawWaterSample, rawWaterSample, handleValidation, warning}) {
    return (
        <>
            <div className="flex flex-col bg-white border border-zinc-200 p-6 gap-6">

                {/* Header */}
                <div>
                    <h1 className="text-2xl font-semibold text-zinc-800">
                        Summary of Parameters
                    </h1>
                </div>

                {/* Main Layout Wrapper */}
                <div className="flex flex-col gap-4">

                    {/* Top Row: Parameters */}
                    <div className="border border-zinc-200 bg-zinc-50/50 rounded-2xl p-5 shadow-sm w-full">
                        <h2 className="text-sm font-semibold text-zinc-800 uppercase tracking-wider mb-4">
                            Measured Raw Water Quality
                        </h2>

                        {/* Parameters Grid - Responsive: 2 cols on mobile, 3 on tablet, 5 on desktop */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                            {PARAMETERS.map(({ label, key, metric }, index) => {
                                const value = validationData?.waterQuality?.[key];
                                const hasValue = value && value !== "—";

                                // Makes the first card green just like the reference image
                                const isHighlighted = index === 0;

                                return (
                                    <div
                                        key={key}
                                        className={`relative flex flex-col p-4 rounded-2xl shadow-sm transition-all duration-200 ${isHighlighted
                                            ? "bg-gradient-to-br from-emerald-800 to-emerald-700 text-white border-transparent"
                                            : "bg-white text-zinc-900 border border-zinc-200"
                                            }`}
                                    >
                                        {/* Top Row: Label & Icon */}
                                        <div className="flex justify-between items-start mb-2">
                                            <span
                                                className={`text-sm font-medium tracking-tight ${isHighlighted ? "text-emerald-50" : "text-zinc-600"
                                                    }`}
                                            >
                                                {label}
                                            </span>
                                        </div>

                                        {/* Value */}
                                        <div className="mt-1 mb-3">
                                            {hasValue ? (
                                                <span className="text-3xl font-bold tracking-tight tabular-nums">
                                                    {value}
                                                </span>
                                            ) : (
                                                <span
                                                    className={`text-3xl font-bold tracking-tight tabular-nums ${isHighlighted ? "opacity-70" : "text-zinc-300"
                                                        }`}
                                                >
                                                    --
                                                </span>
                                            )}
                                        </div>

                                        {/* Bottom Row: Mimicking the subtext layout */}
                                        <div className="mt-auto flex items-center gap-1.5">
                                            {metric && (
                                                <>
                                                    {/* Small indicator badge */}
                                                    <div
                                                        className={`px-1.5 py-0.5 rounded text-[10px] font-semibold flex items-center gap-0.5 ${isHighlighted
                                                            ? "bg-emerald-600/50 text-emerald-50 border border-emerald-500/30"
                                                            : "bg-emerald-50 text-emerald-700 border border-emerald-100"
                                                            }`}
                                                    >
                                                        {metric}
                                                    </div>
                                                    {/* Subtext */}
                                                    <span
                                                        className={`text-[10px] font-medium truncate ${isHighlighted ? "text-emerald-100" : "text-zinc-400"
                                                            }`}
                                                    >
                                                        Standard Unit
                                                    </span>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>



                    {/* Bottom Part predicted dosage and current dosage use and volume to be dispensed */}
                    <div className="border border-zinc-200 bg-zinc-50/50 rounded-2xl p-5 shadow-sm w-full">
                        <h2 className="text-sm font-semibold text-zinc-800 uppercase tracking-wider mb-4">
                            ALUMINA SOLUTION
                        </h2>

                        {/* Bottom Row: Volume & Dosage */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">

                            {/* Predicted Dosage Card */}
                            <div className="border border-zinc-200 bg-white flex flex-col justify-between rounded-2xl p-5 shadow-sm">
                                <div className="mb-4">
                                    <h2 className="text-sm font-semibold text-zinc-800 uppercase tracking-wider mb-1">
                                        Predicted Dosage
                                    </h2>
                                </div>
                                <div className="flex items-end gap-2">
                                    <span className="text-4xl font-bold tracking-tight text-zinc-900 tabular-nums">
                                        {validationData.recommendation.predictedDosage}
                                    </span>
                                    <span className="text-sm font-medium text-zinc-500 mb-1">
                                        mg/L
                                    </span>
                                </div>
                            </div>

                            {/* Current Dosage Card */}
                            <div className="border border-zinc-200 bg-white flex flex-col justify-between rounded-2xl p-5 shadow-sm">
                                <div className="mb-4">
                                    <h2 className="text-sm font-semibold text-zinc-800 uppercase tracking-wider mb-1">
                                        Current Dosage
                                    </h2>
                                </div>
                                <div className="flex items-end gap-2">
                                    <span className="text-4xl font-bold tracking-tight text-zinc-900 tabular-nums">
                                        {currentDosage}
                                    </span>
                                    <span className="text-sm font-medium text-zinc-500 mb-1">
                                        mg/L
                                    </span>
                                </div>
                            </div>

                            {/* Volume to Dispense Card */}
                            <div className="border border-zinc-200 bg-white flex flex-col justify-between rounded-2xl p-5 shadow-sm">
                                {/* Header Section */}
                                <div className="mb-4">
                                    <h2 className="text-sm font-semibold text-zinc-800 uppercase tracking-wider mb-1">
                                        Volume to Dispense
                                    </h2>
                                    <p className="text-xs font-medium text-zinc-500">
                                        Derived from {stockConcentration}g/L stock concentration
                                    </p>
                                </div>

                                {/* Value Section */}
                                <div className="flex items-end gap-2">
                                    <span className="text-4xl font-bold tracking-tight text-zinc-900 tabular-nums">
                                        {currentVolume ?? "--"}
                                    </span>
                                    <span className="text-sm font-medium text-zinc-500 mb-1">
                                        mL
                                    </span>
                                </div>
                            </div>

                        </div>
                    </div>

                </div>



                {/* Buttons Add functionality in the future */}
                {/* Footer & Action Button */}
                {/*Show the validation only when the operator is done dispensing*/}

                {treatmentProcess === 'idle' && (
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
                <div className="px-1 py-1 flex flex-col">
                    {warning && (
                        <div className="mt-1 flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
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
        </>
    )
}

export default SummaryHeader