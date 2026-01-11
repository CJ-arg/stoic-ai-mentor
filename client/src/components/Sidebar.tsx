import { useEffect, useRef } from 'react';

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
    // Reference to the aside container to control its internal scroll
    const asideRef = useRef<HTMLElement>(null);
    // Map of references to each mentor button
    const mentorRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({});

    /**
     * EFFECT: Precise horizontal centering.
     * This calculation ensures only the sidebar scrolls, keeping the rest of the app static.
     */
    useEffect(() => {
        const container = asideRef.current;
        const activeBtn = mentorRefs.current[currentMentor];

        if (container && activeBtn) {
            // Calculate the button's center relative to the container's center
            const containerWidth = container.offsetWidth;
            const btnLeft = activeBtn.offsetLeft;
            const btnWidth = activeBtn.offsetWidth;

            // Target scroll: Button position - Half of container + Half of button
            const scrollTarget = btnLeft - (containerWidth / 2) + (btnWidth / 2);

            container.scrollTo({
                left: scrollTarget,
                behavior: 'smooth',
            });
        }
    }, [currentMentor]);

    return (
        <aside
            ref={asideRef} // Attach ref here to control scrollLeft
            className="flex flex-row lg:flex-col gap-4 pt-[1vh] pb-4 overflow-x-auto lg:overflow-x-visible w-full lg:w-40 shrink-0 snap-x snap-mandatory scrollbar-hide"
        >
            {mentors.map((m) => {
                const isActive = currentMentor === m.id;

                return (
                    <button
                        key={m.id}
                        // Store each button's DOM element in the map
                        ref={(el) => { if (el) mentorRefs.current[m.id] = el; }}
                        onClick={() => setMentor(m.id)}
                        aria-pressed={isActive}
                        aria-label={isActive ? `Current mentor: ${m.name}` : `Select ${m.name} as mentor`}
                        className={`flex-shrink-0 flex flex-col items-center rounded-xl border-2 transition-all duration-300 overflow-hidden w-32 lg:w-full shadow-sm snap-center min-w-[120px] ${isActive
                                ? 'border-stone-800 bg-stone-800 scale-105 shadow-lg z-10'
                                : `${darkMode ? 'bg-stone-900 border-stone-800' : 'bg-white border-white'} grayscale-[0.2]`
                            }`}
                    >
                        <img
                            src={m.img}
                            alt=""
                            className="w-full h-24 lg:h-28 object-cover pointer-events-none"
                        />
                        <div className="p-2 text-center w-full">
                            <p className={`text-[11px] lg:text-xs font-bold ${isActive ? 'text-white' : (darkMode ? 'text-stone-300' : 'text-stone-800')
                                }`}>
                                {m.name}
                            </p>
                            <p className={`text-[8px] uppercase hidden lg:block ${isActive ? 'text-stone-400' : 'text-stone-500'
                                }`}>
                                {m.title}
                            </p>
                        </div>
                    </button>
                );
            })}
        </aside>
    );
};