import { useState, useEffect } from 'react';
import axios from 'axios';

export interface BilingueQuote {
  englishText: string;
  spanishText: string;
  author: string;
}

const fallbackBilingueQuotes: BilingueQuote[] = [
  { 
    englishText: "It is not that we have a short time to live, but that we waste much of it.", 
    spanishText: "No es que tengamos poco tiempo para vivir, sino que perdemos mucho de él.", 
    author: "Séneca" 
  },
  { 
    englishText: "The best revenge is to be unlike him who performed the injury.", 
    spanishText: "La mejor venganza es ser diferente a quien causó el daño.", 
    author: "Marco Aurelio" 
  },
  { 
    englishText: "You become what you give your attention to.", 
    spanishText: "Te conviertes en aquello a lo que le das tu atención.", 
    author: "Epicteto" 
  },
  { 
    englishText: "If it is not right do not do it; if it is not true do not say it.", 
    spanishText: "Si no es correcto, no lo hagas; si no es verdad, no lo digas.", 
    author: "Marco Aurelio" 
  },
  { 
    englishText: "Wealth consists not in having great possessions, but in having few wants.", 
    spanishText: "La riqueza no consiste en tener grandes posesiones, sino en tener pocos deseos.", 
    author: "Epicteto" 
  },
  { 
    englishText: "Difficulty is what wakes up the genius.", 
    spanishText: "La dificultad es lo que despierta al genio.", 
    author: "Séneca" 
  },
  { 
    englishText: "Waste no more time arguing about what a good man should be. Be one.", 
    spanishText: "No pierdas más tiempo discutiendo cómo debe ser un hombre bueno. Sé uno.", 
    author: "Marco Aurelio" 
  },
  { 
    englishText: "Small-minded people blame others. Average people blame themselves. The wise see all blame as foolishness.", 
    spanishText: "La gente de mente pequeña culpa a los demás. La gente común se culpa a sí misma. El sabio ve toda culpa como una tontería.", 
    author: "Epicteto" 
  },
  { 
    englishText: "Luck is what happens when preparation meets opportunity.", 
    spanishText: "La suerte es lo que sucede cuando la preparación se encuentra con la oportunidad.", 
    author: "Séneca" 
  },
  { 
    englishText: "The soul becomes dyed with the color of its thoughts.", 
    spanishText: "El alma se tiñe con el color de sus pensamientos.", 
    author: "Marco Aurelio" 
  },
  { 
    englishText: "No man is free who is not master of himself.", 
    spanishText: "Ningún hombre es libre si no es dueño de sí mismo.", 
    author: "Epicteto" 
  },
  { 
    englishText: "True happiness is to enjoy the present, without anxious dependence upon the future.", 
    spanishText: "La verdadera felicidad es disfrutar el presente, sin una dependencia ansiosa del futuro.", 
    author: "Séneca" 
  }
];

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const shuffleArray = (array: any[]) => {
  const newArr = [...array];
  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
  }
  return newArr;
};

export const useStoicQuotes = (intervalMs: number = 7000) => {
  // 1. Start with shuffled local quotes
  const [quotes, setQuotes] = useState<BilingueQuote[]>(() => shuffleArray(fallbackBilingueQuotes));
  // 2. Index is now an infinite counter (0, 1, 2, 3...)
  const [currentIndex, setCurrentIndex] = useState(0);

  // FETCH EFFECT: Handles data fetching only, does not touch the timer
  useEffect(() => {
    const fetchTranslatedQuote = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/translated-quote`);
        const newQuote = response.data;
        
        setQuotes(prev => {
          const exists = prev.some(q => q.englishText === newQuote.englishText);
          if (exists) return prev;
          // Add the new one but DO NOT perform a general shuffle to keep the current order
          return [...prev, newQuote];
        });
      } catch (e) {
        console.error("Error fetching quote:", e);
      }
    };
    fetchTranslatedQuote();
  }, []);

  // TIMER EFFECT: Independent of data
  useEffect(() => {
    const timer = setInterval(() => {
      // Simply add 1 to the counter
      setCurrentIndex((prev) => prev + 1);
    }, intervalMs);

    return () => clearInterval(timer);
  }, [intervalMs]); // Removed quotes.length from here. Timer never resets.

  // SENIOR LOGIC: Use modulo operator to calculate which quote to show
  // quotes[0 % 4] = quotes[0]
  // quotes[4 % 4] = quotes[0] (loops back smoothly)
  const currentQuote = quotes[currentIndex % quotes.length];

  return {
    currentQuote,
    index: currentIndex // Use this index as 'key' in the component to trigger animations
  };
};