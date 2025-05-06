import { useEffect, useState, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getUserProfile } from '../services/getUserProfile';
import { getUserAwards } from '../services/getUserAwards';
import { fetchMessages, sendMessage, reactToMessage } from '../services/messagesService';
import MessageBubble from '../components/MessageBubble';
import ReplyBubble from '../components/ReplyBubble';
import { Message } from '../types/Message';
import Picker from '@emoji-mart/react';
import dataEmoji from '@emoji-mart/data';

export default function FanThreadChat() {
  const { user } = useAuth();
  const [nick, setNick] = useState('');
  const [avatar, setAvatar] = useState('/default-avatar.png');
  const [hasTrophy, setHasTrophy] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [replyOpenForId, setReplyOpenForId] = useState<number | null>(null);


  useEffect(() => {
    const fetchData = async () => {
      if (!user?.uid) return;
      try {
        const profile = await getUserProfile(user.uid);
        setNick(profile.nickname || '');
        setAvatar(profile.profile_image || '/default-avatar.png');
        const awards = await getUserAwards(user.uid);
        setHasTrophy(awards.some((a: { name: string }) => a.name === 'Verificado'));
      } catch (err) {
        console.error('Erro ao carregar perfil:', err);
      }
    };

    const loadMessages = async () => {
      try {
        const data = await fetchMessages();
        setMessages(data);
        setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 0);
      } catch (err) {
        console.error('Erro ao buscar mensagens:', err);
      }
    };

    fetchData();
    loadMessages();
  }, [user]);

  useEffect(() => {
    setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 0);
  }, [messages.length]);

  const refreshMessages = async () => {
    try {
      const updated = await fetchMessages();
      setMessages(updated);
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

  const handleSendReply = async (parentId: number, text: string) => {
    if (!nick || !text.trim() || !user?.uid) return;
    try {
      await sendMessage({ user_id: user.uid, nickname: nick, text, parent_id: parentId });
      await refreshMessages();
    } catch (err) {
      console.error('Erro ao enviar resposta:', err);
    }
  };

  const handleReact = async (id: number, type: 'like' | 'dislike') => {
    try {
      if (!user?.uid) return;
      await reactToMessage(String(id), type, user.uid);
      await refreshMessages();

    } catch (err) {
      console.error(`Erro ao reagir com ${type}:`, err);
    }
  };

  const toggleReplyForMessage = (id: number) => {
    setReplyOpenForId(current => (current === id ? null : id));
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
      {/* Scrollable area with messages */}
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
          .filter((m) => !m.parent_id)
          .map((msg) => (
            <div key={msg.id}>
              <MessageBubble
                message={msg}
                currentUser={user}
                avatar={avatar}
                hasTrophy={hasTrophy}
                onReact={handleReact}
                onToggleReply={() => setReplyOpenForId((id) => (id === msg.id ? null : msg.id))}
              />
              {replyOpenForId === msg.id && (
                <div className="w-full flex justify-center mt-[-10px] mb-[20px]">
                  <ReplyBubble
                    parentMessage={msg}
                    replies={messages.filter((m) => m.parent_id === msg.id)}
                    user={user}
                    nick={nick}
                    avatar={avatar}
                    onSendReply={handleSendReply}
                    onReact={handleReact}
                  />
                </div>
              )}
            </div>
          ))}

      </div>

      {/* Input bar */}
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
              <Picker data={dataEmoji} onEmojiSelect={(emoji: { native: string }) => setInput((prev) => prev + emoji.native)}
                theme="dark" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
