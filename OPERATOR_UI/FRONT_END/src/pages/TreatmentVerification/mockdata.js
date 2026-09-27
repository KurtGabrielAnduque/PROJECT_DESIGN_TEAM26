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
            dispensingInstructions: {
                stockConcentration: 2.0,  // mg/mL (Your 2g/L DIY mixture) | this must be fixed in the settings
                volumeToDispense: 14.0    // mL (predictedDosage / stockConcentration) | this must be calculated in the backend
            }
        },

        status: 'prediction_complete', // waiting_sample and predicting

        analyzedAt: '2026-09-17T09:00:00',
    }
]


export const validationResultData = [
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
            predictedDosage: 28,  // mg/L (The AI's original baseline)
            dispensingInstructions: {
                stockConcentration: 2.0,  
                volumeToDispense: 14.0    
            }
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
                appliedDosage: 25,       // Operator tested lower than prediction
                appliedVolume: 12.5,     // (25 / 2.0)
                resultingWaterQuality: {
                    turbidity: 15.20,    // NTU (Still too high)
                    ph: 6.0,
                    conductivity: 100,
                    temperature: 25,
                    alkalinity: 38,
                },
                status: "failed",
            },
            {
                trial_no: 2,
                appliedDosage: 30,       // Operator tested slightly higher
                appliedVolume: 15.0,     // (30 / 2.0)
                resultingWaterQuality: {
                    turbidity: 1.20,     // NTU (Success! Safe drinking levels)
                    ph: 5.9,
                    conductivity: 105,
                    temperature: 25,
                    alkalinity: 35,
                },
                status: "success",
            }
        ],

        // The critical hand-off variable for your Full-Scale Page
        finalValidatedDosage: 30,    
        
        overallStatus: "validation_complete", 
        validatedAt: '2026-09-17T09:45:00',
    }
]

export const dispenseResult = [{
    dispenseStatus: 'dispense_complete'
}]