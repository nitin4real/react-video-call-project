import { useState } from "react";
import { Link } from 'react-router-dom';
import { languageList, voiceList } from "../constants/languageCodes";
import Select from 'react-select';
import TestingMenuBox from "../configs/testingMenuBox";
import { CURRENT_VERSION } from "../configs/versions";
import agoraLogo from '../images/agoraLogo.png';

const MultiLanguageSelect = ({ selectedLanguage, setSelectedLanguage }: { selectedLanguage: string, setSelectedLanguage: (lang: string) => void }) => {
  const [addSecondLanguage, setAddSecondLanguage] = useState<boolean>(false);
  const [secondaryLanguage, setSecondaryLanguage] = useState<string>('');

  <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="" /></svg>
  return <div style={{ flexDirection: 'row', display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
    <LanguageDropdown selectedLanguage={selectedLanguage} setSelectedLanguage={setSelectedLanguage} />
    {addSecondLanguage ? <LanguageDropdown displayText="Select Secondary Language"
      selectedLanguage={secondaryLanguage}
      setSelectedLanguage={(lang) => {
        localStorage.setItem('secondaryLanguage', lang)
        setSecondaryLanguage(lang)
      }} /> : <></>}
    <svg
      onClick={() => {
        if (addSecondLanguage) {
          localStorage.removeItem('secondaryLanguage')
          setSecondaryLanguage('')
        }
        setAddSecondLanguage(!addSecondLanguage)
      }}
      width="32"
      height="32"
      viewBox="0 0 32 32"
      xmlns="http://www.w3.org/2000/svg">
      <path fill="#ccc" d={
        !addSecondLanguage ?
          "M16 3C8.832 3 3 8.832 3 16s5.832 13 13 13s13-5.832 13-13S23.168 3 16 3m0 2c6.087 0 11 4.913 11 11s-4.913 11-11 11S5 22.087 5 16S9.913 5 16 5m-1 5v5h-5v2h5v5h2v-5h5v-2h-5v-5z"
          : "M16 3C8.832 3 3 8.832 3 16s5.832 13 13 13s13-5.832 13-13S23.168 3 16 3m0 2c6.087 0 11 4.913 11 11s-4.913 11-11 11S5 22.087 5 16S9.913 5 16 5m-6 10v2h12v-2z"
      } />
    </svg>
  </div>
}


const LanguageDropdown = ({ selectedLanguage, displayText, setSelectedLanguage, }: { selectedLanguage: string, displayText?: string, setSelectedLanguage: (lang: string) => void }) => {

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
          borderRadius: '10px',
          marginRight: '10px',
          // width: window.innerWidth <= 1100 ? '100%' : '30%',
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
          // width: window.innerWidth <= 1100 ? '100%' : '30%',
          borderRadius: '10px',
          marginTop: '2px'
        })
      }}
      value={languages.find(lang => lang.value === selectedLanguage)}
      onChange={handleChange}
      options={languages}
      isSearchable
      placeholder={displayText || "Select Your Language"}
    />
  );
}

const VoiceDropdown = ({ selectedVoice, setSelectedVoice }: { selectedVoice: string, setSelectedVoice: (lang: string) => void }) => {

  const voices = voiceList.map(voice => ({
    value: voice.code,
    label: voice.voiceName
  }));

  const handleChange = (selectedOption: any) => {
    setSelectedVoice(selectedOption?.value);
  }

  return (
    <Select
      id="language-select"
      styles={{
        control: (styles) => ({
          ...styles,
          backgroundColor: 'white',
          width: window.innerWidth <= 1100 ? 'auto' : '30%',
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
          width: window.innerWidth <= 1100 ? '100%' : '30%',
          borderRadius: '10px',
          marginTop: '2px'
        })
      }}
      value={voices.find(voice => voice.value === selectedVoice)}
      onChange={handleChange}
      options={voices}
      isSearchable
      placeholder="Select Your Voice"
    />
  );
}

const VoiceAvatar = ({
  isSelected,
  imgSrc,
}: any) => {
  return <>
    {imgSrc}
  </>
}

