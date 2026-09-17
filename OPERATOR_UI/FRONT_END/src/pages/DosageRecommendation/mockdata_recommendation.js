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
            predictedDosage: 28,  // mg/L
        },

        status: 'prediction_complete', // waiting_sample and predicting

        analyzedAt: '2026-09-17T09:00:00',
    }
]