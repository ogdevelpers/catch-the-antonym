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

export default function AntonymGame() {
  const [gameStarted, setGameStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [score, setScore] = useState(0);
  const [words, setWords] = useState<string[]>([]);
  const [antonyms, setAntonyms] = useState<string[]>([]);
  const [matchedPairs, setMatchedPairs] = useState<Set<string>>(new Set());
  const [draggedItem, setDraggedItem] = useState<DraggedWord | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [gameOver, setGameOver] = useState(false);
  const [animations, setAnimations] = useState<Map<string, string>>(new Map());
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const shuffleArray = <T,>(array: T[]): T[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const startGame = () => {
    const shuffledPairs = shuffleArray(wordPairs);
    const wordList = shuffledPairs.map(pair => pair.word);
    const antonymList = shuffleArray(shuffledPairs.map(pair => pair.antonym));
    
    setWords(wordList);
    setAntonyms(antonymList);
    setGameStarted(true);
    setGameOver(false);
    setScore(0);
    setTimeLeft(30);
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
    const isMatch = wordPairs.some(
      pair => 
        (pair.word === draggedWord && pair.antonym === targetWord) ||
        (pair.word === targetWord && pair.antonym === draggedWord)
    );

    // Find the correct pair
    const correctPair = wordPairs.find(
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
    const pair = wordPairs.find(p => p.word === word || p.antonym === word);
    if (!pair) return '';
    switch (pair.difficulty) {
      case 'easy': return styles.easy;
      case 'medium': return styles.medium;
      case 'hard': return styles.hard;
      default: return '';
    }
  };

  if (!gameStarted && !gameOver) {
    return (
      <div className={styles.startScreen}>
        <div className={styles.startContent}>
          <h1 className={styles.title}>
            🔥 CATCH THE ANTONYM
          </h1>
          <h2 className={styles.subtitle}>
            ADVANCED EDITION
          </h2>
          <div className={styles.infoCard}>
            <p className={styles.challengeText}>
              ⚡ 30-Second Speed Challenge
            </p>
            <p className={styles.description}>
              Drag and pair as many correct antonyms as possible!
            </p>
            <div className={styles.difficultyList}>
              <p className={styles.difficultyItem}>
                <span className={styles.easyDot}>●</span> Easy: 10 pairs
              </p>
              <p className={styles.difficultyItem}>
                <span className={styles.mediumDot}>●</span> Medium: 10 pairs
              </p>
              <p className={styles.difficultyItem}>
                <span className={styles.hardDot}>●</span> Hard: 10 pairs
              </p>
            </div>
          </div>
          <button
            onClick={startGame}
            className={styles.startButton}
          >
            START GAME 🚀
          </button>
        </div>
      </div>
    );
  }

  if (gameOver) {
    const percentage = Math.round((score / 30) * 100);
    return (
      <div className={styles.gameOverScreen}>
        <div className={styles.gameOverContent}>
          <h1 className={styles.gameOverTitle}>🎯 GAME OVER!</h1>
          <div className={styles.gameOverCard}>
            <div className={styles.score}>{score}/30</div>
            <div className={styles.scoreLabel}>Pairs Matched</div>
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
          <button
            onClick={startGame}
            className={styles.playAgainButton}
          >
            PLAY AGAIN 🔄
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.gameContainer}>
      {/* Header */}
      <div className={styles.gameHeader}>
        <div className={styles.scoreDisplay}>
          Score: <span className={styles.scoreValue}>{score}</span>
        </div>
        <div className={`${styles.timer} ${timeLeft <= 10 ? styles.timerWarning : ''}`}>
          ⏱️ {timeLeft}s
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

