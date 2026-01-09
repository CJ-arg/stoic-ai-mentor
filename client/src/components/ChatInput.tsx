import { useState, FormEvent } from 'react';

interface Props {
  onSend: (text: string) => void;
  disabled: boolean;
}

export const ChatInput = ({ onSend, disabled }: Props) => {
  const [input, setInput] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim() || disabled) return;
    onSend(input);
    setInput('');
  };

  return (
    <form onSubmit={handleSubmit} className="p-3 bg-white border-t border-stone-100 flex gap-2 shrink-0">
      <input 
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="flex-1 border border-stone-300 rounded-xl px-4 py-2 text-sm outline-none focus:border-stone-800 focus:ring-1 focus:ring-stone-800 transition-all"
        placeholder="Haz tu pregunta estoica..."
      />
      <button 
        type="submit"
        disabled={disabled || !input.trim()}
        className="bg-stone-800 text-white px-5 py-2 rounded-xl font-bold text-xs uppercase hover:bg-black transition-colors disabled:bg-stone-400"
      >
        →
      </button>
    </form>
  );
};