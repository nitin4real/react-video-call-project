import { useState } from "react";
import { Link } from 'react-router-dom';
import { languageList } from "../constants/languageCodes";

const LanguageDropdown = ({ selectedLanguage, setSelectedLanguage }: { selectedLanguage: string, setSelectedLanguage: (lang: string) => void }) => {

  const languages = languageList

  const handleChange = (event: any) => {
    setSelectedLanguage(event?.target?.value);
  }

  return (
    <div>
      <label htmlFor="language-select">Choose a language:</label>
      <select id="language-select" value={selectedLanguage} onChange={handleChange}>
        <option className="dropdown-container" value="">Select Language</option>
        {languages.map((language, index) => (
          <option key={index} value={language.code}>
            {language.languageName}
          </option>
        ))}
      </select>
    </div>
  );
};

export const JoinMeetComponent = () => {

  const [username, setUsername] = useState<string>('');
  const [channelName, setChannelName] = useState<string>('');
  const [selectedAvatarIndex, setSelectedAvatar] = useState<number>(-1);
  const [selectedLanguage, setSelectedLanguage] = useState('');


  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  };

  const handleChannelnameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setChannelName(e.target.value);
  };

  const handleAvatarClick = (avatar: number) => {
    setSelectedAvatar(avatar);
  };

  const setSessionData = () => {
    localStorage.setItem('username', username)
    // if (selectedAvatarIndex === -1) {
    //   localStorage.setItem('useravatar', avatars[selectedAvatarIndex])
    // } else {
    //   localStorage.setItem('useravatar', avatars[0])
    // }
  }

  return (
    <div className="login-container">
      <h2>Join or Create Channel</h2>
      <LanguageDropdown
        selectedLanguage={selectedLanguage}
        setSelectedLanguage={setSelectedLanguage} />
      <div className="input-container">
        <input
          type="text"
          placeholder="Enter your username"
          value={username}
          onChange={handleUsernameChange}
        />
      </div>
      <div className="input-container">
        <input
          type="text"
          placeholder="Enter Channel Name"
          value={channelName}
          onChange={handleChannelnameChange}
        />
      </div>
      <Link to={`meet/${channelName}/${selectedLanguage}`} onClick={setSessionData} >
        <button>Login</button>
      </Link>
    </div>
  );
};
