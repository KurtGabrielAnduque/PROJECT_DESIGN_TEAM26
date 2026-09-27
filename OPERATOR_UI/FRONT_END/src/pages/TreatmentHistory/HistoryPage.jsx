import React, { useState } from 'react';
import Navbar from '../Components/Navbar';
import { HistoryData } from './mockData';
import { getTodayFormatted, getLocalDateString } from '../../utils/DateHandler';

function HistoryPage() {
  // State for the Search Bar
  const [searchTerm, setSearchTerm] = useState('');

  // date selector
  const [selectedDate, setSelectedDate] = useState(getTodayFormatted());

  const today = new Date('2026-09-27').toLocaleDateString('en-PH', {
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric'
  });

  // Filter by Search Term AND Date
  const filteredData = HistoryData.filter(item => {
    // 1. Check Search Term
    const matchesSearch =
      item.sampleRefNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.overallStatus.toLowerCase().includes(searchTerm.toLowerCase());

    // 2. Check Date Filter
    let matchesDate = true;
    if (selectedDate) {
      // Only filter if the item has a validatedAt property
      if (item.validatedAt) {
        const itemDate = getLocalDateString(item.validatedAt);
        matchesDate = (itemDate === selectedDate);
      } else {
        matchesDate = false; // Exclude pending items if a date is selected
      }
    }

    return matchesSearch && matchesDate;
  });

  return (
    <div className="bg-zinc-50 flex flex-row min-h-screen font-sans">
      <Navbar />

      {/* Main content BAR */}
      <div className="flex-1 flex flex-col min-w-0 bg-zinc-50 min-h-screen font-sans">

        {/* Header Part */}
        <div className="bg-white border-b border-zinc-200 px-8 py-4 pt-5">
          <h1 className="text-2xl font-bold text-zinc-800 mb-1">
            Water Treatment History
          </h1>
          <p className="text-sm text-zinc-500">
            Display or Search all the water treatment activities done with OptiDose
          </p>
        </div>

        {/* Page Content Padding */}
        <div className="p-8 flex flex-col gap-6 flex-1 overflow-hidden">

          {/* ======================================================== */}
          {/* TOP CONTROLS ROW (Matches Wireframe)                         */}
          {/* ======================================================== */}
          <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center">

            {/* 1. Date Today Widget */}
            <div className="bg-white border border-zinc-200 rounded-lg px-4 py-2.5 shadow-sm flex items-center gap-3 min-w-[200px]">
              <svg className="w-5 h-5 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <div>
                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Today's Date</p>
                <p className="text-sm font-semibold text-zinc-800">{today}</p>
              </div>
            </div>

            {/* Search Bar (Takes up remaining space) */}
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search by Sample ID (e.g., SMPL-0001) or Status..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-3 border border-zinc-200 rounded-lg text-sm text-zinc-900 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
            </div>

            {/* Filter By Date Button */}
            <div className="bg-white border border-zinc-200 rounded-lg px-3 py-3 shadow-sm flex items-center gap-2 hover:bg-zinc-50 transition-colors">
              <svg className="w-4 h-4 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              <label htmlFor="dateFilter" className="text-sm font-medium text-zinc-700 whitespace-nowrap cursor-pointer mr-1">
                Filter Date:
              </label>
              <input
                id="dateFilter"
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="text-sm font-bold text-slate-900 bg-transparent focus:outline-none cursor-pointer"
              />

              {/* Clear Date Button (Optional but highly recommended) */}
              {selectedDate && (
                <button
                  onClick={() => setSelectedDate('')}
                  className="ml-2 text-zinc-400 hover:text-red-500"
                  title="Clear Date Filter"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>

          {/* ======================================================== */}
          {/* MAIN TABLE CONTAINER                                     */}
          {/* ======================================================== */}
          <div className="bg-white border border-zinc-200 rounded-xl shadow-sm flex-1 flex flex-col overflow-hidden">
            <div className="overflow-x-auto overflow-y-auto flex-1 custom-scrollbar">
              <table className="w-full text-left border-collapse relative min-w-[800px]">
                <thead className="sticky top-0 z-10 bg-zinc-50 shadow-sm">
                  <tr className="text-[11px] uppercase tracking-wider text-zinc-500 border-b border-zinc-200">
                    <th className="px-6 py-4 font-semibold">Sample ID</th>
                    <th className="px-6 py-4 font-semibold">Date Validated</th>
                    <th className="px-6 py-4 font-semibold text-right">Raw Water (NTU)</th>
                    <th className="px-6 py-4 font-semibold text-center">AI Prediction</th>
                    <th className="px-6 py-4 font-semibold text-center">Validated Dose</th>
                    <th className="px-6 py-4 font-semibold text-right">Final Result</th>
                    <th className="px-6 py-4 font-semibold text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="text-sm divide-y divide-zinc-100">
                  {filteredData.length > 0 ? (
                    filteredData.map((row) => {
                      const isSuccess = row.overallStatus === 'validation_complete';

                      return (
                        <tr key={row.id} className="hover:bg-zinc-50/80 transition-colors">
                          {/* Sample ID */}
                          <td className="px-6 py-4 font-bold text-zinc-900">{row.sampleRefNumber}</td>

                          {/* Date Validated */}
                          <td className="px-6 py-4 text-zinc-500 text-xs">
                            {row.validatedAt ? new Date(row.validatedAt).toLocaleString('en-PH', {
                              year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true
                            }) : 'Pending'}
                          </td>

                          {/* Raw NTU */}
                          <td className="px-6 py-4 text-right font-medium text-zinc-600">
                            {row.waterQuality.turbidity}
                          </td>

                          {/* AI Prediction */}
                          <td className="px-6 py-4 text-center text-zinc-500">
                            {row.recommendation.predictedDosage} mg/L
                          </td>

                          {/* Validated Dose (Highlight if Operator Changed it) */}
                          <td className="px-6 py-4 text-center font-medium">
                            {row.finalValidatedDosage ? (
                              <span className={row.finalValidatedDosage !== row.recommendation.predictedDosage ? "text-amber-600 bg-amber-50 px-2 py-1 rounded" : "text-zinc-900"}>
                                {row.finalValidatedDosage} mg/L
                              </span>
                            ) : '-'}
                          </td>

                          {/* Final Result NTU */}
                          <td className="px-6 py-4 text-right font-bold text-emerald-600">
                            {isSuccess && row.validation_trials.length > 0
                              ? `${row.validation_trials[row.validation_trials.length - 1].resultingWaterQuality.turbidity} NTU`
                              : '-'}
                          </td>

                          {/* Status Badge */}
                          <td className="px-6 py-4 text-center">
                            <span className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full ${isSuccess ? 'bg-emerald-100 text-emerald-700' :
                              row.overallStatus === 'validation_failed' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                              }`}>
                              {row.overallStatus.replace('_', ' ')}
                            </span>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="7" className="px-6 py-12 text-center">
                        <div className="flex flex-col items-center justify-center text-zinc-400">
                          <svg className="w-12 h-12 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                          </svg>
                          <p className="text-base font-medium text-zinc-600">No records found</p>
                          <p className="text-sm">We couldn't find anything matching "{searchTerm}"</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Simple Pagination Footer */}
            <div className="bg-zinc-50 border-t border-zinc-200 px-6 py-3 flex items-center justify-between text-xs text-zinc-500">
              <span>Showing {filteredData.length} entries</span>
              <div className="flex gap-2">
                <button className="px-3 py-1 bg-white border border-zinc-200 rounded hover:bg-zinc-100 disabled:opacity-50">Prev</button>
                <button className="px-3 py-1 bg-white border border-zinc-200 rounded hover:bg-zinc-100 disabled:opacity-50">Next</button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default HistoryPage;