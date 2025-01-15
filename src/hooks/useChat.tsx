import { useEffect, useRef, useState } from "react";
import { chatController } from "../controllers/chatController";
import {
  IChatConnectionConfig,
  IChatListeners,
  IMessage,
  SetupState
} from "../interface/interfaces";
import { AgoraChat } from "agora-chat";

export const useChat = (config: IChatConnectionConfig) => {
  const [chatSetupState, setChatSetupState] = useState<SetupState>('loading');
  const [messagesList, setMessagesList] = useState<IMessage[]>([]);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const [isRoomChat, setIsRoomChat] = useState(true);
  const [selectedUser, setSelectedUser] = useState<string>('');
  const [singleUserMessages, setUserMessages] = useState<{ [key: string]: IMessage[] }>({});
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messagesList]);

  const updateMessageList = (newMessage: IMessage) => {
    setMessagesList((currentlist) => [...currentlist, newMessage]);
  };

  const updateSingleUserList = (newMessage: IMessage) => {
    setUserMessages((currentMessages) => {
      const userId = newMessage?.targetUserId || newMessage.userId;
      const prevMessages = currentMessages[userId] || [];
      return {
        ...currentMessages,
        [userId]: [...prevMessages, newMessage]
      };
    });
  }

  const listenersRef = useRef<IChatListeners>({
    onTextMessage: (msg: AgoraChat.TextMsgBody) => {
      const newMessage: IMessage = {
        text: msg.msg,
        timestamp: new Date(),
        userId: msg?.from || '',
        type: 'text'
      }
      if (msg.chatType === 'chatRoom') {
        updateMessageList(newMessage);
      } else {
        updateSingleUserList(newMessage);
      }
    },
    onAudioMessage: (msg: AgoraChat.AudioMsgBody) => {
      const newMessage: IMessage = {
        file: msg.file,
        timestamp: new Date(),
        userId: msg?.from || '',
        type: 'audio',
        text: msg?.filename,
        fileUrl: msg.url
      }
      if (msg.chatType === 'chatRoom') {
        updateMessageList(newMessage);
      } else {
        updateSingleUserList(newMessage);
      }
    },
    onImageMessage: (msg: AgoraChat.ImgMsgBody) => {
      const newMessage: IMessage = {
        file: msg.file,
        timestamp: new Date(),
        userId: msg?.from || '',
        type: 'img',
        text: "",
        fileUrl: msg.url
      }
      if (msg.chatType === 'chatRoom') {
        updateMessageList(newMessage);
      } else {
        updateSingleUserList(newMessage);
      }
    },
    onFileMessage: (msg: AgoraChat.FileMsgBody) => {
      const newMessage: IMessage = {
        file: msg.file,
        timestamp: new Date(),
        userId: msg?.from || '',
        type: 'file',
        text: msg?.filename || "",
        fileUrl: msg.url
      }
      if (msg.chatType === 'chatRoom') {
        updateMessageList(newMessage);
      } else {
        updateSingleUserList(newMessage);
      }
    }
  });

  const onCompleteCallback = (status: SetupState) => {
    setChatSetupState(status);
  };
  useEffect(() => {
    if (chatSetupState === 'loading')
      chatController.setupChatWithToken(config, listenersRef.current, onCompleteCallback);
    else if (chatSetupState === 'success') {
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatSetupState]);

  return {
    chatSetupState,
    messagesList,
    setMessagesList,
    messagesEndRef,
    isRoomChat,
    setIsRoomChat,
    selectedUser,
    setSelectedUser,
    singleUserMessages,
    updateSingleUserList
  };
};
