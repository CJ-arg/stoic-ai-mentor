import { useState, useEffect } from 'react';
import axios from 'axios';
import { db } from '../db';
import { useLiveQuery } from 'dexie-react-hooks';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const mentorGreetings: Record<string, Record<string, string>> = {
    marco: {
        es: 'Saludos. Soy Marco Aurelio. Iniciemos una sesión de 5 pasos para examinar tu razón. ¿Qué pensamiento inquieta tu ciudadela interior?',
        en: 'Greetings. I am Marcus Aurelius. Let us begin a 5-step session to examine your reason. What thought disturbs your inner citadel?'
    },
    seneca: {
        es: 'Soy Séneca. El tiempo es breve, así que dedicaremos 5 diálogos a tu inquietud. No perdamos un segundo, ¿qué aflige tu alma?',
        en: 'I am Seneca. Time is short, so we will devote 5 dialogues to your concern. Let us not waste a second, what afflicts your soul?'
    },
    epicteto: {
        es: 'Soy Epicteto. Tienes 5 preguntas para que te demuestre tu error. ¿Cuál es tu problema hoy?',
        en: 'I am Epictetus. You have 5 questions for me to show you your error. What is your problem today?'
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

    // Live query to get current session details
    const currentSession = useLiveQuery(
        () => (sessionId ? db.sessions.get(sessionId) : undefined),
        [sessionId]
    );

    const turnCount = Math.floor((messages.length - 1) / 2); // Subtract greeting, divide by 2 (User+Bot)

    // NEW: Session Type detection
    const sessionType = currentSession?.type || 'socratic';
    const isPractical = sessionType === 'practical';
    const maxTurns = isPractical ? 3 : 5;

    // Initialize or restore session
    useEffect(() => {
        let isMounted = true;

        const initSession = async () => {
            // 1. Check if there's an active incomplete session for this mentor
            const activeSession = await db.sessions
                .where('mentor')
                .equals(initialMentor)
                .filter(session => !session.isCompleted)
                .last();

            if (!isMounted) return;

            if (activeSession) {
                // If the current sessionId is already correct, do nothing
                if (sessionId !== activeSession.id) {
                    setSessionId(activeSession.id);
                }

                // Check if we need to update the greeting language (only if it's the first message)
                const firstMessage = await db.messages.where('sessionId').equals(activeSession.id).first();
                if (firstMessage && firstMessage.role === 'bot') {
                    const expectedGreeting = activeSession.type === 'practical'
                        ? firstMessage.text // Don't auto-translate practical context-heavy greetings yet
                        : mentorGreetings[initialMentor][language];

                    if (activeSession.type !== 'practical' && firstMessage.text !== expectedGreeting) {
                        const count = await db.messages.where('sessionId').equals(activeSession.id).count();
                        if (count === 1) {
                            await db.messages.update(firstMessage.id, { text: expectedGreeting });
                        }
                    }
                }
            } else {
                // 2. Create new session (default to socratic)
                const id = await db.sessions.add({
                    timestamp: Date.now(),
                    mentor: initialMentor,
                    isCompleted: false,
                    type: 'socratic'
                });

                if (!isMounted) return;
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
        return () => { isMounted = false; };
    }, [initialMentor, language, sessionId]);

    const startPracticalAction = async (parentId: number) => {
        setLoading(true);
        try {
            const parent = await db.sessions.get(parentId);
            if (!parent) return;

            // 1. Mark any active session as completed
            if (sessionId) {
                await db.sessions.update(sessionId, { isCompleted: true });
            }

            // 2. Create new practical session
            const newId = await db.sessions.add({
                timestamp: Date.now(),
                mentor: initialMentor,
                isCompleted: false,
                type: 'practical',
                parentId: parentId
            });

            setSessionId(newId);

            // 3. Add context-aware greeting
            const greeting = language === 'es'
                ? `He recibido tu llamado a la acción. Recordemos tu conclusión: "${parent.summary?.substring(0, 100)}...". Tu nota personal fue: "${parent.userNote || 'Sin notas'}". 
                   
                   Dime, ¿cuál es el mayor obstáculo práctico que prevés para aplicar esta sabiduría hoy?`
                : `I have received your call to action. Let us remember your conclusion: "${parent.summary?.substring(0, 100)}...". Your personal note: "${parent.userNote || 'No notes'}".
                   
                   Tell me, what is the biggest practical obstacle you foresee for applying this wisdom today?`;

            await db.messages.add({
                sessionId: newId,
                role: 'bot',
                text: greeting,
                timestamp: Date.now()
            });

            // 4. Add automatic user prompt
            const autoPrompt = language === 'es' ? 'Quiero aplicar este conocimiento en mi día a día.' : 'I want to apply this knowledge in my daily life.';
            await sendMessage(autoPrompt, newId);

        } catch (e) {
            console.error("Failed to start practical action:", e);
        } finally {
            setLoading(false);
        }
    };

    const sendMessage = async (text: string, forceId?: number) => {
        const targetId = forceId || sessionId;
        if (!targetId || !text.trim() || loading) return;

        setLoading(true);

        // Save User Message
        await db.messages.add({
            sessionId: targetId,
            role: 'user',
            text,
            timestamp: Date.now()
        });

        try {
            const historyMessages = await db.messages.where('sessionId').equals(targetId).toArray();
            const history = historyMessages.map(m => ({
                role: m.role === 'bot' ? 'assistant' : 'user',
                content: m.text
            }));

            // Use dynamic turn count for practical sessions
            const currentTurn = Math.floor((historyMessages.length - 1) / 2);

            const response = await axios.post(`${API_URL}/ask`, {
                prompt: text,
                mentor: initialMentor,
                language,
                turnCount: currentTurn,
                history,
                sessionType: forceId ? 'practical' : sessionType
            });

            // Save Bot Message
            await db.messages.add({
                sessionId: targetId,
                role: 'bot',
                text: response.data.answer,
                timestamp: Date.now()
            });

        } catch (error) {
            console.error(error);
            const errorMsg = language === 'es' ? 'El oráculo está silenciado.' : 'The oracle is silent.';
            await db.messages.add({
                sessionId: targetId,
                role: 'bot',
                text: errorMsg,
                timestamp: Date.now()
            });
        } finally {
            setLoading(false);
        }
    };

    const synthesizeWisdom = async () => {
        if (!sessionId || currentSession?.summary && !isPractical) return;
        setLoading(true);

        try {
            const history = messages.map(m => ({
                role: m.role === 'bot' ? 'assistant' : 'user',
                content: m.text
            }));

            const response = await axios.post(`${API_URL}/ask`, {
                prompt: isPractical ? "Give me my final Action Plan." : "Synthesize our conversation into one profound stoic truth.",
                mentor: initialMentor,
                language,
                isSynthesis: true,
                history,
                sessionType
            });

            const rawAnswer = response.data.answer;

            if (isPractical) {
                // Save Action Plan to the parent session
                if (currentSession?.parentId) {
                    await db.sessions.update(currentSession.parentId, {
                        actionPlan: rawAnswer
                    });
                }

                // Also save to current session just in case
                await db.sessions.update(sessionId, {
                    summary: rawAnswer
                });

                await db.messages.add({
                    sessionId,
                    role: 'bot',
                    text: language === 'es' ? `### LLAMADO A LA ACCIÓN (Askesis)\n\n${rawAnswer}` : `### CALL TO ACTION (Askesis)\n\n${rawAnswer}`,
                    timestamp: Date.now()
                });
            } else {
                let synthesisData;
                try {
                    const jsonMatch = rawAnswer.match(/\{[\s\S]*\}/);
                    const jsonString = jsonMatch ? jsonMatch[0] : rawAnswer;
                    synthesisData = JSON.parse(jsonString);
                } catch (jsonError) {
                    synthesisData = {
                        title: language === 'es' ? "Episteme profunda" : "Deep Episteme",
                        topic: language === 'es' ? "Consulta estoica" : "Stoic inquiry",
                        category: language === 'es' ? "Sabiduría" : "Wisdom",
                        summary: rawAnswer
                    };
                }

                const { title, topic, category, summary } = synthesisData;

                await db.sessions.update(sessionId, {
                    summary,
                    title,
                    topic,
                    category
                });

                await db.messages.add({
                    sessionId,
                    role: 'bot',
                    text: `SYNTHESIS: ${summary}`,
                    timestamp: Date.now()
                });
            }

        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    // Initial server wake-up (restored)
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

    const finishSession = async () => {
        if (!sessionId) return;
        setLoading(true);
        try {
            await db.sessions.update(sessionId, {
                isCompleted: true,
                timestamp: Date.now()
            });

            await new Promise(resolve => setTimeout(resolve, 50));
            setSessionId(null);
        } catch (e) {
            console.error("Critical: Failed to finish session", e);
        } finally {
            setLoading(false);
        }
    };

    const resetSession = async () => {
        if (sessionId) {
            await db.sessions.update(sessionId, { isCompleted: true });
        }
        setSessionId(null);
    };

    return {
        mentor: initialMentor,
        messages,
        loading,
        sendMessage,
        isWarmingUp,
        turnCount,
        maxTurns,
        sessionType,
        startPracticalAction,
        synthesizeWisdom,
        finishSession,
        resetSession,
        isSynthesized: !!currentSession?.summary
    };
};
