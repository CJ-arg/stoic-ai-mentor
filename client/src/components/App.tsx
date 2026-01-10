import { useState, useRef, useEffect } from 'react';
import { useChat } from '../hooks/useChat'; 
import { LoadingScreen } from '../components/LoadingScreen';
import axios from 'axios'; // Import axios for the wake-up call

const mentors = [
  { id: 'marco', name: 'Marco Aurelio', title: 'Emperador', img: '/Marco.png' },
  { id: 'seneca', name: 'Séneca', title: 'Consejero', img: '/Seneca.png' },
  { id: 'epicteto', name: 'Epicteto', title: 'Resiliente', img: '/Epicteto.png' },
];

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

function App() {
  const [lang, setLang] = useState<'es' | 'en'>('es');
  const [darkMode, setDarkMode] = useState(false);
  
  const { mentor, setMentor, messages, loading, sendMessage, isWarmingUp } = useChat('marco', lang);
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  // WAKE-UP CALL: Triggered as soon as the app mounts to wake up the Render server
  useEffect(() => {
    const wakeUpServer = async () => {
      try {
        // We call the quotes endpoint immediately to gain time
        await axios.get(`${API_URL}/api/translated-quote`);
        
      } catch (e) {
        
      }
    };
    wakeUpServer();
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, loading]);

  if (isWarmingUp) return <LoadingScreen />;

  return (
    <div className={`h-screen w-screen transition-colors duration-500 flex flex-col p-4 md:p-6 overflow-hidden font-sans ${darkMode ? 'bg-stone-950 text-stone-200' : 'bg-stone-200 text-stone-900'}`}>
      
      {/* HEADER DINÁMICO */}
      <header className="shrink-0 flex justify-between items-center mb-6 border-b-2 border-stone-800 pb-1 max-w-6xl mx-auto w-full">
        <h1 className="text-2xl md:text-3xl font-serif tracking-tighter uppercase font-black italic">
          {lang === 'es' ? 'Mentor Estoico' : 'Stoic Mentor'}
        </h1>
        
        <div className="flex gap-4 items-center">
          <button onClick={() => setLang(lang === 'es' ? 'en' : 'es')} className="text-[10px] font-bold uppercase tracking-widest opacity-70 hover:opacity-100">
            {lang === 'es' ? 'English' : 'Español'}
          </button>
          <button onClick={() => setDarkMode(!darkMode)} className="text-xl">
            {darkMode ? '☀️' : '🌙'}
          </button>
        </div>
      </header>
      
      <main className="flex flex-col lg:flex-row gap-6 w-full max-w-4xl mx-auto flex-1 overflow-hidden items-start">
        
        {/* SIDEBAR */}
        <aside className="flex flex-row lg:flex-col gap-4 pt-[1vh] overflow-x-auto lg:overflow-x-visible w-full lg:w-40 shrink-0">
          {mentors.map((m) => (
            <button
              key={m.id}
              onClick={() => setMentor(m.id)}
              className={`flex-shrink-0 flex flex-col items-center rounded-xl border-2 transition-all duration-300 overflow-hidden w-32 lg:w-full shadow-sm ${
                mentor === m.id ? 'border-stone-800 bg-stone-800 scale-105 shadow-lg' : `${darkMode ? 'bg-stone-900 border-stone-800' : 'bg-white border-white'} grayscale-[0.2]`
              }`}
            >
              <img src={m.img} alt={m.name} className="w-full h-24 lg:h-28 object-cover" />
              <div className="p-2 text-center w-full">
                <p className={`text-[11px] lg:text-xs font-bold ${mentor === m.id ? 'text-white' : (darkMode ? 'text-stone-300' : 'text-stone-800')}`}>{m.name}</p>
                <p className={`text-[8px] uppercase hidden lg:block ${mentor === m.id ? 'text-stone-400' : 'text-stone-500'}`}>{m.title}</p>
              </div>
            </button>
          ))}
        </aside>

        {/* CHAT WINDOW */}
        <section className={`flex-1 shadow-xl rounded-2xl flex flex-col h-[500px] lg:h-full overflow-hidden border self-stretch mb-2 ${darkMode ? 'bg-stone-900 border-stone-800' : 'bg-white border-stone-300'}`}>
          <div className="bg-stone-800 p-2 text-center shrink-0 text-white font-serif text-xs uppercase tracking-widest">
            {mentors.find(m => m.id === mentor)?.name}
          </div>

          <div ref={scrollRef} className={`flex-1 overflow-y-auto p-4 lg:p-6 space-y-4 ${darkMode ? 'bg-stone-950' : 'bg-stone-50'}`}>
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-3 rounded-xl text-sm lg:text-base ${
                  msg.role === 'user' ? 'bg-stone-700 text-white shadow-md' : `${darkMode ? 'bg-stone-800 text-stone-200 border-stone-700' : 'bg-white text-stone-900 border-stone-200'} border font-serif shadow-sm`
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {loading && <div className="text-stone-500 text-[10px] animate-pulse italic">...</div>}
          </div>

          <form onSubmit={(e) => { e.preventDefault(); sendMessage(input); setInput(''); }} className={`p-3 border-t flex gap-2 shrink-0 ${darkMode ? 'bg-stone-900 border-stone-800' : 'bg-white border-stone-100'}`}>
            <input 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className={`flex-1 border rounded-xl px-4 py-2 text-sm outline-none transition-all ${darkMode ? 'bg-stone-800 border-stone-700 text-stone-200' : 'bg-white border-stone-300 focus:border-stone-800'}`}
              placeholder={lang === 'es' ? "Haz tu pregunta..." : "Ask your question..."}
            />
            <button className={`px-5 py-2 rounded-xl font-bold text-xs uppercase transition-all ${darkMode ? 'bg-stone-200 text-stone-900' : 'bg-stone-800 text-white'}`}>
              →
            </button>
          </form>
        </section>
      </main>
    </div>
  );
}

export default App;