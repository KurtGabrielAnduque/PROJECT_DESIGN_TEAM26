export const calculateOperationsMetrics = (data) => {
    if (!data || data.length === 0) return null;

    const totalSamples = data.length;
    let totalRawTurbidity = 0;
    
    // For successful trials
    let totalTreatedTurbidity = 0;
    let totalCoagulantDispensed = 0;
    let successfulTrialsCount = 0;
    let compliantSamplesCount = 0; // Samples <= 5 NTU

    // For Stressor Averages
    let totalPh = 0;
    let totalAlkalinity = 0;
    let totalTemp = 0;
    let totalConductivity = 0;

    const trendChart = [];
    const tableData = [];

    data.forEach(item => {
        // 1. Aggregating Raw Water Stressors
        totalRawTurbidity += item.waterQuality.turbidity;
        totalPh += item.waterQuality.ph;
        totalAlkalinity += item.waterQuality.alkalinity;
        totalTemp += item.waterQuality.temperature;
        totalConductivity += item.waterQuality.conductivity;

        // 2. Processing Validation Outcomes
        const successTrial = item.validation_trials.find(t => t.status === "success");
        
        let finalTreatedNTU = null;
        let volumeDispensed = null;

        if (successTrial) {
            finalTreatedNTU = successTrial.resultingWaterQuality.turbidity;
            volumeDispensed = successTrial.appliedVolume;

            totalTreatedTurbidity += finalTreatedNTU;
            totalCoagulantDispensed += volumeDispensed;
            successfulTrialsCount++;

            // Check PNSDW Compliance (<= 5 NTU)
            if (finalTreatedNTU <= 5.0) {
                compliantSamplesCount++;
            }
        }

        // 3. Building Line Chart Data
        trendChart.push({
            sampleId: item.sampleRefNumber.replace('SMPL-', '#'),
            rawNTU: item.waterQuality.turbidity,
            treatedNTU: finalTreatedNTU // Will be null if the batch failed completely
        });

        // 4. Building Data Table Rows
        tableData.push({
            sampleId: item.sampleRefNumber,
            dateTime: new Date(item.validatedAt || Date.now()).toLocaleString('en-PH', { 
                year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12:true, 
            }),
            rawNTU: item.waterQuality.turbidity,
            dosageTreatment: item.finalValidatedDosage ? `${item.finalValidatedDosage} mg/L` : 'Failed',
            volumeDispensed: volumeDispensed ? `${volumeDispensed} mL` : 'N/A',
            resultingNTU: finalTreatedNTU ? `${finalTreatedNTU} NTU` : 'N/A',
            status: item.overallStatus
        });
    });

    // Final Math Calculations
    const avgRawTurbidity = (totalRawTurbidity / totalSamples).toFixed(1);
    const avgTreatedTurbidity = successfulTrialsCount > 0 
        ? (totalTreatedTurbidity / successfulTrialsCount).toFixed(2) 
        : "N/A";
    const avgCoagulantPerSample = successfulTrialsCount > 0 
        ? (totalCoagulantDispensed / successfulTrialsCount).toFixed(1) 
        : "N/A";
    const complianceRate = successfulTrialsCount > 0 
        ? Math.round((compliantSamplesCount / successfulTrialsCount) * 100) 
        : 0;

    return {
        // Top Row: 5 KPIs
        kpis: {
            totalConducted: totalSamples,
            avgRawTurbidity: avgRawTurbidity,
            avgTreatedTurbidity: avgTreatedTurbidity,
            avgCoagulantDispensed: avgCoagulantPerSample,
            complianceRate: complianceRate
        },
        // Middle Left: Line Chart
        trendChart,
        // Middle Right: Bar Chart (Averages to show baseline stressors)
        stressorsChart: [
            { parameter: 'pH', value: (totalPh / totalSamples).toFixed(1), fullMark: 14 },
            { parameter: 'Alkalinity', value: Math.round(totalAlkalinity / totalSamples), fullMark: 100 },
            { parameter: 'Temp (°C)', value: (totalTemp / totalSamples).toFixed(1), fullMark: 40 },
            { parameter: 'Conductivity', value: Math.round(totalConductivity / totalSamples), fullMark: 1000 }
        ],
        // Bottom Row: Table
        tableData: tableData.reverse() // Reverse so newest samples are at the top
    };
};