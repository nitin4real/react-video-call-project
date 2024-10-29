import { useState } from "react";
import { Link } from 'react-router-dom';
import { languageList } from "../constants/languageCodes";
import Select from 'react-select';



const LanguageDropdown = ({ selectedLanguage, setSelectedLanguage }: { selectedLanguage: string, setSelectedLanguage: (lang: string) => void }) => {

  const languages = languageList.map(language => ({
    value: language.code,
    label: language.languageName
  }));

  const handleChange = (selectedOption: any) => {
    setSelectedLanguage(selectedOption?.value);
  }

  return (
    <Select
      id="language-select"
      styles={{
        control: (styles) => ({
          ...styles,
          backgroundColor: 'white',
          width: '30%',
          borderRadius: '10px'
        }),
        option: (styles, { isFocused, isSelected }) => {
          return {
            ...styles,
            backgroundColor: isSelected ? '#1a73e8' : isFocused ? '#f1f1f1' : 'white',
            color: isSelected ? 'white' : isFocused ? 'black' : 'black',
          };
        },
        menu: (styles) => ({
          ...styles,
          width: '30%',

          borderRadius: '10px',
          marginTop: '2px'
        })
      }}
      value={languages.find(lang => lang.value === selectedLanguage)}
      onChange={handleChange}
      options={languages}
      isSearchable
      placeholder="Select Your Language"
    />
  );
}

export const JoinMeetComponent = () => {

  const [username, setUsername] = useState<string>('');
  const [channelName, setChannelName] = useState<string>('');
  const [selectedAvatarIndex, setSelectedAvatar] = useState<number>(-1);
  const [selectedLanguage, setSelectedLanguage] = useState('');

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setUsername(value);
  };

  const handleChannelnameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setChannelName(value);
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
    <>
      <img src="" className="login-background-img"/>
        <div className="login-screen">
          <div className="login-input-container">
            <h2 className="demo-header">Real Time Speech to Speech Translation Demo </h2>
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
            <div>
              <Link to={`meet/${channelName}/${selectedLanguage}`} onClick={setSessionData} >
                <button className="login-button">Login</button>
              </Link>
            </div>

          </div>
          <div style={{
            borderRadius: '10px', margin: '10px'
          }}>
            <img src="https://cdn.freelogovectors.net/wp-content/uploads/2022/05/agora_logo_freelogovectors.net_.png" alt="Agora" className="agora-logo" />
          </div>
        </div>
      </>

      );
};
