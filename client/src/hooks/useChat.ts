import { useState, useEffect } from 'react';
import axios from 'axios';

export interface Message {
  role: 'user' | 'bot';
  text: string;
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

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

const getStorageKey = (mentor: string) => `stoic_chat_history_${mentor}`;

export const useChat = (initialMentor: string, language: 'es' | 'en' = 'es') => {
  const [mentor, setMentor] = useState(initialMentor);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [isWarmingUp, setIsWarmingUp] = useState(true);

  // EFFECT: Load chat history or set initial greeting on mount/mentor change
  useEffect(() => {
    const savedChat = localStorage.getItem(getStorageKey(mentor));

    if (savedChat) {
      const parsedMessages = JSON.parse(savedChat);

      // Update greeting language if chat only contains the initial message
      if (parsedMessages.length === 1 && parsedMessages[0].role === 'bot') {
        setMessages([{ role: 'bot', text: mentorGreetings[mentor][language] }]);
      } else {
        setMessages(parsedMessages);
      }
    } else {
      setMessages([{ role: 'bot', text: mentorGreetings[mentor][language] }]);
    }
  }, [mentor, language]);

  // EFFECT: Persist messages to localStorage strictly when messages change
  useEffect(() => {
    // Avoid saving if messages are empty to prevent overwriting during resets
    if (messages.length > 0) {
      localStorage.setItem(getStorageKey(mentor), JSON.stringify(messages));
    }
  }, [messages, mentor]);

  // EFFECT: Initial server wake-up call
  useEffect(() => {
    const wakeup = async () => {
      const startTime = Date.now();
      const MIN_LOADING_TIME = 4000;
      const MAX_WAIT_TIME = 12000;

      const safetyTimer = setTimeout(() => setIsWarmingUp(false), MAX_WAIT_TIME);

      try {
        await axios.post(`${API_URL}/ask`, {
          prompt: "Wake up",
          mentor: initialMentor,
          language
        });

        clearTimeout(safetyTimer);
        const elapsedTime = Date.now() - startTime;
        const remainingTime = Math.max(0, MIN_LOADING_TIME - elapsedTime);

        setTimeout(() => setIsWarmingUp(false), remainingTime);
      } catch (e) {
        console.log("Server waking up...");
      }
    };
    wakeup();
  }, [initialMentor, language]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || loading) return;

    const userMsg: Message = { role: 'user', text };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setLoading(true);

    try {
      const response = await axios.post(`${API_URL}/ask`, {
        prompt: text,
        mentor,
        language
      });

      const botMsg: Message = { role: 'bot', text: response.data.answer };
      setMessages(prev => [...prev, botMsg]);
    } catch (error) {
      const errorMsg = language === 'es' ? 'El oráculo está silenciado.' : 'The oracle is silent.';
      setMessages(prev => [...prev, { role: 'bot', text: errorMsg }]);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Resets chat state and clears specific localStorage key
   */
  const clearChat = () => {
    const key = getStorageKey(mentor);
    localStorage.removeItem(key);
    // Setting state to the initial greeting automatically triggers the persist effect
    setMessages([{ role: 'bot', text: mentorGreetings[mentor][language] }]);
  };

  return { mentor, setMentor, messages, loading, sendMessage, isWarmingUp, clearChat };
};