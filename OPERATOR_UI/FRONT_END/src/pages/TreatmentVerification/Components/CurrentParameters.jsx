
function CurrentParameters({ PARAMETERS, data, dosage, dispenseStatus, handleDispensing }) {
    return (
        <>
            <div className="flex flex-col bg-white border border-zinc-200 p-6 gap-6">

                {/* Header */}
                <div>
                    <h1 className="text-2xl font-semibold text-zinc-800">
                        Test The Effectiveness of the Predicted Dosage
                    </h1>
                    <p className="text-m text-zinc-500 mt-1">
                        Review the initial parameters and recommended dosage before proceeding to validation.
                    </p>
                </div>

                {/* Grid Layout for Data */}
                <div className="grid grid-cols-9 gap-4">
                    {/* Left Col (Parameters) */}
                    <div className="col-span-7 border border-zinc-200 bg-zinc-50/50 rounded-2xl p-5 shadow-sm">
                        <h2 className="text-sm font-semibold text-zinc-800 uppercase tracking-wider mb-4">
                            Measured Raw Water Quality
                        </h2>

                        <div className="grid grid-cols-5 gap-3">
                            {PARAMETERS.map(({ label, key, metric }, index) => {
                                const value = data?.waterQuality?.[key];
                                const hasValue = value && value !== "—";

                                // Makes the first card green just like the reference image
                                const isHighlighted = index === 0;

                                return (
                                    <div
                                        key={key}
                                        className={`relative flex flex-col p-4 rounded-2xl shadow-sm transition-all duration-200 ${isHighlighted
                                            ? "bg-gradient-to-br from-emerald-800 to-emerald-700 text-white border-transparent"
                                            : "bg-white text-zinc-900 border border-zinc-100"
                                            }`}
                                    >
                                        {/* Top Row: Label & Icon */}
                                        <div className="flex justify-between items-start mb-2">
                                            <span className={`text-sm font-medium tracking-tight ${isHighlighted ? "text-emerald-50" : "text-zinc-900"}`}>
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
                                                <span className={`text-3xl font-bold tracking-tight tabular-nums ${isHighlighted ? "opacity-70" : "text-zinc-300"}`}>
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
                                                        className={`text-[10px] font-medium truncate ${isHighlighted ? "text-emerald-100" : "text-zinc-500"
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

                    {/* Right Col (Dosage) */}
                    <div className="col-span-2 flex flex-col bg-gradient-to-br from-blue-900 to-blue-800 border border-blue-700 rounded-2xl p-6 shadow-md relative overflow-hidden">

                        {/* Subtle decorative glow in the background for a modern tech feel */}
                        <div className="absolute -top-12 -right-12 w-32 h-32 bg-blue-500 rounded-full mix-blend-overlay filter blur-2xl opacity-40"></div>

                        <div className="relative z-10 flex flex-col h-full">

                            {/* Header Row */}
                            <div className="flex justify-between items-start mb-6">
                                <h2 className="text-xs font-semibold text-blue-200 uppercase tracking-widest">
                                    Predicted Optimal Dosage
                                </h2>
                            </div>

                            {/* Big Value */}
                            <div className="mt-auto">
                                {dosage ? (
                                    <div className="flex items-baseline gap-2">
                                        {/* Replace '24.5' with your actual data variable like data.recommendedDosage */}
                                        <span className="text-5xl font-bold text-white tracking-tight tabular-nums drop-shadow-sm">
                                            {dosage}
                                        </span>
                                        <span className="text-lg font-medium text-blue-200">
                                            mg/L
                                        </span>
                                    </div>
                                ) : (
                                    <div className="flex items-baseline gap-2 opacity-50">
                                        <span className="text-5xl font-bold text-white tracking-tight tabular-nums drop-shadow-sm">
                                            --
                                        </span>
                                        <span className="text-lg font-medium text-blue-200">
                                            mg/L
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* Footer Row (Details/Confidence) */}
                            <div className="mt-5 pt-4 border-t border-blue-700/60 flex items-center justify-between">
                                <span className="text-[11px] text-blue-200 flex items-center gap-1.5 font-medium">
                                    {/* Green dot indicating high confidence/ready */}
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]"></span>
                                    High Confidence
                                </span>
                                <span className="text-[10px] font-semibold text-blue-100 bg-blue-800/80 border border-blue-600/50 px-2 py-1 rounded-md uppercase tracking-wide">
                                    Alum (PAC)
                                </span>
                            </div>

                        </div>
                    </div>
                </div>

                {/* Buttons 
                        Add functionality in the future
                */}

                {/* Ready to Dispense */}
                {dispenseStatus === 'waiting' && (
                    <div className="flex justify-end pt-4 mt-2 border-t border-zinc-100">
                        <button
                            onClick={handleDispensing}
                            className="px-5 py-2.5 bg-blue-600 text-white font-medium text-sm rounded-lg shadow-sm hover:bg-blue-700 transition-colors flex items-center gap-2"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                            </svg>
                            Dispense Predicted Dosage
                        </button>
                    </div>
                )}

                {/* Loading / Dispensing */}
                {dispenseStatus === 'dispensing' && (
                    <div className="flex justify-end pt-4 mt-2 border-t border-zinc-100">
                        <button
                            disabled
                            // Changed bg to blue-400 and added flex + gap to align the spinner with the text
                            className="px-5 py-2.5 bg-blue-400 text-white font-medium text-sm rounded-lg shadow-sm cursor-not-allowed flex items-center gap-2.5"
                        >
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            System is Dispensing...
                        </button>
                    </div>
                )}

                {/* Dispense Complete */}
                {dispenseStatus === "dispense_complete" && (
                    <div className="flex flex-row items-center justify-end gap-5 pt-4 mt-2 border-t border-zinc-100">

                        {/* Success Badge */}
                        <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-700">
                            <svg className="w-5 h-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="text-sm font-semibold">
                                Dispensing Complete!
                            </span>
                        </div>

                        {/* Secondary Button to retry */}
                        <button
                            onClick={handleDispensing}
                            className="px-5 py-2.5 bg-white text-zinc-700 border border-zinc-300 font-medium text-sm rounded-lg shadow-sm hover:bg-zinc-50 hover:text-zinc-900 transition-colors flex items-center gap-2"
                        >
                            <svg className="w-4 h-4 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                            </svg>
                            Dispense Again
                        </button>

                    </div>
                )}
            </div>
        </>
    )
}

export default CurrentParameters