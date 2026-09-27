
function CurrentParameters({ PARAMETERS, data, dosage, dispenseStatus, handleDispensing, volume, stockConcentration }) {
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
                <div className="grid grid-cols-1 lg:grid-cols-9 gap-4">
                    {/* Left Col (Parameters) */}
                    <div className="lg:col-span-7 border border-zinc-200 bg-zinc-50/50 rounded-2xl p-5 shadow-sm">
                        <h2 className="text-sm font-semibold text-zinc-800 uppercase tracking-wider mb-4">
                            Measured Raw Water Quality
                        </h2>

                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
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

                    {/* Right Col (Dosage & Pump Instruction) */}
                    <div className="lg:col-span-2 bg-white border border-gray-200 rounded-2xl shadow-sm relative overflow-hidden flex flex-col">

                        {/* Header / Status Bar */}
                        <div className="px-4 sm:px-5 py-3 bg-gray-50 border-b border-gray-200 flex justify-between items-center z-10">
                            <div className="flex gap-2">
                                <span className="text-[10px] sm:text-xs font-bold text-gray-600 bg-gray-200/70 border border-gray-300 px-2 py-1 rounded uppercase tracking-wider">
                                    Alum Sulfate Solution
                                </span>
                            </div>
                        </div>

                        {/* Main Content: Split Brain vs Brawn */}
                        {/* Shifted the flex-row split from 'sm' to 'md' so tablet/mobile users don't get cramped numbers */}
                        <div className="flex flex-col md:flex-row flex-1 divide-y md:divide-y-0 md:divide-x divide-gray-100">

                            {/* Left Side: The Science (AI Target) */}
                            <div className="flex-1 p-4 sm:p-5 lg:p-6 flex flex-col justify-center relative group hover:bg-gray-50 transition-colors">

                                <h3 className="text-[10px] sm:text-[11px] font-bold text-gray-800 uppercase tracking-widest mb-1 z-10">
                                    Optimal Dosage
                                </h3>
                                <p className="text-[10px] text-gray-600 mb-2 sm:mb-3 z-10 line-clamp-1">
                                    Calculated for 1L raw water sample
                                </p>

                                <div className="flex items-baseline gap-1 sm:gap-2 z-10">
                                    {/* Scaled the massive 5xl text down for mobile, normal for tablet, larger for desktop */}
                                    <span className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 tracking-tight tabular-nums">
                                        {dosage ? dosage : '--'}
                                    </span>
                                    <span className="text-sm sm:text-base lg:text-lg font-semibold text-gray-900">
                                        mg/L
                                    </span>
                                </div>
                            </div>

                            {/* Right Side: The Hardware (Pump Action) */}
                            <div className="flex-1 p-4 sm:p-5 lg:p-6 flex flex-col justify-center relative group hover:bg-gray-50 transition-colors">

                                <h3 className="text-[10px] sm:text-[11px] font-bold text-gray-800 uppercase tracking-widest mb-1 z-10">
                                    Required Dispense Volume
                                </h3>
                                <p className="text-[10px] text-gray-600 mb-2 sm:mb-3 z-10 line-clamp-1">
                                    Derived from {stockConcentration}g/L stock concentration
                                </p>

                                <div className="flex items-baseline gap-1 sm:gap-2 z-10">
                                    {/* Scaled typography */}
                                    <span className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 tracking-tight tabular-nums">
                                        {volume ? volume : '--'}
                                    </span>
                                    <span className="text-sm sm:text-base lg:text-lg font-semibold text-gray-900">
                                        mL
                                    </span>
                                </div>
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
                            className="px-5 py-2.5 bg-blue-600 text-white font-medium text-sm rounded-lg shadow-sm hover:bg-blue-700 transition-colors flex items-center gap-2 cursor-pointer"
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
                            className="px-5 py-2.5 bg-white text-zinc-700 border border-zinc-300 font-medium text-sm rounded-lg shadow-sm hover:bg-zinc-50 hover:text-zinc-900 transition-colors flex items-center gap-2 cursor-pointer"
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