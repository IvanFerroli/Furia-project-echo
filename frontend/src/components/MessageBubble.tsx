import React from 'react';
import { Message } from '../types/Message';

interface Props {
  message: Message;
  isMine: boolean;
  avatar: string;
  hasTrophy: boolean;
  onReact: (id: number, type: 'like' | 'dislike') => void;
  onToggleReply: () => void;
}

export default function MessageBubble({
  message,
  isMine,
  avatar,
  hasTrophy,
  onReact,
  onToggleReply
}: Props) {
  return (
    <div
      className={`flex ${isMine ? 'justify-end' : 'justify-start'} items-start w-full`}
      style={{ fontFamily: '"Helvetica World", Arial, Helvetica, sans-serif', marginBottom: '25px' }}
    >
      <div
        className={`w-[80%] bg-[#1e1e1e] text-[#f3f4f6] py-6 px-6 min-h-[150px] rounded-[2rem] shadow-[0_10px_25px_rgba(0,0,0,0.4)] transition-all duration-300 hover:scale-[1.02] relative pb-[48px] ${
          isMine ? 'rounded-tr-none' : 'rounded-tl-none'
        }`}
      >
        {/* Avatar */}
        {!isMine && (
          <img
            src={message.profile_image || '/default-avatar.png'}
            className="w-8 h-8 rounded-full object-cover absolute top-[-16px] left-[-16px] border-2 border-white shadow-md"
          />
        )}
        {isMine && (
          <img
            src={avatar}
            className="w-8 h-8 rounded-full object-cover absolute top-[-16px] right-[-16px] border-2 border-white shadow-md"
          />
        )}

        {/* Header */}
        <div className="flex items-center gap-2 mb-3">
          <strong className="text-md" style={{ fontFamily: '"Helvetica World", Arial, Helvetica, sans-serif' }}>
            {message.nickname}
          </strong>
          {hasTrophy && <span className="ml-1 text-yellow-400">🏆</span>}
          <span className="text-xs text-gray-400">
            {new Date(message.timestamp).toLocaleString()}
          </span>
        </div>

        {/* Texto */}
        <p className="whitespace-pre-wrap text-[15px] leading-relaxed">{message.text}</p>

        {/* Botões */}
        <div
          className={`absolute bottom-[-20px] ${
            isMine ? 'right-[24px]' : 'left-[24px]'
          } flex gap-3`}
        >
          <button
            className="rounded-full bg-gray-100 text-black px-4 py-1 text-sm hover:bg-gray-200 transition shadow"
            style={{ fontFamily: '"Helvetica World", Arial, Helvetica, sans-serif' }}
            onClick={() => onReact(message.id, 'like')}
          >
            👍 {message.likes}
          </button>
          <button
            className="rounded-full bg-gray-100 text-black px-4 py-1 text-sm hover:bg-gray-200 transition shadow"
            style={{ fontFamily: '"Helvetica World", Arial, Helvetica, sans-serif' }}
            onClick={() => onReact(message.id, 'dislike')}
          >
            👎 {message.dislikes}
          </button>

          {/* Botão de resposta com badge */}
          <div className="relative">
            <button
              className="rounded-full bg-white text-black px-4 py-1 text-sm border border-gray-300 hover:bg-gray-100 transition shadow"
              style={{
                marginLeft: '5px',
                fontFamily: '"Helvetica World", Arial, Helvetica, sans-serif'
              }}
              onClick={onToggleReply}
            >
              ...
            </button>
            {message.replyCount > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: '-8px',
                  right: '-8px',
                  backgroundColor: '#ff3b3b',
                  color: 'white',
                  fontSize: '0.75rem',
                  borderRadius: '9999px',
                  padding: '2px 6px',
                  boxShadow: '0 0 10px rgba(255, 0, 0, 0.6)',
                  animation: 'pulseBadge 1.5s infinite',
                  fontFamily: '"Helvetica World", Arial, Helvetica, sans-serif',
                }}
              >
                {message.replyCount}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
