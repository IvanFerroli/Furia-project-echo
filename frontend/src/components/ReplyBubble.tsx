import { useRef, useEffect, useState } from 'react';
import Picker from '@emoji-mart/react';
import dataEmoji from '@emoji-mart/data';
import { Message } from '../types/Message';

interface Props {
    parentMessage: Message;
    replies: Message[];
    user: any;
    nick: string;
    avatar: string;
    onSendReply: (parentId: number, text: string) => void;
    onReact: (id: number, type: 'like' | 'dislike') => void;
}

export default function ReplyBubble({
    parentMessage,
    replies,
    user,
    nick,
    avatar,
    onSendReply,
    onReact
}: Props) {
    const containerRef = useRef<HTMLDivElement>(null);
    const hasMounted = useRef(false);
    const [replyValue, setReplyValue] = useState('');
    const [showEmoji, setShowEmoji] = useState(false);

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
                setShowEmoji(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [showEmoji]);

    return (
        <div
            ref={containerRef}
            className="w-[80%] ml-auto mr-auto mt-[-40px] mb-[40px] z-100 relative animate-fade-in"
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
            {/* Lista de respostas */}
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
                        {/* Avatar da resposta */}
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

                        {/* Nickname da resposta */}
                        <div
                            style={{
                                position: 'absolute',
                                top: '16px',
                                left: '75px',
                                fontSize: '17px',
                                fontWeight: 700,
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                fontFamily: '"Helvetica World", Arial, Helvetica, sans-serif',
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

                        {/* Botões */}
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

            {/* Campo de entrada de resposta */}
            <div className="relative mt-4">
                <input
                    className="bg-transparent border-b border-gray-500 p-2 w-full text-sm focus:outline-none placeholder:text-gray-400"
                    style={{
                        fontFamily: '"Helvetica World", Arial, Helvetica, sans-serif',
                        color: 'white',
                    }}
                    placeholder={`Responder a ${parentMessage.nickname}...`}
                    value={replyValue}
                    onChange={(e) => setReplyValue(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && replyValue.trim()) {
                            onSendReply(parentMessage.id, replyValue.trim());
                            setReplyValue('');
                            setShowEmoji(false);
                        }
                    }}
                />

                <div className="flex justify-end items-center gap-2 mt-2 relative">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setShowEmoji((prev) => !prev);
                        }}
                        className="text-lg hover:scale-110 transition-transform"
                        style={{ fontFamily: '"Helvetica World", Arial, Helvetica, sans-serif' }}
                    >
                        😊
                    </button>
                    <button
                        onClick={() => {
                            if (replyValue.trim()) {
                                onSendReply(parentMessage.id, replyValue.trim());
                                setReplyValue('');
                                setShowEmoji(false);
                            }
                        }}
                        className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-4 rounded-full text-sm shadow-md"
                        style={{ fontFamily: '"Helvetica World", Arial, Helvetica, sans-serif' }}
                    >
                        Enviar
                    </button>

                    {hasMounted.current && showEmoji && (
                        <div className="absolute bottom-[110%] right-0 z-50">
                            <Picker
                                data={dataEmoji}
                                onEmojiSelect={(emoji: any) => setReplyValue(replyValue + emoji.native)}
                                theme="dark"
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
