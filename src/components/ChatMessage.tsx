export const ChatMessage = ({ message, currentUserId }: any) => {
  const isCurrentUser = message.userId === currentUserId;
  const formattedTime = new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  return (
    <div className={`chat-item ${isCurrentUser ? 'current-user' : ''}`}>
      <div className="message-text">{message.text}</div>
      <div className="message-info">
        {isCurrentUser ? <></> : <span className="user-id">send by: {message.userId}</span>}
        <div className="timestamp">{formattedTime}</div>
      </div>
    </div>
  );
};
