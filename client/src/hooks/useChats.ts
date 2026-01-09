import { useState, useEffect, useRef } from 'react';
import axios from 'axios';

export interface Message {
  role: 'user' | 'bot';
  text: string;
}

const mentorGreetings: Record<string, string> = {
  marco: 'Saludos. Soy Marco Aurelio. ¿Qué inquieta tu razón?',
  seneca: 'Soy Séneca. No perdamos el tiempo, ¿qué aflige tu alma?',
  epicteto: 'Soy Epicteto. ¿Cuál es tu problema hoy?'
};

export const useChat = (initialMentor: string) => {
  const [mentor, setMentor] = useState(initialMentor);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [isWarmingUp, setIsWarmingUp] = useState(true);

  // Efecto para el "Warm up" (Despertar el servidor)
  // En src/hooks/useChat.ts

useEffect(() => {
  const wakeup = async () => {
    // Registramos el tiempo de inicio
    const startTime = Date.now();
    const MIN_LOADING_TIME = 4000; // 4 segundos para que lean la frase

    try {
      // Llamada al backend
      await axios.post('http://localhost:3000/ask', { prompt: "Wake up", mentor: 'marco' });
    } catch (e) { 
      console.log("Warming up server...");
    } finally { 
      // Calculamos cuánto tiempo ha pasado
      const endTime = Date.now();
      const elapsedTime = endTime - startTime;

      // Si fue más rápido que nuestro mínimo, esperamos la diferencia
      const remainingTime = Math.max(0, MIN_LOADING_TIME - elapsedTime);

      setTimeout(() => {
        setIsWarmingUp(false);
        setMessages([{ role: 'bot', text: mentorGreetings[initialMentor] }]);
      }, remainingTime);
    }
  };
  
  wakeup();
}, []);

  // Cambiar de mentor resetea el chat
  useEffect(() => {
    if(!isWarmingUp) {
      setMessages([{ role: 'bot', text: mentorGreetings[mentor] }]);
    }
  }, [mentor]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || loading) return;

    const newMessages: Message[] = [...messages, { role: 'user', text }];
    setMessages(newMessages);
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:3000/ask', { prompt: text, mentor });
      setMessages([...newMessages, { role: 'bot', text: response.data.answer }]);
    } catch (error) {
      setMessages([...newMessages, { role: 'bot', text: 'Error de conexión.' }]);
    } finally {
      setLoading(false);
    }
  };

  return { mentor, setMentor, messages, loading, sendMessage, isWarmingUp };
};