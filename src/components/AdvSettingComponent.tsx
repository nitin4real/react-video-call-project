import { useState } from "react";
import settingsImg from '../images/settings.png'
import { TranslationConfigs } from "../interface/interfaces";

export const AdvSettingComponent = ({
    currentVolume,
    setAudioVolume
}: {
    currentVolume: React.MutableRefObject<TranslationConfigs>,
    setAudioVolume: (config: TranslationConfigs) => void
}) => {
    const [isAutoVolume, setIsAutoVolume] = useState(currentVolume.current.dynamicVolume);
    const [isTranslationActive, setIsTranslationActive] = useState(currentVolume.current.isTranslationActive);
    const [botVolume, setBotVolume] = useState(currentVolume.current.botVolume);
    const [userVolume, setUserVolume] = useState(currentVolume.current.userVolume);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const toggleModal = () => {
        setIsModalOpen(!isModalOpen);
    };

    return (
        <>
            <button onClick={toggleModal} className="round-btn">
                <img height={30} width={30} src={settingsImg} alt="Settings" onClick={() => { }} />
            </button>

            {isModalOpen && (
                <div className="info-modal">
                    <div className="info-modal-overlay" onClick={toggleModal}></div>
                    <div className="adv-setting-modal-content">
                        <h4>
                            Advance Settings
                        </h4>
                        {/* bot volume */}
                        <div className="vol-slider-container">
                            <input
                                type="range"
                                min="0"
                                max="100"
                                value={botVolume}
                                onChange={(e) => {
                                    setBotVolume(Number(e.target.value));
                                    setAudioVolume({
                                        ...currentVolume.current,
                                        botVolume: Number(e.target.value),
                                    });
                                }}
                                className="slider"
                            />
                            <span>{botVolume} Translator Volume</span>
                        </div>
                        {/* user volume */}
                        <div className="vol-slider-container">
                            <input
                                type="range"
                                min="0"
                                max="100"
                                value={userVolume}
                                onChange={(e) => {
                                    setUserVolume(Number(e.target.value));
                                    setAudioVolume({
                                        ...currentVolume.current,
                                        userVolume: Number(e.target.value),
                                    });
                                }}
                                className="slider"
                            />
                            <span>{userVolume} Original Volume</span>
                        </div>




                        <div className="auto-volume-checkbox-container">
                            <input
                                className="auto-volume-checkbox"
                                type="checkbox"
                                checked={isAutoVolume}
                                onChange={(e) => {
                                    setIsAutoVolume(e.target.checked);
                                    setAudioVolume({
                                        ...currentVolume.current,
                                        dynamicVolume: e.target.checked,
                                    });
                                }}
                            />
                            Auto Adjust Orignal Volume
                        </div>
                        <div className="auto-volume-checkbox-container">
                            <input
                                className="auto-volume-checkbox"
                                type="checkbox"
                                checked={isTranslationActive}
                                onChange={(e) => {
                                    setIsTranslationActive(e.target.checked);
                                    e.target.checked ? setUserVolume(currentVolume.current.userVolume) : setUserVolume(100);
                                    setAudioVolume({
                                        ...currentVolume.current,
                                        isTranslationActive: e.target.checked,
                                    });
                                }}
                            />
                            Translation Active
                        </div>
                        <button className="info-modal-btn" onClick={toggleModal}>Close</button>
                    </div>
                </div>
            )}
        </>
    );
};