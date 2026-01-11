// src/components/ChatWindow.tsx
import { useState } from 'react';
import type { FormEvent, RefObject } from 'react';
import type { Message } from '../hooks/useChat';

interface Props {
  mentorName: string;
  messages: Message[];
  loading: boolean;
  scrollRef: RefObject<HTMLDivElement | null>;
  darkMode: boolean;
  lang: 'es' | 'en';
  onClear: () => void;
  onSendMessage: (text: string) => void;
}

export const ChatWindow = ({
  mentorName,
  messages,
  loading,
  scrollRef,
  darkMode,
  lang,
  onClear,
  onSendMessage
}: Props) => {
  // Local state for the input field to prevent whole-app re-renders on every keystroke
  const [inputValue, setInputValue] = useState('');

  /**
   * Handles the message submission and clears local input state
   */
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || loading) return;
    onSendMessage(inputValue);
    setInputValue('');
  };

  return (
    <section className={`flex-1 shadow-xl rounded-2xl flex flex-col h-[500px] lg:h-full overflow-hidden border self-stretch mb-2 transition-colors duration-300 ${darkMode ? 'bg-stone-900 border-stone-800' : 'bg-white border-stone-300'
      }`}>

      {/* CHAT HEADER: Includes Mentor Name and Clear History Action */}
      <div className={`p-3 px-5 flex justify-between items-center shrink-0 border-b ${darkMode ? 'bg-stone-800 border-stone-700' : 'bg-stone-100 border-stone-200'
        }`}>
        <h2 className={`font-serif text-[11px] uppercase tracking-[0.2em] font-bold ${darkMode ? 'text-stone-300' : 'text-stone-800'
          }`}>
          {mentorName}
        </h2>

        <button
          onClick={() => {
            const confirmMsg = lang === 'es' ? '¿Borrar historial?' : 'Clear history?';
            if (window.confirm(confirmMsg)) onClear();
          }}
          className={`group flex items-center gap-2 px-3 py-1 rounded-full border transition-all duration-300 ${darkMode
            ? 'border-stone-700 text-stone-500 hover:border-red-900 hover:text-red-400'
            : 'border-stone-300 text-stone-500 hover:border-red-200 hover:text-red-600'
            }`}
        >
          {/* Trash Icon Asset */}
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
          </svg>
          <span className="text-[10px] font-bold uppercase tracking-wider">
            {lang === 'es' ? 'Limpiar' : 'Clear'}
          </span>
        </button>
      </div>

      {/* MESSAGES VIEWPORT: Renders chat history with auto-scroll target */}
      <div
        ref={scrollRef}
        className={`flex-1 overflow-y-auto p-4 lg:p-6 space-y-4 transition-colors duration-300 ${darkMode ? 'bg-stone-950' : 'bg-stone-50'
          }`}
      >
        {messages.map((msg, index) => (
          <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] p-3 lg:p-4 rounded-xl text-sm lg:text-base leading-relaxed shadow-sm ${msg.role === 'user'
              ? 'bg-stone-700 text-white rounded-br-none'
              : `${darkMode ? 'bg-stone-800 text-stone-200 border-stone-700' : 'bg-white text-stone-900 border-stone-200'} border rounded-bl-none font-serif`
              }`}>
              {msg.text}
            </div>
          </div>
        ))}
        {loading && (
          <div className="text-stone-500 text-[10px] animate-pulse italic">
            {lang === 'es' ? 'El mentor está reflexionando...' : 'The mentor is reflecting...'}
          </div>
        )}
      </div>

      {/* INPUT FORM: Local input management for performance optimization */}
      <form
        onSubmit={handleSubmit}
        className={`p-3 border-t flex gap-2 shrink-0 ${darkMode ? 'bg-stone-900 border-stone-800' : 'bg-white border-stone-100'
          }`}
      >
        <input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className={`flex-1 border rounded-xl px-4 py-2 text-sm outline-none transition-all ${darkMode
            ? 'bg-stone-800 border-stone-700 text-stone-200'
            : 'bg-white border-stone-300 focus:border-stone-800'
            }`}
          placeholder={lang === 'es' ? "Haz tu pregunta..." : "Ask your question..."}
        />
        <button
          type="submit"
          className={`px-5 py-2 rounded-xl font-bold text-xs uppercase transition-all ${darkMode ? 'bg-stone-200 text-stone-900' : 'bg-stone-800 text-white'
            }`}
        >
          →
        </button>
      </form>
    </section>
  );
};