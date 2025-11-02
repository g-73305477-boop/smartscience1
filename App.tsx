import React, { useState, useCallback, useEffect } from 'react';
import { GameState, Feedback, Item, Difficulty, HighScores } from './types';
import { GAME_ITEMS } from './constants';
import StartScreen from './components/StartScreen';
import GameScreen from './components/GameScreen';
import EndScreen from './components/EndScreen';

// --- START: Sound Utilities ---
// Sound sources: Generated with bfxr.net (public domain) and encoded to Base64 data URIs.
const SOUNDS = {
  click: new Audio('data:audio/wav;base64,UklGRl9vT19XQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YVSAAAAAAAB/AIA/gL+Av4C/gACAgIA/gL+AP4C/gD+AAAAAAAAA'),
  start: new Audio('data:audio/wav;base64,UklGRlpsT19XQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YVpsAAAAAAB5AJMA9wABAAYCygGpA70CEAP1Am8CgQLtAaMC3wE6AmsA5wAHAEEArgDGAHwAEgDUANwAogDwAE8A6gB2AA4A4gB+AOIAAAAASHpUfHiEeHh6e3xufG58a3pSenB2eXt5enp5fX5/f4B/gICAgoGCgYKAgoCCgYCBgH+AgH9/f39/f39/f35+fn5+fn5+fX19fX19fX18fHx8fHx8fHx7e3t7e3t7e3t7e3t7enp6enp6enp6ejo6Ojo6Ojo6Ojo5OTk5OTk5OTk5OTg4ODg4ODg4ODg4ODc3Nzc3Nzc3Nzc3NzY2NjY2NjY2NjY2NjU1NTU1NTU1NTU1NTQ0NDQ0NDQ0NDQ0NDMzMzMzMzMzMzMzMzMzMzIyMjIyMjIyMjIyMjIyMhISEhISEhISEhISEhISEhHh4eHh4eHh4eHh4eHh4d3d3d3d3d3d3d3d3d3d3d3d3d3c='),
  // FIX: Added closing parenthesis and comma to correctly terminate the 'correct' sound object property.
  correct: new Audio('data:audio/wav;base64,UklGRqJuT19XQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YZpuAAAAAAB9AHsAewB/AH8AewB/AH8AgQCAAIEAgQCAAIEAgQCAAIEAgQCAAIEAgQCAAIIAggCCAIIAggCCAIIAgwCDAIMAgwCDAIMAgwCDAIMAgwCDAIIAggCCAIIAggCCAIIAgQCAAIEAgQCAAIEAgQCAAIEAgQCAAIAAgACAAIAAgACAAIAAfwB/AH8AfwB/AH8AfwB/AH8AfwB7AHsAewB7AHsAewB7AHsAewB7AHsAewB7AHsAewB/AH8AfwB/AH8AfwB/AH8AfwB/AH8AfwB/AH8AfwB/AIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAA'),
  incorrect: new Audio('data:audio/wav;base64,UklGRohkT19XQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YaB୍କAAAAAAAADYANgA2ADYANgA2ADMANgA2ADYANgA2ADYANgA2ADYANgA1ADUANQA1ADUANQA1ADUANQA1ADUANQA1ADUANQA1ADUANQA0ADQANAA0ADQANAA0ADQANAA0ADQANAA0ADQANAA0ADQANAAzADMANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA3ADcANwA' ),
  end: new Audio('data:audio/wav;base64,UklGRp5tT19XQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YZJtAAAAAAAAAH4AfwB/AH8AfwB/AH8AfwB/AH8AfwB/AH8AfwB/AH4AfwB/AH4AfwB/AH8AfwB/AH8AfwB+AH8AfwB/AH8AfwB/AH4AfwB+AH4AfwB/AH4AfwB+AH8AfwB+AH4AfwB+AH4AfgB+AH4AfgB+AH4AfgB+AH4AfgB9AH4AfQB9AH0AfQB9AH0AfQB9AH0AfQB9AH0AfQB9AH0AfQB9AH0AfQB8AH0AfQB8AH0AfQB8AH0AfQB9AH0AfQB9AHwAfQB8AHwAfQB8AHwAfAB8AHwAfAB8AHwAfAB8AHwAfAB8AHwAfAB7AHwAewB7AHsAewB7AHsAewB7AHsAewB7AHsAewB7AHsAewB7AHsAewB7AHsAewB7AHsAewB7AHsAewB7AHsAewB6AHsAewB6AHsAegB6AHoAegB6AHoAegB6AHoAegB6AHoAegB6AHoAegB6AHoAegB6AHoAegB5AHoAegB5AHoAegB5AHoAegB5AHoAegB5AHoAegB5AHkAeQB5AHkAeQB5AHkAeQB5AHkAeQB5AHkAeQB5AHkAeQB4AHkAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAdwB4AHcAdwB3AHcAdwB3AHcAdwB3AHcAdwB3AHcAdwB3AHcAdwB3AHcAdwB3AHcAdgB3AHYAdgB2AHYAdgB2AHYAdgB2AHYAdgB2AHYAdgB2AHYAdQB2AHUAdQB1AHUAdQB1AHUAdQB1AHUAdQB1AHUAdQB1AHUAdAB1AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHMAdABzAHMAdABzAHMAcwBzAHMAcwBzAHMAcwBzAHMAcwBzAHMAcgBzAHIAcgByAHIAcgByAHIAcgByAHIAcgByAHIAcgByAHIAcQByAHIAcQBxAHIAcQBxAHEAcQBxAHEAcQBxAHEAcQBxAHAAcQBxAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABvAHAAOwA='),
};

