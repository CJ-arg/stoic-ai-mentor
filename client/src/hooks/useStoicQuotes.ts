import { useState, useEffect } from 'react';

const QUOTES = [
  {
    englishText: "The happiness of your life depends upon the quality of your thoughts.",
    spanishText: "La felicidad de tu vida depende de la calidad de tus pensamientos.",
    author: "Marco Aurelio"
  },
  {
    englishText: "We suffer more often in imagination than in reality.",
    spanishText: "Sufrimos más a menudo en la imaginación que en la realidad.",
    author: "Séneca"
  },
  {
    englishText: "It's not what happens to you, but how you react to it that matters.",
    spanishText: "No es lo que te sucede, sino cómo reaccionas a ello lo que importa.",
    author: "Epicteto"
  },
  {
    englishText: "Waste no more time arguing what a good man should be. Be one.",
    spanishText: "No pierdas más tiempo discutiendo qué debería ser un buen hombre. Sé uno.",
    author: "Marco Aurelio"
  },
  {
    englishText: "If a man knows not to which port he sails, no wind is favorable.",
    spanishText: "Si un hombre no sabe a qué puerto navega, ningún viento es favorable.",
    author: "Séneca"
  }
];

export const useStoicQuotes = (intervalMs: number = 7000) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % QUOTES.length);
    }, intervalMs);

    return () => clearInterval(timer);
  }, [intervalMs]);

  return { currentQuote: QUOTES[index], index };
};