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
        <div
            className={`flex ${isMine ? 'justify-end' : 'justify-start'} items-start w-full`}
            style={{ fontFamily: 'Helvetica World, Arial, Helvetica, sans-serif', marginBottom: '20px' }}
        >
            <div
                className={`w-[80%] bg-[#1e1e1e] text-[#f3f4f6] py-6 px-6 min-h-[150px] rounded-[2rem] shadow-[0_10px_25px_rgba(0,0,0,0.4)] transition-all duration-300 hover:scale-[1.02] relative ${isMine ? 'rounded-tr-none' : 'rounded-tl-none'
                    }`}
            >
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

                <div className="flex items-center gap-2 mb-3">
                    <strong className="text-md">{message.nickname}</strong>
                    {hasTrophy && <span className="ml-1 text-yellow-400">🏆</span>}
                    <span className="text-xs text-gray-400">{new Date(message.timestamp).toLocaleString()}</span>
                </div>

                <p className="whitespace-pre-wrap text-[15px] leading-relaxed">{message.text}</p>

                {children}

                <div className="flex gap-3 mt-4">
                    <button
                        className="rounded-full bg-gray-100 text-black px-4 py-1 text-sm hover:bg-gray-200 transition"
                        onClick={() => onReact(message.id, 'like')}
                    >
                        👍 {message.likes}
                    </button>
                    <button
                        className="rounded-full bg-gray-100 text-black px-4 py-1 text-sm hover:bg-gray-200 transition"
                        onClick={() => onReact(message.id, 'dislike')}
                    >
                        👎 {message.dislikes}
                    </button>
                </div>
            </div>
        </div>
    );


}
