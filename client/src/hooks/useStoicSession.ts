import { useState, useEffect } from 'react';
import axios from 'axios';
import { db, type Message } from '../db';
import { useLiveQuery } from 'dexie-react-hooks';

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

export const useStoicSession = (initialMentor: string, language: 'es' | 'en' = 'es') => {
    const [sessionId, setSessionId] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);
    const [isWarmingUp, setIsWarmingUp] = useState(true);

    // Live query to get messages for the current session
    const messages = useLiveQuery(
        () => (sessionId ? db.messages.where('sessionId').equals(sessionId).toArray() : []),
        [sessionId]
    ) || [];

    const turnCount = Math.floor((messages.length - 1) / 2); // Subtract greeting, divide by 2 (User+Bot)

    // Initialize or restore session
    useEffect(() => {
        const initSession = async () => {
            // 1. Check if there's an active incomplete session for this mentor
            const activeSession = await db.sessions
                .where('mentor')
                .equals(initialMentor)
                .filter(session => !session.isCompleted)
                .last();

            if (activeSession) {
                setSessionId(activeSession.id);
            } else {
                // 2. Create new session
                const id = await db.sessions.add({
                    timestamp: Date.now(),
                    mentor: initialMentor,
                    isCompleted: false
                });
                setSessionId(id);

                // 3. Add initial greeting
                await db.messages.add({
                    sessionId: id,
                    role: 'bot',
                    text: mentorGreetings[initialMentor][language],
                    timestamp: Date.now()
                });
            }
        };

        initSession();
    }, [initialMentor, language]);

    // Initial server wake-up (same as before)
    useEffect(() => {
        const wakeup = async () => {
            const startTime = Date.now();
            const MIN_LOADING_TIME = 4000;
            const MAX_WAIT_TIME = 12000;
            const safetyTimer = setTimeout(() => setIsWarmingUp(false), MAX_WAIT_TIME);
            try {
                await axios.post(`${API_URL}/ask`, { prompt: "Wake up", mentor: initialMentor, language });
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
        if (!sessionId || !text.trim() || loading) return;

        setLoading(true);

        // Save User Message
        await db.messages.add({
            sessionId,
            role: 'user',
            text,
            timestamp: Date.now()
        });

        try {
            // Send to API including history and turnCount context
            // Note: We'll update server to handle this better, for now basic prompt
            const history = messages.map(m => ({
                role: m.role === 'bot' ? 'assistant' : 'user',
                content: m.text
            }));

            const response = await axios.post(`${API_URL}/ask`, {
                prompt: text,
                mentor: initialMentor,
                language,
                turnCount, // Send current turn count for server-side logic
                history // Optional: send history if server supports it later
            });

            // Save Bot Message
            await db.messages.add({
                sessionId,
                role: 'bot',
                text: response.data.answer,
                timestamp: Date.now()
            });

        } catch (error) {
            console.error(error);
            const errorMsg = language === 'es' ? 'El oráculo está silenciado.' : 'The oracle is silent.';
            await db.messages.add({
                sessionId,
                role: 'bot',
                text: errorMsg,
                timestamp: Date.now()
            });
        } finally {
            setLoading(false);
        }
    };

    const synthesizeWisdom = async () => {
        if (!sessionId) return;
        setLoading(true);

        try {
            // Placeholder for synthesis logic - could be a specific API call
            // For now, let's just mark complete and maybe add a system message

            // Just mark as completed for now, or trigger a special "synthesis" prompt
            // Let's ask the AI for a summary
            const response = await axios.post(`${API_URL}/ask`, {
                prompt: "Synthesize our conversation into one profound stoic truth.",
                mentor: initialMentor,
                language,
                isSynthesis: true
            });

            await db.sessions.update(sessionId, {
                summary: response.data.answer,
                isCompleted: true
            });

            // Add the summary as a final message
            await db.messages.add({
                sessionId,
                role: 'bot',
                text: `📝 **SYNTHESIS**: ${response.data.answer}`,
                timestamp: Date.now()
            });

        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const resetSession = async () => {
        // Mark current as completed if not already (abandoned)
        if (sessionId) {
            await db.sessions.update(sessionId, { isCompleted: true });
        }
        setSessionId(null); // Trigger effect to create new one
    };

    return {
        mentor: initialMentor,
        messages,
        loading,
        sendMessage,
        isWarmingUp,
        turnCount,
        synthesizeWisdom,
        resetSession,
        isCompleted: false // We can improve this with a live query on the session itself if needed
    };
};
