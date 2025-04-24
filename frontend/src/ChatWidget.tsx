import { useState } from 'react';
import { X, Minus } from 'lucide-react';

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [messages, setMessages] = useState([
    { from: 'bot', text: 'Salve, torcedor da FURIA! Como posso te ajudar hoje? 🐆🔥' },
  ]);
  const [input, setInput] = useState('');

  const sendMessage = () => {
    if (!input.trim()) return;
    setMessages([...messages, { from: 'user', text: input }]);
    setInput('');
  };

  return (
    <div className="fixed bottom-4 right-4 w-80 text-sm font-sans z-50">
      {isOpen ? (
        <div className="flex flex-col h-[450px] bg-white shadow-2xl rounded-2xl border border-gray-200 overflow-hidden">
          <div className="flex justify-between items-center bg-black text-white px-4 py-2">
            <span className="font-bold">FURIA Chat</span>
            <div className="flex gap-2">
              <button onClick={() => setIsOpen(false)}><Minus size={16} /></button>
              <button onClick={() => setIsOpen(false)}><X size={16} /></button>
            </div>
          </div>
          <div className="flex-1 p-3 overflow-y-auto space-y-2 bg-zinc-50 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`max-w-[85%] px-3 py-2 rounded-xl whitespace-pre-line ${
                  msg.from === 'user'
                    ? 'ml-auto bg-zinc-300 text-black'
                    : 'bg-black text-white'
                }`}
              >
                {msg.text}
              </div>
            ))}
          </div>
          <div className="p-3 border-t border-gray-200 flex gap-2">
            <input
              className="flex-1 rounded-xl border px-3 py-2 outline-none"
              placeholder="Pergunta algo sobre a FURIA..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            />
            <button
              className="bg-black text-white rounded-xl px-4 py-2"
              onClick={sendMessage}
            >
              Enviar
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-black text-white px-4 py-2 rounded-full shadow-lg"
        >
          💬 Abrir Chat
        </button>
      )}
    </div>
  );
};

export default ChatWidget;