const ToggleGender = ({
  isMaleSelected,
  setIsMaleSelected
}: {
  isMaleSelected: boolean,
  setIsMaleSelected: (isMale: boolean) => void
}) => {
  const maleSvg = <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="M18 4c-3.666 0-6.446.862-8.313 2.625C7.822 8.388 7 10.958 7 14v.906C6.428 15.45 6 16.15 6 17c0 1.26.89 2.154 2 2.594c.37 1.167.773 2.393 1.22 3.437c.485 1.142.924 2.048 1.53 2.69a7.19 7.19 0 0 0 10.5 0c.606-.642 1.013-1.548 1.5-2.69c.446-1.044.88-2.27 1.25-3.436c1.11-.44 2-1.334 2-2.594c0-.846-.43-1.547-1-2.094V14c0-2.824-.643-4.834-1.78-6.156c-.966-1.12-2.255-1.58-3.532-1.72l-.782-1.56l-.28-.564zm-.594 2.063l.688 1.375c.333.666.463 1.14.468 1.343s.013.12-.03.158c-.087.073-.93.29-1.97.343s-2.264.028-3.406.47c-1.14.442-2.143 1.627-2.156 3.25h2c.008-.986.237-1.128.875-1.375s1.738-.32 2.813-.375c1.074-.055 2.183.01 3.125-.78c.47-.397.77-1.08.75-1.75c-.005-.148-.04-.29-.063-.44a3.2 3.2 0 0 1 1.188.876C22.413 10 23 11.482 23 14v1.844l.5.28c.304.177.5.496.5.876a.98.98 0 0 1-.906 1l-.688.03l-.187.657a38 38 0 0 1-1.282 3.532c-.45 1.056-.967 1.956-1.125 2.124c-2.13 2.25-5.497 2.25-7.625 0c-.16-.168-.675-1.068-1.126-2.125a38 38 0 0 1-1.28-3.532l-.188-.657l-.688-.03A.98.98 0 0 1 8 17c0-.374.193-.698.5-.875l.5-.28V14c0-2.697.684-4.636 2.063-5.938c1.28-1.21 3.37-1.9 6.343-2zM13 16a1 1 0 1 0 0 2a1 1 0 0 0 0-2m6 0a1 1 0 1 0 0 2a1 1 0 0 0 0-2" /></svg>
  const femaleSvg = <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="M18.125 4c-3.304 0-6.984.562-9.72 3.594C5.673 10.626 4 15.88 4 25v1h8.656c.99.625 2.103 1 3.344 1s2.355-.383 3.344-1H29v-1c0-8.125-1.57-12.844-3.625-15.594c-1.81-2.42-3.892-3.094-5.438-3.25L19 4.5l-.28-.5zm-.563 2.063l.813 1.437l.28.5h.595c1.01 0 2.848.34 4.53 2.594C25.386 12.74 26.8 16.83 26.938 24h-5.375c.11-.14.21-.292.313-.438C23.233 21.625 24 19.207 24 17h-2c0 1.722-.644 3.827-1.75 5.406C19.144 23.986 17.665 25 16 25c-1.663 0-3.143-1.01-4.25-2.594C10.643 20.824 10 18.71 10 17c0-.444.085-.667.22-.844c.132-.177.364-.33.717-.468c.707-.28 1.9-.395 3.157-.5c1.258-.106 2.57-.206 3.75-.75C19.024 13.893 20 12.66 20 11h-2c0 1.044-.274 1.304-.97 1.625c-.694.32-1.882.458-3.124.563s-2.55.163-3.72.624c-.583.23-1.148.578-1.56 1.126C8.21 15.485 8 16.218 8 17c0 2.198.768 4.59 2.125 6.53q.165.241.344.47H6.06c.135-8.163 1.71-12.696 3.844-15.063c2.088-2.314 4.783-2.815 7.656-2.874zM13 17a1 1 0 1 0 0 2a1 1 0 0 0 0-2m6 0a1 1 0 1 0 0 2a1 1 0 0 0 0-2" /></svg>
  const handleToggleGender = () => {
    setIsMaleSelected(!isMaleSelected);
  };

  return (
    <div onClick={handleToggleGender} className="" >
      <VoiceAvatar imgSrc={maleSvg} isSelected={isMaleSelected} />
      <label className="switch">
        <input type="checkbox" />
        <span className="slider"></span>
      </label>
      <VoiceAvatar imgSrc={femaleSvg} isSelected={!isMaleSelected} />
    </div>
  );
}

export const JoinMeetComponent = () => {

  const [username, setUsername] = useState<string>('');
  const [channelName, setChannelName] = useState<string>('');
  const [selectedAvatarIndex, setSelectedAvatar] = useState<number>(-1);
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [selectedVoice, setSelectedVoice] = useState('');
  const [isTestingMode, setIsTestingMode] = useState(false);

  const toggleTestingMode = () => {
    setIsTestingMode(prevMode => !prevMode);
  };

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
    localStorage.setItem('voiceId', selectedVoice)
    // if (selectedAvatarIndex === -1) {
    //   localStorage.setItem('useravatar', avatars[selectedAvatarIndex])
    // } else {
    //   localStorage.setItem('useravatar', avatars[0])
    // }
  }

  return (
    <>
      <div className="login-background-img" />
      <div className="login-screen">
        <div className="login-input-container">
          <h2 className="demo-header">Real Time Speech to Speech Translation Demo </h2>
          {isTestingMode ? <TestingMenuBox /> : <></>}
          <MultiLanguageSelect
            selectedLanguage={selectedLanguage}
            setSelectedLanguage={setSelectedLanguage} />
          <br />
          <VoiceDropdown
            selectedVoice={selectedVoice}
            setSelectedVoice={setSelectedVoice} />
          {/* <ToggleGender
            isMaleSelected={isMaleSelected}
            setIsMaleSelected={setIsMaleSelected}
          /> */}

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
        <div className="login-logo">
          <img
            src={agoraLogo}
            alt="Agora"
            className="agora-logo"
          // onClick={toggleTestingMode} 
          />
        </div>
        <div className="version-number">
          {CURRENT_VERSION}
        </div>
      </div>
    </>

  );
};
