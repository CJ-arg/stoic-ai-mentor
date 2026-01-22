import React from 'react';

interface DepthCounterProps {
    currentTurn: number;
    maxTurns: number;
    sessionType?: 'socratic' | 'practical';
}

const DepthCounter: React.FC<DepthCounterProps> = ({ currentTurn, maxTurns = 5, sessionType = 'socratic' }) => {
    const isPractical = sessionType === 'practical';
    const label = isPractical ? 'Askesis' : 'Bathos';
    const activeColor = isPractical ? 'bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.6)]' : 'bg-stone-300';

    return (
        <div className="flex flex-col items-center">
            <span className={`text-[9px] ml-1 font-serif uppercase tracking-[0.2em] font-bold ${isPractical ? 'text-orange-500' : 'text-stone-500'}`}>
                {label} {Math.min(currentTurn, maxTurns)}/{maxTurns}
            </span>

            <div className="flex items-center space-x-2 my-1 justify-center animate-fade-in">
                {Array.from({ length: maxTurns }).map((_, index) => {
                    const isActive = index < currentTurn;
                    return (
                        <div
                            key={index}
                            className={`
              h-1 w-1 rounded-full transition-all duration-500
              ${isActive ? `${activeColor} scale-125` : 'bg-stone-700/50'}
            `}
                        />
                    );
                })}
            </div>
        </div>
    );
};

export default DepthCounter;
