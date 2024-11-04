import { useState } from "react";
import { setTestingConfigs } from "../configs/testingConfigs";
import info from '../images/info.png'
import illustration from '../images/illustrationAnimation.gif'

export const InfoComponent = () => {
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
        <>
            <button onClick={toggleModal} className="round-btn">
                <img height={30} width={30} src={info} alt="Info" onClick={() => { }} />
            </button>


            {isModalOpen && (
                <div style={modalStyles}>
                    <div style={overlayStyles} onClick={toggleModal}></div>
                    <div style={modalContentStyles}>
                        <h2>
                            How it works
                        </h2>
                        <p>Agora and open ai. (Under construction)</p>
                        <img height={'50%'} width={'50%'}  src={illustration} />
                        <button style={{ margin: 10 }} onClick={toggleModal}>Close</button>
                    </div>
                </div>
            )}
        </>
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