import { useState, useEffect } from 'react';
import axios from 'axios';

export interface Message {
  role: 'user' | 'bot';
  text: string;
}

const mentorGreetings: Record<string, Record<string, string>> = {
  marco: {
    es: 'Saludos. Soy Marco Aurelio. ¿Qué inquieta tu razón?',
    en: 'Greetings. I am Marcus Aurelius. What disturbs your reason?'
  },
  seneca: {
    es: 'Soy Séneca. No perdamos el tiempo, ¿qué aflige tu alma?',
    en: 'I am Seneca. Let us not waste time, what afflicts your soul?'
  },
  epicteto: {
    es: 'Soy Epicteto. ¿Cuál es tu problema hoy?',
    en: 'I am Epictetus. What is your problem today?'
  }
};

export const useChat = (initialMentor: string, language: 'es' | 'en' = 'es') => {
  const [mentor, setMentor] = useState(initialMentor);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [isWarmingUp, setIsWarmingUp] = useState(true);

  useEffect(() => {
    const wakeup = async () => {
      const startTime = Date.now();
      const MIN_LOADING_TIME = 4000; 
      try {
        await axios.post('http://localhost:3000/ask', { 
          prompt: "Wake up", 
          mentor: initialMentor, 
          language 
        });
      } catch (e) { 
        console.log("Servidor despertando...");
      } finally { 
        const elapsedTime = Date.now() - startTime;
        const remainingTime = Math.max(0, MIN_LOADING_TIME - elapsedTime);
        setTimeout(() => {
          setIsWarmingUp(false);
          setMessages([{ role: 'bot', text: mentorGreetings[initialMentor][language] }]);
        }, remainingTime);
      }
    };
    wakeup();
  }, []); // Solo al montar

  useEffect(() => {
    if(!isWarmingUp) {
      setMessages([{ role: 'bot', text: mentorGreetings[mentor][language] }]);
    }
  }, [mentor, language]); // Sincroniza cambios de mentor e idioma

  const sendMessage = async (text: string) => {
    if (!text.trim() || loading) return;
    const newMessages: Message[] = [...messages, { role: 'user', text }];
    setMessages(newMessages);
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:3000/ask', { prompt: text, mentor, language });
      setMessages([...newMessages, { role: 'bot', text: response.data.answer }]);
    } catch (error) {
      setMessages([...newMessages, { role: 'bot', text: language === 'es' ? 'Error.' : 'Error.' }]);
    } finally {
      setLoading(false);
    }
  };

  return { mentor, setMentor, messages, loading, sendMessage, isWarmingUp };
};