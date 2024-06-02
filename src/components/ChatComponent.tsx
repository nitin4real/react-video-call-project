import { useState } from "react";
import { chatController } from "../controllers/chatController";
import { useChat } from "../hooks/useChat";
import {
  IChatConnectionConfig
} from "../interface/interfaces";
import { ChatMessage } from "./ChatMessage";
import { ErrorComponent } from "./ErrorComponent";
import Loader from "./Loader";

export const ChatComponent = ({ config }: { config: IChatConnectionConfig }) => {

  const { chatSetupState, messagesList, setMessagesList, messagesEndRef } = useChat(config)
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

  const handleKeyPress = (e: any) => {
    if (e.key === 'Enter') {
      handleSendMessage()
    }
  }

  if (chatSetupState === 'loading') {
    <Loader />
  } else if (chatSetupState === 'error') {
    <ErrorComponent message="Error in loading chat" />
  }

  return (
    <div className="chat-container">
      <h4>Chat</h4>
      <div className="messages-container">
        {messagesList.map((message, index) => (
          <ChatMessage key={index} message={message} currentUserId={config.uid} />
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="input-container">
        <input
          type="text"
          value={input}
          onKeyDown={handleKeyPress}
          onChange={handleInputChange}
          placeholder="Type your message"
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
}