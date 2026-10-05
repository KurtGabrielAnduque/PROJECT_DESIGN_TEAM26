import React from 'react'
import {Plus, Trash2, AlertCircle, X } from 'lucide-react';


function LabModal({isModalOpen, setIsModalOpen, formError, formData, handleInputChange, addSequence, removeSequence, handleSubmit, handleSequenceChange}) {
    return (
        <>
            {/* CREATION MODAL */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/40 backdrop-blur-sm p-4">
                    <div className="bg-white w-full max-w-3xl max-h-[90vh] rounded-2xl shadow-xl flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">

                        {/* Modal Header */}
                        <div className="px-6 py-4 border-b border-zinc-200 flex justify-between items-center bg-zinc-50">
                            <h2 className="text-lg font-bold text-zinc-900">Create Lab Configuration</h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-zinc-400 hover:text-zinc-600">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Modal Body (Scrollable) */}
                        <div className="overflow-y-auto flex-1 p-6 space-y-8">

                            {/* Error Alert */}
                            {formError && (
                                <div className="bg-red-50 text-red-700 p-4 rounded-xl border border-red-200 flex items-start gap-3">
                                    <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                                    <span className="text-sm font-medium">{formError}</span>
                                </div>
                            )}

                            {/* 1. Analysis Configuration */}
                            <section>
                                <h3 className="text-md font-bold text-zinc-800 border-b border-zinc-200 pb-2 mb-4">Analysis Configuration</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-semibold text-zinc-600 mb-1">Stirring Speed (RPM)</label>
                                        <input type="number" required value={formData.analysis_config.stirring_speed} onChange={e => handleInputChange('analysis_config', 'stirring_speed', e.target.value)} className="w-full px-3 py-2 border border-zinc-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-zinc-600 mb-1">Stirring Duration (sec)</label>
                                        <input type="number" required value={formData.analysis_config.stirring_duration} onChange={e => handleInputChange('analysis_config', 'stirring_duration', e.target.value)} className="w-full px-3 py-2 border border-zinc-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                                    </div>
                                </div>
                            </section>

                            {/* 2. Coagulation Process */}
                            <section>
                                <h3 className="text-md font-bold text-zinc-800 border-b border-zinc-200 pb-2 mb-4">Coagulation Process</h3>

                                <div className="mb-6 bg-zinc-50 p-4 rounded-xl border border-zinc-200">
                                    <h4 className="text-sm font-semibold text-zinc-700 mb-3">Flash Mixing Phase</h4>
                                    <div className="grid grid-cols-3 gap-4">
                                        <div>
                                            <label className="block text-xs font-semibold text-zinc-600 mb-1">Speed (RPM)</label>
                                            <input type="number" required value={formData.coagulation_config.flash_mixing_speed} onChange={e => handleInputChange('coagulation_config', 'flash_mixing_speed', e.target.value)} className="w-full px-3 py-2 border border-zinc-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold text-zinc-600 mb-1">Duration (sec)</label>
                                            <input type="number" required value={formData.coagulation_config.flash_mixing_duration} onChange={e => handleInputChange('coagulation_config', 'flash_mixing_duration', e.target.value)} className="w-full px-3 py-2 border border-zinc-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold text-zinc-600 mb-1">Dispense Timing (sec)</label>
                                            <input type="number" required value={formData.coagulation_config.coagulant_dispense_timing} onChange={e => handleInputChange('coagulation_config', 'coagulant_dispense_timing', e.target.value)} className="w-full px-3 py-2 border border-zinc-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                                        </div>
                                    </div>
                                </div>

                                <div className="mb-6">
                                    <div className="flex justify-between items-center mb-3">
                                        <h4 className="text-sm font-semibold text-zinc-700">Slow Mixing Sequence</h4>
                                        <button type="button" onClick={addSequence} className="text-xs bg-blue-100 text-blue-700 font-bold px-3 py-1.5 rounded-lg hover:bg-blue-200 flex items-center gap-1">
                                            <Plus className="w-3.5 h-3.5" /> Add Sequence
                                        </button>
                                    </div>

                                    {formData.coagulation_config.slow_mixing_configurations.length === 0 ? (
                                        <p className="text-sm text-zinc-400 italic text-center p-4 border border-dashed border-zinc-300 rounded-lg">No sequences added.</p>
                                    ) : (
                                        <div className="space-y-3">
                                            {formData.coagulation_config.slow_mixing_configurations.map((seq, idx) => (
                                                <div key={idx} className="flex items-center gap-3 bg-white p-3 border border-zinc-200 rounded-lg shadow-sm">
                                                    <span className="text-xs font-bold bg-zinc-100 text-zinc-500 px-2 py-1 rounded">Seq {seq.sequence_no}</span>
                                                    <div className="flex-1 grid grid-cols-2 gap-3">
                                                        <input type="number" placeholder="RPM" required value={seq.rpm} onChange={e => handleSequenceChange(idx, 'rpm', e.target.value)} className="w-full px-3 py-1.5 text-sm border border-zinc-300 rounded focus:ring-2 focus:ring-blue-500 outline-none" />
                                                        <input type="number" placeholder="Duration (sec)" required value={seq.duration} onChange={e => handleSequenceChange(idx, 'duration', e.target.value)} className="w-full px-3 py-1.5 text-sm border border-zinc-300 rounded focus:ring-2 focus:ring-blue-500 outline-none" />
                                                    </div>
                                                    <button type="button" onClick={() => removeSequence(idx)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg">
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <h4 className="text-sm font-semibold text-zinc-700 mb-2">Settling Phase</h4>
                                    <div className="w-1/2">
                                        <label className="block text-xs font-semibold text-zinc-600 mb-1">Settling Time (sec)</label>
                                        <input type="number" required value={formData.coagulation_config.settling_duration} onChange={e => handleInputChange('coagulation_config', 'settling_duration', e.target.value)} className="w-full px-3 py-2 border border-zinc-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                                    </div>
                                </div>
                            </section>

                            {/* 3. Stock Solution Configuration */}
                            <section>
                                <h3 className="text-md font-bold text-zinc-800 border-b border-zinc-200 pb-2 mb-4">Stock Solution Configuration</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-semibold text-zinc-600 mb-1">Sample Volume (L)</label>
                                        <input type="number" required value={formData.concentration_config.sample_volume} onChange={e => handleInputChange('concentration_config', 'sample_volume', e.target.value)} className="w-full px-3 py-2 border border-zinc-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-zinc-600 mb-1">Stock Concentration (g/L)</label>
                                        <input type="number" required value={formData.concentration_config.stock_concentration} onChange={e => handleInputChange('concentration_config', 'stock_concentration', e.target.value)} className="w-full px-3 py-2 border border-zinc-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                                    </div>
                                </div>
                            </section>

                        </div>

                        {/* Modal Footer */}
                        <div className="px-6 py-4 border-t border-zinc-200 bg-zinc-50 flex justify-end gap-3">
                            <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-semibold text-zinc-600 hover:bg-zinc-200 rounded-lg transition-colors">
                                Cancel
                            </button>
                            <button onClick={handleSubmit} className="px-6 py-2 text-sm font-bold bg-blue-600 text-white hover:bg-blue-700 rounded-lg shadow-sm transition-colors">
                                Save Configuration
                            </button>
                        </div>

                    </div>
                </div>
            )}
        </>
    )
}

export default LabModal