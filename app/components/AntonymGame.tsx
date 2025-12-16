'use client';

import { useState, useEffect, useRef } from 'react';
import styles from './AntonymGame.module.css';

interface WordPair {
  word: string;
  antonym: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

const wordPairs: WordPair[] = [
  { word: 'Abundant', antonym: 'Scarce', difficulty: 'easy' },
  { word: 'Diligent', antonym: 'Negligent', difficulty: 'easy' },
  { word: 'Elaborate', antonym: 'Simplify', difficulty: 'easy' },
  { word: 'Mitigate', antonym: 'Aggravate', difficulty: 'easy' },
  { word: 'Profound', antonym: 'Superficial', difficulty: 'easy' },
  { word: 'Authentic', antonym: 'Counterfeit', difficulty: 'easy' },
  { word: 'Harmony', antonym: 'Discord', difficulty: 'easy' },
  { word: 'Precede', antonym: 'Succeed', difficulty: 'easy' },
  { word: 'Optimistic', antonym: 'Cynical', difficulty: 'easy' },
  { word: 'Prosper', antonym: 'Decline', difficulty: 'easy' },
  { word: 'Reluctant', antonym: 'Eager', difficulty: 'medium' },
  { word: 'Ambiguous', antonym: 'Explicit', difficulty: 'medium' },
  { word: 'Concur', antonym: 'Dissent', difficulty: 'medium' },
  { word: 'Ascend', antonym: 'Descend', difficulty: 'medium' },
  { word: 'Cautious', antonym: 'Reckless', difficulty: 'medium' },
  { word: 'Generous', antonym: 'Stingy', difficulty: 'medium' },
  { word: 'Lucid', antonym: 'Obscure', difficulty: 'medium' },
  { word: 'Fragile', antonym: 'Resilient', difficulty: 'medium' },
  { word: 'Rapid', antonym: 'Sluggish', difficulty: 'medium' },
  { word: 'Triumph', antonym: 'Defeat', difficulty: 'medium' },
  { word: 'Vacant', antonym: 'Occupied', difficulty: 'hard' },
  { word: 'Futile', antonym: 'Effective', difficulty: 'hard' },
  { word: 'Incessant', antonym: 'Intermittent', difficulty: 'hard' },
  { word: 'Deteriorate', antonym: 'Improve', difficulty: 'hard' },
  { word: 'Novel', antonym: 'Conventional', difficulty: 'hard' },
  { word: 'Dense', antonym: 'Sparse', difficulty: 'hard' },
  { word: 'Benevolent', antonym: 'Malevolent', difficulty: 'hard' },
  { word: 'Inevitable', antonym: 'Avoidable', difficulty: 'hard' },
  { word: 'Credible', antonym: 'Dubious', difficulty: 'hard' },
  { word: 'Abolish', antonym: 'Establish', difficulty: 'hard' },
];

interface DraggedWord {
  word: string;
  type: 'word' | 'antonym';
  index: number;
}

interface AntonymGameProps {
  difficulty: 'easy' | 'medium' | 'hard';
  onBackToSelection?: () => void;
}

export default function AntonymGame({ difficulty, onBackToSelection }: AntonymGameProps) {
  const [gameStarted, setGameStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [score, setScore] = useState(0);
  const [words, setWords] = useState<string[]>([]);
  const [antonyms, setAntonyms] = useState<string[]>([]);
  const [matchedPairs, setMatchedPairs] = useState<Set<string>>(new Set());
  const [draggedItem, setDraggedItem] = useState<DraggedWord | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [gameOver, setGameOver] = useState(false);
  const [animations, setAnimations] = useState<Map<string, string>>(new Map());
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Filter word pairs based on selected difficulty
  const filteredWordPairs = wordPairs.filter(pair => pair.difficulty === difficulty);

  const shuffleArray = <T,>(array: T[]): T[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const startGame = () => {
    const shuffledPairs = shuffleArray(filteredWordPairs);
    const wordList = shuffledPairs.map(pair => pair.word);
    const antonymList = shuffleArray(shuffledPairs.map(pair => pair.antonym));
    
    setWords(wordList);
    setAntonyms(antonymList);
    setGameStarted(true);
    setGameOver(false);
    setScore(0);
    setTimeLeft(60);
    setMatchedPairs(new Set());
    setAnimations(new Map());
    
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setGameOver(true);
          setGameStarted(false);
          if (timerRef.current) {
            clearInterval(timerRef.current);
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Auto-start game when component mounts with difficulty
  useEffect(() => {
    if (!gameStarted && !gameOver) {
      startGame();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [difficulty]);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const handleDragStart = (word: string, type: 'word' | 'antonym', index: number) => {
    if (gameOver || !gameStarted) return;
    setDraggedItem({ word, type, index });
  };

  const handleDragOver = (e: React.DragEvent, index: number, type: 'word' | 'antonym') => {
    e.preventDefault();
    if (draggedItem && draggedItem.type !== type) {
      setDragOverIndex(index);
    }
  };

  const handleDragLeave = () => {
    setDragOverIndex(null);
  };

  const handleDrop = (e: React.DragEvent, targetWord: string, targetIndex: number, targetType: 'word' | 'antonym') => {
    e.preventDefault();
    setDragOverIndex(null);

    if (!draggedItem || draggedItem.type === targetType) return;

    const draggedWord = draggedItem.word;
    const pairKey = draggedItem.type === 'word' 
      ? `${draggedWord}-${targetWord}`
      : `${targetWord}-${draggedWord}`;

    // Check if this is a correct match
    const isMatch = filteredWordPairs.some(
      pair => 
        (pair.word === draggedWord && pair.antonym === targetWord) ||
        (pair.word === targetWord && pair.antonym === draggedWord)
    );

    // Find the correct pair
    const correctPair = filteredWordPairs.find(
      pair => 
        (pair.word === draggedWord && pair.antonym === targetWord) ||
        (pair.word === targetWord && pair.antonym === draggedWord)
    );
    
    if (isMatch && correctPair) {
      const finalKey = `${correctPair.word}-${correctPair.antonym}`;
      const reverseKey = `${correctPair.antonym}-${correctPair.word}`;
      
      // Check if already matched (check both directions)
      if (matchedPairs.has(finalKey) || matchedPairs.has(reverseKey)) {
        setDraggedItem(null);
        return;
      }
      
      setMatchedPairs(new Set([...matchedPairs, finalKey]));
      setScore(score + 1);
      
      // Add success animation
      const animationKey = `${draggedItem.index}-${targetIndex}`;
      setAnimations(new Map(animations.set(animationKey, 'success')));
      
      setTimeout(() => {
        setAnimations(prev => {
          const newMap = new Map(prev);
          newMap.delete(animationKey);
          return newMap;
        });
      }, 1000);
    } else {
      // Add shake animation for incorrect match
      const animationKey = `${draggedItem.index}-${targetIndex}`;
      setAnimations(new Map(animations.set(animationKey, 'error')));
      
      setTimeout(() => {
        setAnimations(prev => {
          const newMap = new Map(prev);
          newMap.delete(animationKey);
          return newMap;
        });
      }, 500);
    }

    setDraggedItem(null);
  };

  const isMatched = (word: string, type: 'word' | 'antonym') => {
    return Array.from(matchedPairs).some(pair => {
      const [w, a] = pair.split('-');
      return (type === 'word' && w === word) || (type === 'antonym' && a === word);
    });
  };

  const getDifficultyClass = (word: string) => {
    const pair = filteredWordPairs.find(p => p.word === word || p.antonym === word);
    if (!pair) return '';
    switch (pair.difficulty) {
      case 'easy': return styles.easy;
      case 'medium': return styles.medium;
      case 'hard': return styles.hard;
      default: return '';
    }
  };


  if (gameOver) {
    const totalPairs = filteredWordPairs.length;
    const percentage = totalPairs > 0 ? Math.round((score / totalPairs) * 100) : 0;
    return (
      <div className={styles.gameOverScreen}>
        <div className={styles.gameOverContent}>
          <h1 className={styles.gameOverTitle}>🎯 GAME OVER!</h1>
          <div className={styles.gameOverCard}>
            <div className={styles.scoreContainer}>
              <div className={styles.score}>{score}/{totalPairs}</div>
              <div className={styles.scoreLabel}>Pairs Matched</div>
            </div>
            <div className={styles.accuracy}>{percentage}% Accuracy</div>
            <div className={styles.message}>
              {percentage === 100 && (
                <p className={styles.perfectScore}>🏆 PERFECT SCORE!</p>
              )}
              {percentage >= 80 && percentage < 100 && (
                <p className={styles.excellent}>🌟 Excellent!</p>
              )}
              {percentage >= 60 && percentage < 80 && (
                <p className={styles.goodJob}>👍 Good Job!</p>
              )}
              {percentage < 60 && (
                <p className={styles.keepPracticing}>💪 Keep Practicing!</p>
              )}
            </div>
          </div>
          <div className={styles.buttonContainer}>
            <button
              onClick={startGame}
              className={styles.playAgainButton}
            >
              PLAY AGAIN 🔄
            </button>
            {onBackToSelection && (
              <button
                onClick={onBackToSelection}
                className={`${styles.playAgainButton} ${styles.changeDifficultyButton}`}
              >
                CHANGE DIFFICULTY ⚙️
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.gameContainer}>
      {/* Header */}
      <div className={styles.gameHeader}>
        <div className={styles.scoreCard}>
          <div className={styles.scoreIcon}>🎯</div>
          <div className={styles.scoreContent}>
            <div className={styles.scoreLabel}>Score</div>
            <div className={styles.scoreValue}>{score}</div>
          </div>
        </div>
        <div className={`${styles.timerCard} ${timeLeft <= 10 ? styles.timerWarning : ''}`}>
          <div className={styles.timerIcon}>⏱️</div>
          <div className={styles.timerContent}>
            <div className={styles.timerLabel}>Time</div>
            <div className={styles.timerValue}>{timeLeft}s</div>
          </div>
        </div>
      </div>

      {/* Game Area */}
      <div className={styles.gameArea}>
        {/* Words Side */}
        <div className={styles.wordsSection}>
          <h3 className={styles.sectionTitle}>WORDS</h3>
          <div className={styles.wordsList}>
            {words.map((word, index) => {
              const matched = isMatched(word, 'word');
              const animation = animations.get(`${index}-`);
              const difficultyClass = getDifficultyClass(word);
              return (
                <div
                  key={`word-${index}`}
                  draggable={!matched && gameStarted}
                  onDragStart={() => handleDragStart(word, 'word', index)}
                  onDragOver={(e) => handleDragOver(e, index, 'word')}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, word, index, 'word')}
                  className={[
                    styles.wordCard,
                    matched ? styles.matched : difficultyClass,
                    draggedItem?.word === word ? styles.dragging : '',
                    dragOverIndex === index && draggedItem?.type === 'antonym' ? styles.dragOver : '',
                    animation === 'success' ? styles.success : '',
                    animation === 'error' ? styles.error : '',
                  ].filter(Boolean).join(' ')}
                >
                  {word}
                </div>
              );
            })}
          </div>
        </div>

        {/* Antonyms Side */}
        <div className={styles.antonymsSection}>
          <h3 className={styles.sectionTitle}>ANTONYMS</h3>
          <div className={styles.antonymsList}>
            {antonyms.map((antonym, index) => {
              const matched = isMatched(antonym, 'antonym');
              const animation = animations.get(`-${index}`);
              return (
                <div
                  key={`antonym-${index}`}
                  draggable={!matched && gameStarted}
                  onDragStart={() => handleDragStart(antonym, 'antonym', index)}
                  onDragOver={(e) => handleDragOver(e, index, 'antonym')}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, antonym, index, 'antonym')}
                  className={[
                    styles.antonymCard,
                    matched ? styles.matched : '',
                    draggedItem?.word === antonym ? styles.dragging : '',
                    dragOverIndex === index && draggedItem?.type === 'word' ? styles.dragOver : '',
                    animation === 'success' ? styles.success : '',
                    animation === 'error' ? styles.error : '',
                  ].filter(Boolean).join(' ')}
                >
                  {antonym}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

