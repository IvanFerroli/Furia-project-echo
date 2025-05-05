import React, { useRef, useEffect } from 'react';
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
    const containerRef = useRef<HTMLDivElement>(null);

    const hasMounted = useRef(false);


    useEffect(() => {
        if (!hasMounted.current) {
            hasMounted.current = true;
            return;
        }

        function handleClickOutside(event: MouseEvent) {
            if (
                showEmoji &&
                containerRef.current &&
                !containerRef.current.contains(event.target as Node)
            ) {
                toggleEmoji();
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [showEmoji, toggleEmoji]);

    return (
        <div
            ref={containerRef}
            className="w-[80%] ml-auto mr-auto mt-[-30px] mb-[40px] z-10 relative animate-fade-in"
            style={{
                transform: 'translateY(30px)',
                fontFamily: '"Helvetica World", Arial, Helvetica, sans-serif',
                transition: 'all 0.4s ease-in-out',
                borderRadius: '2rem',
                boxShadow: '0 10px 25px rgba(0,0,0,0.4)',
                backgroundColor: '#1e1e1e',
                padding: '32px',
            }}
        >
            {replies.map((rep) => {
                const isMine = rep.user_id === user?.uid;
                return (
                    <div
                        key={rep.id}
                        className="relative flex flex-col hover:scale-[1.01] transition-transform"
                        style={{
                            backgroundColor: isMine ? '#2a2a2a' : '#494b6b',
                            color: '#f3f4f6',
                            fontFamily: '"Helvetica World", Arial, Helvetica, sans-serif',
                            borderRadius: '2rem',
                            boxShadow: '0 10px 25px rgba(0,0,0,0.4)',
                            padding: '32px',
                            marginBottom: '20px',
                        }}
                    >
                        {/* Avatar */}
                        <img
                            src={rep.profile_image || '/furia-logos.png'}
                            onError={(e) => {
                                const img = e.currentTarget as HTMLImageElement;
                                if (img.src !== window.location.origin + '/furia-logos.png') {
                                    img.src = '/furia-logos.png';
                                }
                            }}
                            style={{
                                width: '50px',
                                height: '50px',
                                borderRadius: '50%',
                                objectFit: 'cover',
                                position: 'absolute',
                                top: '10px',
                                left: '10px',
                                border: '2px solid white',
                                boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
                            }}
                        />

                        {/* Nickname */}
                        <div
                            style={{
                                position: 'absolute',
                                top: '16px',
                                left: '75px',
                                fontSize: '17px',
                                fontWeight: 700,
                                fontFamily: '"Helvetica World", Arial, Helvetica, sans-serif',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                            }}
                        >
                            <span>{rep.nickname}</span>
                        </div>

                        {/* Timestamp */}
                        <span
                            style={{
                                position: 'absolute',
                                bottom: '20px',
                                left: '32px',
                                fontSize: '12px',
                                color: '#c0c0c0',
                                fontFamily: '"Helvetica World", Arial, Helvetica, sans-serif',
                            }}
                        >
                            {new Date(rep.timestamp).toLocaleString()}
                        </span>

                        {/* Texto */}
                        <div
                            className="flex items-center justify-center text-center text-[15px] leading-relaxed whitespace-pre-wrap break-words"
                            style={{
                                minHeight: '60px',
                                padding: '0 8px',
                                fontFamily: '"Helvetica World", Arial, sans-serif',
                            }}
                        >
                            {rep.text}
                        </div>

                        {/* Reações */}
                        <div className="flex gap-2 mt-2 text-xs">
                            <button
                                className="bg-gray-100 text-black rounded-full px-3 py-1"
                                style={{ fontFamily: '"Helvetica World", Arial, Helvetica, sans-serif' }}
                                onClick={() => onReact(rep.id, 'like')}
                            >
                                👍 {rep.likes}
                            </button>
                            <button
                                className="bg-gray-100 text-black rounded-full px-3 py-1"
                                style={{ fontFamily: '"Helvetica World", Arial, Helvetica, sans-serif' }}
                                onClick={() => onReact(rep.id, 'dislike')}
                            >
                                👎 {rep.dislikes}
                            </button>
                        </div>
                    </div>
                );
            })}

            {/* input de resposta */}
            <div className="relative">
                <input
                    className="bg-transparent border-b border-gray-500 p-2 w-full text-sm focus:outline-none placeholder:text-gray-400"
                    style={{
                        fontFamily: '"Helvetica World", Arial, Helvetica, sans-serif',
                        color: 'white'
                    }}
                    placeholder={`Responder a ${parentMessage.nickname}...`}
                    value={replyValue}
                    onChange={(e) => onChange(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && onSendReply(parentMessage.id)}
                />

                <div className="flex justify-end items-center gap-2 mt-2 relative">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            toggleEmoji();
                        }}
                        className="text-lg hover:scale-110 transition-transform"
                        style={{ fontFamily: '"Helvetica World", Arial, Helvetica, sans-serif' }}
                    >
                        😊
                    </button>

                    <button
                        onClick={() => onSendReply(parentMessage.id)}
                        className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-4 rounded-full text-sm shadow-md"
                        style={{ fontFamily: '"Helvetica World", Arial, Helvetica, sans-serif' }}
                    >
                        Enviar
                    </button>

                    {hasMounted.current && showEmoji && (
                        <div className="absolute bottom-[110%] right-0 z-50">
                            <Picker
                                data={dataEmoji}
                                onEmojiSelect={(emoji: any) =>
                                    onChange(replyValue + emoji.native)
                                }
                                theme="dark"
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );

}
