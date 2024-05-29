import { useId, useState } from 'react';
import './App.css';
import { initWithUserNameAndToken, sendMessage, setUpProject } from "./project/project";

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

  // return <LoginComponent />
  return (
    <>
      <LoginButton loginSucces={loginSucces} />
      {isLoading ? <></> : <ChatScreen />}
    </>
  );
}

export default App;

const LoginButton = ({ loginSucces }: { loginSucces: (status: boolean) => void }) => {
  const loginUser1 = () => {
    loginSucces(true)
    initWithUserNameAndToken(
      'loginUser1',
      '007eJxSYBA+6L5Ko9zrvdm2l0ftV7VX7HS3KZW7+Sf0bfrNnXbcDEoKDGaJBikGSYZGaWYG5iaJiSkWhhbJlpZpaZbGpqYpJiYm0s/D0gTUGRg42VyZmBgYGUAYxGcBkzwMuYmZeckZiSVF+fm5XAw5+emZeaHFqUWGIHUQlciigAAAAP//LdooMQ==',
      loginSucces)
  }
  const loginUser2 = () => {
    loginSucces(true)
    initWithUserNameAndToken(
      'loginUser2',
      '007eJxSYKh1i14n2ip/LusAm+jyavMrWz7rHzp6dsXkn6d3XY1/4FijwGCWaJBikGRolGZmYG6SmJhiYWiRbGmZlmZpbGqaYmJiovk8LE1AnYHhwCQjBiYGRjAG8VnAJA9DbmJmXnJGYklRfn4uF0NOfnpmXmhxapERSB1EJbIoIAAA//9nXCt/',
      loginSucces)
  }
  const loginUser3 = () => {
    loginSucces(true)
    initWithUserNameAndToken(
      'loginUser3',
      '007eJxSYFB38dpxQLRoyvULy6c4vs/2KTTh1RX66mARp5a8dLGNsoMCg1miQYpBkqFRmpmBuUliYoqFoUWypWVamqWxqWmKiYmJ6fOwNAF1BoaPdu8ZmRgYGUAYxGcBkzwMuYmZeckZiSVF+fm5XAw5+emZeaHFqUXGIHUQlciigAAAAP//oown7A==',
      loginSucces)
  }

  return <>
    <div onClick={loginUser1}>login as user1</div>
    <div onClick={loginUser2}>login as user2</div>
    <div onClick={loginUser3}>login as user3</div>
  </>
}


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







const LoginComponent: React.FC = () => {
  const [username, setUsername] = useState<string>('');
  const [selectedAvatarIndex, setSelectedAvatar] = useState<number>(-1);

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  };

  const handleAvatarClick = (avatar: number) => {
    setSelectedAvatar(avatar);
  };

  const handleLogin = () => {
    if (username && selectedAvatarIndex) {
      console.log('Username:', username);
      console.log('Selected Avatar:', avatars[selectedAvatarIndex]);
      // Implement your login function here
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
