import { useState } from "react";
import { avatars } from "../contants/images";
import { GenerateTokenForUserID } from "../AgoraTokenGenerator";
import { initWithUserNameAndToken } from "../project/project";

export const JoinMeetComponent = ({ onLogin }: { onLogin: (status: boolean) => void }) => {
    const [username, setUsername] = useState<string>('');
    const [selectedAvatarIndex, setSelectedAvatar] = useState<number>(-1);
  
    const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setUsername(e.target.value);
    };
  
    const handleAvatarClick = (avatar: number) => {
      setSelectedAvatar(avatar);
    };
  
    const handleLogin = async () => {
      if (username && selectedAvatarIndex) {
        console.log('Username:', username);
        console.log('Selected Avatar:', avatars[selectedAvatarIndex]);
        //
        const { tokens = {}, appId = '' } = await GenerateTokenForUserID(username)
        // Implement your login function here
        const { rtcToken = '', rtmToken = '' } = tokens
        if (!rtcToken || !rtmToken) {
          alert('Some Problem Occured while login')
          return
        }
        initWithUserNameAndToken(username, tokens, appId, onLogin)
      } else {
        alert('Please enter a username and select an avatar.');
      }
    };
  
    return (
      <div className="login-container">
        <h2>Login</h2>
        <div className="input-container">
          <input
            type="text"
            placeholder="Enter your username"
            value={username}
            onChange={handleUsernameChange}
          />
        </div>
        <div className="avatar-container">
          {avatars.map((avatar, index) => (
            <img
              key={index}
              src={avatar}
              alt={`avatar-${index}`}
              className={`avatar ${selectedAvatarIndex === index ? 'selected' : ''}`}
              onClick={() => handleAvatarClick(index)}
            />
          ))}
        </div>
        <button onClick={handleLogin}>Login</button>
      </div>
    );
  };
  