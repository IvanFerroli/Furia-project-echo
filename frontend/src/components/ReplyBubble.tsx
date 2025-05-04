import React, { useState } from 'react';
import Picker from '@emoji-mart/react';
import dataEmoji from '@emoji-mart/data';
import { Message } from '../types/Message';

interface Props {
  parentMessage: Message;
  replies: Message[];
  user: any;
  nick: string;
  avatar: string;
  onSendReply: (parentId: number) => void;
  onReact: (id: number, type: 'like' | 'dislike') => void;
  replyValue: string;
  onChange: (value: string) => void;
  showEmoji: boolean;
  toggleEmoji: () => void;
}

export default function ReplyBubble({
  parentMessage,
  replies,
  user,
  nick,
  avatar,
  onSendReply,
  onReact,
  replyValue,
  onChange,
  showEmoji,
  toggleEmoji
}: Props) {
  return (
    <div
      className="w-[80%] ml-auto mr-auto bg-[#1e1e1e] text-[#f3f4f6] mt-4 p-6 rounded-[2rem] shadow-[0_10px_25px_rgba(0,0,0,0.4)] transition-all duration-500 transform animate-fade-in space-y-4"
      style={{ transform: 'translateY(0)', fontFamily: 'Helvetica World, Arial, sans-serif' }}
    >
      {/* replies */}
      {replies.map((rep) => (
        <div key={rep.id} className="bg-[#2a2a2a] rounded-xl p-3 shadow-inner">
          <div className="flex justify-between items-center mb-1">
            <strong>{rep.nickname}</strong>
            <span className="text-xs text-gray-400">{new Date(rep.timestamp).toLocaleString()}</span>
          </div>
          <p className="text-sm">{rep.text}</p>
          <div className="flex gap-2 mt-2 text-xs">
            <button className="bg-gray-100 text-black rounded-full px-3 py-1" onClick={() => onReact(rep.id, 'like')}>
              👍 {rep.likes}
            </button>
            <button className="bg-gray-100 text-black rounded-full px-3 py-1" onClick={() => onReact(rep.id, 'dislike')}>
              👎 {rep.dislikes}
            </button>
          </div>
        </div>
      ))}
    
      {/* reply input */}
      <div className="relative">
        <input
          className="bg-transparent border-b border-gray-500 p-2 w-full text-sm focus:outline-none placeholder:text-gray-400"
          placeholder={`Responder a ${parentMessage.nickname}...`}
          value={replyValue}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && onSendReply(parentMessage.id)}
        />
        <div className="flex justify-end items-center gap-2 mt-2">
          <button
            onClick={toggleEmoji}
            className="text-lg hover:scale-110 transition-transform"
          >
            😊
          </button>
          <button
            onClick={() => onSendReply(parentMessage.id)}
            className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-4 rounded-full text-sm shadow-md"
          >
            Enviar
          </button>
        </div>
        {showEmoji && (
          <div className="absolute bottom-[110%] right-0 z-50">
            <Picker
              data={dataEmoji}
              onEmojiSelect={(emoji: any) => onChange(replyValue + emoji.native)}
              theme="dark"
            />
          </div>
        )}
      </div>
    </div>
  );
}
