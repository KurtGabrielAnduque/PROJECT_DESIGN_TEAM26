
function PostTreatmentGrid({ validationResult, data, subPARAMETERS, setValidationResult}) {

    // Add these variables right before your return statement to clean up the JSX:
    const latestTrial = validationResult.validation_trials[validationResult.validation_trials.length - 1];
    const finalTurbidity = latestTrial.resultingWaterQuality.turbidity;
    // Assuming you have access to the initial data:
    const initialTurbidity = data?.waterQuality?.turbidity || 0;
    const reductionPercentage = initialTurbidity ? (((initialTurbidity - finalTurbidity) / initialTurbidity) * 100).toFixed(1) : 0;
    const volume = latestTrial.appliedVolume;
    const dosage = latestTrial.appliedDosage;


    return (
        <>
            {/* === POST-TREATMENT RESULT GRID === */}
            <div className="grid grid-cols-6 gap-5 mt-2 animate-in fade-in duration-500">

                {/* MAIN PARAMETER: Turbidity (Col Span 3 or 2) */}
                <div className="col-span-2 relative bg-white border border-emerald-200 rounded-2xl p-6 shadow-sm overflow-hidden flex flex-col justify-between">

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
                    {/* Section Header */}
                    <div className="flex items-start justify-between">
                        <div>
                            <h2 className="text-lg font-semibold text-zinc-800">
                                Post-Treatment Water Quality
                            </h2>
                            <p className="text-sm text-zinc-500 mt-1">
                                Other measured water quality parameters after the treatment process.
                            </p>
                        </div>


                    </div>


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

                {/* Container for the two split cards */}
                <div className="col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">

                    {/* CARD 1: The AI Prediction (Dosage) */}
                    <div className="relative bg-gradient-to-br from-blue-900 to-blue-800 border border-blue-700 rounded-2xl p-6 shadow-sm overflow-hidden flex flex-col justify-between">

                        {/* Decorative glow */}
                        <div className="absolute -top-12 -right-12 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl pointer-events-none"></div>

                        {/* Header */}
                        <div className="relative z-10 flex items-center justify-between mb-4">
                            <div>
                                <h3 className="text-sm font-semibold text-white uppercase tracking-wider">
                                    Predicted Dosage
                                </h3>
                                <p className="text-[11px] text-blue-200 mt-0.5">
                                    Target Concentration
                                </p>
                            </div>
                            <div className="w-8 h-8 rounded-lg bg-blue-800/80 border border-blue-600/50 flex items-center justify-center">
                                {/* AI / Sparkle Icon */}
                                <svg className="w-4 h-4 text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            </div>
                        </div>

                        {/* Value */}
                        <div className="relative z-10 mt-2">
                            <div className="flex items-baseline gap-2">
                                <span className="text-5xl font-bold text-white tracking-tight tabular-nums">
                                    {dosage ? dosage : '--'}
                                </span>
                                <span className="text-lg font-medium text-blue-300">
                                    mg/L
                                </span>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="relative z-10 mt-6 pt-4 border-t border-blue-700/70 flex justify-between items-center">
                            <span className="text-[10px] uppercase tracking-wide text-blue-300">
                                Model Output
                            </span>
                            <span className="text-[10px] font-bold text-blue-100 bg-blue-800/80 border border-blue-600/50 px-2 py-1 rounded uppercase tracking-wider">
                                Alum (PAC)
                            </span>
                        </div>
                    </div>


                    {/* CARD 2: The Hardware Action (Volume) */}
                    <div className="relative bg-gradient-to-br from-slate-900 to-slate-800 border border-emerald-700/50 rounded-2xl p-6 shadow-sm overflow-hidden flex flex-col justify-between">

                        {/* Decorative glow */}
                        <div className="absolute -top-12 -right-12 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

                        {/* Header */}
                        <div className="relative z-10 flex items-center justify-between mb-4">
                            <div>
                                <h3 className="text-sm font-semibold text-white uppercase tracking-wider">
                                    Dispensed Volume
                                </h3>
                                <p className="text-[11px] text-emerald-200/70 mt-0.5">
                                    Physical Pump Action
                                </p>
                            </div>
                            <div className="w-8 h-8 rounded-lg bg-emerald-900/50 border border-emerald-700/50 flex items-center justify-center">
                                {/* Liquid / Beaker Icon */}
                                <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                                </svg>
                            </div>
                        </div>

                        {/* Value */}
                        <div className="relative z-10 mt-2">
                            <div className="flex items-baseline gap-2">
                                <span className="text-5xl font-bold text-emerald-400 tracking-tight tabular-nums">
                                    {volume ? volume : '--'}
                                </span>
                                <span className="text-lg font-medium text-emerald-600">
                                    mL
                                </span>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="relative z-10 mt-6 pt-4 border-t border-emerald-800/50 flex justify-between items-center">
                            <span className="text-[10px] uppercase tracking-wide text-emerald-500/70">
                                Pump Status
                            </span>
                            <div className="flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wide">
                                    Applied
                                </span>
                            </div>
                        </div>
                    </div>

                </div>

            </div>
        </>
    )
}

export default PostTreatmentGrid