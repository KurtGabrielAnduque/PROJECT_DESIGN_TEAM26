import React from 'react'
import { useState } from 'react';

function DosageAdjustmentModal({ isAdjustModalOpen, setIsAdjustModalOpen, validationData, dosageInput, setDosageInput, stockConcentration, handleSaveAdjustedDosage}) {
    const [acknowledge, setAcknowledge] = useState(false);
    const [warning, setWarning] = useState(false);

    const handleWarning = () => {
        if (!acknowledge) {
            setWarning(true);
            return;
        }

        setWarning(false);
        handleSaveAdjustedDosage();
    }

    return (
        <>
            {/* === DOSAGE ADJUSTMENT MODAL === */}
            {isAdjustModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/40 backdrop-blur-sm animate-in fade-in duration-200">

                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden border border-zinc-200">
                        {/* Modal Header */}
                        <div className="px-6 py-4 border-b border-zinc-100 bg-zinc-50 flex justify-between items-center">
                            <h3 className="text-lg font-semibold text-zinc-800">
                                Adjust Coagulant Dosage
                            </h3>
                            <button
                                onClick={() => setIsAdjustModalOpen(false)}
                                className="text-zinc-400 hover:text-zinc-600 transition-colors"
                            >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6">
                            <p className="text-sm text-zinc-500 mb-4">
                                The AI predicted <strong>{validationData.recommendation.predictedDosage} mg/L</strong>.
                                Enter your manual adjustment below. The required stock volume will be recalculated automatically.
                            </p>

                            <div>
                                <label className="block text-xs font-semibold text-zinc-700 uppercase tracking-wide mb-2">
                                    New Target Dosage
                                </label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        value={dosageInput}
                                        onChange={(e) => setDosageInput(e.target.value)}
                                        className="block w-full pl-4 pr-16 py-3 text-2xl font-bold text-zinc-800 bg-white border border-zinc-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                        placeholder="0.0"
                                        step="0.1"
                                        autoFocus
                                    />
                                    <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                                        <span className="text-zinc-400 font-medium">mg/L</span>
                                    </div>
                                </div>
                            </div>

                            {/* Live Preview of Volume */}
                            {dosageInput && !isNaN(dosageInput) && (
                                <div className="mt-4 p-3 bg-emerald-50 border border-emerald-100 rounded-lg flex justify-between items-center">
                                    <span className="text-xs font-medium text-emerald-800">New Pump Volume:</span>
                                    <span className="text-sm font-bold text-emerald-600">
                                        {(parseFloat(dosageInput) / stockConcentration).toFixed(1)} mL
                                    </span>
                                </div>
                            )}
                        </div>

                        <div className="m-4 pt-4 border-t border-zinc-100">
                            <label className="flex items-center h-full gap-3 cursor-pointer select-none bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3">
                                <div
                                    onClick={() => setAcknowledge((prev) => !prev)}
                                    className={`relative shrink-0 w-10 h-5 rounded-full transition-colors ${acknowledge ? "bg-blue-600" : "bg-zinc-300"
                                        }`}
                                >
                                    <div
                                        className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${acknowledge ? "translate-x-5" : ""
                                            }`}
                                    />
                                </div>

                                <span className="text-sm text-zinc-600">
                                    {acknowledge ? (
                                        <span className="text-blue-700 font-medium">
                                            New 1L raw water sample is secured
                                        </span>
                                    ) : (
                                        <span className="text-black font-medium">
                                            Please ensure that you use another fresh 1L  raw water sample from same source
                                        </span>
                                    )}
                                </span>
                            </label>

                        </div>

                        {(warning) && (
                            <div className="mb-3 flex items-center gap-3 border-y border-amber-200 bg-amber-50 px-4 py-3">
                                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-100">
                                    ⚠️
                                </div>

                                <span className="text-sm font-medium leading-5 text-zinc-700">
                                    Please secure a 1L raw water sample by acknowledging.
                                </span>
                            </div>
                        )}


                        {/* Modal Footer */}
                        <div className="px-6 py-4 border-t border-zinc-100 bg-zinc-50 flex justify-end gap-3">
                            <button
                                onClick={() => setIsAdjustModalOpen(false)}
                                className="px-4 py-2 text-sm font-medium text-zinc-600 bg-white border border-zinc-300 rounded-lg hover:bg-zinc-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleWarning}
                                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 shadow-sm transition-colors"
                            >
                                Apply & Retest
                            </button>
                        </div>
                    </div>

                </div>
            )}
        </>
    )
}

export default DosageAdjustmentModal