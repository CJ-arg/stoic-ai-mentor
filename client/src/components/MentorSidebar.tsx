interface Mentor {
  id: string;
  name: string;
  title: string;
  img: string;
}

interface Props {
  mentors: Mentor[];
  activeMentor: string;
  onSelect: (id: string) => void;
}

export const MentorSidebar = ({ mentors, activeMentor, onSelect }: Props) => (
  <aside className="flex flex-row lg:flex-col gap-4 overflow-x-auto lg:overflow-x-visible w-full lg:w-40 shrink-0 pb-2 lg:pb-0">
    {mentors.map((m) => (
      <button
        key={m.id}
        onClick={() => onSelect(m.id)}
        className={`flex-shrink-0 flex flex-col items-center rounded-xl border-2 transition-all duration-300 overflow-hidden w-32 lg:w-full shadow-sm ${
          activeMentor === m.id 
            ? 'border-stone-800 bg-stone-800 scale-105 shadow-lg z-10' 
            : 'border-white bg-white hover:border-stone-400 grayscale-[0.2]'
        }`}
      >
        <div className="w-full h-24 lg:h-28 overflow-hidden">
          <img src={m.img} alt={m.name} className="w-full h-full object-cover" />
        </div>
        <div className="p-2 text-center w-full">
          <p className={`text-[11px] lg:text-xs font-bold truncate ${activeMentor === m.id ? 'text-white' : 'text-stone-800'}`}>
            {m.name}
          </p>
          <p className={`text-[8px] uppercase tracking-widest hidden lg:block mt-0.5 ${activeMentor === m.id ? 'text-stone-400' : 'text-stone-500'}`}>
            {m.title}
          </p>
        </div>
      </button>
    ))}
  </aside>
);