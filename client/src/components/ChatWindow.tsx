import type { RefObject } from 'react';
import type { Message } from '../hooks/useChat';

interface Props {
  messages: Message[];
  loading: boolean;
  activeMentorName?: string;
  scrollRef: RefObject<HTMLDivElement | null>;
}

export const ChatWindow = ({ messages, loading, activeMentorName, scrollRef }: Props) => (
  <section className="flex-1 bg-white shadow-xl rounded-2xl flex flex-col h-[500px] lg:h-full overflow-hidden border border-stone-300 self-stretch mb-2">
    <div className="bg-stone-800 p-2 text-center shrink-0">
      <h2 className="text-white font-serif text-xs uppercase tracking-widest">
        {activeMentorName}
      </h2>
    </div>

    <div 
      ref={scrollRef}
      className="flex-1 overflow-y-auto p-4 lg:p-6 space-y-4 bg-stone-50"
    >
      {messages.map((msg, index) => (
        <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
          <div className={`max-w-[85%] p-3 lg:p-4 rounded-xl text-sm lg:text-base leading-relaxed shadow-sm ${
            msg.role === 'user' 
              ? 'bg-stone-700 text-white rounded-br-none' 
              : 'bg-white text-stone-900 border border-stone-200 rounded-bl-none font-serif'
          }`}>
            {msg.text}
          </div>
        </div>
      ))}
      {loading && (
        <div className="text-stone-400 text-[10px] animate-pulse italic">
          El mentor está reflexionando...
        </div>
      )}
    </div>
  </section>
);