// GET request

export const HistoryData = [
    // =========================================================
    // SAMPLE 0001
    // =========================================================
    {
        id: 1,
        sampleRefNumber: "SMPL-0001",
        waterQuality: {
            turbidity: 200,
            ph: 6.0,
            conductivity: 100,
            temperature: 25,
            alkalinity: 40,
        },
        recommendation: {
            predictedDosage: 28,
            dispensingInstructions: {
                stockConcentration: 2.0,
                volumeToDispense: 14.0,
            },
        },
        settings: {
            flash_mix_rpm: 120,
            flash_mix_duration: 60,
            slow_mix_rpm: 30,
            slow_mix_duration: 600,
            settling_duration: 900,
        },
        validation_trials: [
            {
                trial_no: 1,
                appliedDosage: 25,
                appliedVolume: 12.5,
                resultingWaterQuality: {
                    turbidity: 15.20,
                    ph: 6.0,
                    conductivity: 100,
                    temperature: 25,
                    alkalinity: 38,
                },
                status: "failed",
            },
            {
                trial_no: 2,
                appliedDosage: 30,
                appliedVolume: 15.0,
                resultingWaterQuality: {
                    turbidity: 1.20,
                    ph: 5.9,
                    conductivity: 105,
                    temperature: 25,
                    alkalinity: 35,
                },
                status: "success",
            },
        ],
        finalValidatedDosage: 30,
        overallStatus: "validation_complete",
        validatedAt: "2026-09-10T09:45:00",
    },

    // =========================================================
    // SAMPLE 0002
    // =========================================================
    {
        id: 2,
        sampleRefNumber: "SMPL-0002",
        waterQuality: {
            turbidity: 300,
            ph: 6.2,
            conductivity: 500,
            temperature: 25,
            alkalinity: 40,
        },
        recommendation: {
            predictedDosage: 40,
            dispensingInstructions: {
                stockConcentration: 2.0,
                volumeToDispense: 20.0,
            },
        },
        settings: {
            flash_mix_rpm: 120,
            flash_mix_duration: 60,
            slow_mix_rpm: 30,
            slow_mix_duration: 600,
            settling_duration: 900,
        },
        validation_trials: [
            {
                trial_no: 1,
                appliedDosage: 40,
                appliedVolume: 20.0,
                resultingWaterQuality: {
                    turbidity: 1.20,
                    ph: 6.0,
                    conductivity: 510,
                    temperature: 25,
                    alkalinity: 40,
                },
                status: "success",
            },
        ],
        finalValidatedDosage: 40,
        overallStatus: "validation_complete",
        validatedAt: "2026-09-11T09:45:00",
    },

    // =========================================================
    // SAMPLE 0003
    // =========================================================
    {
        id: 3,
        sampleRefNumber: "SMPL-0003",
        waterQuality: {
            turbidity: 145,
            ph: 6.5,
            conductivity: 180,
            temperature: 26,
            alkalinity: 45,
        },
        recommendation: {
            predictedDosage: 24,
            dispensingInstructions: {
                stockConcentration: 2.0,
                volumeToDispense: 12.0,
            },
        },
        settings: {
            flash_mix_rpm: 120,
            flash_mix_duration: 60,
            slow_mix_rpm: 30,
            slow_mix_duration: 600,
            settling_duration: 900,
        },
        validation_trials: [
            {
                trial_no: 1,
                appliedDosage: 24,
                appliedVolume: 12.0,
                resultingWaterQuality: {
                    turbidity: 8.40,
                    ph: 6.4,
                    conductivity: 185,
                    temperature: 26,
                    alkalinity: 43,
                },
                status: "failed",
            },
            {
                trial_no: 2,
                appliedDosage: 27,
                appliedVolume: 13.5,
                resultingWaterQuality: {
                    turbidity: 2.10,
                    ph: 6.3,
                    conductivity: 190,
                    temperature: 26,
                    alkalinity: 42,
                },
                status: "success",
            },
        ],
        finalValidatedDosage: 27,
        overallStatus: "validation_complete",
        validatedAt: "2026-09-12T10:20:00",
    },

    // =========================================================
    // SAMPLE 0004
    // =========================================================
    {
        id: 4,
        sampleRefNumber: "SMPL-0004",
        waterQuality: {
            turbidity: 85,
            ph: 7.0,
            conductivity: 220,
            temperature: 27,
            alkalinity: 50,
        },
        recommendation: {
            predictedDosage: 18,
            dispensingInstructions: {
                stockConcentration: 2.0,
                volumeToDispense: 9.0,
            },
        },
        settings: {
            flash_mix_rpm: 120,
            flash_mix_duration: 60,
            slow_mix_rpm: 30,
            slow_mix_duration: 600,
            settling_duration: 900,
        },
        validation_trials: [
            {
                trial_no: 1,
                appliedDosage: 18,
                appliedVolume: 9.0,
                resultingWaterQuality: {
                    turbidity: 0.85,
                    ph: 6.9,
                    conductivity: 225,
                    temperature: 27,
                    alkalinity: 48,
                },
                status: "success",
            },
        ],
        finalValidatedDosage: 18,
        overallStatus: "validation_complete",
        validatedAt: "2026-09-13T08:30:00",
    },

    // =========================================================
    // SAMPLE 0005
    // =========================================================
    {
        id: 5,
        sampleRefNumber: "SMPL-0005",
        waterQuality: {
            turbidity: 420,
            ph: 5.8,
            conductivity: 620,
            temperature: 24,
            alkalinity: 35,
        },
        recommendation: {
            predictedDosage: 48,
            dispensingInstructions: {
                stockConcentration: 2.0,
                volumeToDispense: 24.0,
            },
        },
        settings: {
            flash_mix_rpm: 120,
            flash_mix_duration: 60,
            slow_mix_rpm: 30,
            slow_mix_duration: 600,
            settling_duration: 900,
        },
        validation_trials: [
            {
                trial_no: 1,
                appliedDosage: 48,
                appliedVolume: 24.0,
                resultingWaterQuality: {
                    turbidity: 9.80,
                    ph: 5.7,
                    conductivity: 630,
                    temperature: 24,
                    alkalinity: 31,
                },
                status: "failed",
            },
            {
                trial_no: 2,
                appliedDosage: 52,
                appliedVolume: 26.0,
                resultingWaterQuality: {
                    turbidity: 6.40,
                    ph: 5.6,
                    conductivity: 640,
                    temperature: 24,
                    alkalinity: 30,
                },
                status: "failed",
            },{
                trial_no: 3,
                appliedDosage: 72,
                appliedVolume: 36.0,
                resultingWaterQuality: {
                    turbidity: 2.40,
                    ph: 5.6,
                    conductivity: 640,
                    temperature: 24,
                    alkalinity: 30,
                },
                status: "success",
            },

        ],
        finalValidatedDosage: 72,
        overallStatus: "validation_complete",
        validatedAt: "2026-09-14T11:15:00",
    },

    // =========================================================
    // SAMPLE 0006
    // =========================================================
    {
        id: 6,
        sampleRefNumber: "SMPL-0006",
        waterQuality: {
            turbidity: 250,
            ph: 6.8,
            conductivity: 310,
            temperature: 25,
            alkalinity: 48,
        },
        recommendation: {
            predictedDosage: 32,
            dispensingInstructions: {
                stockConcentration: 2.0,
                volumeToDispense: 16.0,
            },
        },
        settings: {
            flash_mix_rpm: 120,
            flash_mix_duration: 60,
            slow_mix_rpm: 30,
            slow_mix_duration: 600,
            settling_duration: 900,
        },
        validation_trials: [
            {
                trial_no: 1,
                appliedDosage: 32,
                appliedVolume: 16.0,
                resultingWaterQuality: {
                    turbidity: 7.20,
                    ph: 6.7,
                    conductivity: 320,
                    temperature: 25,
                    alkalinity: 45,
                },
                status: "failed",
            },
            {
                trial_no: 2,
                appliedDosage: 36,
                appliedVolume: 18.0,
                resultingWaterQuality: {
                    turbidity: 1.70,
                    ph: 6.6,
                    conductivity: 325,
                    temperature: 25,
                    alkalinity: 44,
                },
                status: "success",
            },
        ],
        finalValidatedDosage: 36,
        overallStatus: "validation_complete",
        validatedAt: "2026-09-15T14:10:00",
    },

    // =========================================================
    // SAMPLE 0007
    // =========================================================
    {
        id: 7,
        sampleRefNumber: "SMPL-0007",
        waterQuality: {
            turbidity: 110,
            ph: 7.1,
            conductivity: 260,
            temperature: 26,
            alkalinity: 52,
        },
        recommendation: {
            predictedDosage: 20,
            dispensingInstructions: {
                stockConcentration: 2.0,
                volumeToDispense: 10.0,
            },
        },
        settings: {
            flash_mix_rpm: 120,
            flash_mix_duration: 60,
            slow_mix_rpm: 30,
            slow_mix_duration: 600,
            settling_duration: 900,
        },
        validation_trials: [
            {
                trial_no: 1,
                appliedDosage: 20,
                appliedVolume: 10.0,
                resultingWaterQuality: {
                    turbidity: 1.05,
                    ph: 7.0,
                    conductivity: 265,
                    temperature: 26,
                    alkalinity: 50,
                },
                status: "success",
            },
        ],
        finalValidatedDosage: 20,
        overallStatus: "validation_complete",
        validatedAt: "2026-09-16T09:05:00",
    },

    // =========================================================
    // SAMPLE 0009
    // =========================================================
    {
        id: 8,
        sampleRefNumber: "SMPL-0009",
        waterQuality: {
            turbidity: 180,
            ph: 6.7,
            conductivity: 280,
            temperature: 25,
            alkalinity: 46,
        },
        recommendation: {
            predictedDosage: 26,
            dispensingInstructions: {
                stockConcentration: 2.0,
                volumeToDispense: 13.0,
            },
        },
        settings: {
            flash_mix_rpm: 120,
            flash_mix_duration: 60,
            slow_mix_rpm: 30,
            slow_mix_duration: 600,
            settling_duration: 900,
        },
        validation_trials: [
            {
                trial_no: 1,
                appliedDosage: 26,
                appliedVolume: 13.0,
                resultingWaterQuality: {
                    turbidity: 2.80,
                    ph: 6.6,
                    conductivity: 290,
                    temperature: 25,
                    alkalinity: 44,
                },
                status: "success",
            },
        ],
        finalValidatedDosage: 26,
        overallStatus: "validation_complete",
        validatedAt: "2026-09-17T08:40:00",
    },

    // =========================================================
    // SAMPLE 0010
    // =========================================================
    {
        id: 9,
        sampleRefNumber: "SMPL-0010",
        waterQuality: {
            turbidity: 360,
            ph: 6.1,
            conductivity: 450,
            temperature: 24,
            alkalinity: 39,
        },
        recommendation: {
            predictedDosage: 42,
            dispensingInstructions: {
                stockConcentration: 2.0,
                volumeToDispense: 21.0,
            },
        },
        settings: {
            flash_mix_rpm: 120,
            flash_mix_duration: 60,
            slow_mix_rpm: 30,
            slow_mix_duration: 600,
            settling_duration: 900,
        },
        validation_trials: [
            {
                trial_no: 1,
                appliedDosage: 42,
                appliedVolume: 21.0,
                resultingWaterQuality: {
                    turbidity: 10.20,
                    ph: 6.0,
                    conductivity: 460,
                    temperature: 24,
                    alkalinity: 37,
                },
                status: "failed",
            },
            {
                trial_no: 2,
                appliedDosage: 46,
                appliedVolume: 23.0,
                resultingWaterQuality: {
                    turbidity: 2.40,
                    ph: 5.9,
                    conductivity: 470,
                    temperature: 24,
                    alkalinity: 36,
                },
                status: "success",
            },
        ],
        finalValidatedDosage: 46,
        overallStatus: "validation_complete",
        validatedAt: "2026-09-18T13:20:00",
    },

    // =========================================================
    // SAMPLE 0011
    // =========================================================
    {
        id: 10,
        sampleRefNumber: "SMPL-0011",
        waterQuality: {
            turbidity: 95,
            ph: 7.2,
            conductivity: 190,
            temperature: 27,
            alkalinity: 55,
        },
        recommendation: {
            predictedDosage: 16,
            dispensingInstructions: {
                stockConcentration: 2.0,
                volumeToDispense: 8.0,
            },
        },
        settings: {
            flash_mix_rpm: 120,
            flash_mix_duration: 60,
            slow_mix_rpm: 30,
            slow_mix_duration: 600,
            settling_duration: 900,
        },
        validation_trials: [
            {
                trial_no: 1,
                appliedDosage: 16,
                appliedVolume: 8.0,
                resultingWaterQuality: {
                    turbidity: 0.72,
                    ph: 7.1,
                    conductivity: 195,
                    temperature: 27,
                    alkalinity: 53,
                },
                status: "success",
            },
        ],
        finalValidatedDosage: 16,
        overallStatus: "validation_complete",
        validatedAt: "2026-09-19T08:15:00",
    },

    // =========================================================
    // SAMPLE 0012
    // =========================================================
    {
        id: 11,
        sampleRefNumber: "SMPL-0012",
        waterQuality: {
            turbidity: 225,
            ph: 6.4,
            conductivity: 340,
            temperature: 26,
            alkalinity: 44,
        },
        recommendation: {
            predictedDosage: 30,
            dispensingInstructions: {
                stockConcentration: 2.0,
                volumeToDispense: 15.0,
            },
        },
        settings: {
            flash_mix_rpm: 120,
            flash_mix_duration: 60,
            slow_mix_rpm: 30,
            slow_mix_duration: 600,
            settling_duration: 900,
        },
        validation_trials: [
            {
                trial_no: 1,
                appliedDosage: 30,
                appliedVolume: 15.0,
                resultingWaterQuality: {
                    turbidity: 5.90,
                    ph: 6.3,
                    conductivity: 350,
                    temperature: 26,
                    alkalinity: 41,
                },
                status: "failed",
            },
            {
                trial_no: 2,
                appliedDosage: 34,
                appliedVolume: 17.0,
                resultingWaterQuality: {
                    turbidity: 1.45,
                    ph: 6.2,
                    conductivity: 355,
                    temperature: 26,
                    alkalinity: 40,
                },
                status: "success",
            },
        ],
        finalValidatedDosage: 34,
        overallStatus: "validation_complete",
        validatedAt: "2026-09-20T10:30:00",
    },

    // =========================================================
    // SAMPLE 0013
    // =========================================================
    {
        id: 12,
        sampleRefNumber: "SMPL-0013",
        waterQuality: {
            turbidity: 410,
            ph: 5.9,
            conductivity: 580,
            temperature: 24,
            alkalinity: 36,
        },
        recommendation: {
            predictedDosage: 50,
            dispensingInstructions: {
                stockConcentration: 2.0,
                volumeToDispense: 25.0,
            },
        },
        settings: {
            flash_mix_rpm: 120,
            flash_mix_duration: 60,
            slow_mix_rpm: 30,
            slow_mix_duration: 600,
            settling_duration: 900,
        },
        validation_trials: [
            {
                trial_no: 1,
                appliedDosage: 50,
                appliedVolume: 25.0,
                resultingWaterQuality: {
                    turbidity: 7.80,
                    ph: 5.8,
                    conductivity: 590,
                    temperature: 24,
                    alkalinity: 32,
                },
                status: "failed",
            },{
                trial_no: 2,
                appliedDosage: 60,
                appliedVolume: 30.0,
                resultingWaterQuality: {
                    turbidity: 4.98,
                    ph: 5.8,
                    conductivity: 590,
                    temperature: 24,
                    alkalinity: 32,
                },
                status: "success",
            },
        ],
        finalValidatedDosage: 60,
        overallStatus: "validation_complete",
        validatedAt: "2026-09-21T14:00:00",
    },

    // =========================================================
    // SAMPLE 0014
    // =========================================================
    {
        id: 13,
        sampleRefNumber: "SMPL-0014",
        waterQuality: {
            turbidity: 130,
            ph: 6.9,
            conductivity: 240,
            temperature: 26,
            alkalinity: 49,
        },
        recommendation: {
            predictedDosage: 22,
            dispensingInstructions: {
                stockConcentration: 2.0,
                volumeToDispense: 11.0,
            },
        },
        settings: {
            flash_mix_rpm: 120,
            flash_mix_duration: 60,
            slow_mix_rpm: 30,
            slow_mix_duration: 600,
            settling_duration: 900,
        },
        validation_trials: [
            {
                trial_no: 1,
                appliedDosage: 22,
                appliedVolume: 11.0,
                resultingWaterQuality: {
                    turbidity: 1.60,
                    ph: 6.8,
                    conductivity: 250,
                    temperature: 26,
                    alkalinity: 47,
                },
                status: "success",
            },
        ],
        finalValidatedDosage: 22,
        overallStatus: "validation_complete",
        validatedAt: "2026-09-22T08:50:00",
    },

    // =========================================================
    // SAMPLE 0015
    // =========================================================
    {
        id: 14,
        sampleRefNumber: "SMPL-0015",
        waterQuality: {
            turbidity: 190,
            ph: 6.6,
            conductivity: 300,
            temperature: 25,
            alkalinity: 47,
        },
        recommendation: {
            predictedDosage: 27,
            dispensingInstructions: {
                stockConcentration: 2.0,
                volumeToDispense: 13.5,
            },
        },
        settings: {
            flash_mix_rpm: 120,
            flash_mix_duration: 60,
            slow_mix_rpm: 30,
            slow_mix_duration: 600,
            settling_duration: 900,
        },
        validation_trials: [
            {
                trial_no: 1,
                appliedDosage: 27,
                appliedVolume: 13.5,
                resultingWaterQuality: {
                    turbidity: 2.30,
                    ph: 6.5,
                    conductivity: 310,
                    temperature: 25,
                    alkalinity: 45,
                },
                status: "success",
            },
        ],
        finalValidatedDosage: 27,
        overallStatus: "validation_complete",
        validatedAt: "2026-09-23T11:25:00",
    },
    // =========================================================
    // SAMPLE 0016
    // =========================================================
    {
        id: 15,
        sampleRefNumber: "SMPL-0017",
        waterQuality: {
            turbidity: 155,
            ph: 7.0,
            conductivity: 210,
            temperature: 27,
            alkalinity: 51,
        },
        recommendation: {
            predictedDosage: 23,
            dispensingInstructions: {
                stockConcentration: 2.0,
                volumeToDispense: 11.5,
            },
        },
        settings: {
            flash_mix_rpm: 120,
            flash_mix_duration: 60,
            slow_mix_rpm: 30,
            slow_mix_duration: 600,
            settling_duration: 900,
        },
        validation_trials: [
            {
                trial_no: 1,
                appliedDosage: 23,
                appliedVolume: 11.5,
                resultingWaterQuality: {
                    turbidity: 4.20,
                    ph: 6.9,
                    conductivity: 220,
                    temperature: 27,
                    alkalinity: 49,
                },
                status: "success",
            },
        ],
        finalValidatedDosage: 23,
        overallStatus: "validation_complete",
        validatedAt: "2026-09-24T14:40:00",
    },

    // =========================================================
    // SAMPLE 0017
    // =========================================================
    {
        sampleId: 16,
        sampleRefNumber: "SMPL-0019",
        waterQuality: {
            turbidity: 240,
            ph: 6.8,
            conductivity: 325,
            temperature: 26,
            alkalinity: 46,
        },
        recommendation: {
            predictedDosage: 31,
            dispensingInstructions: {
                stockConcentration: 2.0,
                volumeToDispense: 15.5,
            },
        },
        settings: {
            flash_mix_rpm: 120,
            flash_mix_duration: 60,
            slow_mix_rpm: 30,
            slow_mix_duration: 600,
            settling_duration: 900,
        },
        validation_trials: [
            {
                trial_no: 1,
                appliedDosage: 31,
                appliedVolume: 15.5,
                resultingWaterQuality: {
                    turbidity: 6.10,
                    ph: 6.7,
                    conductivity: 335,
                    temperature: 26,
                    alkalinity: 44,
                },
                status: "failed",
            },
            {
                trial_no: 2,
                appliedDosage: 35,
                appliedVolume: 17.5,
                resultingWaterQuality: {
                    turbidity: 2.00,
                    ph: 6.6,
                    conductivity: 340,
                    temperature: 26,
                    alkalinity: 43,
                },
                status: "success",
            },
        ],
        finalValidatedDosage: 35,
        overallStatus: "validation_complete",
        validatedAt: "2026-09-25T08:10:00",
    },
];