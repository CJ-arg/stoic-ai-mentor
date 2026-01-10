import { useStoicQuotes } from '../hooks/useStoicQuotes';

export const LoadingScreen = () => {
  const { currentQuote, index } = useStoicQuotes(7000); // Rotate every 7 sec

  return (
    <div className="h-screen w-screen bg-stone-200 flex flex-col items-center justify-center p-6 animate-in fade-in duration-700">
      <div className="max-w-xl w-full border-t border-b border-stone-400 py-16 px-4 relative">
        
        {/* Pantheon Icon */}
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
          <blockquote key={index} className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-1000">
            {/* Spanish Phrase */}
            <p className="text-2xl md:text-4xl font-serif text-stone-800 italic leading-relaxed tracking-tight mb-2">
              "{currentQuote.spanishText}"
            </p>
            {/* English Phrase (more subtle) */}
            <p className="text-xl md:text-2xl font-serif text-stone-500 italic leading-relaxed tracking-tight">
              "{currentQuote.englishText}"
            </p>
            <cite className="block text-stone-500 uppercase tracking-[0.4em] text-[10px] md:text-xs font-black not-italic">
              — {currentQuote.author}
            </cite>
          </blockquote>
          
          <div className="flex flex-col items-center gap-4">
            <div className="flex gap-2">
              <span className="w-2 h-2 bg-stone-800 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
              <span className="w-2 h-2 bg-stone-800 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
              <span className="w-2 h-2 bg-stone-800 rounded-full animate-bounce"></span>
            </div>
            <p className="text-stone-400 text-[10px] uppercase tracking-[0.2em] font-medium">
              Synchronizing with the Logos...
            </p>
          </div>
        </div>
      </div>
      
      <footer className="absolute bottom-8 text-stone-400 text-[9px] uppercase tracking-widest text-center">
        Memento Mori • Server waking up (may take 50s)
      </footer>
    </div>
  );
};