'use client';

import { useState } from 'react';
import styles from './DifficultySelection.module.css';

type Difficulty = 'easy' | 'medium' | 'hard';

interface DifficultySelectionProps {
  onSelectDifficulty: (difficulty: Difficulty) => void;
}

export default function DifficultySelection({ onSelectDifficulty }: DifficultySelectionProps) {
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | null>(null);

  const difficulties: { level: Difficulty; label: string; description: string; color: string; count: number }[] = [
    { level: 'easy', label: 'Easy', description: 'Perfect for beginners', color: '#22c55e', count: 10 },
    { level: 'medium', label: 'Medium', description: 'Challenge yourself', color: '#eab308', count: 10 },
    { level: 'hard', label: 'Hard', description: 'Expert level', color: '#ef4444', count: 10 },
  ];

  const handleSelect = (difficulty: Difficulty) => {
    setSelectedDifficulty(difficulty);
  };

  const handleStart = () => {
    if (selectedDifficulty) {
      onSelectDifficulty(selectedDifficulty);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.selectionCard}>
          <h3 className={styles.selectTitle}>Select Difficulty Level</h3>
          <p className={styles.selectDescription}>
            Choose your challenge level and match as many antonyms as possible in 30 seconds!
          </p>
          
          <div className={styles.difficultyOptions}>
            {difficulties.map((difficulty) => (
              <button
                key={difficulty.level}
                onClick={() => handleSelect(difficulty.level)}
                className={`${styles.difficultyButton} ${
                  selectedDifficulty === difficulty.level ? styles.selected : ''
                }`}
                style={{
                  '--difficulty-color': difficulty.color,
                } as React.CSSProperties}
              >
                <div className={styles.difficultyHeader}>
                  <span className={styles.difficultyDot} style={{ color: difficulty.color }}>●</span>
                  <span className={styles.difficultyLabel}>{difficulty.label}</span>
                </div>
                <p className={styles.difficultyDescription}>{difficulty.description}</p>
                <p className={styles.difficultyCount}>{difficulty.count} word pairs</p>
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleStart}
          disabled={!selectedDifficulty}
          className={`${styles.startButton} ${!selectedDifficulty ? styles.disabled : ''}`}
        >
          START GAME 🚀
        </button>
      </div>
    </div>
  );
}

