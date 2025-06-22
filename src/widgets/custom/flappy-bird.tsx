import React, { useState, useEffect, useCallback, useRef } from 'react';
import { WidgetConfig, WidgetProps } from '../../types/widget';
import { Bird } from 'lucide-react';

interface GameState {
  birdY: number;
  birdVelocity: number;
  pipes: Array<{ x: number; gapY: number; passed: boolean }>;
  score: number;
  gameStarted: boolean;
  gameOver: boolean;
}

const GRAVITY = 0.6;
const JUMP_FORCE = -12;
const PIPE_WIDTH = 60;
const PIPE_GAP = 120;
const PIPE_SPEED = 2;
const BIRD_SIZE = 30;

const FlappyBirdWidget: React.FC<WidgetProps> = ({ widget, onUpdate }) => {
  const gameRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>();
  const [gameState, setGameState] = useState<GameState>({
    birdY: 250,
    birdVelocity: 0,
    pipes: [],
    score: 0,
    gameStarted: false,
    gameOver: false
  });

  const resetGame = useCallback(() => {
    setGameState({
      birdY: 250,
      birdVelocity: 0,
      pipes: [],
      score: 0,
      gameStarted: false,
      gameOver: false
    });
  }, []);

  const jump = useCallback(() => {
    if (!gameState.gameStarted) {
      setGameState(prev => ({ ...prev, gameStarted: true, birdVelocity: JUMP_FORCE }));
    } else if (!gameState.gameOver) {
      setGameState(prev => ({ ...prev, birdVelocity: JUMP_FORCE }));
    }
  }, [gameState.gameStarted, gameState.gameOver]);

  const checkCollisions = useCallback((birdY: number, pipes: any[]) => {
    // Check ground collision
    if (birdY > 470 || birdY < 0) return true;

    // Check pipe collisions
    for (const pipe of pipes) {
      if (pipe.x < 150 + BIRD_SIZE && pipe.x + PIPE_WIDTH > 150) {
        if (birdY < pipe.gapY || birdY + BIRD_SIZE > pipe.gapY + PIPE_GAP) {
          return true;
        }
      }
    }
    return false;
  }, []);

  const gameLoop = useCallback(() => {
    setGameState(prev => {
      if (!prev.gameStarted || prev.gameOver) return prev;

      const newBirdY = prev.birdY + prev.birdVelocity;
      const newBirdVelocity = prev.birdVelocity + GRAVITY;

      // Update pipes
      let newPipes = prev.pipes.map(pipe => ({ ...pipe, x: pipe.x - PIPE_SPEED }));
      
      // Remove off-screen pipes
      newPipes = newPipes.filter(pipe => pipe.x > -PIPE_WIDTH);

      // Add new pipes
      if (newPipes.length === 0 || newPipes[newPipes.length - 1].x < 100) {
        newPipes.push({
          x: 300,
          gapY: Math.random() * 200 + 100,
          passed: false
        });
      }

      // Update score
      let newScore = prev.score;
      newPipes.forEach(pipe => {
        if (!pipe.passed && pipe.x + PIPE_WIDTH < 150) {
          pipe.passed = true;
          newScore++;
        }
      });

      // Check collisions
      const collision = checkCollisions(newBirdY, newPipes);

      return {
        ...prev,
        birdY: newBirdY,
        birdVelocity: newBirdVelocity,
        pipes: newPipes,
        score: newScore,
        gameOver: collision
      };
    });

    animationRef.current = requestAnimationFrame(gameLoop);
  }, [checkCollisions]);

  useEffect(() => {
    if (gameState.gameStarted && !gameState.gameOver) {
      animationRef.current = requestAnimationFrame(gameLoop);
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [gameState.gameStarted, gameState.gameOver, gameLoop]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'ArrowUp') {
        e.preventDefault();
        if (gameState.gameOver) {
          resetGame();
        } else {
          jump();
        }
      }
    };

    const handleClick = () => {
      if (gameState.gameOver) {
        resetGame();
      } else {
        jump();
      }
    };

    const gameElement = gameRef.current;
    if (gameElement) {
      gameElement.addEventListener('click', handleClick);
      document.addEventListener('keydown', handleKeyPress);
    }

    return () => {
      if (gameElement) {
        gameElement.removeEventListener('click', handleClick);
      }
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [jump, gameState.gameOver, resetGame]);

  return (
    <div className="h-full w-full bg-gradient-to-b from-blue-400 to-blue-600 relative overflow-hidden cursor-pointer" ref={gameRef}>
      {/* Background clouds */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-16 h-8 bg-white/20 rounded-full"></div>
        <div className="absolute top-20 right-20 w-12 h-6 bg-white/15 rounded-full"></div>
        <div className="absolute top-32 left-32 w-20 h-10 bg-white/10 rounded-full"></div>
      </div>

      {/* Ground */}
      <div className="absolute bottom-0 w-full h-8 bg-green-500"></div>

      {/* Pipes */}
      {gameState.pipes.map((pipe, index) => (
        <div key={index}>
          {/* Top pipe */}
          <div
            className="absolute bg-green-600 border-2 border-green-700"
            style={{
              left: pipe.x,
              top: 0,
              width: PIPE_WIDTH,
              height: pipe.gapY
            }}
          ></div>
          {/* Bottom pipe */}
          <div
            className="absolute bg-green-600 border-2 border-green-700"
            style={{
              left: pipe.x,
              top: pipe.gapY + PIPE_GAP,
              width: PIPE_WIDTH,
              height: 500 - pipe.gapY - PIPE_GAP - 32
            }}
          ></div>
        </div>
      ))}

      {/* Bird */}
      <div
        className="absolute w-8 h-8 bg-yellow-400 border-2 border-yellow-600 rounded-full flex items-center justify-center transition-transform duration-75"
        style={{
          left: 150,
          top: gameState.birdY,
          transform: `rotate(${Math.min(Math.max(gameState.birdVelocity * 3, -30), 60)}deg)`
        }}
      >
        <div className="w-2 h-2 bg-black rounded-full absolute top-1 right-1"></div>
        <div className="w-3 h-1 bg-orange-500 absolute -right-1 top-3 rounded-sm"></div>
      </div>

      {/* Score */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 text-white text-2xl font-bold drop-shadow-lg">
        {gameState.score}
      </div>

      {/* Game Over Screen */}
      {gameState.gameOver && (
        <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-white">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-center">
            <h2 className="text-2xl font-bold mb-2">Game Over!</h2>
            <p className="text-lg mb-4">Score: {gameState.score}</p>
            <p className="text-sm mb-4">Click or press Space to play again</p>
          </div>
        </div>
      )}

      {/* Start Screen */}
      {!gameState.gameStarted && !gameState.gameOver && (
        <div className="absolute inset-0 bg-black/30 flex flex-col items-center justify-center text-white">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-center">
            <Bird className="w-12 h-12 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Flappy Bird</h2>
            <p className="text-sm mb-4">Click or press Space to start</p>
            <p className="text-xs">Avoid the pipes and try to get a high score!</p>
          </div>
        </div>
      )}
    </div>
  );
};

export const flappyBirdWidgetConfig: WidgetConfig = {
  type: 'custom-flappy-bird',
  name: 'Flappy Bird',
  description: 'Recreates the classic Flappy Bird game with smooth gameplay and score tracking',
  defaultSize: { width: 300, height: 500 },
  minSize: { width: 300, height: 500 },
  maxSize: { width: 300, height: 500 },
  component: FlappyBirdWidget,
  icon: Bird,
  version: '1.0.0',
  features: {
    resizable: false,
    fullscreenable: false,
    hasSettings: false
  },
  categories: ['ENTERTAINMENT'],
  author: {
    name: 'Widget Developer',
    email: 'developer@widgets.com'
  }
};