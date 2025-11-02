
import React from 'react';

interface ChoiceButtonProps {
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
  color?: 'green' | 'red' | 'blue' | 'gray';
}

const ChoiceButton: React.FC<ChoiceButtonProps> = ({ onClick, disabled = false, children, color = 'gray' }) => {
  const colorClasses = {
    gray: 'bg-gray-500 border-gray-700 hover:bg-gray-600 active:border-gray-500',
    green: 'bg-green-500 border-green-700 hover:bg-green-600 active:border-green-500',
    red: 'bg-red-500 border-red-700 hover:bg-red-600 active:border-red-500',
    blue: 'bg-blue-500 border-blue-700 hover:bg-blue-600 active:border-blue-500',
  };

  const disabledClasses = 'opacity-50 cursor-not-allowed';

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        w-full text-white p-4 text-xl tracking-wider
        border-b-8 rounded-md
        transition-all duration-150 ease-in-out
        transform active:translate-y-1 active:border-b-4
        focus:outline-none focus:ring-4 focus:ring-yellow-300
        ${colorClasses[color]}
        ${disabled ? disabledClasses : ''}
      `}
    >
      {children}
    </button>
  );
};

export default ChoiceButton;
