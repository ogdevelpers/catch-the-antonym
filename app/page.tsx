'use client';

import { useState } from 'react';
import DifficultySelection from './components/DifficultySelection';
import AntonymGame from './components/AntonymGame';

export default function Home() {
  const [selectedDifficulty, setSelectedDifficulty] = useState<'easy' | 'medium' | 'hard' | null>(null);

  const handleDifficultySelect = (difficulty: 'easy' | 'medium' | 'hard') => {
    setSelectedDifficulty(difficulty);
  };

  const handleBackToSelection = () => {
    setSelectedDifficulty(null);
  };

  if (selectedDifficulty) {
    return <AntonymGame difficulty={selectedDifficulty} onBackToSelection={handleBackToSelection} />;
  }

  return <DifficultySelection onSelectDifficulty={handleDifficultySelect} />;
}
