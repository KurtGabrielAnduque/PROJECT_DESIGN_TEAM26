import { ResponsiveContainer, LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Line, BarChart, Bar } from 'recharts';
import { Cell } from 'recharts';

function BottomSectionAnalytics({modelMetrics}) {
    return (
        <>
            <div className="flex flex-col gap-4 p-5">

                <div className="flex items-center justify-between border-t border-zinc-200 pt-10">
                    <div>
                        <h2 className="text-lg font-bold text-zinc-800">Model Reliability & Diagnostics</h2>
                        <p className="text-xs text-zinc-500 mt-1">AI performance and operator trust metrics</p>
                    </div>
                </div>

                {/* TOP ROW: 4 Model KPIs */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {/* Card 1: Zero-Touch Acceptance */}
                    <div className="bg-white rounded-xl p-5 shadow-sm border border-zinc-200 flex flex-col justify-between">
                        <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Zero-Touch Acceptance</h3>
                        <div className="flex items-baseline gap-1">
                            <p className="text-3xl font-black text-zinc-800">{modelMetrics.kpis.exactMatchRate}%</p>
                        </div>
                        <p className="text-[10px] text-zinc-400 mt-1">No operator override applied</p>
                    </div>

                    {/* Card 2: Average Override Delta */}
                    <div className="bg-white rounded-xl p-5 shadow-sm border border-zinc-200 flex flex-col justify-between">
                        <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Avg Override Delta</h3>
                        <div className="flex items-baseline gap-1">
                            <p className={`text-3xl font-black ${modelMetrics.kpis.avgOverrideDelta > 0 ? 'text-amber-500' : 'text-blue-500'}`}>
                                {modelMetrics.kpis.avgOverrideDelta > 0 ? '+' : ''}{modelMetrics.kpis.avgOverrideDelta}
                            </p>
                            <span className="text-sm font-medium text-zinc-400">mg/L</span>
                        </div>
                        <p className="text-[10px] text-zinc-400 mt-1">When adjustments are made</p>
                    </div>

                    {/* Card 3: First-Trial Success */}
                    <div className="bg-white rounded-xl p-5 shadow-sm border border-zinc-200 flex flex-col justify-between">
                        <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">First-Trial Success</h3>
                        <div className="flex items-baseline gap-1">
                            <p className="text-3xl font-black text-zinc-800">{modelMetrics.kpis.firstTrialSuccessRate}%</p>
                        </div>
                        <p className="text-[10px] text-zinc-400 mt-1">Validated on attempt #1</p>
                    </div>

                    {/* Card 4: Avg Trials Per Batch */}
                    <div className="bg-white rounded-xl p-5 shadow-sm border border-zinc-200 flex flex-col justify-between">
                        <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Efficiency Ratio</h3>
                        <div className="flex items-baseline gap-1">
                            <p className="text-3xl font-black text-indigo-600">{modelMetrics.kpis.avgTrialsPerBatch}</p>
                            <span className="text-sm font-medium text-indigo-400">trials/batch</span>
                        </div>
                        <p className="text-[10px] text-zinc-400 mt-1">Target is 1.0</p>
                    </div>
                </div>

                {/* MIDDLE ROW: AI Diagnostics Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* Left: Predicted vs Actual Line Chart */}
                    <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm border border-zinc-200">
                        <div className="flex justify-between items-end mb-6">
                            <div>
                                <h3 className="text-sm font-bold text-zinc-800">AI vs. Operator Baseline</h3>
                                <p className="text-xs text-zinc-500 mt-1">Predicted Dosage (AI) vs. Final Validated Dosage (Human)</p>
                            </div>
                            <div className="flex gap-4">
                                <div className="flex items-center gap-2">
                                    <span className="w-4 h-0 border-t-2 border-dashed border-blue-400"></span>
                                    <span className="text-xs font-medium text-zinc-600">AI Prediction</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="w-3 h-3 rounded bg-emerald-500"></span>
                                    <span className="text-xs font-medium text-zinc-600">Validated</span>
                                </div>
                            </div>
                        </div>

                        <div className="h-64 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={modelMetrics.predictedVsActualChart} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f4f4f5" />
                                    <XAxis dataKey="sampleId" axisLine={false} tickLine={false} tick={{ fill: '#a1a1aa', fontSize: 11 }} dy={10} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#a1a1aa', fontSize: 11 }} />
                                    <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e4e4e7', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} />

                                    {/* AI Prediction (Dotted Blue Line) */}
                                    <Line type="monotone" dataKey="predicted" name="Predicted (mg/L)" stroke="#60a5fa" strokeWidth={2} strokeDasharray="5 5" dot={{ r: 0 }} activeDot={{ r: 4 }} />

                                    {/* Operator Final Decision (Solid Green Line) */}
                                    <Line type="monotone" dataKey="actual" name="Validated (mg/L)" stroke="#10b981" strokeWidth={3} dot={{ r: 4, fill: '#10b981', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6 }} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Right: Override Distribution Histogram */}
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-zinc-200">
                        <h3 className="text-sm font-bold text-zinc-800">Override Distribution</h3>
                        <p className="text-xs text-zinc-500 mt-1 mb-6">How operators correct the AI</p>

                        <div className="h-64 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={modelMetrics.distributionChart} layout="vertical" margin={{ top: 0, right: 20, left: 0, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f4f4f5" />
                                    <XAxis type="number" hide />
                                    <YAxis dataKey="range" type="category" axisLine={false} tickLine={false} tick={{ fill: '#71717a', fontSize: 10 }} width={80} />
                                    <Tooltip cursor={{ fill: '#f4f4f5' }} contentStyle={{ borderRadius: '8px', border: '1px solid #e4e4e7' }} />
                                    <Bar dataKey="count" radius={[0, 4, 4, 0]} barSize={24}>
                                        {
                                            modelMetrics.distributionChart.map((entry, index) => {
                                                // Color coding: Blue for under-dosing, Green for exact, Amber for over-dosing
                                                let color = '#818cf8'; // Default Indigo
                                                if (entry.range.includes('Reduced')) color = '#60a5fa'; // Blue
                                                if (entry.range.includes('Exact')) color = '#34d399';   // Emerald
                                                if (entry.range.includes('Added')) color = '#fbbf24';   // Amber
                                                return <Cell key={`cell-${index}`} fill={color} />;
                                            })
                                        }
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                </div>
            </div>
        </>
    )
}

export default BottomSectionAnalytics