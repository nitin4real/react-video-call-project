import { useEffect, useRef, useState } from "react";
import { chatController } from "../controllers/chatController";
import {
  IChatConnectionConfig,
  IChatEvent,
  IChatMeetListeners,
  IMessage,
  SetupState
} from "../interface/interfaces";

export const useChat = (config: IChatConnectionConfig) => {
  const [chatSetupState, setChatSetupState] = useState<SetupState>('loading');
  const [messagesList, setMessagesList] = useState<IMessage[]>([]);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messagesList]);

  const updateMessageList = (newMessage: IMessage) => {
    setMessagesList((currentlist) => [...currentlist, newMessage]);
  };

  const listenersRef = useRef<IChatMeetListeners>({
    onMessage: (event: IChatEvent) => {
      const message = event.message;
      const newMessage = {
        text: message,
        timestamp: new Date(),
        userId: event.publisher
      };
      updateMessageList(newMessage);

    },
    onPresence: (event: IChatEvent) => {
      console.log(event);
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
    messagesEndRef
  };
};
