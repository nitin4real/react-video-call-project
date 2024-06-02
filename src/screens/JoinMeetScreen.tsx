import { useState } from "react";
import { Link } from 'react-router-dom';
import { avatars } from "../contants/images";

export const JoinMeetComponent = () => {

  const [username, setUsername] = useState<string>('');
  const [channelName, setChannelName] = useState<string>('');
  const [selectedAvatarIndex, setSelectedAvatar] = useState<number>(-1);

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
    if (selectedAvatarIndex === -1) {
      localStorage.setItem('useravatar', avatars[selectedAvatarIndex])
    } else {
      localStorage.setItem('useravatar', avatars[0])
    }
  }

  return (
    <div className="login-container">
      <h2>Join or Create Channel</h2>
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
      <Link to={`meet/${channelName}`} onClick={setSessionData} >
        <button>Login</button>
      </Link>
    </div>
  );
};
