import Dexie, { type EntityTable } from 'dexie';

export interface Session {
    id: number;
    timestamp: number;
    mentor: string;
    summary?: string;
    title?: string;
    topic?: string;
    category?: string;
    isCompleted: boolean;
}

export interface Message {
    id: number;
    sessionId: number;
    role: 'user' | 'bot';
    text: string;
    timestamp: number;
}

const db = new Dexie('StoicMentorDB') as Dexie & {
    sessions: EntityTable<Session, 'id'>;
    messages: EntityTable<Message, 'id'>;
};

db.version(1).stores({
    sessions: '++id, timestamp, mentor, isCompleted',
    messages: '++id, sessionId, role, timestamp'
});

export { db };
