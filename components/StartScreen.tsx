import React from 'react';
import ChoiceButton from './ChoiceButton';
import { Difficulty, HighScores } from '../types';

interface StartScreenProps {
  onStart: (difficulty: Difficulty) => void;
  highScores: HighScores;
}

const DifficultyButton: React.FC<{
  difficulty: Difficulty;
  label: string;
  color: 'green' | 'blue' | 'red';
  highScore: number;
  onStart: (difficulty: Difficulty) => void;
}> = ({ difficulty, label, color, highScore, onStart }) => (
  <div className="flex flex-col items-center">
    <ChoiceButton onClick={() => onStart(difficulty)} color={color}>
      {label}
    </ChoiceButton>
    <p className="text-sm mt-2 text-yellow-300">High Score: {highScore}</p>
  </div>
);

const StartScreen: React.FC<StartScreenProps> = ({ onStart, highScores }) => {
  return (
    <div className="bg-[#7F7F7F] bg-opacity-75 p-8 rounded-lg border-4 border-black shadow-lg flex flex-col items-center space-y-6">
      <h1 className="text-3xl md:text-5xl drop-shadow-[4px_4px_0_rgba(0,0,0,0.5)]">Minecraft:</h1>
      <h2 className="text-2xl md:text-4xl drop-shadow-[4px_4px_0_rgba(0,0,0,0.5)]">Living or Not?</h2>
      <p className="text-lg text-gray-200">Select your difficulty!</p>
      <div className="w-full max-w-sm space-y-4">
        <DifficultyButton
          difficulty={Difficulty.Easy}
          label="Easy (10 items)"
          color="green"
          highScore={highScores[Difficulty.Easy]}
          onStart={onStart}
        />
        <DifficultyButton
          difficulty={Difficulty.Medium}
          label="Medium (20 items)"
          color="blue"
          highScore={highScores[Difficulty.Medium]}
          onStart={onStart}
        />
        <DifficultyButton
          difficulty={Difficulty.Hard}
          label="Hard (All items)"
          color="red"
          highScore={highScores[Difficulty.Hard]}
          onStart={onStart}
        />
      </div>
    </div>
  );
};

export default StartScreen;
