import React from 'react'

import { Activity, Timer, Droplets, FlaskConical} from 'lucide-react';

function LabSettingsDisplay({activeSettings}) {
    return (
        <>

            {/* DISPLAY STATE */}
            <div className="mx-auto w-full">
                {/* Analysis Configuration Card */}
                <div className="bg-white border border-zinc-200 p-6 shadow-sm">
                    <div className="mb-6">
                        <h2 className="text-lg font-bold text-zinc-900 flex items-center gap-2">
                            <Activity className="w-5 h-5 text-blue-500" /> Analysis Configuration
                        </h2>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="bg-zinc-50 border border-zinc-100 rounded-xl p-4">
                            <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1">Stirring Speed</p>
                            <div className="flex items-end gap-1">
                                <span className="text-3xl font-bold text-zinc-900">{activeSettings.analysis_config.stirring_speed}</span>
                                <span className="text-sm font-medium text-zinc-500 mb-1">RPM</span>
                            </div>
                        </div>
                        <div className="bg-zinc-50 border border-zinc-100 rounded-xl p-4">
                            <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1">Stirring Duration</p>
                            <div className="flex items-end gap-1">
                                <span className="text-3xl font-bold text-zinc-900">{activeSettings.analysis_config.stirring_duration}</span>
                                <span className="text-sm font-medium text-zinc-500 mb-1">sec</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Coagulation Configuration Card */}
                <div className="bg-white border border-zinc-200 p-6 shadow-sm">
                    <div className="mb-6">
                        <h2 className="text-lg font-bold text-zinc-900 flex items-center gap-2">
                            <Droplets className="w-5 h-5 text-blue-500" /> Coagulation Process
                        </h2>
                    </div>

                    <h3 className="text-sm font-semibold text-zinc-800 mb-3 border-b border-zinc-100 pb-2">Flash Mixing Phase</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                        <div className="bg-zinc-50 border border-zinc-100 rounded-xl p-4">
                            <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1">Speed</p>
                            <div className="flex items-end gap-1">
                                <span className="text-2xl font-bold text-zinc-900">{activeSettings.coagulation_config.flash_mixing_speed}</span>
                                <span className="text-xs font-medium text-zinc-500 mb-1">RPM</span>
                            </div>
                        </div>
                        <div className="bg-zinc-50 border border-zinc-100 rounded-xl p-4">
                            <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1">Duration</p>
                            <div className="flex items-end gap-1">
                                <span className="text-2xl font-bold text-zinc-900">{activeSettings.coagulation_config.flash_mixing_duration}</span>
                                <span className="text-xs font-medium text-zinc-500 mb-1">sec</span>
                            </div>
                        </div>
                        <div className="bg-zinc-50 border border-zinc-100 rounded-xl p-4">
                            <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1">Dispense Timing</p>
                            <div className="flex items-end gap-1">
                                <span className="text-2xl font-bold text-zinc-900">{activeSettings.coagulation_config.coagulant_dispense_timing}</span>
                                <span className="text-xs font-medium text-zinc-500 mb-1">sec</span>
                            </div>
                        </div>
                    </div>

                    <h3 className="text-sm font-semibold text-zinc-800 mb-3 border-b border-zinc-100 pb-2">Slow Mixing Sequence</h3>
                    <div className="overflow-hidden border border-zinc-200 rounded-xl mb-8">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-zinc-50 border-b border-zinc-200">
                                <tr>
                                    <th className="px-4 py-3 font-semibold text-zinc-700">Sequence No.</th>
                                    <th className="px-4 py-3 font-semibold text-zinc-700">Speed (RPM)</th>
                                    <th className="px-4 py-3 font-semibold text-zinc-700">Duration (sec)</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-100">
                                {activeSettings.coagulation_config.slow_mixing_configurations.map((step) => (
                                    <tr key={step.sequence_no} className="hover:bg-zinc-50/50">
                                        <td className="px-4 py-3 font-medium text-zinc-900">Step {step.sequence_no}</td>
                                        <td className="px-4 py-3 text-zinc-600">{step.rpm}</td>
                                        <td className="px-4 py-3 text-zinc-600">{step.duration}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <h3 className="text-sm font-semibold text-zinc-800 mb-3 border-b border-zinc-100 pb-2">Settling Phase</h3>
                    <div className="bg-zinc-50 border border-zinc-100 rounded-xl p-4 max-w-sm">
                        <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1 flex items-center gap-1">
                            <Timer className="w-3.5 h-3.5" /> Duration
                        </p>
                        <div className="flex items-end gap-1">
                            <span className="text-2xl font-bold text-zinc-900">{activeSettings.coagulation_config.settling_duration}</span>
                            <span className="text-xs font-medium text-zinc-500 mb-1">sec</span>
                        </div>
                    </div>
                </div>

                {/* Concentration Configuration Card */}
                <div className="bg-white border border-zinc-200 p-6 shadow-sm">
                    <div className="mb-6">
                        <h2 className="text-lg font-bold text-zinc-900 flex items-center gap-2">
                            <FlaskConical className="w-5 h-5 text-blue-500" /> Stock Solution
                        </h2>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="bg-zinc-50 border border-zinc-100 rounded-xl p-4">
                            <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1">Sample Volume</p>
                            <div className="flex items-end gap-1">
                                <span className="text-3xl font-bold text-zinc-900">{activeSettings.concentration_config.sample_volume}</span>
                                <span className="text-sm font-medium text-zinc-500 mb-1">L</span>
                            </div>
                        </div>
                        <div className="bg-zinc-50 border border-zinc-100 rounded-xl p-4">
                            <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1">Stock Concentration</p>
                            <div className="flex items-end gap-1">
                                <span className="text-3xl font-bold text-zinc-900">{activeSettings.concentration_config.stock_concentration}</span>
                                <span className="text-sm font-medium text-zinc-500 mb-1">g/L</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default LabSettingsDisplay