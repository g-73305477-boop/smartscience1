export interface Item {
  id: number;
  name: string;
  imageUrl: string;
  isLiving: boolean;
}

export enum GameState {
  Start,
  Playing,
  End,
}

export enum Feedback {
  None,
  Correct,
  Incorrect,
}

export enum Difficulty {
  Easy = 'Easy',
  Medium = 'Medium',
  Hard = 'Hard',
}

export type HighScores = {
  [key in Difficulty]: number;
};
