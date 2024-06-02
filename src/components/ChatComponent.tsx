import { useEffect, useRef, useState } from "react";
import { chatController } from "../controllers/chatController";
import {
  IChatConnectionConfig,
  IChatEvent,
  IChatMeetListeners,
  IMessage,
  SetupState
} from "../interface/interfaces";
import { ErrorComponent } from "./ErrorComponent";
import Loader from "./Loader";

const useChat = (config: IChatConnectionConfig) => {
  const [chatSetupState, setChatSetupState] = useState<SetupState>('loading');
  const [messagesList, setMessagesList] = useState<IMessage[]>([])

  const updateMessageList = (newMessage: IMessage) => {
    setMessagesList((currentlist) => [...currentlist, newMessage]);
  }

  const listenersRef = useRef<IChatMeetListeners>({
    onMessage: (event: IChatEvent) => {
      const message = event.message
      const newMessage = {
        text: message,
        timestamp: new Date(),
        userId: event.publisher
      };
      updateMessageList(newMessage)

    },
    onPresence: (event: IChatEvent) => {
      console.log(event)
    }
  })

  const onCompleteCallback = (status: SetupState) => {
    setChatSetupState(status)
  }
  useEffect(() => {
    if (chatSetupState === 'loading')
      chatController.setupChatWithToken(config, listenersRef.current, onCompleteCallback)
    else if (chatSetupState === 'success') {

    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatSetupState])

  return {
    chatSetupState,
    messagesList,
    setMessagesList
  }
}


export const ChatComponent = ({ config }: { config: IChatConnectionConfig }) => {

  const { chatSetupState, messagesList, setMessagesList } = useChat(config)
  const [input, setInput] = useState('');

  const handleInputChange = (e: any) => {
    setInput(e.target.value);
  };

  const handleSendMessage = () => {
    if (input.trim()) {
      const newMessage = {
        text: input,
        timestamp: new Date(),
        userId: config.uid
      };
      chatController.sendMessage(input)
      setMessagesList((currentMessageList) => [...currentMessageList, newMessage]);
      setInput('');
    }
  };

  if (chatSetupState === 'loading') {
    <Loader />
  } else if (chatSetupState === 'error') {
    <ErrorComponent message="Error in loading chat" />
  }

  return (
    <div className="chat-container">
      <div className="messages-container">
        {messagesList.map((message, index) => (
          <ChatItem key={index} message={message} currentUserId={config.uid} />
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

const ChatItem = ({ message, currentUserId }: any) => {
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


export function formatTimeToHHMM(time: Date) {
  let date;

  if (typeof time === 'string') {
    date = new Date(`1970-01-01T${time}Z`);
  } else if (time instanceof Date) {
    date = time;
  } else {
    throw new Error('Invalid input type. Expected a string or Date object.');
  }

  const hours = String(date.getUTCHours()).padStart(2, '0');
  const minutes = String(date.getUTCMinutes()).padStart(2, '0');

  return `${hours}:${minutes}`;
}
