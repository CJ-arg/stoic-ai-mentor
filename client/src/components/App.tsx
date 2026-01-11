import { useState, useRef, useEffect } from 'react';
import { useChat } from '../hooks/useChat';
import { LoadingScreen } from '../components/LoadingScreen';
import { Sidebar } from '../components/Sidebar';
import { ChatWindow } from '../components/ChatWindow';
import axios from 'axios';

/**
 * Mentor data constants used for the Sidebar and identification
 */
const mentors = [
  { id: 'marco', name: 'Marco Aurelio', title: 'Emperador', img: '/Marco.png' },
  { id: 'seneca', name: 'Séneca', title: 'Consejero', img: '/Seneca.png' },
  { id: 'epicteto', name: 'Epicteto', title: 'Resiliente', img: '/Epicteto.png' },
];

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

function App() {
  const [lang, setLang] = useState<'es' | 'en'>('es');
  const [darkMode, setDarkMode] = useState(false);

  // Hook logic orchestration
  const {
    mentor,
    setMentor,
    messages,
    loading,
    sendMessage,
    isWarmingUp,
    clearChat
  } = useChat('marco', lang);

  const scrollRef = useRef<HTMLDivElement>(null);

  /**
   * Handles language switching with a warning if there is existing chat history.
   * This ensures the AI context remains consistent within a single language.
   */
  const toggleLanguage = () => {
    const newLang = lang === 'es' ? 'en' : 'es';
    if (messages.length > 1) {
      const confirmMsg = lang === 'es'
        ? "¿Acaso crees que puedo hablar dos lenguas a la vez sin perder la razón? Para cambiar de lengua debo despejar mi mente y borrar el historial. ¿Procedemos?"
        : "Do you think I can speak two languages at once without losing my mind? To change tongues, I must clear my mind and the history. Shall we proceed?";

      if (window.confirm(confirmMsg)) {
        clearChat(); // Clears persistence and state
        setLang(newLang);
      }
    } else {
      setLang(newLang);
    }
  };

  /**
   * WAKE-UP CALL: Effect to ping the server as soon as the app loads to avoid 
   * delays caused by server cold starts (common in free-tier hosting).
   */
  useEffect(() => {
    const wakeUpServer = async () => {
      try {
        await axios.get(`${API_URL}/api/translated-quote`);
      } catch (e) {
        // Silent catch: the goal is just to trigger the server boot
      }
    };
    wakeUpServer();
  }, []);

  /**
   * AUTO-SCROLL: Keeps the chat view locked to the most recent messages.
   */
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, loading]);

  if (isWarmingUp) return <LoadingScreen />;

  return (
    <div className={`h-screen w-screen transition-colors duration-500 flex flex-col p-4 md:p-6 overflow-hidden font-sans ${darkMode ? 'bg-stone-950 text-stone-200' : 'bg-stone-200 text-stone-900'}`}>

      {/* HEADER SECTION */}
      <header className="shrink-0 flex justify-between items-center mb-6 border-b-2 border-stone-800 pb-1 max-w-6xl mx-auto w-full">
        <h1 className="text-2xl md:text-3xl font-serif tracking-tighter uppercase font-black italic">
          {lang === 'es' ? 'Mentor Estoico' : 'Stoic Mentor'}
        </h1>

        <div className="flex gap-4 items-center">
          <button onClick={toggleLanguage} className="text-[10px] font-bold uppercase tracking-widest opacity-70 hover:opacity-100">
            {lang === 'es' ? 'English' : 'Español'}
          </button>
          <button onClick={() => setDarkMode(!darkMode)} className="text-xl">
            {darkMode ? '☀️' : '🌙'}
          </button>
        </div>
      </header>

      {/* MAIN CONTENT AREA */}
      <main className="flex flex-col lg:flex-row gap-6 w-full max-w-4xl mx-auto flex-1 overflow-hidden items-start">
        <Sidebar
          mentors={mentors}
          currentMentor={mentor}
          setMentor={setMentor}
          darkMode={darkMode}
        />

        <ChatWindow
          mentorName={mentors.find(m => m.id === mentor)?.name || ''}
          messages={messages}
          loading={loading}
          darkMode={darkMode}
          lang={lang}
          onClear={clearChat} // Refactored prop name to match ChatWindow interface
          onSendMessage={sendMessage}
          scrollRef={scrollRef}
        />
      </main>
    </div>
  );
}

export default App;