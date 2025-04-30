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
    <div className="border-2 border-gray-300 rounded-lg bg-white shadow-md p-4 max-w-3xl mx-auto">
      {!nick && (
        <div className="mb-4">
          <input
            className="border p-2 w-full rounded"
            placeholder="Digite seu nick"
            onChange={(e) => setNick(e.target.value)}
          />
        </div>
      )}

      {nick && (
        <>
          <div className="max-h-96 overflow-y-auto space-y-4">
            {messages.map((msg) => (
              <div key={msg.id} className="border p-3 rounded">
                <strong>{msg.author}</strong>
                <p>{msg.text}</p>
                <div className="flex gap-2 mt-2">
                  <button onClick={() => handleLike(msg.id)}>👍 {msg.likes}</button>
                  <button onClick={() => handleDislike(msg.id)}>👎 {msg.dislikes}</button>
                </div>

                <details className="mt-2">
                  <summary className="cursor-pointer text-sm text-blue-600 hover:text-blue-800">
                    Responder / Ver respostas ({msg.replies.length})
                  </summary>
                  <div className="mt-2 ml-4">
                    {msg.replies.map((rep) => (
                      <div key={rep.id} className="border-t pt-2">
                        <strong>{rep.author}</strong>
                        <p>{rep.text}</p>
                        <div className="flex gap-2 mt-2">
                          <button onClick={() => handleLike(msg.id, rep.id)}>👍 {rep.likes}</button>
                          <button onClick={() => handleDislike(msg.id, rep.id)}>👎 {rep.dislikes}</button>
                        </div>
                      </div>
                    ))}

                    <input
                      className="border p-1 mt-2 w-full rounded"
                      placeholder="Digite sua resposta"
                      value={replyInputs[msg.id] || ''}
                      onChange={(e) => setReplyInputs(prev => ({ ...prev, [msg.id]: e.target.value }))}
                      onKeyDown={(e) => e.key === 'Enter' && handleSendReply(msg.id)}
                    />
                    <button
                      className="mt-2 bg-gray-300 text-black p-1 rounded w-full"
                      onClick={() => handleSendReply(msg.id)}
                    >
                      Enviar resposta
                    </button>
                  </div>
                </details>
              </div>
            ))}
          </div>

          <div className="mt-4 relative">
            <input
              className="border p-2 w-full rounded pr-10"
              placeholder="Digite sua mensagem"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            />
            <button
              className="absolute right-2 top-1/2 -translate-y-1/2"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            >
              😊
            </button>
            {showEmojiPicker && (
              <div className="absolute bottom-12 right-0 z-10">
                <Picker data={dataEmoji} onEmojiSelect={handleEmojiSelect} />
              </div>
            )}
            <button
              className="mt-2 w-full bg-blue-500 text-white p-2 rounded"
              onClick={handleSend}
            >
              Enviar
            </button>
          </div>
        </>
      )}
    </div>
  );
}
