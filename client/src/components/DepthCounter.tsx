import React from 'react';

interface DepthCounterProps {
    currentTurn: number;
    maxTurns: number;
}

const DepthCounter: React.FC<DepthCounterProps> = ({ currentTurn, maxTurns = 5 }) => {
    return (
        <div>
            <span className="text-xs text-stone-500 ml-1 font-serif uppercase tracking-widest">
                Bathos {Math.min(currentTurn, maxTurns)}/{maxTurns}
            </span>

            <div className="flex items-center space-x-3 my-1 justify-center animate-fade-in">
                {Array.from({ length: maxTurns }).map((_, index) => {
                    const isActive = index < currentTurn;
                    return (
                        <div
                            key={index}
                            className={`
              h-1 w-1 rounded-full transition-all duration-500
              ${isActive ? 'bg-stone-300 scale-125' : 'bg-stone-700'}
            `}
                        />
                    );
                })}
            </div>
        </div>

    );
};

export default DepthCounter;
