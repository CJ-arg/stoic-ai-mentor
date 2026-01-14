import React from 'react';

interface DepthCounterProps {
    currentTurn: number;
    maxTurns: number;
}

const DepthCounter: React.FC<DepthCounterProps> = ({ currentTurn, maxTurns = 5 }) => {
    return (
        <div className="flex items-center space-x-2 my-4 justify-center animate-fade-in">
            {Array.from({ length: maxTurns }).map((_, index) => {
                const isActive = index < currentTurn;
                return (
                    <div
                        key={index}
                        className={`
              h-2 w-2 rounded-full transition-all duration-500
              ${isActive ? 'bg-stone-300 scale-125' : 'bg-stone-700'}
            `}
                    />
                );
            })}
            <span className="text-xs text-stone-500 ml-2 font-serif uppercase tracking-widest">
                Depth {Math.min(currentTurn, maxTurns)}/{maxTurns}
            </span>
        </div>
    );
};

export default DepthCounter;
