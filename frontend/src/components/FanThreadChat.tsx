import { useEffect, useState, useRef } from 'react';
import Picker from '@emoji-mart/react';
import dataEmoji from '@emoji-mart/data';
import { useAuth } from '../contexts/AuthContext';
import { getUserProfile } from '../services/getUserProfile';
import { getUserAwards } from '../services/getUserAwards';
import { fetchMessages, sendMessage, reactToMessage } from '../services/messagesService';
import MessageBubble from '../components/MessageBubble';
import { Message } from '../types/Message';
import ReplyBubble from '../components/ReplyBubble';

export default function FanThreadChat() {
  const { user } = useAuth();
  const [nick, setNick] = useState('');
  const [avatar, setAvatar] = useState('/default-avatar.png');
  const [hasTrophy, setHasTrophy] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [replyInputs, setReplyInputs] = useState<Record<number, string>>({});
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showReplyEmoji, setShowReplyEmoji] = useState<Record<number, boolean>>({});
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.uid) return;
      try {
        const profile = await getUserProfile(user.uid);
        setNick(profile.nickname || '');
        setAvatar(profile.profile_image || '/default-avatar.png');
        const awards = await getUserAwards(user.uid);
        setHasTrophy(awards.some(a => a.name === 'Verificado'));
      } catch (err) {
        console.error('Erro ao carregar perfil:', err);
      }
    };

    const loadMessages = async () => {
      try {
        const data = await fetchMessages();
        setMessages(data);
        const defaults: Record<number, boolean> = {};
        data.forEach((msg) => {
          defaults[msg.id] = false;
        });
        setShowReplyEmoji(defaults);
        setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 0);
      } catch (err) {
        console.error('Erro ao buscar mensagens:', err);
      }
    };

    fetchData();
    loadMessages();
  }, [user]);

  // Novo efeito: scroll automático após cada atualização de messages
  useEffect(() => {
    setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 0);
  }, [messages.length]);

  const refreshMessages = async () => {
    try {
      const updated = await fetchMessages();
      setMessages(updated);
      // Removido scroll daqui (agora é automático via useEffect acima)
    } catch (err) {
      console.error('Erro ao atualizar mensagens:', err);
    }
  };

  const handleSend = async () => {
    if (!nick || !input.trim() || !user?.uid) return;
    try {
      await sendMessage({ user_id: user.uid, nickname: nick, text: input });
      await refreshMessages();
      setInput('');
    } catch (err) {
      console.error('Erro ao enviar mensagem:', err);
    }
  };

  const handleSendReply = async (parentId: number) => {
    const replyText = replyInputs[parentId];
    if (!nick || !replyText?.trim() || !user?.uid) return;
    try {
      await sendMessage({ user_id: user.uid, nickname: nick, text: replyText, parent_id: parentId });
      await refreshMessages();
      setReplyInputs(prev => ({ ...prev, [parentId]: '' }));
      setShowReplyEmoji(prev => ({ ...prev, [parentId]: false }));
    } catch (err) {
      console.error('Erro ao enviar resposta:', err);
    }
  };

  const handleReact = async (id: number, type: 'like' | 'dislike') => {
    try {
      await reactToMessage(String(id), type);
      await refreshMessages();
    } catch (err) {
      console.error(`Erro ao reagir com ${type}:`, err);
    }
  };

  const handleEmojiSelect = (emoji: any) => {
    setInput(prev => prev + emoji.native);
  };

  return (
    <div
      className="w-[90%] mx-auto my-[50px] shadow-xl rounded-[32px] flex flex-col"
      style={{
        fontFamily: '"Helvetica World", Arial, Helvetica, sans-serif',
        backgroundColor: '#f9f9f9',
        padding: '24px',
        maxHeight: 'calc(100vh - 100px)',
        msOverflowX: 'hidden',
      }}
    >
      {/* Área scrollável com mensagens */}
      <div
        className="flex-1 overflow-y-auto pr-2"
        style={{
          display: 'flex',
          flexDirection: 'column-reverse',
          gap: '24px',
          paddingBottom: '24px',
        }}
      >
        <div ref={bottomRef} />
        {messages
          .filter(m => !m.parent_id)
          .map(msg => {
            const isMine = user?.uid === msg.user_id;
            const isReplyOpen = showReplyEmoji[msg.id];
  
            return (
              <div key={msg.id} className="space-y-2">
                <MessageBubble
                  message={msg}
                  isMine={isMine}
                  avatar={avatar}
                  hasTrophy={hasTrophy && msg.nickname === nick}
                  onReact={handleReact}
                  onToggleReply={() =>
                    setShowReplyEmoji(prev => ({ ...prev, [msg.id]: !prev[msg.id] }))
                  }
                />
  
                {isReplyOpen && (
                  <ReplyBubble
                    parentMessage={msg}
                    replies={messages.filter(r => r.parent_id === msg.id)}
                    user={user}
                    nick={nick}
                    avatar={avatar}
                    replyValue={replyInputs[msg.id] || ''}
                    onChange={(value) =>
                      setReplyInputs(prev => ({ ...prev, [msg.id]: value }))
                    }
                    onSendReply={() => handleSendReply(msg.id)}
                    onReact={handleReact}
                    showEmoji={showReplyEmoji[msg.id] === true}
                    toggleEmoji={() =>
                      setShowReplyEmoji(prev => {
                        const current = prev[msg.id];
                        return { ...prev, [msg.id]: !current };
                      })
                    }
                  />
                )}
              </div>
            );
          })}
      </div>
  
      {/* Barra fixa no fundo do wrapper */}
      <div className="pt-4 border-t border-gray-300 bg-[#f9f9f9]">
        <div className="flex gap-2 items-center">
          <input
            className="flex-1 border border-gray-300 p-3 rounded-xl"
            placeholder="Digite sua mensagem"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          />
          <button
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className="px-3 py-2 bg-gray-100 rounded-xl"
          >
            😊
          </button>
          <button
            onClick={handleSend}
            className="bg-blue-500 text-white px-4 py-2 rounded-xl"
          >
            Enviar
          </button>
        </div>
  
        {showEmojiPicker && (
          <div className="relative">
            <div className="absolute bottom-[110%] right-0 z-50">
              <Picker data={dataEmoji} onEmojiSelect={handleEmojiSelect} theme="light" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
  
}
