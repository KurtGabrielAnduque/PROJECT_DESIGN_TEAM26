export const calculateModelReliability = (data) => {
    if (!data || data.length === 0) return null;

    let exactMatches = 0;
    let totalOverrides = 0;
    let overrideSum = 0;
    let firstTrialSuccess = 0;
    let totalTrialsRun = 0;

    const predictedVsActualChart = [];
    const overrideDistribution = {
        underDosedHeavy: 0, // > 5mg lower than AI
        underDosedSlight: 0, // 1-5mg lower
        exactMatch: 0,
        overDosedSlight: 0, // 1-5mg higher
        overDosedHeavy: 0 // > 5mg higher
    };

    data.forEach(item => {
        totalTrialsRun += item.validation_trials.length;

        // Check if first trial was a success
        if (item.validation_trials.length > 0 && item.validation_trials[0].status === 'success') {
            firstTrialSuccess++;
        }

        const predicted = item.recommendation.predictedDosage;
        const actual = item.finalValidatedDosage;

        if (actual !== null) { // Only calculate for completed batches
            predictedVsActualChart.push({
                sampleId: item.sampleRefNumber.replace('SMPL-', '#'),
                predicted: predicted,
                actual: actual
            });

            const delta = actual - predicted;

            if (delta === 0) {
                exactMatches++;
                overrideDistribution.exactMatch++;
            } else {
                totalOverrides++;
                overrideSum += delta;

                // Bucket the overrides for the distribution chart
                if (delta <= -5) overrideDistribution.underDosedHeavy++;
                else if (delta < 0) overrideDistribution.underDosedSlight++;
                else if (delta >= 5) overrideDistribution.overDosedHeavy++;
                else if (delta > 0) overrideDistribution.overDosedSlight++;
            }
        }
    });

    const completedBatches = data.filter(d => d.finalValidatedDosage !== null).length;

    return {
        kpis: {
            exactMatchRate: Math.round((exactMatches / completedBatches) * 100),
            avgOverrideDelta: totalOverrides > 0 ? (overrideSum / totalOverrides).toFixed(1) : 0,
            firstTrialSuccessRate: Math.round((firstTrialSuccess / completedBatches) * 100),
            avgTrialsPerBatch: (totalTrialsRun / completedBatches).toFixed(1)
        },
        predictedVsActualChart,
        distributionChart: [
            { range: 'Reduced >5mg', count: overrideDistribution.underDosedHeavy },
            { range: 'Reduced 1-5mg', count: overrideDistribution.underDosedSlight },
            { range: 'Exact Match', count: overrideDistribution.exactMatch },
            { range: 'Added 1-5mg', count: overrideDistribution.overDosedSlight },
            { range: 'Added >5mg', count: overrideDistribution.overDosedHeavy }
        ]
    };
};