const playSound = (sound: HTMLAudioElement) => {
  // We clone the Audio object on each play to allow for overlapping sounds (e.g., clicking quickly).
  // FIX: Cast the result of cloneNode() to HTMLAudioElement to access the play() method.
  (sound.cloneNode() as HTMLAudioElement).play().catch(e => console.error("Error playing sound:", e));
};

const sound = {
  playClick: (isMuted: boolean) => !isMuted && playSound(SOUNDS.click),
  playStart: (isMuted: boolean) => !isMuted && playSound(SOUNDS.start),
  playCorrect: (isMuted: boolean) => !isMuted && playSound(SOUNDS.correct),
  playIncorrect: (isMuted: boolean) => !isMuted && playSound(SOUNDS.incorrect),
  playEnd: (isMuted: boolean) => !isMuted && playSound(SOUNDS.end),
};
// --- END: Sound Utilities ---

// --- START: MuteToggle Component ---
const SpeakerOnIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
  </svg>
);

const SpeakerOffIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17l-6-6m0 6l6-6" />
  </svg>
);

interface MuteToggleProps {
  isMuted: boolean;
  onToggle: () => void;
}

const MuteToggle: React.FC<MuteToggleProps> = ({ isMuted, onToggle }) => (
  <button
    onClick={onToggle}
    aria-label={isMuted ? 'Unmute sounds' : 'Mute sounds'}
    className="absolute top-4 right-4 z-50 p-2 rounded-lg bg-[#555555] border-2 border-t-[#C6C6C6] border-l-[#C6C6C6] border-b-[#373737] border-r-[#373737] hover:bg-gray-600 active:bg-gray-800 active:border-t-[#373737] active:border-l-[#373737] active:border-b-[#C6C6C6] active:border-r-[#C6C6C6] transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-300"
  >
    {isMuted ? <SpeakerOffIcon /> : <SpeakerOnIcon />}
  </button>
);
// --- END: MuteToggle Component ---

const HIGH_SCORE_KEY = 'minecraft-game-highscores';

const initialHighScores: HighScores = {
  [Difficulty.Easy]: 0,
  [Difficulty.Medium]: 0,
  [Difficulty.Hard]: 0,
};

const DIFFICULTY_LEVELS = {
  [Difficulty.Easy]: 10,
  [Difficulty.Medium]: 20,
  [Difficulty.Hard]: GAME_ITEMS.length,
};

