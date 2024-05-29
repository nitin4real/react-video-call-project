import { useId, useState } from 'react';
import './App.css';
import { initWithUserNameAndToken, sendMessage, setUpProject } from "./project/project";
import { GenerateTokenForUserID } from './AgoraTokenGenerator';
// const Client = ({ children }:any) => {
//   return (
//     <AgoraRTCProvider client={AgoraRTC.createClient({ mode: "rtc", codec: "vp8" }) as any}>
//       {children}
//     </AgoraRTCProvider>
//   );
// };

interface IMessage {
  text: string;
  timestamp: Date;
  userId: string;
}

class UserData {
  userName: string
  userImage: string
  userId: string

  constructor(userId = '', userName = 'Guest', userImage = '') {
    this.userId = userId
    this.userName = userName
    this.userImage = userImage
  }

  setUserName = (userName: string) => {
    this.userName = userName
  }

  setUserImage = (userImage: string) => {
    this.userImage = userImage
  }

  setUserId = (userId: string) => {
    this.userId = userId
  }
}

class SessionStore {
  currentUser: UserData
  sessionToken: string
  constructor() {
    this.sessionToken = ''
    this.currentUser = new UserData()
  }

  setSessionToken = (sessionToken: string) => {
    this.sessionToken = sessionToken
  }

  setCurrentUser = (userData: UserData) => {
    this.currentUser = userData
  }

}
const sessionStore = new SessionStore()


setUpProject()

function App() {
  const [isLoading, setIsLoading] = useState(true)

  const loginSucces = (status: boolean) => {
    setIsLoading(status)
  }
  if (isLoading) {
    return <LoginComponent onLogin={loginSucces} />
  }
  return (
    <>
      {isLoading ? <></> : <ChatScreen />}
    </>
  );
}

export default App;

const ChatScreen = () => {
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [input, setInput] = useState('');

  const handleInputChange = (e: any) => {
    setInput(e.target.value);
  };

  const handleSendMessage = () => {
    if (input.trim()) {
      const newMessage = {
        text: input,
        timestamp: new Date(),
        userId: ''
      };
      sendMessage(input)
      setMessages([...messages, newMessage]);
      setInput('');
      // Implement your send message function here
    }
  };

  return (
    <div className="chat-container">
      <div className="messages-container">
        {messages.map((message, index) => (
          <div key={index} className="message">
            <div className="message-text">{message.text}</div>
            <div className="message-timestamp">
              {message.timestamp.toLocaleTimeString()}
            </div>
          </div>
        ))}
      </div>
      <div className="input-container">
        <input
          type="text"
          value={input}
          onChange={handleInputChange}
          placeholder="Type your message"
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
}





const avatars = [
  'https://img.freepik.com/free-psd/3d-illustration-person-with-sunglasses_23-2149436188.jpg',
  'https://img.freepik.com/free-psd/3d-illustration-person-with-sunglasses_23-2149436188.jpg',
  'https://img.freepik.com/free-psd/3d-illustration-person-with-sunglasses_23-2149436188.jpg',
  'https://img.freepik.com/free-psd/3d-illustration-person-with-sunglasses_23-2149436188.jpg',
];


const LoginComponent = ({ onLogin }: { onLogin: (status: boolean) => void }) => {
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
