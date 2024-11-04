import OAIxAgora from '../images/OAIxAgora.png';
import oai from '../images/oai.png';
import OAIxAgoraWithoutLogo from '../images/OAIxAgoraWithoutImage.png';
import agoraLogo from '../images/agoraLogo.png';
export const MeetHeader = () => {
    return <div className="meet-header">
        {/* <img src={OAIxAgora} alt="Agora" className="oai-agora-logo" />
        <img src={OAIxAgoraWithoutLogo} alt="Agora" className="oai-agora-logo" /> */}
        <a target='_blank' href='https://www.agora.io/en/'>
            <img src={agoraLogo} alt="Agora" className="header-agora-logo" />
        </a>
        <a target='_blank' href='https://www.agora.io/en/products/agora-openai-conversational-ai-sdk/'>
        <img src={oai} alt="Agora" className="header-oai-logo" />
        </a>
    </div>;
};
