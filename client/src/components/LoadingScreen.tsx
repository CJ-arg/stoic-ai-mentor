import { useState } from 'react';

const stoicQuotes = [
  { text: "No es que tengamos poco tiempo, sino que perdemos mucho.", author: "Séneca" },
  { text: "La mejor venganza es ser diferente a quien causó el daño.", author: "Marco Aurelio" },
  { text: "Te conviertes en aquello a lo que le das tu atención.", author: "Epicteto" },
  { text: "Si no es correcto, no lo hagas. Si no es verdad, no lo digas.", author: "Marco Aurelio" },
  { text: "La felicidad de tu vida depende de la calidad de tus pensamientos.", author: "Marco Aurelio" }
];

export const LoadingScreen = () => {
  const [quote] = useState(() => stoicQuotes[Math.floor(Math.random() * stoicQuotes.length)]);

  return (
    <div className="h-screen w-screen bg-stone-200 flex flex-col items-center justify-center p-6 animate-in fade-in duration-700">
      <div className="max-w-xl w-full border-t border-b border-stone-400 py-16 px-4 relative">
        
        {/* Icono decorativo: Panteón Minimalista */}
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-stone-200 px-4 text-stone-800">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L2 7V9H22V7L12 2Z" fill="currentColor"/>
            <rect x="4" y="10" width="2" height="10" fill="currentColor"/>
            <rect x="9" y="10" width="2" height="10" fill="currentColor"/>
            <rect x="13" y="10" width="2" height="10" fill="currentColor"/>
            <rect x="18" y="10" width="2" height="10" fill="currentColor"/>
            <path d="M2 20V22H22V20H2Z" fill="currentColor"/>
          </svg>
        </div>

        <div className="text-center space-y-8">
          <blockquote className="space-y-4">
            <p className="text-2xl md:text-4xl font-serif text-stone-800 italic leading-relaxed animate-pulse tracking-tight">
              "{quote.text}"
            </p>
            <cite className="block text-stone-500 uppercase tracking-[0.4em] text-[10px] md:text-xs font-black not-italic">
              — {quote.author}
            </cite>
          </blockquote>
          
          <div className="flex flex-col items-center gap-4">
            {/* Spinner Estoico (Puntos) */}
            <div className="flex gap-2">
              <span className="w-2 h-2 bg-stone-800 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
              <span className="w-2 h-2 bg-stone-800 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
              <span className="w-2 h-2 bg-stone-800 rounded-full animate-bounce"></span>
            </div>
            
            <p className="text-stone-400 text-[10px] uppercase tracking-[0.2em] font-medium">
              Sincronizando con el Logos...
            </p>
          </div>
        </div>

        {/* Decoración inferior: Rombo clásico */}
        <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-stone-200 px-4">
          <div className="w-5 h-5 rotate-45 border border-stone-400 flex items-center justify-center">
            <div className="w-1 h-1 bg-stone-400 rounded-full"></div>
          </div>
        </div>
      </div>
      
      <footer className="absolute bottom-8 text-stone-400 text-[9px] uppercase tracking-widest">
        Memento Mori • Servidor en proceso de arranque
      </footer>
    </div>
  );
};