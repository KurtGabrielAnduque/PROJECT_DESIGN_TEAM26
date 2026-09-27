import React from 'react'
import Navbar from '../Components/Navbar'



// import Top Section Analytics (Water Quality Analytics)
import TopSectionAnalytics from './Components/TopSectionAnalytics';
import BottomSectionAnalytics from './Components/BottomSectionAnalytics';

// import the dashboarddata
import { DashBoardData } from './mockData'

// import the computation utility for the section 1
import { calculateOperationsMetrics } from '../../utils/Section1Computations';
import { calculateModelReliability } from '../../utils/Section2Computation';



function DashBoardPage() {
  // get the data and apply computations for first section of the analytics dashboard
  const metrics = calculateOperationsMetrics(DashBoardData);
  const modelMetrics = calculateModelReliability(DashBoardData);

  // filter the lastweeks activity for section treatment logs
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

  const recentLogs = metrics.tableData.filter(row => {
    const rowDate = new Date(row.dateTime);
    return rowDate >= oneWeekAgo;
  });

  return (
    <div className="bg-zinc-50 flex flex-row min-h-screen font-sans">
      {/*Header Part*/}
      <Navbar />

      {/*Main content BAR*/}
      <div className="flex-1 flex flex-col min-w-0 bg-zinc-50 min-h-screen font-sans">

        {/*Header Part*/}
        <div className="bg-white border-b border-zinc-200 px-8 py-1 pt-3">
          <h1 className="text-2xl font-bold text-zinc-800 mb-1">
            DashBoard and Analytics
          </h1>
          <p className="text-sm text-zinc-500 mb-4">
            Overview of OptiDose treatment and validation activity
          </p>
        </div>

        {/*Section 1*/}
        {/*Historical raw water readings, analysis and treatment resuls*/}
        <TopSectionAnalytics
          metrics={metrics}
          recentLogs={recentLogs}
        />

        {/*Section 2*/}
        {/*Model Reliability Analytics*/}
        <BottomSectionAnalytics modelMetrics={modelMetrics}/>

      </div>
    </div>
  )
}

export default DashBoardPage