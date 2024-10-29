import { ITranscript } from "../interface/interfaces";
import { userDataStore } from "../store/UserDataStore";

export const TranscriptText = ({ message, currentUserId }: { message: ITranscript, currentUserId: string }) => {
  const isCurrentUser = message.uid === currentUserId;
  const formattedTime = new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const userName = userDataStore.getUserName(String(message.uid))
  return (
    <div className={`chat-item ${isCurrentUser ? 'current-user' : ''}`}>
      <div className="message-text">{message.text}</div>
      <div className="message-info">
        {isCurrentUser ? <></> : <span className="user-id">Said by: {userName}</span>}
        <div className="timestamp">{formattedTime}</div>
      </div>
    </div>
  );
};
