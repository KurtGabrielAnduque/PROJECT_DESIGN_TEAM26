// upon press ng predict button eto yung ibabato na data ng backend
export const dataForVerfication = [
    {
        sampleId: 1,
        sampleRefNumber: 'SMPL-0001',

        waterQuality: {
            turbidity: 200,       // NTU
            ph: 6.0,
            conductivity: 100,    // µS/cm
            temperature: 25,      // °C
            alkalinity: 40,       // mg/L
        },

        recommendation: {
            predictedDosage: 28,  // mg/L
        },

        status: 'prediction_complete', // waiting_sample and predicting

        analyzedAt: '2026-09-17T09:00:00',
    }
]


export const validationResultData = [{
    sampleId: 1,
    sampleRefNumber: 'SMPL-0001',

    waterQuality: {
        turbidity: 200,       // NTU
        ph: 6.0,
        conductivity: 100,    // µS/cm
        temperature: 25,      // °C
        alkalinity: 40,       // mg/L
    },

    recommendation: {
        predictedDosage: 28,  // mg/L
    },

    settings: {
        flash_mix_rpm: 120,
        flash_mix_duration: 60,
        slow_mix_rpm: 30,
        slow_mix_duration: 600,
        settling_duration: 900
    },

    validation_trials: [
        {
            trial_no: 1,
            dose: 25,
            resulting_turbidity: 1.20,
            resultingWaterQuality: {
                turbidity: 200,       // NTU
                ph: 6.0,
                conductivity: 100,    // µS/cm
                temperature: 25,      // °C
                alkalinity: 40,       // mg/L
            },
            status: "failed"
        }
    ],

}]

export const dispenseResult =[{
    dispenseStatus : 'dispense_complete'
}]