import { useEffect, useState } from 'react';
import Picker from '@emoji-mart/react';
import dataEmoji from '@emoji-mart/data';
import { useAuth } from '../contexts/AuthContext';
import { getUserProfile } from '../services/getUserProfile';
import { fetchMessages, sendMessage, reactToMessage } from '../services/messagesService';

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
}

export default function FanThreadChat() {
  const { user } = useAuth();
  const [nick, setNick] = useState('');
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
      } catch (err) {
        console.error('Erro ao buscar nickname:', err);
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
      setReplyInputs((prev) => ({ ...prev, [parentId]: '' }));
      setShowReplyEmoji((prev) => ({ ...prev, [parentId]: false }));
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
    setInput((prev) => prev + emoji.native);
  };

  return (
    <div
      className="mt-[50px] mb-[100px] w-[90%] mx-auto rounded-[32px] bg-[#f9f9f9] shadow-xl flex flex-col"
      style={{ minHeight: '1000px' }}
    >
      {nick && (
        <>
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 bg-[#f9f9f9]">
            {messages.filter(m => !m.parent_id).map(msg => (
              <div key={msg.id} className="bg-[#fbfbfb] border border-[#fff] rounded-3xl shadow-sm p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <strong>{msg.nickname}</strong>
                  <span className="text-xs text-gray-400">{new Date(msg.timestamp).toLocaleString()}</span>
                </div>
                <p>{msg.text}</p>
                <div className="flex gap-2 text-sm">
                  <button onClick={() => handleReact(msg.id, 'like')}>👍 {msg.likes}</button>
                  <button onClick={() => handleReact(msg.id, 'dislike')}>👎 {msg.dislikes}</button>
                </div>

                <details>
                  <summary className="cursor-pointer text-blue-600 hover:underline">
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
              </div>
            ))}
          </div>
          <div className="p-4 bg-white border-t border-gray-200 relative rounded-b-[32px]">
            <div className="flex items-center gap-2">
              <input
                className="flex-1 border border-gray-300 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Digite sua mensagem"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              />
              <button
                className="text-xl px-3 py-2 rounded-xl shadow-sm bg-gray-100 hover:bg-gray-200"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              >
                😊
              </button>
              <button
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-xl"
                onClick={handleSend}
              >
                Enviar
              </button>
            </div>
            {showEmojiPicker && (
              <div className="absolute bottom-[100%] right-4 z-50">
                <Picker
                  data={dataEmoji}
                  onEmojiSelect={handleEmojiSelect}
                  theme="light"
                />
              </div>
            )}

          </div>
        </>
      )}
    </div>
  );
}
