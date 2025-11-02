
import React from 'react';
import { Item, Feedback } from '../types';
import ChoiceButton from './ChoiceButton';

interface GameScreenProps {
  item: Item;
  score: number;
  onChoice: (isLiving: boolean) => void;
  feedback: Feedback;
  currentItemNumber: number;
  totalItems: number;
}

const FeedbackMessage: React.FC<{ feedback: Feedback }> = ({ feedback }) => {
  if (feedback === Feedback.None) return null;

  const isCorrect = feedback === Feedback.Correct;
  const message = isCorrect ? 'Correct!' : 'Incorrect!';
  const color = isCorrect ? 'text-green-400' : 'text-red-500';

  return (
    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20">
      <p className={`text-6xl animate-ping-pong ${color} drop-shadow-[3px_3px_0_rgba(0,0,0,1)]`}>{message}</p>
    </div>
  );
};

const GameScreen: React.FC<GameScreenProps> = ({ item, score, onChoice, feedback, currentItemNumber, totalItems }) => {
  const isAnswering = feedback !== Feedback.None;

  return (
    <div className="bg-[#7F7F7F] bg-opacity-75 p-4 sm:p-8 rounded-lg border-4 border-black shadow-lg w-full">
      <div className="flex justify-between items-center mb-4 text-xl">
        <p>Score: <span className="text-yellow-400">{score}</span></p>
        <p>Item: <span className="text-yellow-400">{currentItemNumber} / {totalItems}</span></p>
      </div>
      
      <div className="relative bg-[#C6C6C6] border-4 border-t-[#555555] border-l-[#555555] border-b-[#FFFFFF] border-r-[#FFFFFF] p-6 mb-6 min-h-[250px] flex flex-col items-center justify-center">
        <FeedbackMessage feedback={feedback} />
        <div className="w-32 h-32 flex items-center justify-center mb-4">
          <img src={item.imageUrl} alt={item.name} className="max-w-full max-h-full object-contain pixelated-image" style={{ imageRendering: 'pixelated' }} />
        </div>
        <h2 className="text-3xl text-black drop-shadow-[2px_2px_0_rgba(255,255,255,0.7)]">{item.name}</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <ChoiceButton onClick={() => onChoice(true)} disabled={isAnswering} color="green">
          Living Thing
        </ChoiceButton>
        <ChoiceButton onClick={() => onChoice(false)} disabled={isAnswering} color="red">
          Non-Living Thing
        </ChoiceButton>
      </div>
    </div>
  );
};

export default GameScreen;
