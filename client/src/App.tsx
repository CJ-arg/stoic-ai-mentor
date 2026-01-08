import { useState, useEffect, useRef } from 'react'
import axios from 'axios'

interface Message {
  role: 'user' | 'bot';
  text: string;
}

function App() {
  const [mentor, setMentor] = useState('marco');
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const mentors = [
    { id: 'marco', name: 'Marco Aurelio', title: 'Emperador', img: '/Marco.png' },
    { id: 'seneca', name: 'Séneca', title: 'Consejero', img: '/Seneca.png' },
    { id: 'epicteto', name: 'Epicteto', title: 'Resiliente', img: '/Epicteto.png' },
  ];

  const mentorGreetings: Record<string, string> = {
    marco: 'Saludos. Soy Marco Aurelio. ¿Qué inquieta tu razón?',
    seneca: 'Soy Séneca. No perdamos el tiempo, ¿qué aflige tu alma?',
    epicteto: 'Soy Epicteto. ¿Cuál es tu problema hoy?'
  };

  const [messages, setMessages] = useState<Message[]>([
    { role: 'bot', text: mentorGreetings['marco'] }
  ]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  useEffect(() => {
    setMessages([{ role: 'bot', text: mentorGreetings[mentor] }]);
  }, [mentor]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    const newMessages: Message[] = [...messages, { role: 'user', text: input }];
    setMessages(newMessages);
    const currentInput = input;
    setInput('');
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:3000/ask', {
        prompt: currentInput,
        mentor: mentor 
      });
      setMessages([...newMessages, { role: 'bot', text: response.data.answer }]);
    } catch (error) {
      console.error(error);
      setMessages([...newMessages, { role: 'bot', text: 'Error de conexión.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-screen bg-stone-200 flex flex-col p-4 md:p-6 overflow-hidden font-sans">
      
      <h1 className="text-2xl md:text-3xl font-serif text-stone-900 mb-6 border-b-2 border-stone-800 pb-1 tracking-tighter uppercase font-black text-center shrink-0">
        Mentor Estoico
      </h1>
      
      {/* Contenedor Principal */}
      <div className="flex flex-col lg:flex-row gap-6 w-full max-w-6xl mx-auto flex-1 overflow-hidden items-start">
        
        {/* COLUMNA IZQUIERDA: Tarjetas reducidas un 20% */}
        <div className="flex flex-row lg:flex-col gap-4 overflow-x-auto lg:overflow-x-visible w-full lg:w-40 shrink-0">
          {mentors.map((m) => (
            <button
              key={m.id}
              onClick={() => setMentor(m.id)}
              className={`flex-shrink-0 flex flex-col items-center rounded-xl border-2 transition-all duration-300 overflow-hidden w-32 lg:w-full shadow-sm ${
                mentor === m.id 
                ? 'border-stone-800 bg-stone-800 scale-105 shadow-lg z-10' 
                : 'border-white bg-white hover:border-stone-400 grayscale-[0.2]'
              }`}
            >
              {/* Altura de imagen reducida para que quepan las 3 */}
              <div className="w-full h-24 lg:h-28 overflow-hidden">
                <img src={m.img} alt={m.name} className="w-full h-full object-cover" />
              </div>
              <div className="p-2 text-center w-full">
                <p className={`text-[11px] lg:text-xs font-bold truncate ${mentor === m.id ? 'text-white' : 'text-stone-800'}`}>
                  {m.name}
                </p>
                <p className={`text-[8px] uppercase tracking-widest hidden lg:block mt-0.5 ${mentor === m.id ? 'text-stone-400' : 'text-stone-500'}`}>
                  {m.title}
                </p>
              </div>
            </button>
          ))}
          {/* El espacio vacío abajo se genera automáticamente por el items-start del padre */}
        </div>

        {/* CHAT: Se mantiene flexible y ocupa el resto */}
        <div className="flex-1 bg-white shadow-xl rounded-2xl flex flex-col h-[500px] lg:h-full overflow-hidden border border-stone-300 self-stretch mb-2">
          
          <div className="bg-stone-800 p-2 text-center shrink-0">
             <h2 className="text-white font-serif text-xs uppercase tracking-widest">
               {mentors.find(m => m.id === mentor)?.name}
             </h2>
          </div>

          <div 
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-4 lg:p-6 space-y-4 bg-stone-50"
          >
            {messages.map((msg, index) => (
              <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-3 lg:p-4 rounded-xl text-sm lg:text-base leading-relaxed ${
                  msg.role === 'user' 
                    ? 'bg-stone-700 text-white rounded-br-none shadow-md' 
                    : 'bg-white text-stone-900 border border-stone-200 rounded-bl-none font-serif shadow-sm'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="text-stone-400 text-[10px] animate-pulse italic">El mentor está reflexionando...</div>
            )}
          </div>

          <div className="p-3 bg-white border-t border-stone-100 flex gap-2 shrink-0">
            <input 
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
              className="flex-1 border border-stone-300 rounded-xl px-4 py-2 text-sm outline-none focus:border-stone-800 focus:ring-1 focus:ring-stone-800 transition-all"
              placeholder="Haz tu pregunta estoica..."
            />
            <button 
              onClick={sendMessage}
              disabled={loading}
              className="bg-stone-800 text-white px-5 py-2 rounded-xl font-bold text-xs uppercase hover:bg-black transition-colors"
            >
              →
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}

export default App