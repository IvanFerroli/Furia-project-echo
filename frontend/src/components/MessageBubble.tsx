import React from 'react';
import { Message } from '../types/Message';

interface Props {
  message: Message;
  isMine: boolean;
  avatar: string;
  hasTrophy: boolean;
  onReact: (id: number, type: 'like' | 'dislike') => void;
  children?: React.ReactNode;
}

export default function MessageBubble({
  message,
  isMine,
  avatar,
  hasTrophy,
  onReact,
  children
}: Props) {
  return (
    <div className={`flex ${isMine ? 'justify-end' : 'justify-start'} gap-2 items-start`}>
      <div className={`max-w-[70%] bg-[#1e1e1e] text-[#f3f4f6] p-4 rounded-[2rem] shadow-lg ${isMine ? 'rounded-tr-none' : 'rounded-tl-none'} relative`}>
        {!isMine && <img src={message.profile_image || '/default-avatar.png'} className="w-4 h-4 rounded-full object-cover absolute top-0 left-0" />}
        {isMine && <img src={avatar} className="w-4 h-4 rounded-full object-cover absolute top-0 right-0" />}
        <div className="flex items-center gap-2 mb-1">
          <strong>{message.nickname}</strong>
          {message.nickname === avatar && hasTrophy && ' 🏆'}
          <span className="text-xs text-gray-400">{new Date(message.timestamp).toLocaleString()}</span>
        </div>
        <p className="whitespace-pre-wrap">{message.text}</p>
        <div className="flex gap-2 mt-2">
          <button className="rounded-full bg-gray-100 px-3 py-1" onClick={() => onReact(message.id, 'like')}>👍 {message.likes}</button>
          <button className="rounded-full bg-gray-100 px-3 py-1" onClick={() => onReact(message.id, 'dislike')}>👎 {message.dislikes}</button>
        </div>
        {children}
      </div>
    </div>
  );
}
