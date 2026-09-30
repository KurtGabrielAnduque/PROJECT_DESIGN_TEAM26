// perform a GET request ot get the data from the analysis page or
// should I just simply store the result in the useState and this useState is location in the App.jsx
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

export const validationResultData = [
    {
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
                stockConcentration: 2
            }
        },

        validation: {
            id: 1,

            treatmentProcedureConfiguration: {
                id: 1,
                name: "Maynilad Standard Validation Procedure",
                version: "1.0",

                flashMixRpm: 185,
                flashMixDuration: 8,

                slowMixRpm: 30,
                slowMixDuration: 600,

                settlingDuration: 960
            },

            validationTrials: [
                {
                    id: 1,
                    trialNo: 1,

                    appliedDosage: 28,
                    appliedVolume: 14,

                    resultingWaterQuality: {
                        turbidity: 15.20,
                        ph: 6.0,
                        conductivity: 100,
                        temperature: 25,
                        alkalinity: 38
                    },

                    status: "failed"
                },

                {
                    id: 2,
                    trialNo: 2,

                    appliedDosage: 30,
                    appliedVolume: 15,

                    resultingWaterQuality: {
                        turbidity: 1.20,
                        ph: 5.9,
                        conductivity: 105,
                        temperature: 25,
                        alkalinity: 35
                    },

                    status: "passed"
                }
            ],

            finalValidatedDosage: 30,
            overallStatus: "validation_complete",
            validatedAt: "2026-09-17T09:45:00"
        }
    }
];

export const initialValidationData = {
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
            stockConcentration: 2
        }
    },

    validation: {
        id: 1,

        treatmentProcedureConfiguration: {
            id: 1,
            name: "Maynilad Standard Validation Procedure",
            version: "1.0",

            flashMixRpm: 185,
            flashMixDuration: 8,

            slowMixRpm: 30,
            slowMixDuration: 600,

            settlingDuration: 960
        },

        validationTrials: [],

        finalValidatedDosage: null,
        overallStatus: "in_progress",
        validatedAt: null
    }
};