import { useState } from 'react';
import type { FormEvent } from 'react';

interface Props {
  onSend: (text: string) => void;
  disabled: boolean;
  darkMode: boolean; // Add support for theme
  lang: 'es' | 'en'; // Add support for language
}

export const ChatInput = ({ onSend, disabled, darkMode, lang }: Props) => {
  const [input, setInput] = useState('');

  /**
   * Handle form submission and clear local state
   */
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim() || disabled) return;
    onSend(input);
    setInput('');
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`p-3 border-t flex gap-2 shrink-0 transition-colors duration-500 ${darkMode ? 'bg-stone-900 border-stone-800' : 'bg-white border-stone-100'
        }`}
    >
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className={`flex-1 border rounded-xl px-4 py-2 text-sm outline-none transition-all ${darkMode
            ? 'bg-stone-800 border-stone-700 text-stone-200 focus:border-stone-500'
            : 'bg-white border-stone-300 focus:border-stone-800 focus:ring-1 focus:ring-stone-800'
          }`}
        placeholder={lang === 'es' ? "Haz tu pregunta estoica..." : "Ask your stoic question..."}
      />
      <button
        type="submit"
        disabled={disabled || !input.trim()}
        className={`px-5 py-2 rounded-xl font-bold text-xs uppercase transition-all ${darkMode
            ? 'bg-stone-200 text-stone-900 hover:bg-white'
            : 'bg-stone-800 text-white hover:bg-black'
          } disabled:bg-stone-500 disabled:opacity-50`}
      >
        →
      </button>
    </form>
  );
};