import React from 'react';
import ChoiceButton from './ChoiceButton';

interface EndScreenProps {
  score: number;
  totalItems: number;
  highScore: number;
  isNewHighScore: boolean;
  onPlayAgain: () => void;
}

const EndScreen: React.FC<EndScreenProps> = ({ score, totalItems, highScore, isNewHighScore, onPlayAgain }) => {
  const percentage = Math.round((score / totalItems) * 100);
  let message = '';

  if (percentage === 100) {
    message = 'Perfect Score! You are a Minecraft expert!';
  } else if (percentage >= 75) {
    message = 'Great job! You know your stuff!';
  } else if (percentage >= 50) {
    message = 'Not bad! A little more practice needed.';
  } else {
    message = 'Better luck next time, survivor!';
  }

  return (
    <div className="bg-[#7F7F7F] bg-opacity-75 p-8 rounded-lg border-4 border-black shadow-lg flex flex-col items-center space-y-6">
      <h1 className="text-4xl md:text-5xl drop-shadow-[4px_4px_0_rgba(0,0,0,0.5)]">Game Over!</h1>
      
      {isNewHighScore && (
         <p className="text-2xl text-green-400 animate-pulse drop-shadow-[2px_2px_0_rgba(0,0,0,1)]">New High Score!</p>
      )}

      <div className="text-center">
        <p className="text-2xl">Your Final Score:</p>
        <p className="text-6xl text-yellow-400 drop-shadow-[4px_4px_0_rgba(0,0,0,0.5)]">{score} / {totalItems}</p>
      </div>
      
      <p className="text-xl">High Score: <span className="text-yellow-300">{highScore}</span></p>
      
      <p className="text-xl text-gray-200">{message}</p>
      
      <ChoiceButton onClick={onPlayAgain} color="blue">
        Main Menu
      </ChoiceButton>
    </div>
  );
};

export default EndScreen;