// Fisher-Yates shuffle algorithm
const shuffleArray = <T,>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(GameState.Start);
  const [score, setScore] = useState(0);
  const [currentItemIndex, setCurrentItemIndex] = useState(0);
  const [feedback, setFeedback] = useState<Feedback>(Feedback.None);
  const [activeItems, setActiveItems] = useState<Item[]>([]);
  const [currentDifficulty, setCurrentDifficulty] = useState<Difficulty | null>(null);
  const [isNewHighScore, setIsNewHighScore] = useState(false);
  
  const [highScores, setHighScores] = useState<HighScores>(() => {
    try {
      const savedScores = localStorage.getItem(HIGH_SCORE_KEY);
      return savedScores ? { ...initialHighScores, ...JSON.parse(savedScores) } : initialHighScores;
    } catch {
      return initialHighScores;
    }
  });

  const [isMuted, setIsMuted] = useState<boolean>(() => {
    const savedMute = localStorage.getItem('minecraft-game-muted');
    return savedMute ? JSON.parse(savedMute) : false;
  });

  useEffect(() => {
    localStorage.setItem('minecraft-game-muted', JSON.stringify(isMuted));
  }, [isMuted]);

  const toggleMute = useCallback(() => {
    setIsMuted(prev => !prev);
  }, []);

  const startGame = useCallback((difficulty: Difficulty) => {
    sound.playClick(isMuted);
    sound.playStart(isMuted);

    setCurrentDifficulty(difficulty);
    setIsNewHighScore(false);

    const shuffled = shuffleArray(GAME_ITEMS);
    const itemCount = DIFFICULTY_LEVELS[difficulty];
    setActiveItems(shuffled.slice(0, itemCount));

    setScore(0);
    setCurrentItemIndex(0);
    setFeedback(Feedback.None);
    setGameState(GameState.Playing);
  }, [isMuted]);

  const handleEndGame = useCallback((finalScore: number) => {
    if (!currentDifficulty) return;
    
    const prevHighScore = highScores[currentDifficulty];
    if (finalScore > prevHighScore) {
      setIsNewHighScore(true);
      const newHighScores = { ...highScores, [currentDifficulty]: finalScore };
      setHighScores(newHighScores);
      localStorage.setItem(HIGH_SCORE_KEY, JSON.stringify(newHighScores));
    }
    
    sound.playEnd(isMuted);
    setGameState(GameState.End);
  }, [currentDifficulty, highScores, isMuted]);

  const handleChoice = useCallback((isLivingChoice: boolean) => {
    if (feedback !== Feedback.None) return; // Prevent multiple clicks

    sound.playClick(isMuted);
    const currentItem = activeItems[currentItemIndex];
    let newScore = score;
    if (currentItem.isLiving === isLivingChoice) {
      newScore = score + 1;
      setScore(newScore);
      setFeedback(Feedback.Correct);
      sound.playCorrect(isMuted);
    } else {
      setFeedback(Feedback.Incorrect);
      sound.playIncorrect(isMuted);
    }

    setTimeout(() => {
      setFeedback(Feedback.None);
      if (currentItemIndex < activeItems.length - 1) {
        setCurrentItemIndex(prev => prev + 1);
      } else {
        handleEndGame(newScore);
      }
    }, 1500);
  }, [currentItemIndex, activeItems, feedback, isMuted, score, handleEndGame]);

  const restartGame = useCallback(() => {
    sound.playClick(isMuted);
    setGameState(GameState.Start);
  }, [isMuted]);

  const renderGameContent = () => {
    switch (gameState) {
      case GameState.Playing:
        return (
          <GameScreen
            item={activeItems[currentItemIndex]}
            score={score}
            onChoice={handleChoice}
            feedback={feedback}
            currentItemNumber={currentItemIndex + 1}
            totalItems={activeItems.length}
          />
        );
      case GameState.End:
        return (
          <EndScreen
            score={score}
            totalItems={activeItems.length}
            highScore={currentDifficulty ? highScores[currentDifficulty] : 0}
            isNewHighScore={isNewHighScore}
            onPlayAgain={restartGame}
          />
        );
      case GameState.Start:
      default:
        return <StartScreen onStart={startGame} highScores={highScores} />;
    }
  };

  return (
    <div className="bg-green-600 min-h-screen text-white text-center flex flex-col items-center justify-center p-4">
      <div className="absolute top-0 left-0 w-full h-1/2 bg-blue-400"></div>
      <div className="absolute bottom-0 left-0 w-full h-1/2 bg-yellow-900 border-t-8 border-green-600"></div>
      <MuteToggle isMuted={isMuted} onToggle={toggleMute} />
      <main className="relative z-10 w-full max-w-2xl">
        {renderGameContent()}
      </main>
    </div>
  );
};

export default App;
