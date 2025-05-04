import React, { useState } from 'react';
import Picker from '@emoji-mart/react';
import dataEmoji from '@emoji-mart/data';

interface Props {
  parentId: number;
  nickname: string;
  value: string;
  onChange: (val: string) => void;
  onSubmit: () => void;
}

export default function ReplyBubble({ parentId, nickname, value, onChange, onSubmit }: Props) {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  return (
    <div className="bg-white border rounded-2xl p-3 shadow-md mt-4 ml-6">
      <div className="text-sm text-gray-600 mb-1">Responder a <strong>{nickname}</strong></div>
      <input
        className="border border-gray-300 rounded-lg p-2 w-full text-sm"
        placeholder="Escreva uma resposta..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && onSubmit()}
      />
      <div className="flex justify-end items-center mt-2 gap-2">
        <button
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          className="text-lg"
        >
          😊
        </button>
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded text-sm"
          onClick={onSubmit}
        >
          Enviar resposta
        </button>
      </div>
      {showEmojiPicker && (
        <div className="absolute z-50">
          <Picker
            data={dataEmoji}
            onEmojiSelect={(emoji: any) => onChange(value + emoji.native)}
            theme="light"
          />
        </div>
      )}
    </div>
  );
}
