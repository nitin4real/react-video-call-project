import { useEffect, useRef } from "react";
import {
  ITranscript
} from "../interface/interfaces";
import { ChatMessage } from "./ChatMessage";
import { TranscriptText } from "./TranscriptText";
import downloadImg from '../images/download.png'
import { userDataStore } from "../store/UserDataStore";

export const TranscriptPanel = ({ transcript, currentUserId, completeTranscript }: { transcript: ITranscript[], currentUserId: string, completeTranscript: React.MutableRefObject<ITranscript[]> }) => {
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [transcript]);

  return (
    <div className="chat-container">
      <h4 className="transcript-heading">
        <div>
          Transcript
        </div>
        <a
          download={
            `transcript-${new Date().toISOString().replace(/:/g, '-')}.txt`
          }
          title="Download Complete Transcript"
          href={`data:text/plain;charset=utf-8,${encodeURIComponent(completeTranscript.current.map((message) => `${message.timestamp.getUTCDate()}: ${message.uid}: ${userDataStore.getUserName(message.uid) || 'Unknown'}:  ${message.spokenWords ? '(SpokenWords)' : '(Translated)'}  ${message.text}`).join('\n'))}`
          }>
          <img className="download-img" src={downloadImg} alt="Download" />

        </a>
      </h4>

      <div className="messages-container">
        {transcript.map((message, index) => (
          <TranscriptText key={index} message={message} currentUserId={currentUserId} />
        ))}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}