import { useEffect, useState } from 'react';
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
      } catch (err) {
        console.error('Erro ao buscar mensagens:', err);
      }
    };


    fetchData();
    loadMessages();
  }, [user]);

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
      className="mt-[50px] mb-[100px] w-[90%] mx-auto bg-[#f9f9f9] shadow-xl rounded-[32px] min-h-[1000px] flex flex-col"
      style={{ fontFamily: '"Helvetica World", Arial, Helvetica, sans-serif' }}
    >
      <div className="flex-1 p-4 overflow-y-scroll space-y-6">
        {messages.filter(m => !m.parent_id).map(msg => {
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
                      if (current === true) return { ...prev, [msg.id]: false };
                      else return { ...prev, [msg.id]: true };
                    })
                  }
                />
              )}
            </div>
          );
        })}
      </div>

      <div className="p-4 bg-white rounded-b-[32px]">
        <div className="flex gap-2 items-center">
          <input
            className="flex-1 border border-gray-300 p-3 rounded-xl"
            placeholder="Digite sua mensagem"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          />
          <button onClick={() => setShowEmojiPicker(!showEmojiPicker)} className="px-3 py-2 bg-gray-100 rounded-xl">
            😊
          </button>
          <button onClick={handleSend} className="bg-blue-500 text-white px-4 py-2 rounded-xl">
            Enviar
          </button>
        </div>

        {showEmojiPicker && (
          <div className="absolute bottom-[100%] right-4">
            <Picker data={dataEmoji} onEmojiSelect={handleEmojiSelect} theme="light" />
          </div>
        )}
      </div>
    </div>
  );


}
