import OAIxAgora from '../images/OAIxAgora.png';
import oai from '../images/oai.png';
import OAIxAgoraWithoutLogo from '../images/OAIxAgoraWithoutImage.png';
import agoraLogo from '../images/agoraLogo.png';
export const MeetHeader = () => {
    return <div className="meet-header">
        {/* <img src={OAIxAgora} alt="Agora" className="oai-agora-logo" />
        <img src={OAIxAgoraWithoutLogo} alt="Agora" className="oai-agora-logo" /> */}
        <img src={agoraLogo} alt="Agora" className="header-agora-logo" />
        <img src={oai} alt="Agora" className="header-oai-logo" />
    </div>;
};
