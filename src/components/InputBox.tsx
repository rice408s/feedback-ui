import React, { useState } from 'react';
import { Plus, Sparkles, Send } from 'lucide-react';

interface InputBoxProps {
  className?: string;
  onSend?: (message: string) => void;
  hasError?: boolean;
}

export const InputBox: React.FC<InputBoxProps> = ({ className = '', onSend, hasError = false }) => {
  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (message.trim() && onSend) {
      onSend(message);
      setMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className={`bg-white ${hasError ? 'pb-2 px-2 md:pb-2 md:px-2' : 'p-2 md:p-2'} ${className}`}>
      <div className="max-w-[785px] mx-auto">
        <div className={`bg-white border border-zinc-200 p-3 md:p-4 ${
          hasError ? 'rounded-b-2xl border-t-0' : 'rounded-2xl'
        }`}>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Eros in cursus turpis massa"
            className="w-full resize-none outline-none text-[14px] md:text-[15px] text-zinc-700 placeholder:text-zinc-400 min-h-[40px] md:min-h-[48px]"
            rows={2}
          />

          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center gap-1.5 md:gap-3">
              {/* Add button */}
              <button className="p-1.5 md:p-2 bg-white border border-zinc-200 rounded hover:bg-zinc-50 transition-colors">
                <Plus className="w-[10px] h-[10px]" />
              </button>

              {/* Agent/Model selector */}
              <div className="flex items-center bg-zinc-100 rounded overflow-hidden">
                <button className="px-2 md:px-3 py-1.5 md:py-2 bg-blue-50 border border-blue-200 text-[10px] md:text-[11px] text-zinc-700 hover:bg-blue-100 transition-colors">
                  Agent
                </button>
                <button className="px-2 md:px-3 py-1.5 md:py-2 text-[10px] md:text-[11px] text-zinc-700 hover:bg-zinc-200 transition-colors">
                  Model
                </button>
              </div>

              {/* Effect button - hidden on mobile */}
              <button className="hidden sm:block p-1.5 md:p-2 bg-blue-50 border border-blue-200 rounded hover:bg-blue-100 transition-colors">
                <Sparkles className="w-[10px] h-[10px]" />
              </button>
            </div>

            {/* Send button */}
            <button
              onClick={handleSend}
              disabled={!message.trim()}
              className="p-1.5 md:p-2 bg-indigo-600 rounded hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-[10px] h-[10px] text-white" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
