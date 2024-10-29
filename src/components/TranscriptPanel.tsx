import { useEffect, useRef } from "react";
import {
  ITranscript
} from "../interface/interfaces";
import { ChatMessage } from "./ChatMessage";
import { TranscriptText } from "./TranscriptText";

export const TranscriptPanel = ({ transcript, currentUserId }: { transcript: ITranscript[], currentUserId: string }) => {
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [transcript]);

  return (
    <div className="chat-container">
      <h4>Transcript</h4>
      <div className="messages-container">
        {transcript.map((message, index) => (
          <TranscriptText key={index} message={message} currentUserId={currentUserId} />
        ))}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}