export const DateDataFormalizer = (data) => {
    if (!data || data.length === 0) return null;

    const tableData = [];

    data.forEach(item => {

        const successTrial = item.validation_trials.find(t => t.status === "success");

        let finalTreatedNTU = null;
        let volumeDispensed = null;

        if (successTrial) {
            finalTreatedNTU = successTrial.resultingWaterQuality.turbidity;
            volumeDispensed = successTrial.appliedVolume;
        }

        tableData.push({
            sampleId: item.sampleRefNumber,
            dateTime: new Date(item.validatedAt || Date.now()).toLocaleString('en-PH', {
                year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true,
            }),
            rawNTU: item.waterQuality.turbidity,
            dosageTreatment: item.finalValidatedDosage ? `${item.finalValidatedDosage} mg/L` : 'Failed',
            volumeDispensed: volumeDispensed ? `${volumeDispensed} mL` : 'N/A',
            resultingNTU: finalTreatedNTU ? `${finalTreatedNTU} NTU` : 'N/A',
            status: item.overallStatus
        });
    })

    return {
        tableData: tableData.reverse(),
    };

}