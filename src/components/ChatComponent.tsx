import { useState } from "react";
import AC, { AgoraChat } from 'agora-chat';

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
import { getFileType } from "../utils/appUtils";
import attachIcon from "../images/attach.svg";
import removeIcon from "../images/remove.png";
import { EmptyChat } from "./EmptyChat";

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

  const [inputText, setInputText] = useState('');
  const [inputFile, setInputFile] = useState<AgoraChat.FileObj | undefined>(undefined);

  const handleInputChange = (e: any) => {
    setInputText(e.target.value);
  };

  const handleInputFileChange = (e: any) => {
    var input: HTMLInputElement = document.getElementById('uploader') as any
    var file = AC.utils.getFileUrl(input);
    if (file.filetype) {
      setInputFile(file);
    }

  }

  const handleSendMessage = () => {
    if (inputFile) {
      const fileExt = inputFile.filetype
      const fileType = getFileType(fileExt)
      const newMessage: IMessage = {
        file: inputFile,
        timestamp: new Date(),
        userId: config.uid,
        targetUserId: selectedUser,
        text: inputFile.filename,
        type: fileType,
        fileUrl: inputFile.url
      }

      chatController.sendFile(inputFile, selectedUser)
      if (isRoomChat) {
        setMessagesList((currentMessageList) => [...currentMessageList, newMessage]);
      } else {
        updateSingleUserList(newMessage);
      }
      setInputFile(undefined);
    }
    if (inputText.trim()) {
      const newMessage: IMessage = {
        text: inputText,
        timestamp: new Date(),
        userId: config.uid,
        targetUserId: selectedUser,
        type: "text"
      }
      chatController.sendMessage(inputText, selectedUser)
      if (isRoomChat) {
        setMessagesList((currentMessageList) => [...currentMessageList, newMessage]);
      } else {
        updateSingleUserList(newMessage);
      }
      setInputText('');
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
  const resetSelectedFile = () => {
    setInputFile(undefined)
    var input: HTMLInputElement = document.getElementById('uploader') as any
    input.value = ''
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
          {roomChat.length === 0 ? <EmptyChat message="Messages Will appear here" />
            : roomChat.map((message, index) => (
              <ChatMessage key={index} message={message} currentUserId={config.uid} />
            ))}
          <div ref={messagesEndRef} />
        </div>
        : selectedUser ?
          <div className="messages-container">
            <div className="chat-select-user-header"> Private Chat with {userDataStore.getUserName(selectedUser) || selectedUser} </div>
            {
              singleUserMessages[selectedUser]?.length === 0 || singleUserMessages[selectedUser] === undefined
                ? <EmptyChat message="Messages Will appear here" />
                : singleUserMessages[selectedUser]?.map((message, index) => (
                  <ChatMessage key={index} message={message} currentUserId={config.uid} />
                ))
            }
          </div> : <div className="messages-container">
            <div className="chat-select-user-header"> Select a user to chat </div>
            {
              userIdList.length === 0 ? <EmptyChat message="No Users in the chat room" /> :
                userIdList.map((user, index) => (
                  <div className="chat-users" key={index} onClick={() => setSelectedUser(user)}>{userDataStore.getUserName(user) || user}</div>
                ))}
            <div ref={messagesEndRef} />
          </div>
      }
      <div className="input-container input-container-chat">
        {
          inputFile
            ? <div className="file-selected">
              <span className="file-selected-name">{inputFile.filename}</span>
              <button className="cancel-file" onClick={resetSelectedFile}>
                <img src={removeIcon} height={25} width={25} alt="remove" className="remove-icon" />
              </button>
            </div>
            : <></>
        }
        <input
          type="text"
          value={inputText}
          disabled={!(isRoomChat || selectedUser)}
          onKeyDown={handleKeyPress}
          onChange={handleInputChange}
          placeholder="Type your message"
        />
        <div className="input-actions">
          <label className="attach-icon" htmlFor="uploader">
            <img src={attachIcon} height={30} width={30} alt="attach" className="attach-icon" />
          </label>
          <input type="file" id="uploader" disabled={!(isRoomChat || selectedUser)} onChange={handleInputFileChange} style={{ display: 'none' }} />

          <button
            disabled={!(isRoomChat || selectedUser)}
            className={!(isRoomChat || selectedUser) ? "chat-send-btn chat-send-btn-disabled" : "chat-send-btn"} onClick={handleSendMessage}>
            Send
          </button>
        </div>
      </div>
    </div>
  );
}