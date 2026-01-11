// src/components/Sidebar.tsx

export interface Mentor {
    id: string;
    name: string;
    title: string;
    img: string;
}

interface SidebarProps {
    mentors: Mentor[];
    currentMentor: string;
    setMentor: (id: string) => void;
    darkMode: boolean;
}

export const Sidebar = ({ mentors, currentMentor, setMentor, darkMode }: SidebarProps) => {
    return (
        <aside className="flex flex-row lg:flex-col gap-4 pt-[1vh] overflow-x-auto lg:overflow-x-visible w-full lg:w-40 shrink-0">
            {mentors.map((m) => (
                <button
                    key={m.id}
                    onClick={() => setMentor(m.id)}
                    className={`flex-shrink-0 flex flex-col items-center rounded-xl border-2 transition-all duration-300 overflow-hidden w-32 lg:w-full shadow-sm ${currentMentor === m.id
                            ? 'border-stone-800 bg-stone-800 scale-105 shadow-lg'
                            : `${darkMode ? 'bg-stone-900 border-stone-800' : 'bg-white border-white'} grayscale-[0.2]`
                        }`}
                >
                    <img src={m.img} alt={m.name} className="w-full h-24 lg:h-28 object-cover" />
                    <div className="p-2 text-center w-full">
                        <p className={`text-[11px] lg:text-xs font-bold ${currentMentor === m.id ? 'text-white' : (darkMode ? 'text-stone-300' : 'text-stone-800')
                            }`}>
                            {m.name}
                        </p>
                        <p className={`text-[8px] uppercase hidden lg:block ${currentMentor === m.id ? 'text-stone-400' : 'text-stone-500'
                            }`}>
                            {m.title}
                        </p>
                    </div>
                </button>
            ))}
        </aside>
    );
};