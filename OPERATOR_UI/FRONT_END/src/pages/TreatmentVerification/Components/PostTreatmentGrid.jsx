
function PostTreatmentGrid({validationResult, data, subPARAMETERS}) {

    // Add these variables right before your return statement to clean up the JSX:
    const latestTrial = validationResult.validation_trials[validationResult.validation_trials.length - 1];
    const finalTurbidity = latestTrial.resultingWaterQuality.turbidity;
    // Assuming you have access to the initial data:
    const initialTurbidity = data?.waterQuality?.turbidity || 0;
    const reductionPercentage = initialTurbidity ? (((initialTurbidity - finalTurbidity) / initialTurbidity) * 100).toFixed(1) : 0;


    return (
        <>
            {/* === POST-TREATMENT RESULT GRID === */}
            <div className="grid grid-cols-6 gap-5 mt-2 animate-in fade-in duration-500">

                {/* MAIN PARAMETER: Turbidity (Col Span 4) */}
                <div className="col-span-4 relative bg-white border border-emerald-200 rounded-2xl p-6 shadow-sm overflow-hidden flex flex-col justify-between">

                    {/* Subtle pristine water glow effect */}
                    <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none"></div>

                    {/* Header */}
                    <div className="flex justify-between items-start relative z-10">
                        <div>
                            <h3 className="text-sm font-semibold text-zinc-800 uppercase tracking-wider">
                                Final Turbidity
                            </h3>
                            <p className="text-xs text-zinc-500 mt-0.5">Post-treatment clarity reading</p>
                        </div>

                        {/* Reduction Badge */}
                        <div className="flex items-center gap-1 bg-emerald-50 border border-emerald-200 text-emerald-700 px-2.5 py-1 rounded-full shadow-sm">
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 13.5L12 21m0 0l-7.5-7.5M12 21V3" />
                            </svg>
                            <span className="text-sm font-bold">{reductionPercentage}% Reduction</span>
                        </div>
                    </div>

                    {/* Big Value Display */}
                    <div className="mt-6 mb-4 relative z-10">
                        <div className="flex items-baseline gap-2">
                            <span className="text-6xl font-bold text-zinc-900 tracking-tight tabular-nums">
                                {finalTurbidity}
                            </span>
                            <span className="text-xl font-medium text-zinc-400">NTU</span>
                        </div>
                    </div>

                    {/* Before & After Comparison Footer */}
                    <div className="flex items-center gap-4 mt-auto pt-4 border-t border-zinc-100 relative z-10">
                        <div className="flex flex-col">
                            <span className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">Initial</span>
                            <span className="text-sm font-medium text-zinc-600 tabular-nums">{initialTurbidity} NTU</span>
                        </div>

                        {/* Arrow pointing right */}
                        <svg className="w-5 h-5 text-zinc-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                        </svg>

                        <div className="flex flex-col">
                            <span className="text-[10px] font-semibold text-emerald-600 uppercase tracking-wider">Final</span>
                            <span className="text-sm font-bold text-emerald-700 tabular-nums">{finalTurbidity} NTU</span>
                        </div>
                    </div>
                </div>


                {/* SUB-PARAMETERS (Col Span 2) */}
                <div className="col-span-2 flex flex-col gap-3">
                    {subPARAMETERS.map(({ label, key, metric }) => {
                        const value = latestTrial.resultingWaterQuality[key];

                        return (
                            <div
                                key={key}
                                className="flex items-center justify-between bg-zinc-50/80 border border-zinc-200 rounded-xl p-4 shadow-sm"
                            >
                                {/* Label */}
                                <span className="text-xs font-semibold text-zinc-600 uppercase tracking-wider">
                                    {label}
                                </span>

                                {/* Value & Metric */}
                                <div className="flex items-baseline gap-1">
                                    <span className="text-lg font-bold text-zinc-900 tabular-nums tracking-tight">
                                        {value}
                                    </span>
                                    <span className="text-xs font-medium text-zinc-500">
                                        {metric}
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>

            </div>
        </>
    )
}

export default PostTreatmentGrid