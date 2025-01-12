import { useState } from "react";
import { chatController } from "../controllers/chatController";
import { useChat } from "../hooks/useChat";
import {
  IChatConnectionConfig,
  IMessage
} from "../interface/interfaces";
import { ChatMessage } from "./ChatMessage";
import { ErrorComponent } from "./ErrorComponent";
import Loader from "./Loader";
import { userDataStore } from "../store/UserDataStore";

export const ChatComponent = ({ config, userIdList }: { config: IChatConnectionConfig, userIdList: string[] }) => {

  const {
    chatSetupState,
    messagesList: roomChat,
    setMessagesList,
    messagesEndRef,
    isRoomChat,
    setIsRoomChat,
    selectedUser,
    setSelectedUser,
    singleUserMessages,
    updateSingleUserList
  } = useChat(config)

  const [input, setInput] = useState('');

  const handleInputChange = (e: any) => {
    setInput(e.target.value);
  };

  const handleSendMessage = () => {
    if (input.trim()) {
      const newMessage = {
        text: input,
        timestamp: new Date(),
        userId: config.uid,
        targetUserId: selectedUser
      } as IMessage
      chatController.sendMessage(input, selectedUser)
      if (isRoomChat) {
        setMessagesList((currentMessageList) => [...currentMessageList, newMessage]);
      } else {
        updateSingleUserList(newMessage);
      }
      setInput('');
    }
  };

  const handleKeyPress = (e: any) => {
    if (e.key === 'Enter') {
      if (!(isRoomChat || selectedUser)) {
        return
      }
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
      <div className="chat-header">
        <h4>Chat</h4>
        <div className="chat-toggle">
          <button
            className={isRoomChat ? "chat-toggle-btn-active" : "chat-toggle-btn"}
            onClick={() => {
              setIsRoomChat(true)
              setSelectedUser('')
            }} disabled={isRoomChat}>
            Room Chat
          </button>
          <button
            className={isRoomChat ? "chat-toggle-btn" : "chat-toggle-btn-active"}
            onClick={() => {
              setIsRoomChat(false)
              setSelectedUser('')
            }}>
            Private Chat
          </button>
        </div>
      </div>
      {isRoomChat ?
        <div className="messages-container">
          {roomChat.map((message, index) => (
            <ChatMessage key={index} message={message} currentUserId={config.uid} />
          ))}
          <div ref={messagesEndRef} />
        </div>
        : selectedUser ?
          <div className="messages-container">
            <div className="chat-select-user-header"> Private Chat with {userDataStore.getUserName(selectedUser) || selectedUser} </div>
            {
              singleUserMessages[selectedUser]?.map((message, index) => (
                <ChatMessage key={index} message={message} currentUserId={config.uid} />
              ))
            }
          </div> : <div className="messages-container">
            <div className="chat-select-user-header"> Select a user to chat </div>
            {userIdList.map((user, index) => (
              <div className="chat-users" key={index} onClick={() => setSelectedUser(user)}>{userDataStore.getUserName(user) || user}</div>
            ))}
            <div ref={messagesEndRef} />
          </div>
      }
      <div className="input-container input-container-chat">
        <input
          type="text"
          value={input}
          disabled={!(isRoomChat || selectedUser)}
          onKeyDown={handleKeyPress}
          onChange={handleInputChange}
          placeholder="Type your message"
        />
        <button
          disabled={!(isRoomChat || selectedUser)}
          className={!(isRoomChat || selectedUser) ? "chat-send-btn chat-send-btn-disabled" : "chat-send-btn"} onClick={handleSendMessage}>
          Send
        </button>
      </div>
    </div>
  );
}