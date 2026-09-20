import React from 'react'

function DosageHeader({state}) {
    const stepIndex = state === "complete" ? 1 : 0;


    return (
        <>
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
        </>
    )
}

export default DosageHeader