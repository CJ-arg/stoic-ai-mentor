import { useState } from 'react'
import axios from 'axios'

interface Message {
  role: 'user' | 'bot';
  text: string;
}

function App() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { role: 'bot', text: 'Saludos, ciudadano. Soy Marco Aurelio. ¿Qué inquieta tu razón hoy?' }
  ]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    // 1. Añadimos tu mensaje a la lista
    const newMessages: Message[] = [...messages, { role: 'user', text: input }];
    setMessages(newMessages);
    const currentInput = input;
    setInput('');
    setLoading(true);

    try {
      // 2. Llamamos a nuestro servidor (Backend)
      const response = await axios.post('http://localhost:3000/ask', {
        prompt: currentInput
      });

      // 3. Añadimos la respuesta del bot
      setMessages([...newMessages, { role: 'bot', text: response.data.answer }]);
    } catch (error) {
      console.error(error);
      setMessages([...newMessages, { role: 'bot', text: 'El oráculo ha perdido la conexión con el logos.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col items-center p-4 pt-12">
      <h1 className="text-4xl font-serif text-stone-800 mb-8 border-b-2 border-stone-400 pb-2">Coach Estoico</h1>
      
      <div className="w-full max-w-2xl bg-white shadow-2xl rounded-lg flex flex-col h-[600px] overflow-hidden">
        {/* Pantalla de Chat */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-stone-50">
          {messages.map((msg, index) => (
            <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] p-3 rounded-lg shadow-sm ${
                msg.role === 'user' 
                  ? 'bg-stone-700 text-white rounded-br-none' 
                  : 'bg-white text-stone-800 border border-stone-200 rounded-bl-none'
              }`}>
                {msg.text}
              </div>
            </div>
          ))}
          {loading && <p className="text-stone-400 italic animate-pulse">Marco Aurelio está meditando...</p>}
        </div>

        {/* Input de texto */}
        <div className="p-4 bg-white border-t border-stone-200 flex gap-2">
          <input 
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            className="flex-1 border border-stone-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-stone-500 outline-none"
            placeholder="Escribe tu duda aquí..."
          />
          <button 
            onClick={sendMessage}
            disabled={loading}
            className="bg-stone-800 text-white px-6 py-2 rounded-md hover:bg-stone-900 disabled:bg-stone-400 transition-colors"
          >
            Preguntar
          </button>
        </div>
      </div>
    </div>
  )
}

export default App