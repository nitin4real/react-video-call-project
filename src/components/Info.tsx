import { useState } from "react";
import { setTestingConfigs } from "../configs/testingConfigs";
import info from '../images/info.png'
import illustration from '../images/illustrationAnimation.gif'
import { howItWorksText } from "../constants/info";

export const InfoComponent = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [viewArchitecture, setViewArchitecture] = useState(false);

    const toggleModal = () => {
        setIsModalOpen(!isModalOpen);
    };

    const toggleView = () => {
        setViewArchitecture(show => !show);
    };

    return (
        <>
            <button onClick={toggleModal} className="round-btn">
                <img height={30} width={30} src={info} alt="Info" onClick={() => { }} />
            </button>


            {isModalOpen && (
                <div className="info-modal">
                    <div className="info-modal-overlay" onClick={toggleModal}></div>
                    <div className="info-modal-content">
                        <h3>
                            How it works
                        </h3>
                        {
                            viewArchitecture ?
                                <img className="info-modal-img" src={illustration} />
                                :
                                <p className="info-modal-text">
                                    {howItWorksText}
                                    <p>
                                        For more information on Agora SD-RTN, visit <a href="https://www.agora.io/en/the-agora-platform-advantage/" target="_blank" rel="noopener noreferrer">Agora</a>
                                    </p>
                                    <p>
                                        For more information on OpenAI Realtime API <a href="https://openai.com/index/introducing-the-realtime-api/" target="_blank" rel="noopener noreferrer">OpenAI</a>
                                    </p>
                                    <p>
                                        For more information on Agora - OpenAI Realtime Collaboration, visit <a href="https://www.agora.io/en/products/agora-openai-conversational-ai-sdk/" target="_blank" rel="noopener noreferrer"> Click Here </a>
                                    </p>
                                </p>
                        }
                        <button className="info-modal-btn" onClick={toggleView}>Show {viewArchitecture ? `Details` : `Architecture`}</button>
                        <button className="info-modal-btn" onClick={toggleModal}>Close</button>
                    </div>
                </div>
            )}
        </>
    );
};