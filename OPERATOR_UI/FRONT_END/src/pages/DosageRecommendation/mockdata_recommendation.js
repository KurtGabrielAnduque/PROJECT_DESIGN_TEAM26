// upon press ng predict button eto yung ibabato na data ng backend
export const recommendationData = [
    {
        id: 1,
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
        // this must not be stored in the database because this will just serve as a signal that model is done predicting
        // or the data has arrived.

        analyzedAt: '2026-09-17T09:00:00',
    }
]


// This is the revised payload 
// PLEASE FIX THE APPLICATION OF IT IN THE FRONT END AFTER COMPLETING THE DBDIAGRAMIO architecture
// Concentration unit is g/L so backend must be responsible to compute how many mL to dispense base on current stock solution

export const finalDataForPredictionPage = [{
    id: 1,
    sampleRefNumber: "SMPL-0001",

    waterQuality: {
        turbidity: 200,
        ph: 6.0,
        conductivity: 100,
        temperature: 25,
        alkalinity: 40
    },

    recommendation: {
        id: 1,
        predictedDosage: 28,
        volumeToDispense: 14,

        concentrationConfiguration: {
            id: 1,
            sampleVolume: 1,
            stockConcentration: 2,
        }
    },

    status: "prediction_complete",
    analyzedAt: "2026-09-17T09:00:00"
}]