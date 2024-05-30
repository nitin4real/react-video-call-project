import { useState } from "react";
import { Link } from 'react-router-dom';
import { avatars } from "../contants/images";

export const JoinMeetComponent = () => {

  const [username, setUsername] = useState<string>('');
  const [channelName, setChannelName] = useState<string>('');
  const [selectedAvatarIndex, setSelectedAvatar] = useState<number>(-1);
  const queryParams = new URLSearchParams({ username }).toString();

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

  // const handleLogin = async () => {
  //   if (username && selectedAvatarIndex !== -1) {
  //     console.log('Username:', username);
  //     console.log('Selected Avatar:', avatars[selectedAvatarIndex]);

  //     //here send the usename and channel name, and go to meet screen, 
  //     //there create a token from api 
  //     //get the response in uid as a number set these values to the sessionstore and carry on  

  //     const { tokens = {}, appId = '' } = await GenerateTokenForUserID(username)
  //     // Implement your login function here
  //     const { rtcToken = '', rtmToken = '' } = tokens
  //     if (!rtcToken || !rtmToken) {
  //       alert('Some Problem Occured while login')
  //       return
  //     }
  //     initWithUserNameAndToken(username, tokens, appId, () => { })
  //   } else {
  //     alert('Please enter a username and select an avatar.');
  //   }
  // };

  // if (showVideo) {
  //   return <MeetVideoComponent appId={values.appId} tokens={values.tokens} username={values.uid} />
  // }

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
      <div className="input-container">
        <input
          type="text"
          placeholder="Enter Channel Name"
          value={channelName}
          onChange={handleChannelnameChange}
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
      <Link to={`meet/${channelName}`} onClick={setSessionData} >
        <button>Login</button>
      </Link>
    </div>
  );
};
