import { useEffect, useState } from 'react';
import data from '../data/threadChatMock.json';
import Picker from '@emoji-mart/react';
import dataEmoji from '@emoji-mart/data';


interface Message {
  id: string;
  author: string;
  text: string;
  timestamp: string;
  likes: number;
  dislikes: number;
  replies: Message[];
}

export default function FanThreadChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [nick, setNick] = useState<string>('');
  const [nickInput, setNickInput] = useState<string>(''); // 👈 FALTAVA ESSE AQUI
  const [input, setInput] = useState<string>('');
  const [replyInputs, setReplyInputs] = useState<Record<string, string>>({});
  const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(false);



  useEffect(() => {
    const storedMessages = localStorage.getItem('messages');
    if (storedMessages) {
      setMessages(JSON.parse(storedMessages));
    } else {
      setMessages(data as Message[]);
      localStorage.setItem('messages', JSON.stringify(data));
    }
  }, []);

  const saveMessages = (updatedMessages: Message[]) => {
    setMessages(updatedMessages);
    localStorage.setItem('messages', JSON.stringify(updatedMessages));
  };

  const handleSend = () => {
    if (!nick || !input.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      author: nick,
      text: input,
      timestamp: new Date().toISOString(),
      likes: 0,
      dislikes: 0,
      replies: [],
    };

    saveMessages([newMessage, ...messages]);
    setInput('');
  };

  const handleSendReply = (parentId: string) => {
    if (!nick || !replyInputs[parentId]?.trim()) return;

    const newReply: Message = {
      id: Date.now().toString(),
      author: nick,
      text: replyInputs[parentId],
      timestamp: new Date().toISOString(),
      likes: 0,
      dislikes: 0,
      replies: [],
    };

    const updatedMessages = messages.map(msg => {
      if (msg.id === parentId) {
        return { ...msg, replies: [...msg.replies, newReply] };
      }
      return msg;
    });

    saveMessages(updatedMessages);
    setReplyInputs(prev => ({ ...prev, [parentId]: '' }));
  };

  const handleEmojiSelect = (emoji: { native: string }) => {
    setInput(prev => prev + emoji.native);
  };

  const handleLike = (messageId: string, replyId?: string) => {
    const updatedMessages = messages.map(msg => {
      if (msg.id === messageId) {
        if (replyId) {
          const updatedReplies = msg.replies.map(rep => rep.id === replyId ? { ...rep, likes: rep.likes + 1 } : rep);
          return { ...msg, replies: updatedReplies };
        }
        return { ...msg, likes: msg.likes + 1 };
      }
      return msg;
    });
    saveMessages(updatedMessages);
  };

  const handleDislike = (messageId: string, replyId?: string) => {
    const updatedMessages = messages.map(msg => {
      if (msg.id === messageId) {
        if (replyId) {
          const updatedReplies = msg.replies.map(rep => rep.id === replyId ? { ...rep, dislikes: rep.dislikes + 1 } : rep);
          return { ...msg, replies: updatedReplies };
        }
        return { ...msg, dislikes: msg.dislikes + 1 };
      }
      return msg;
    });
    saveMessages(updatedMessages);
  };

  return (
    <div className="mt-[50px] mb-[100px] w-[90%] mx-auto rounded-[32px] bg-[#f9f9f9] shadow-xl flex flex-col max-h-[80vh]">
      {!nick && (
        <div className="p-4 bg-white rounded-t-[32px] shadow-md space-y-2">
          <input
            className="border border-gray-300 p-3 w-full rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Escolha um nick para participar"
            value={nickInput}
            onChange={(e) => setNickInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && nickInput.trim() && setNick(nickInput.trim())}
          />
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-xl w-full"
            onClick={() => nickInput.trim() && setNick(nickInput.trim())}
          >
            Entrar no chat
          </button>
        </div>
      )}


      {nick && (
        <>
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 bg-[#f9f9f9]">
            {messages.map((msg) => (
              <div key={msg.id} className="bg-white rounded-2xl shadow-md p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <strong className="text-gray-800">{msg.author}</strong>
                  <span className="text-xs text-gray-400">{new Date(msg.timestamp).toLocaleString()}</span>
                </div>
                <p className="text-gray-700">{msg.text}</p>
                <div className="flex gap-2 text-sm">
                  <button onClick={() => handleLike(msg.id)} className="bg-gray-100 hover:bg-blue-100 text-gray-600 rounded-full px-3 py-1 shadow-sm">
                    👍 {msg.likes}
                  </button>
                  <button onClick={() => handleDislike(msg.id)} className="bg-gray-100 hover:bg-red-100 text-gray-600 rounded-full px-3 py-1 shadow-sm">
                    👎 {msg.dislikes}
                  </button>
                </div>

                <details className="pt-2 text-sm">
                  <summary className="cursor-pointer text-blue-600 hover:underline">
                    Responder / Ver respostas ({msg.replies.length})
                  </summary>
                  <div className="mt-3 pl-4 border-l border-gray-200 space-y-3">
                    {msg.replies.map((rep) => (
                      <div key={rep.id} className="bg-gray-100 rounded-xl p-3 shadow-sm">
                        <div className="flex items-center justify-between">
                          <strong className="text-gray-700">{rep.author}</strong>
                          <span className="text-xs text-gray-400">{new Date(rep.timestamp).toLocaleString()}</span>
                        </div>
                        <p className="text-gray-700">{rep.text}</p>
                        <div className="flex gap-2 mt-1 text-xs">
                          <button onClick={() => handleLike(msg.id, rep.id)} className="bg-gray-200 hover:bg-blue-100 text-gray-600 rounded-full px-2 py-1 shadow-sm">
                            👍 {rep.likes}
                          </button>
                          <button onClick={() => handleDislike(msg.id, rep.id)} className="bg-gray-200 hover:bg-red-100 text-gray-600 rounded-full px-2 py-1 shadow-sm">
                            👎 {rep.dislikes}
                          </button>
                        </div>
                      </div>
                    ))}

                    <input
                      className="border border-gray-300 rounded-lg p-2 w-full mt-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                      placeholder="Escreva uma resposta..."
                      value={replyInputs[msg.id] || ''}
                      onChange={(e) =>
                        setReplyInputs((prev) => ({ ...prev, [msg.id]: e.target.value }))
                      }
                      onKeyDown={(e) => e.key === 'Enter' && handleSendReply(msg.id)}
                    />
                    <button
                      className="bg-blue-500 hover:bg-blue-600 text-white w-full mt-2 py-2 rounded-lg text-sm"
                      onClick={() => handleSendReply(msg.id)}
                    >
                      Enviar resposta
                    </button>
                  </div>
                </details>
              </div>
            ))}
          </div>

          <div className="p-4 bg-white border-t border-gray-200 relative shadow-inner rounded-b-[32px]">
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
              <div className="absolute bottom-16 right-4 z-50">
                <Picker data={dataEmoji} onEmojiSelect={handleEmojiSelect} theme="light" />
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );


}
