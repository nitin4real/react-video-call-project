import React, { useState } from 'react';
import { setTestingConfigs } from './testingConfigs';

const TestingMenuBox: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const toggleModal = () => {
        setIsModalOpen(!isModalOpen);
    };
    const setNewSettings = () => {
        // Get the input value and set it to the testingConfigs
        
        const volumeInput = document.getElementById('volumeInput') as HTMLInputElement;
        if (volumeInput) {
            setTestingConfigs('audioSuppressionVolumeLevel', volumeInput.value);
        }
    }
    return (
        <div>
            <button style={{ margin: 10 }} onClick={toggleModal}>
                {isModalOpen ? 'Close Setting' : 'Open Setting'}
            </button>
            {isModalOpen && (
                <div style={modalStyles}>
                    <div style={overlayStyles} onClick={toggleModal}></div>
                    <div style={modalContentStyles}>
                        <h2>
                            Don't mind the UI, Just for test purpose
                        </h2>
                        <p>Set Suppressed Audio Volume.</p>
                        <input
                            id="volumeInput"
                            type="number"
                            placeholder="Volume"
                            min="0"
                            max="100"
                            onKeyDown={(e) => {
                                if (!/[0-9]/.test(e.key) && e.key !== 'Backspace' && e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') {
                                    e.preventDefault();
                                }
                            }}
                        />
                        <button style={{ margin: 10 }} onClick={setNewSettings}>Set New Settings</button>
                        <button style={{ margin: 10 }} onClick={toggleModal}>Close</button>
                    </div>
                </div>
            )}
        </div>
    );
};

const modalStyles: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
};

const overlayStyles: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
};

const modalContentStyles: React.CSSProperties = {
    position: 'relative',
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '8px',
    zIndex: 1001,
};

export default TestingMenuBox;