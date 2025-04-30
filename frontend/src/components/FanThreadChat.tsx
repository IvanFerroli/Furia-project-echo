import React, { useEffect, useState } from 'react';
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

    const updatedMessages = [newMessage, ...messages];
    setMessages(updatedMessages);
    localStorage.setItem('messages', JSON.stringify(updatedMessages));
    setInput('');
  };

  const handleEmojiSelect = (emoji: { native: string }) => {
    setInput(prev => prev + emoji.native);
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
                  <button>👍 {msg.likes}</button>
                  <button>👎 {msg.dislikes}</button>
                </div>
                {msg.replies.length > 0 && (
                  <details>
                    <summary className="cursor-pointer text-sm text-blue-600 hover:text-blue-800">
                      Ver respostas ({msg.replies.length})
                    </summary>
                    {msg.replies.map((rep) => (
                      <div key={rep.id} className="ml-4 border-t pt-2">
                        <strong>{rep.author}</strong>
                        <p>{rep.text}</p>
                        <div className="flex gap-2 mt-2">
                          <button>👍 {rep.likes}</button>
                          <button>👎 {rep.dislikes}</button>
                        </div>
                      </div>
                    ))}
                  </details>
                )}
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
              <div className="absolute bottom-12 right-0">
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
