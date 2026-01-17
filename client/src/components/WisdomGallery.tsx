import React from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db';

interface WisdomGalleryProps {
    darkMode: boolean;
    lang: 'es' | 'en';
}

const WisdomGallery: React.FC<WisdomGalleryProps> = ({ darkMode, lang }) => {
    const allSessions = useLiveQuery(() => db.sessions.toArray(), []) || [];

    const savedSessions = allSessions
        .filter(s => s.isCompleted && s.summary)
        .sort((a, b) => b.timestamp - a.timestamp);

    const handleDelete = async (id: number) => {
        const confirmMsg = lang === 'es'
            ? '¿Estás seguro de que quieres eliminar esta episteme para siempre? Esta acción no se puede deshacer.'
            : 'Are you sure you want to delete this episteme forever? This action cannot be undone.';

        if (window.confirm(confirmMsg)) {
            try {
                await db.sessions.delete(id);
                // Also clean up messages for that session
                await db.messages.where('sessionId').equals(id).delete();
            } catch (e) {
                console.error("Failed to delete session:", e);
            }
        }
    };

    if (savedSessions.length === 0) {
        return (
            <div className={`p-8 text-center rounded-2xl border-2 border-dashed ${darkMode ? 'border-stone-800 text-stone-600' : 'border-stone-300 text-stone-400'
                }`}>
                <p className="font-serif italic">
                    {lang === 'es' ? 'Aún no has guardado ninguna episteme. Completa una sesión para comenzar tu diario.' : 'No epistemes saved yet. Complete a session to start your journal.'}
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-6 overflow-y-auto max-h-[70vh] pr-2 custom-scrollbar">
            <h2 className="text-xl font-serif font-bold uppercase tracking-widest border-b border-stone-800 pb-2 mb-6">
                {lang === 'es' ? 'Diario de Sabiduría' : 'Journal of Wisdom'}
            </h2>
            <div className="grid gap-6">
                {savedSessions.map((session) => (
                    <article
                        key={session.id}
                        className={`p-6 rounded-2xl border transition-all duration-500 hover:scale-[1.01] ${darkMode
                            ? 'bg-stone-900 border-stone-800 hover:border-stone-600'
                            : 'bg-white border-stone-200 hover:border-stone-400 shadow-sm'
                            }`}
                    >
                        <header className="flex justify-between items-start mb-4">
                            <div>
                                <span className={`text-[10px] uppercase tracking-widest font-bold px-2 py-1 rounded-md mb-2 inline-block ${darkMode ? 'bg-stone-800 text-stone-400' : 'bg-stone-100 text-stone-600'
                                    }`}>
                                    {session.category || (lang === 'es' ? 'General' : 'General')}
                                </span>
                                <h3 className="text-lg font-serif font-black leading-tight">
                                    {session.title || (lang === 'es' ? 'Sesión sin título' : 'Untitled Session')}
                                </h3>
                            </div>
                            <div className="flex flex-col items-end gap-2">
                                <time className="text-[10px] text-stone-500 font-mono">
                                    {new Date(session.timestamp).toLocaleDateString()}
                                </time>
                                <button
                                    onClick={() => handleDelete(session.id)}
                                    className={`p-2 rounded-full transition-colors ${darkMode
                                        ? 'text-stone-600 hover:text-red-400 hover:bg-red-400/10'
                                        : 'text-stone-300 hover:text-red-600 hover:bg-red-50'
                                        }`}
                                    title={lang === 'es' ? 'Eliminar' : 'Delete'}
                                >
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                        <line x1="10" y1="11" x2="10" y2="17"></line>
                                        <line x1="14" y1="11" x2="14" y2="17"></line>
                                    </svg>
                                </button>
                            </div>
                        </header>

                        <div className="mb-4">
                            <p className={`text-[11px] uppercase tracking-wider font-bold mb-1 ${darkMode ? 'text-stone-500' : 'text-stone-400'}`}>
                                {lang === 'es' ? 'Motivo:' : 'Topic:'} <span className={darkMode ? 'text-stone-300' : 'text-stone-600'}>{session.topic}</span>
                            </p>
                        </div>

                        <p className={`text-sm leading-relaxed font-serif italic ${darkMode ? 'text-stone-300' : 'text-stone-700'}`}>
                            "{session.summary}"
                        </p>

                        <footer className="mt-4 flex justify-between items-center border-t border-stone-800/10 pt-4">
                            <span className="text-[10px] uppercase tracking-tighter opacity-50">
                                {lang === 'es' ? 'Mentor:' : 'Mentor:'} {session.mentor}
                            </span>
                        </footer>
                    </article>
                ))}
            </div>
        </div>
    );
};

export default WisdomGallery;
