import { useState, useEffect } from 'react';
import Navbar from '../Components/Navbar';
import { Plus, AlertCircle } from 'lucide-react';
import axios from 'axios';


// import the modal module
import LabModal from './Components/LabModal';

// import the Display of settings
import LabSettingsDisplay from './Components/LabSettingsDisplay';

export default function LabSettingsConfigPage({activeSettings, setActiveSettings, isLoading, setIsLoading, loadLabSettings}) {
    // Modal and Form State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formError, setFormError] = useState('');

    // Initial blank state for the form payload 
    // this is the form that will update after the operator 
    // create new configurations
    const initialFormState = {
        name: "Maynilad Standard Validation Procedure",
        version: "1.0",
        is_active: true,
        coagulation_config: {
            flash_mixing_speed: '',
            flash_mixing_duration: '',
            coagulant_dispense_timing: '',
            slow_mixing_configurations: [],
            settling_duration: ''
        },
        concentration_config: {
            sample_volume: '',
            stock_concentration: ''
        },
        analysis_config: {
            stirring_speed: '',
            stirring_duration: ''
        }
    };

    const [formData, setFormData] = useState(initialFormState);


    // Helper to handle nested input changes
    const handleInputChange = (section, field, value) => {
        setFormData(prev => ({
            ...prev,
            [section]: {
                ...prev[section],
                [field]: Number(value) || value
            }
        }));
        setFormError(''); // Clear errors on change
    };

    // Helper to add a sequence to slow mixing
    const addSequence = () => {
        setFormData(prev => {
            const currentSequences = prev.coagulation_config.slow_mixing_configurations;
            return {
                ...prev,
                coagulation_config: {
                    ...prev.coagulation_config,
                    slow_mixing_configurations: [
                        ...currentSequences,
                        {
                            sequence_no: currentSequences.length + 1, // Auto-increment sequence
                            rpm: '',
                            duration: ''
                        }
                    ]
                }
            };
        });
    };

    // Helper to handle sequence input changes
    const handleSequenceChange = (index, field, value) => {
        setFormData(prev => {
            const newSequences = [...prev.coagulation_config.slow_mixing_configurations];
            newSequences[index][field] = Number(value) || '';
            return {
                ...prev,
                coagulation_config: {
                    ...prev.coagulation_config,
                    slow_mixing_configurations: newSequences
                }
            };
        });
    };

    // Helper to remove a sequence
    const removeSequence = (indexToRemove) => {
        setFormData(prev => {
            const filtered = prev.coagulation_config.slow_mixing_configurations.filter((_, idx) => idx !== indexToRemove);
            // Re-index sequences
            const reindexed = filtered.map((seq, idx) => ({ ...seq, sequence_no: idx + 1 }));
            return {
                ...prev,
                coagulation_config: {
                    ...prev.coagulation_config,
                    slow_mixing_configurations: reindexed
                }
            };
        });
    };

    // Form Submission and Validation
    const handleSubmit = async (e) => {
        e.preventDefault();
        const flashDuration = Number(formData.coagulation_config.flash_mixing_duration);
        const dispenseTiming = Number(formData.coagulation_config.coagulant_dispense_timing);

        // Fail-safe condition: dispense timing must not be equal or greater than duration of flash mixing
        if (dispenseTiming >= flashDuration) {
            setFormError(`Dispense timing (${dispenseTiming}s) cannot be equal to or greater than the flash mixing duration (${flashDuration}s).`);
            return;
        }

        // Perform post request
        await axios.post('http://127.0.0.1:8000/api/lab-settings/', formData);
        await loadLabSettings();

        setIsModalOpen(false);
        setFormData(initialFormState); // reset form
    };

    return (
        <div className="bg-zinc-50 flex flex-row min-h-screen font-sans">
            <Navbar />

            <div className="flex-1 flex flex-col min-w-0 min-h-screen font-sans relative">
                {/* Header Part */}
                <div className="bg-white border-b border-zinc-200 px-8 py-6 flex justify-between items-start sticky top-0 z-10">
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <h1 className="text-2xl font-bold text-zinc-900">Lab Settings</h1>
                            {activeSettings && activeSettings.is_active && (
                                <span className="px-2.5 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full border border-emerald-200">
                                    ACTIVE PROFILE
                                </span>
                            )}
                        </div>
                        <p className="text-sm text-zinc-500">Configure the function of the system here before proceeding with testings.</p>
                    </div>

                    {activeSettings && (
                        <div className="text-right">
                            <p className="text-sm font-semibold text-zinc-900">{activeSettings.name} (v{activeSettings.version})</p>
                            <p className="text-xs text-zinc-500">Created: {new Date(activeSettings.created_at).toLocaleDateString()}</p>
                        </div>
                    )}
                </div>

                {isLoading ? (
                    <div className="p-8 flex justify-center text-zinc-500">Loading configurations...</div>
                ) : !activeSettings ? (
                    // EMPTY STATE (If backend doesn't return current active settings)
                    <div className="p-8 flex flex-col items-center justify-center flex-1 text-center">
                        <div className="w-16 h-16 bg-zinc-100 rounded-full flex items-center justify-center mb-4">
                            <AlertCircle className="w-8 h-8 text-zinc-400" />
                        </div>
                        <h2 className="text-xl font-bold text-zinc-800 mb-2">No Active Configuration Found</h2>
                        <p className="text-sm text-zinc-500 mb-6 max-w-md">
                            There are currently no active lab configurations in the system. You must create one first before proceeding.
                        </p>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold shadow-sm transition-all active:scale-95"
                        >
                            <Plus className="w-5 h-5" />
                            Create Configuration
                        </button>
                    </div>
                ) : (
                    // insert here the module for displaying the current lab settings
                    <LabSettingsDisplay
                        activeSettings={activeSettings}
                    />
                )}

                {/* Floating Create Button if Settings already exist */}
                {activeSettings && (
                    <div className="fixed bottom-8 right-8 z-20">
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-4 rounded-full font-semibold shadow-lg shadow-blue-600/30 transition-all active:scale-95"
                        >
                            <Plus className="w-5 h-5" />
                            Create New Configuration
                        </button>
                    </div>
                )}
            </div>

            <LabModal
                isModalOpen={isModalOpen}
                setIsModalOpen={setIsModalOpen}
                formError={formError}
                formData={formData}
                handleInputChange={handleInputChange}
                addSequence={addSequence}
                removeSequence={removeSequence}
                handleSubmit={handleSubmit}
                handleSequenceChange={handleSequenceChange}
            />

        </div>


    );
}