import React from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

function TopSectionAnalytics({metrics, recentLogs}) {
    return (
        <>
            <div className="flex flex-col gap-4 p-5">

                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-zinc-800">Operations & Water Quality</h2>
                </div>

                {/* TOP ROW: 5 KPI Cards */}
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    {/* Card 1: Total Samples */}
                    <div className="bg-white rounded-xl p-5 shadow-sm border border-zinc-200 flex flex-col justify-between">
                        <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Total Samples Conducted</h3>
                        <p className="text-3xl font-black text-zinc-800">{metrics.kpis.totalConducted}</p>
                    </div>

                    {/* Card 2: Avg Raw Turbidity */}
                    <div className="bg-white rounded-xl p-5 shadow-sm border border-zinc-200 flex flex-col justify-between">
                        <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Avg Raw Turbidity</h3>
                        <div className="flex items-baseline gap-1">
                            <p className="text-3xl font-black text-zinc-800">{metrics.kpis.avgRawTurbidity}</p>
                            <span className="text-sm font-medium text-zinc-400">NTU</span>
                        </div>
                    </div>

                    {/* Card 3: Avg Treated Turbidity */}
                    <div className="bg-white rounded-xl p-5 shadow-sm border border-zinc-200 flex flex-col justify-between">
                        <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Avg Treated Result</h3>
                        <div className="flex items-baseline gap-1">
                            <p className="text-3xl font-black text-emerald-600">{metrics.kpis.avgTreatedTurbidity}</p>
                            <span className="text-sm font-medium text-emerald-600/70">NTU</span>
                        </div>
                    </div>

                    {/* Card 4: Avg Coagulant Dispensed */}
                    <div className="bg-white rounded-xl p-5 shadow-sm border border-zinc-200 flex flex-col justify-between">
                        <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Avg Coagulant / 1L</h3>
                        <div className="flex items-baseline gap-1">
                            <p className="text-3xl font-black text-blue-600">{metrics.kpis.avgCoagulantDispensed}</p>
                            <span className="text-sm font-medium text-blue-600/70">mL</span>
                        </div>
                    </div>

                    {/* Card 5: Compliance Rate */}
                    <div className="bg-zinc-900 rounded-xl p-5 shadow-sm border border-zinc-800 flex flex-col justify-between relative overflow-hidden">
                        <div className="absolute -right-4 -top-4 w-16 h-16 bg-emerald-500/20 rounded-full blur-2xl"></div>
                        <h3 className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-2 relative z-10">
                            PNSDW Compliance Rate <br /> (≤ 5.0 NTU)
                        </h3>
                        <div className="flex items-baseline gap-1 relative z-10">
                            <p className="text-3xl font-black text-white">{metrics.kpis.complianceRate}%</p>
                        </div>
                    </div>
                </div>

                {/* MIDDLE ROW: Charts[cite: 3] */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* Left: Turbidity Reduction Trend (Line Chart) */}
                    <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm border border-zinc-200">
                        <div className="flex justify-between items-end mb-6">
                            <div>
                                <h3 className="text-sm font-bold text-zinc-800">Turbidity Reduction Trend</h3>
                                <p className="text-xs text-zinc-500 mt-1">Raw incoming NTU vs. Final Validated NTU</p>
                            </div>
                            <div className="flex gap-4">
                                <div className="flex items-center gap-2">
                                    <span className="w-3 h-3 rounded bg-zinc-300"></span>
                                    <span className="text-xs font-medium text-zinc-600">Raw Water</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="w-3 h-3 rounded bg-emerald-500"></span>
                                    <span className="text-xs font-medium text-zinc-600">Treated</span>
                                </div>
                            </div>
                        </div>

                        <div className="h-64 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={metrics.trendChart} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f4f4f5" />
                                    <XAxis dataKey="sampleId" axisLine={false} tickLine={false} tick={{ fill: '#a1a1aa', fontSize: 11 }} dy={10} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#a1a1aa', fontSize: 11 }} />
                                    <Tooltip
                                        contentStyle={{ borderRadius: '8px', border: '1px solid #e4e4e7', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                                    />
                                    {/* Spiky Raw Data */}
                                    <Line type="monotone" dataKey="rawNTU" name="Raw NTU" stroke="#d4d4d8" strokeWidth={2} dot={{ r: 3, fill: '#d4d4d8' }} activeDot={{ r: 5 }} />
                                    {/* Stable Treated Data */}
                                    <Line type="monotone" dataKey="treatedNTU" name="Treated NTU" stroke="#10b981" strokeWidth={3} dot={{ r: 4, fill: '#10b981', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6 }} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Right: Raw Water Stressors */}
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-zinc-200">
                        <h3 className="text-sm font-bold text-zinc-800">Raw Water Stressors</h3>
                        <p className="text-xs text-zinc-500 mt-1 mb-6">Average baseline parameters</p>

                        <div className="flex flex-col gap-5 justify-center h-56">
                            {metrics.stressorsChart.map((item, idx) => (
                                <div key={idx} className="w-full">
                                    <div className="flex justify-between items-end mb-1">
                                        <span className="text-xs font-semibold text-zinc-600">{item.parameter}</span>
                                        <span className="text-sm font-bold text-zinc-800">{item.value}</span>
                                    </div>
                                    {/* Custom Tailwind progress bar to handle vastly different scales visually */}
                                    <div className="w-full bg-zinc-100 rounded-full h-2.5 overflow-hidden">
                                        <div
                                            className="bg-blue-500 h-2.5 rounded-full"
                                            style={{ width: `${(item.value / item.fullMark) * 100}%` }}
                                        ></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>

                {/* BOTTOM ROW: Treatment Log Table */}
                <div className="bg-white rounded-xl shadow-sm border border-zinc-200 overflow-hidden flex flex-col h-[400px]">

                    {/* Sticky Header Container */}
                    <div className="px-6 py-4 border-b border-zinc-100 bg-zinc-50/50 flex-none z-20 sticky top-0">
                        <h3 className="text-sm font-bold text-zinc-800">Recent Week's Treatment Logs</h3>
                    </div>

                    {/* Scrollable Table Area */}
                    <div className="overflow-x-auto overflow-y-auto flex-1 custom-scrollbar">
                        <table className="w-full text-left border-collapse relative">
                            <thead className="sticky top-0 z-10">
                                <tr className="bg-zinc-50 text-[11px] uppercase tracking-wider text-zinc-500 shadow-sm border-b border-zinc-200">
                                    <th className="px-6 py-3 font-semibold">Sample ID</th>
                                    <th className="px-6 py-3 font-semibold">Date & Time</th>
                                    <th className="px-6 py-3 font-semibold text-right">Raw NTU</th>
                                    <th className="px-6 py-3 font-semibold text-right">Dosage Treatment</th>
                                    <th className="px-6 py-3 font-semibold text-right">Volume Dispensed</th>
                                    <th className="px-6 py-3 font-semibold text-right">Resulting NTU</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm divide-y divide-zinc-100">
                                {recentLogs.length > 0 ? (
                                    recentLogs.map((row, idx) => (
                                        <tr
                                            key={idx}
                                            className={`hover:bg-zinc-50 transition-colors ${row.status === 'validation_failed' ? 'bg-red-50/30' : ''}`}
                                        >
                                            <td className="px-6 py-4 font-semibold text-zinc-900">{row.sampleId}</td>
                                            <td className="px-6 py-4 text-zinc-500 text-xs">{row.dateTime}</td>
                                            <td className="px-6 py-4 text-right font-medium text-zinc-600">{row.rawNTU}</td>
                                            <td className="px-6 py-4 text-right font-medium text-zinc-900">
                                                {row.status === 'validation_failed' ? (
                                                    <span className="text-red-500 text-xs font-bold uppercase">Failed</span>
                                                ) : (
                                                    row.dosageTreatment
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-right text-zinc-500">{row.volumeDispensed}</td>
                                            <td className="px-6 py-4 text-right font-bold text-emerald-600">{row.resultingNTU}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="px-6 py-8 text-center text-zinc-500">
                                            No treatment logs found for the past week.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </>
    )
}

export default TopSectionAnalytics