import { useState } from "react";
import { IMessage } from "../interface/interfaces";
import { sendMessage } from "../project/project";

export const ChatComponent = () => {
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
  