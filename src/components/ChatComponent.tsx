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
      console.log(message, event)
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
    console.log('rebuild the whole thing', messagesList)
  })
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
        userId: 'self'
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
          <div key={index} className="message">
            <div className="message-text">{message.text}</div>
            <div className="message-timestamp">
              {message.timestamp.toLocaleTimeString()}
              {message.userId}
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
