import { useEffect, useRef, useState } from "react";
import { IMessage } from "../interface/interfaces";
import { userDataStore } from "../store/UserDataStore";
import { getLanguageNameByISOCode } from "../constants/languageCodes";

const AudioMessage = ({ togglePlayback, message, isPlayingAudio }: { togglePlayback: () => void, message: IMessage, isPlayingAudio: boolean }) => {
  const audioIcon = <svg width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M8 4v10.184A3 3 0 0 0 7 14a3 3 0 1 0 3 3V7h7v4.184A3 3 0 0 0 16 11a3 3 0 1 0 3 3V4z" /></svg>
  const playIcon = <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M6.906 4.537A.6.6 0 0 0 6 5.053v13.894a.6.6 0 0 0 .906.516l11.723-6.947a.6.6 0 0 0 0-1.032z" /></svg>
  const pauseIcon = <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="M15 19q-.825 0-1.412-.587T13 17V7q0-.825.588-1.412T15 5h2q.825 0 1.413.588T19 7v10q0 .825-.587 1.413T17 19zm-8 0q-.825 0-1.412-.587T5 17V7q0-.825.588-1.412T7 5h2q.825 0 1.413.588T11 7v10q0 .825-.587 1.413T9 19zm8-2h2V7h-2zm-8 0h2V7H7zM7 7v10zm8 0v10z" /></svg>

  return <div onClick={togglePlayback} className="audio-msg">
    <div>
      {audioIcon}
      {isPlayingAudio ? pauseIcon : playIcon}
    </div>
    {message.text || 'Audio'}
  </div>

}
export const ChatMessage = ({ message, currentUserId }: { message: IMessage, currentUserId: string }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const isCurrentUser = message.userId === currentUserId;
  const formattedTime = new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const userName = userDataStore.getUserName(String(message.userId)) || String(message.userId)
  const isText = message.type === 'text';
  const isFile = message.type === 'file';
  const isImg = message.type === 'img';
  const isAudio = message.type === 'audio';
  const imgIcon = <svg width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M5 21q-.825 0-1.412-.587T3 19V5q0-.825.588-1.412T5 3h14q.825 0 1.413.588T21 5v14q0 .825-.587 1.413T19 21zm0-2h14V5H5zm1-2h12l-3.75-5l-3 4L9 13zm-1 2V5z" /></svg>
  const fileIcon = <svg width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M13 9V3.5L18.5 9M6 2c-1.11 0-2 .89-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z" /></svg>
  const orignalLanguage = getLanguageNameByISOCode(message.translatedMessage?.srcLanguage || '')
  useEffect(() => {
    if (isAudio && audioRef.current === null) {
      audioRef.current = new Audio(message.fileUrl)
    }
  }, [])

  const togglePlayback = () => {
    if (isPlayingAudio) {
      audioRef.current?.pause();
    } else {
      audioRef.current?.play();
    }
    setIsPlayingAudio((prev) => !prev);
  }
  return (
    <div className={`chat-item ${isCurrentUser ? 'current-user' : ''}`}>
      {
        isText
          ? <div className="message-text">
            {isCurrentUser ? message.text : message.translatedMessage?.text}
          </div>
          : isFile ? <a href={message.fileUrl} target="_blank">
            <div className="message-text">{fileIcon} </div>
            <div className="message-text">{message.text || 'File'}</div>
          </a>
            : isImg ? <a href={message.fileUrl} target="_blank">
              <div className="message-text">
                <img height={80} width={80} src={message.fileUrl} alt="img" />
              </div>
            </a>
              : isAudio ?
                <AudioMessage togglePlayback={togglePlayback} message={message} isPlayingAudio={isPlayingAudio} />
                : <></>
      }
      <div className="message-info">
        {isCurrentUser ? <></> : <span className="user-id">send by: {userName}</span>}
        {isCurrentUser || !message.text ? <></> : <div className="message-text-translated">
          {orignalLanguage}{': '}{message.text}
        </div>}
        <div className="timestamp">{formattedTime}</div>
      </div>
    </div>
  );
};
