import { useEffect, useState } from 'react';
import Picker from '@emoji-mart/react';
import dataEmoji from '@emoji-mart/data';
import { useAuth } from '../contexts/AuthContext';
import { getUserProfile } from '../services/getUserProfile';
import { getUserAwards } from '../services/getUserAwards';
import { fetchMessages, sendMessage, reactToMessage } from '../services/messagesService';
import MessageBubble from '../components/MessageBubble';


export interface Message {
  id: number;
  user_id?: string;
  nickname: string;
  text: string;
  timestamp: string;
  likes: number;
  dislikes: number;
  parent_id?: number;
  replyCount?: number;
  profile_image?: string;
}

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
    <div className="mt-[50px] mb-[100px] w-[90%] mx-auto bg-[#f9f9f9] shadow-xl rounded-[32px] min-h-[1000px] flex flex-col">
      <div className="flex-1 p-4 overflow-y-scroll space-y-4">
        {messages.filter(m => !m.parent_id).map(msg => {
          const isMine = user?.uid === msg.user_id;
          return (
            <MessageBubble
              key={msg.id}
              message={msg}
              isMine={isMine}
              avatar={avatar}
              hasTrophy={hasTrophy && msg.nickname === nick}
              onReact={handleReact}
            >
              <details>
                <summary className="cursor-pointer text-blue-600 hover:underline mt-2">
                  Responder / Ver respostas ({msg.replyCount || 0})
                </summary>
                <div className="mt-3 pl-4 border-l border-gray-200 space-y-3">
                  {messages.filter(r => r.parent_id === msg.id).map(rep => (
                    <div key={rep.id} className="bg-white border rounded-2xl p-3 shadow-sm">
                      <div className="flex items-center justify-between">
                        <strong>{rep.nickname}</strong>
                        <span className="text-xs text-gray-400">{new Date(rep.timestamp).toLocaleString()}</span>
                      </div>
                      <p>{rep.text}</p>
                      <div className="flex gap-2 mt-1 text-xs">
                        <button onClick={() => handleReact(rep.id, 'like')}>👍 {rep.likes}</button>
                        <button onClick={() => handleReact(rep.id, 'dislike')}>👎 {rep.dislikes}</button>
                      </div>
                    </div>
                  ))}
                  <div className="relative mt-2">
                    <input
                      className="border border-gray-300 rounded-lg p-2 w-full text-sm"
                      placeholder="Escreva uma resposta..."
                      value={replyInputs[msg.id] || ''}
                      onChange={(e) =>
                        setReplyInputs((prev) => ({ ...prev, [msg.id]: e.target.value }))
                      }
                      onKeyDown={(e) => e.key === 'Enter' && handleSendReply(msg.id)}
                    />
                    <div className="flex justify-end items-center mt-1 gap-2">
                      <button
                        onClick={() =>
                          setShowReplyEmoji((prev) => ({ ...prev, [msg.id]: !prev[msg.id] }))
                        }
                        className="text-lg"
                      >
                        😊
                      </button>
                      <button
                        className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded text-sm"
                        onClick={() => handleSendReply(msg.id)}
                      >
                        Enviar resposta
                      </button>
                    </div>
                    {showReplyEmoji[msg.id] && (
                      <div className="absolute bottom-[100%] right-0 z-50">
                        <Picker
                          data={dataEmoji}
                          onEmojiSelect={(emoji: any) =>
                            setReplyInputs((prev) => ({
                              ...prev,
                              [msg.id]: (prev[msg.id] || '') + emoji.native,
                            }))
                          }
                          theme="light"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </details>
            </MessageBubble>
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
          <button onClick={() => setShowEmojiPicker(!showEmojiPicker)} className="px-3 py-2 bg-gray-100 rounded-xl">😊</button>
          <button onClick={handleSend} className="bg-blue-500 text-white px-4 py-2 rounded-xl">Enviar</button>
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
