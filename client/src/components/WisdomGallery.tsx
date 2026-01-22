import React, { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db';

interface WisdomGalleryProps {
    darkMode: boolean;
    lang: 'es' | 'en';
    onPracticalAction: (id: number) => void;
}

const WisdomCard: React.FC<{
    session: any;
    darkMode: boolean;
    lang: 'es' | 'en';
    onDelete: (id: number) => void;
    onPracticalAction: (id: number) => void;
}> = ({ session, darkMode, lang, onDelete, onPracticalAction }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [note, setNote] = useState(session.userNote || '');

    const handleSaveNote = async () => {
        try {
            await db.sessions.update(session.id, { userNote: note });
            setIsEditing(false);
        } catch (e) {
            console.error("Failed to save note:", e);
        }
    };

    return (
        <article
            className={`p-6 rounded-2xl border transition-all duration-500 hover:scale-[1.01] flex flex-col gap-4 ${darkMode
                ? 'bg-stone-900 border-stone-800 hover:border-stone-600'
                : 'bg-white border-stone-200 hover:border-stone-400 shadow-sm'
                }`}
        >
            <header className="flex justify-between items-start">
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
                        onClick={() => onDelete(session.id)}
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

            <div>
                <p className={`text-[11px] uppercase tracking-wider font-bold mb-1 ${darkMode ? 'text-stone-500' : 'text-stone-400'}`}>
                    {lang === 'es' ? 'Motivo:' : 'Topic:'} <span className={darkMode ? 'text-stone-300' : 'text-stone-600'}>{session.topic}</span>
                </p>
                <p className={`text-sm leading-relaxed font-serif italic ${darkMode ? 'text-stone-300' : 'text-stone-700'}`}>
                    "{session.summary}"
                </p>
            </div>

            {/* ACTION PLAN IF EXISTS */}
            {session.actionPlan && (
                <div className={`p-4 rounded-xl border-2 border-orange-500/20 bg-orange-500/5 ${darkMode ? 'text-stone-300' : 'text-stone-800'
                    }`}>
                    <h4 className="text-[10px] uppercase tracking-widest font-black text-orange-500 mb-2">
                        {lang === 'es' ? '⚡ Plan de Acción Activo' : '⚡ Active Action Plan'}
                    </h4>
                    <p className="text-sm font-serif leading-relaxed italic">
                        {session.actionPlan}
                    </p>
                </div>
            )}

            {/* PERSONAL REFLECTION SECTION */}
            <div className={`mt-2 p-4 rounded-xl border-l-2 ${darkMode ? 'bg-stone-950/50 border-stone-700' : 'bg-stone-50 border-stone-200'
                }`}>
                <div className="flex justify-between items-center mb-2">
                    <h4 className={`text-[10px] uppercase tracking-[0.2em] font-bold ${darkMode ? 'text-stone-500' : 'text-stone-400'}`}>
                        {lang === 'es' ? 'Mi Reflexión' : 'My Reflection'}
                    </h4>
                    {!isEditing ? (
                        <button
                            onClick={() => setIsEditing(true)}
                            className="text-[10px] font-bold uppercase hover:underline opacity-60"
                        >
                            {note ? (lang === 'es' ? 'Editar' : 'Edit') : (lang === 'es' ? 'Añadir Nota' : 'Add Note')}
                        </button>
                    ) : (
                        <div className="flex gap-2">
                            <button
                                onClick={handleSaveNote}
                                className="text-[10px] font-bold uppercase text-blue-500 hover:underline"
                            >
                                {lang === 'es' ? 'Guardar' : 'Save'}
                            </button>
                            <button
                                onClick={() => { setIsEditing(false); setNote(session.userNote || ''); }}
                                className="text-[10px] font-bold uppercase opacity-60 hover:underline"
                            >
                                {lang === 'es' ? 'Cancelar' : 'Cancel'}
                            </button>
                        </div>
                    )}
                </div>

                {isEditing ? (
                    <textarea
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        className={`w-full bg-transparent text-sm font-serif p-0 border-none focus:ring-0 resize-none min-h-[60px] ${darkMode ? 'text-stone-300' : 'text-stone-800'
                            }`}
                        placeholder={lang === 'es' ? 'Escribe aquí cómo aplicarás esto...' : 'Write here how you will apply this...'}
                        autoFocus
                    />
                ) : (
                    <p className={`text-sm font-serif ${note ? (darkMode ? 'text-stone-400' : 'text-stone-600') : 'text-stone-400/50 italic'}`}>
                        {note || (lang === 'es' ? 'Ninguna anotación todavía.' : 'No notes yet.')}
                    </p>
                )}
            </div>

            <footer className="mt-2 flex justify-between items-center border-t border-stone-800/10 pt-4">
                <span className="text-[10px] uppercase tracking-tighter opacity-50">
                    {lang === 'es' ? 'Mentor:' : 'Mentor:'} {session.mentor}
                </span>

                <button
                    onClick={() => onPracticalAction(session.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${darkMode
                        ? 'bg-orange-500/10 text-orange-400 hover:bg-orange-500 hover:text-white'
                        : 'bg-orange-50 text-orange-600 hover:bg-orange-600 hover:text-white border border-orange-200'
                        }`}
                >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"></path>
                    </svg>
                    {lang === 'es' ? 'Llamado a la Acción' : 'Call to Action'}
                </button>
            </footer>
        </article>
    );
};

const WisdomGallery: React.FC<WisdomGalleryProps> = ({ darkMode, lang, onPracticalAction }) => {
    const allSessions = useLiveQuery(() => db.sessions.toArray(), []) || [];

    const savedSessions = allSessions
        .filter(s => s.isCompleted && s.summary && s.type !== 'practical')
        .sort((a, b) => b.timestamp - a.timestamp);

    const handleDelete = async (id: number) => {
        const confirmMsg = lang === 'es'
            ? '¿Estás seguro de que quieres eliminar esta episteme para siempre? Esta acción no se puede deshacer.'
            : 'Are you sure you want to delete this episteme forever? This action cannot be undone.';

        if (window.confirm(confirmMsg)) {
            try {
                await db.sessions.delete(id);
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
                    <WisdomCard
                        key={session.id}
                        session={session}
                        darkMode={darkMode}
                        lang={lang}
                        onDelete={handleDelete}
                        onPracticalAction={onPracticalAction}
                    />
                ))}
            </div>
        </div>
    );
};

export default WisdomGallery;
