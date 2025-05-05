import { useState } from 'react';
import { Message } from '../types/Message';

interface Props {
    message: Message;
    currentUser: any;
    avatar: string;
    hasTrophy: boolean;
    onReact: (id: number, type: 'like' | 'dislike') => void;
    onToggleReply: () => void; // 👈 necessário para controle externo
}


export default function MessageBubble({
    message,
    currentUser,
    avatar,
    hasTrophy,
    onReact,
    onToggleReply,
}: Props) {
    const [isReplyOpen, setIsReplyOpen] = useState(false);

    const isMine = currentUser?.uid === message.user_id;

    return (
        <div
            className={`flex ${isMine ? 'justify-end' : 'justify-start'} items-start w-full`}
            style={{
                fontFamily: '"Helvetica World", Arial, Helvetica, sans-serif',
                marginBottom: '25px'
            }}
        >
            <div
                className={`w-[80%] bg-[#1e1e1e] text-[#f3f4f6] min-h-[150px] rounded-[2rem] shadow-[0_10px_25px_rgba(0,0,0,0.4)] transition-all duration-300 hover:scale-[1.02] relative ${isMine ? 'rounded-tr-none' : 'rounded-tl-none'
                    }`}
                style={{
                    paddingTop: '48px',
                    paddingBottom: '48px',
                    paddingLeft: '32px',
                    paddingRight: '32px',
                    fontFamily: '"Helvetica World", Arial, Helvetica, sans-serif',
                    backgroundColor: isMine ? '#1e1e1e' : '#3a3d5c',
                    color: '#f3f4f6',
                    borderRadius: '2rem',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.4)',
                    transition: 'all 0.3s',
                    minHeight: '150px',
                    position: 'relative'
                }}
            >
                {/* Avatar */}
                {!isMine && (
                    <img
                        src={message.profile_image || '/furia-logos.png'}
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

                )}

                {isMine && (
                    <img
                        src={avatar || '/furia-logos.png'}
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
                            right: '10px',
                            border: '2px solid white',
                            boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
                        }}
                    />

                )}

                {/* Header */}
                {/* Nickname no topo esquerdo */}
                <div
                    style={{
                        position: 'absolute',
                        top: '16px',
                        right: isMine ? '75px' : 'auto',
                        left: isMine ? 'auto' : '75px',
                        fontSize: '17px',
                        fontWeight: 700,
                        fontFamily: '"Helvetica World", Arial, Helvetica, sans-serif',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                    }}
                >
                    <span>{message.nickname}</span>
                    {hasTrophy && <span className="text-yellow-400">🏆</span>}
                </div>


                {/* Timestamp no canto inferior esquerdo */}
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
                    {new Date(message.timestamp).toLocaleString()}
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
                    {message.text}
                </div>

                {/* Botões */}
                <div
                    className={`absolute bottom-[-20px] ${isMine ? 'right-[24px]' : 'left-[24px]'
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
                        {typeof message.replyCount === 'number' && message.replyCount > 0 && (

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

