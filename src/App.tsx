import { BrowserRouter, Route, Routes } from "react-router-dom";
import './App.css';
import { JoinMeetComponent } from './screens/JoinMeetScreen';
import { MeetScreen } from './screens/MeetScreen';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<JoinMeetComponent />} />
        <Route path="/meet" element={<MeetScreen />} />
        <Route path="/meet/:channelname/" element={<MeetScreen />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App;