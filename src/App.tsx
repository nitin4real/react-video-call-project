import { useState } from 'react';
import './App.css';
import { ChatComponent } from './components/ChatComponent';
import { JoinMeetComponent } from './components/JoinMeetComponent';


//fix for video and chat both
function App() {
  const [isLoading, setIsLoading] = useState(true)

  const loginSucces = (status: boolean) => {
    setIsLoading(status)
  }
  if (isLoading) {
    return <JoinMeetComponent onLogin={loginSucces} />
  }
  return (
    <>
      {isLoading ? <></> : <ChatComponent />}
    </>
  );
}

export default App;

