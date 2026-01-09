import { useState, useRef, useEffect } from 'react';
import { useChat } from '../hooks/useChats';
import { LoadingScreen } from './LoadingScreen'; // Crearías este componente

const mentors = [
  { id: 'marco', name: 'Marco Aurelio', title: 'Emperador', img: '/Marco.png' },
  { id: 'seneca', name: 'Séneca', title: 'Consejero', img: '/Seneca.png' },
  { id: 'epicteto', name: 'Epicteto', title: 'Resiliente', img: '/Epicteto.png' },
];

function App() {
  const { mentor, setMentor, messages, loading, sendMessage, isWarmingUp } = useChat('marco');
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, loading]);

  if (isWarmingUp) return <LoadingScreen />;

  return (
    <div className="h-screen w-screen bg-stone-200 flex flex-col p-4 md:p-6 overflow-hidden font-sans">
      <header className="shrink-0 text-center mb-6">
        <h1 className="text-2xl md:text-3xl font-serif text-stone-900 border-b-2 border-stone-800 pb-1 tracking-tighter uppercase font-black inline-block">
          Mentor Estoico
        </h1>
      </header>
      
      <main className="flex flex-col lg:flex-row gap-6 w-full max-w-6xl mx-auto flex-1 overflow-hidden items-start">
        
        {/* SIDEBAR: MENTORS */}
        <aside className="flex flex-row lg:flex-col gap-4 overflow-x-auto lg:overflow-x-visible w-full lg:w-40 shrink-0">
          {mentors.map((m) => (
            <button
              key={m.id}
              onClick={() => setMentor(m.id)}
              className={`flex-shrink-0 flex flex-col items-center rounded-xl border-2 transition-all duration-300 overflow-hidden w-32 lg:w-full shadow-sm ${
                mentor === m.id ? 'border-stone-800 bg-stone-800 scale-105 shadow-lg' : 'border-white bg-white hover:border-stone-400 grayscale-[0.2]'
              }`}
            >
              <img src={m.img} alt={m.name} className="w-full h-24 lg:h-28 object-cover" />
              <div className="p-2 text-center w-full">
                <p className={`text-[11px] lg:text-xs font-bold ${mentor === m.id ? 'text-white' : 'text-stone-800'}`}>{m.name}</p>
                <p className="text-[8px] uppercase text-stone-500 hidden lg:block">{m.title}</p>
              </div>
            </button>
          ))}
        </aside>

        {/* CHAT WINDOW */}
        <section className="flex-1 bg-white shadow-xl rounded-2xl flex flex-col h-[500px] lg:h-full overflow-hidden border border-stone-300 self-stretch mb-2">
          <div className="bg-stone-800 p-2 text-center shrink-0 text-white font-serif text-xs uppercase tracking-widest">
            {mentors.find(m => m.id === mentor)?.name}
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 lg:p-6 space-y-4 bg-stone-50">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-3 rounded-xl text-sm lg:text-base ${
                  msg.role === 'user' ? 'bg-stone-700 text-white rounded-br-none' : 'bg-white text-stone-900 border border-stone-200 rounded-bl-none font-serif shadow-sm'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {loading && <div className="text-stone-400 text-[10px] animate-pulse italic">El mentor está reflexionando...</div>}
          </div>

          <form 
            onSubmit={(e) => { e.preventDefault(); sendMessage(input); setInput(''); }}
            className="p-3 bg-white border-t border-stone-100 flex gap-2 shrink-0"
          >
            <input 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 border border-stone-300 rounded-xl px-4 py-2 text-sm outline-none focus:border-stone-800"
              placeholder="Haz tu pregunta estoica..."
            />
            <button className="bg-stone-800 text-white px-5 py-2 rounded-xl font-bold text-xs uppercase hover:bg-black transition-all">
              →
            </button>
          </form>
        </section>

      </main>
    </div>
  );
}

export default App;