// upon press ng predict button eto yung ibabato na data ng backend
export const recommendationData = [
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
            predictedDosage: 28,  // mg/L variable name = Change to predicted dosage
            dispensingInstructions: {
                stockConcentration: 2.0,  // mg/mL (Your 2g/L DIY mixture) // this must be fix in the settings
                volumeToDispense: 14.0    // mL (predictedDosage / stockConcentration) // this must be calculated in the backend
            },
        },

        status: 'prediction_complete', // waiting_sample and predicting

        analyzedAt: '2026-09-17T09:00:00',
    }
]