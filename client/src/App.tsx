import React, { useState, useEffect, useRef } from 'react';
import { Calendar, MapPin, Clock, ArrowRight, CheckCircle, User, Mail, Hash, Phone, ChevronDown, Code2, Instagram, Facebook, Twitter, Linkedin, GraduationCap, Menu, X, AlertCircle, Home, MessageSquare, Download, Gamepad2, Zap } from 'lucide-react';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion';
import { type Variants } from 'framer-motion';
import axios from 'axios';
import * as Tone from 'tone';
import { Helmet } from 'react-helmet-async';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// In a self-contained environment, we can't use import.meta.env, so we'll hardcode the URL.
const rawUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080';
const API_URL = rawUrl.replace(/\/$/, ''); 

// --- Enhanced Animation Variants ---
const fadeIn: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }
  }
};

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 60 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }
  }
};

const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.2
    }
  }
};

const slideIn: Variants = {
  hidden: { x: -100, opacity: 0 },
  visible: { 
    x: 0, 
    opacity: 1,
    transition: { duration: 0.6, ease: "easeOut" }
  }
};

const scaleIn: Variants = {
  hidden: { scale: 0.8, opacity: 0 },
  visible: { 
    scale: 1, 
    opacity: 1,
    transition: { duration: 0.5, ease: "easeOut" }
  }
};

// --- Enhanced Reusable Components ---
interface FormInputProps {
  icon: React.ReactNode;
  placeholder: string;
  type?: string;
  id: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  pattern?: string;
  title?: string;
}

const FormInput = ({ icon, placeholder, type = 'text', id, name, value, onChange, pattern, title }: FormInputProps) => (
  <motion.div 
    className="relative group"
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    transition={{ type: "spring", stiffness: 400, damping: 25 }}
  >
    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors duration-300 group-focus-within:text-cyan-400">
      {icon}
    </div>
    <input
      type={type}
      id={id}
      name={name}
      pattern={pattern}
      title={title}
      value={value}
      onChange={onChange}
      className="w-full pl-12 pr-4 py-4 bg-gray-700/80 backdrop-blur-sm border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all duration-300 text-lg hover:bg-gray-700 focus:shadow-lg focus:shadow-cyan-400/20"
      placeholder={placeholder}
      required
    />
  </motion.div>
);

interface FAQItemProps {
  question: string;
  answer: React.ReactNode;
}

const FAQItem = ({ question, answer }: FAQItemProps) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <motion.div 
      className="border-b border-gray-700/50 group" 
      variants={fadeIn}
      whileHover={{ backgroundColor: "rgba(75, 85, 99, 0.1)" }}
      transition={{ duration: 0.3 }}
    >
      <button
        className="w-full flex justify-between items-center text-left py-6 px-2"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="font-semibold text-xl group-hover:text-cyan-400 transition-colors duration-300">{question}</span>
        <motion.div 
          animate={{ rotate: isOpen ? 180 : 0 }} 
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="text-cyan-400"
        >
          <ChevronDown className="h-7 w-7" />
        </motion.div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <motion.div 
              className="pb-6 px-2 text-gray-300 text-lg leading-relaxed"
              initial={{ y: -10 }}
              animate={{ y: 0 }}
              transition={{ delay: 0.1 }}
            >
              {answer}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const SectionSeparator = () => (
  <motion.div 
    className="relative text-center my-20" 
    aria-hidden="true"
    initial={{ opacity: 0, scale: 0.8 }}
    whileInView={{ opacity: 1, scale: 1 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6 }}
  >
    <div className="absolute inset-0 flex items-center">
      <div className="w-full border-t border-gradient-to-r from-transparent via-gray-600 to-transparent"></div>
    </div>
    <div className="relative inline-block px-6 bg-gray-900">
      <motion.div
        whileHover={{ rotate: 360, scale: 1.2 }}
        transition={{ duration: 0.6 }}
      >
        <Code2 className="h-12 w-12 text-cyan-400/70" />
      </motion.div>
    </div>
  </motion.div>
);

const Countdown = ({ isRegistrationOpen }: { isRegistrationOpen: boolean | null }) => {
    const calculateTimeLeft = () => {
        const difference = +new Date("2025-09-25T23:59:59") - +new Date();
        let timeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0 };

        if (difference > 0) {
            timeLeft = {
                days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                minutes: Math.floor((difference / 1000 / 60) % 60),
                seconds: Math.floor((difference / 1000) % 60)
            };
        }
        return timeLeft;
    };

    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

    useEffect(() => {
        const timer = setTimeout(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);
        return () => clearTimeout(timer);
    });
    
    if (isRegistrationOpen === false || Object.values(timeLeft).every(v => v === 0)) {
        return (
            <motion.div 
              className="max-w-4xl mx-auto mt-12 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
                 <h3 className="text-2xl md:text-3xl font-bold text-red-400 mb-2">Pendaftaran Telah Ditutup</h3>
                 <p className="text-lg md:text-xl text-gray-300">Sampai jumpa di acara!</p>
            </motion.div>
        );
    }

    if (isRegistrationOpen === null) {
        return (
          <div className="max-w-4xl mx-auto mt-12 text-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="inline-block"
            >
              <Code2 className="h-8 w-8 text-cyan-400" />
            </motion.div>
            <p className="mt-2 text-gray-400">Memuat status pendaftaran...</p>
          </div>
        );
    }

    const timerComponents = Object.entries(timeLeft).map(([interval, value], index) => {
        const intervalIndonesian: { [key: string]: string } = {
            days: 'Hari',
            hours: 'Jam',
            minutes: 'Menit',
            seconds: 'Detik'
        };

        return (
            <motion.div 
              key={interval} 
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
                <motion.div 
                  className="text-3xl md:text-5xl lg:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-300 to-blue-400"
                  key={value}
                  initial={{ scale: 1.2 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                    {String(value).padStart(2, '0')}
                </motion.div>
                <div className="text-xs md:text-sm lg:text-lg uppercase text-gray-400 tracking-wider">{intervalIndonesian[interval] || interval}</div>
            </motion.div>
        );
    });

    return (
        <motion.div 
          className="max-w-4xl mx-auto mt-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
            <h3 className="text-xl md:text-2xl text-center font-bold mb-6 text-gray-200">Pendaftaran Ditutup Dalam</h3>
            <motion.div 
              className="flex justify-center gap-3 md:gap-6 lg:gap-8 p-4 md:p-6 bg-gray-800/60 backdrop-blur-sm rounded-2xl border border-gray-700/50"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
                {timerComponents.length ? timerComponents : <span>Pendaftaran telah ditutup!</span>}
            </motion.div>
            <motion.p 
              className="text-center text-yellow-400 mt-4 text-sm md:text-base"
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              *Kursi terbatas dan pendaftaran akan ditutup jika kuota sudah terpenuhi.
            </motion.p>
        </motion.div>
    );
};

const GitMazeGame = () => {
    const initialMaze = [
        [2, 0, 1, 1, 1],
        [1, 0, 4, 1, 1],
        [1, 0, 4, 0, 3],
        [1, 0, 0, 0, 1],
        [1, 1, 1, 1, 1],
    ];

    const [maze, setMaze] = useState(initialMaze);
    const [playerPosition, setPlayerPosition] = useState([0, 1]);
    const [message, setMessage] = useState('Selamat datang! Ikuti panduan untuk menyimulasikan alur kerja Git pertamamu.');
    const [gameState, setGameState] = useState('start');
    const [nextCommand, setNextCommand] = useState('git checkout -b feature');

    const resetGame = () => {
        setMaze(initialMaze);
        setPlayerPosition([0, 1]);
        setMessage('Selamat datang! Ikuti panduan untuk menyimulasikan alur kerja Git pertamamu.');
        setGameState('start');
        setNextCommand('git checkout -b feature');
    };

    const handleCommand = (command: string) => {
        if (command !== nextCommand) return;

        switch (gameState) {
            case 'start':
                const newMazeBranch = maze.map(row => row.map(cell => cell === 4 ? 5 : cell));
                setMaze(newMazeBranch);
                setPlayerPosition([1, 2]);
                setGameState('branched');
                setMessage('Bagus! Anda telah membuat branch "feature". Ini memungkinkan Anda mengerjakan ide baru tanpa memengaruhi kode utama.');
                setNextCommand('git commit');
                break;
            case 'branched':
                setPlayerPosition([2, 2]);
                setGameState('committed');
                setMessage('Mantap! Anda telah "commit" pekerjaan Anda, menyimpan snapshot perubahan di branch feature.');
                setNextCommand('git checkout main');
                break;
            case 'committed':
                setPlayerPosition([3, 1]);
                setGameState('on_main');
                setMessage('Anda kembali ke branch utama. Sekarang saatnya menggabungkan fitur yang telah selesai.');
                setNextCommand('git merge feature');
                break;
            case 'on_main':
                const newMazeMerge = [...maze];
                newMazeMerge[1][3] = 0; 
                setMaze(newMazeMerge);
                setGameState('merged');
                setMessage('Luar biasa! Fitur telah digabungkan. Langkah terakhir adalah "push" ke server.');
                setNextCommand('git push');
                break;
            case 'merged':
                setPlayerPosition([2, 4]);
                setGameState('win');
                setMessage('🎉 Berhasil! Kode Anda sudah live. Anda telah menyelesaikan siklus pengembangan penuh!');
                setNextCommand('');
                break;
        }
    };
    
    const getCellClass = (cell: number, row: number, col: number) => {
        const isPlayerHere = playerPosition[0] === row && playerPosition[1] === col;
        if(isPlayerHere) return 'bg-cyan-400 ring-2 ring-white shadow-lg shadow-cyan-400/50';

        switch(cell) {
            case 1: return 'bg-gray-700';
            case 2: return 'bg-blue-500 shadow-inner';
            case 3: return 'bg-green-500 shadow-inner';
            case 4: return 'bg-gray-900';
            case 5: return 'bg-purple-600 shadow-inner';
            default: return 'bg-gray-800';
        }
    };

    const CommandButton = ({ command }: { command: string }) => {
        const isNext = command === nextCommand;
        return (
            <motion.button
                onClick={() => handleCommand(command)}
                className={`p-3 rounded-xl text-center transition-all duration-300 font-mono text-sm md:text-base ${
                    isNext 
                        ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-400/30 ring-2 ring-cyan-400' 
                        : 'bg-gray-700 text-gray-400 opacity-50 cursor-not-allowed'
                }`}
                disabled={!isNext && gameState !== 'win'}
                whileHover={isNext ? { scale: 1.05, y: -2 } : {}}
                whileTap={isNext ? { scale: 0.95 } : {}}
                animate={isNext ? { 
                    boxShadow: [
                        "0 0 20px rgba(34, 211, 238, 0.3)",
                        "0 0 30px rgba(34, 211, 238, 0.5)",
                        "0 0 20px rgba(34, 211, 238, 0.3)"
                    ]
                } : {}}
                transition={{ duration: 1.5, repeat: Infinity }}
            >
                {command.replace('git ', '')}
            </motion.button>
        );
    };

    return (
        <motion.div 
          className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm p-6 md:p-8 rounded-2xl border border-gray-700/50"
          variants={scaleIn}
        >
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl md:text-3xl font-bold flex items-center gap-3">
                  <Gamepad2 className="h-8 w-8 text-cyan-400" />
                  Simulator Alur Kerja Git
                </h2>
                <motion.button 
                  onClick={resetGame} 
                  className="text-sm text-cyan-400 hover:text-cyan-300 hover:underline transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  Ulangi
                </motion.button>
            </div>
            <div className="grid lg:grid-cols-2 gap-8 items-center">
                <motion.div 
                  className="grid grid-cols-5 gap-1 border-2 border-gray-600 p-3 rounded-xl bg-black/50 backdrop-blur-sm"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                >
                    {maze.map((row, rowIndex) => 
                        row.map((cell, colIndex) => (
                            <motion.div 
                              key={`${rowIndex}-${colIndex}`} 
                              className={`w-full aspect-square rounded-sm transition-all duration-300 ${getCellClass(cell, rowIndex, colIndex)}`}
                              whileHover={{ scale: 1.1 }}
                              layout
                            />
                        ))
                    )}
                </motion.div>
                <div className="space-y-6">
                    <motion.div 
                      className="min-h-[80px] p-4 bg-gray-900/50 rounded-xl border-l-4 border-cyan-400"
                      key={message}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5 }}
                    >
                      <p className="text-gray-300 leading-relaxed">{message}</p>
                    </motion.div>
                    <div className="grid grid-cols-2 gap-3 font-mono text-sm">
                        <CommandButton command="git checkout -b feature" />
                        <CommandButton command="git commit" />
                        <CommandButton command="git checkout main" />
                        <CommandButton command="git merge feature" />
                        <div className="col-span-2">
                           <CommandButton command="git push" />
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

const DinoGame = () => {
    const gameAreaRef = useRef<HTMLDivElement>(null);
    const playerElementRef = useRef<HTMLDivElement>(null);
    const obstaclesContainerRef = useRef<HTMLDivElement>(null);
    const requestRef = useRef<number>();
    
    // Game state refs - these don't trigger re-renders
    const playerStateRef = useRef({ y: 0, vy: 0 });
    const obstaclesRef = useRef<{ x: number, width: number, height: number, type: 'ground' | 'air', y?: number, element: HTMLDivElement }[]>([]);
    const scoreRef = useRef(0);
    const gameSpeedRef = useRef(5);
    const timeSinceLastObstacleRef = useRef(0);
    const lastScoreSoundRef = useRef(0);

    // React state for UI that changes less frequently
    const [sceneryLevel, setSceneryLevel] = useState(0);
    const [displayScore, setDisplayScore] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    const [isRunning, setIsRunning] = useState(false);
    const [obstacleScale, setObstacleScale] = useState(1);

    const sounds = useRef<{
        jump: Tone.Synth | null,
        score: Tone.Synth | null,
        gameOver: Tone.Synth | null
    }>({ jump: null, score: null, gameOver: null });

    useEffect(() => {
        sounds.current.jump = new Tone.Synth({ oscillator: { type: 'triangle' }, envelope: { attack: 0.005, decay: 0.1, sustain: 0.3, release: 0.1 } }).toDestination();
        sounds.current.score = new Tone.Synth({ oscillator: { type: 'sine' }, envelope: { attack: 0.005, decay: 0.1, sustain: 0.3, release: 0.1 } }).toDestination();
        sounds.current.gameOver = new Tone.Synth({ oscillator: { type: 'sawtooth' }, envelope: { attack: 0.01, decay: 0.4, sustain: 0.1, release: 0.2 } }).toDestination();
    }, []);

    useEffect(() => {
        if (window.innerWidth < 500) {
            setObstacleScale(0.6);
        }
    }, []);

    const [gameSettings, setGameSettings] = useState({
        gravity: 0.8,
        jumpStrength: -19,
        playerX: 50,
        playerSize: 40,
        groundY: 280,
        initialSpeed: 4,
        speedIncrease: 0.002,
        obstacleInterval: 1800,
    });

    useEffect(() => {
        const width = window.innerWidth;
        if (width < 500) {
            setGameSettings(prev => ({
                ...prev,
                jumpStrength: -14, 
                playerX: 30,      
                playerSize: 25,    
                groundY: 250,      
                initialSpeed: 3,  
                obstacleInterval: 1500, 
            }));
        }
    }, []);

    const startGame = async () => {
        await Tone.start(); 
        await Tone.context.resume();
        playerStateRef.current = { y: gameSettings.groundY - gameSettings.playerSize, vy: 0 };
        
        // Clear old obstacles from DOM and refs
        obstaclesRef.current.forEach(obs => obs.element.remove());
        obstaclesRef.current = [];

        scoreRef.current = 0;
        gameSpeedRef.current = gameSettings.initialSpeed;
        timeSinceLastObstacleRef.current = 0;
        lastScoreSoundRef.current = 0;

        setGameOver(false);
        setIsRunning(true);
        setSceneryLevel(0);
        setDisplayScore(0);
    };

    const lastJumpTimeRef = useRef(0); 

    const jump = () => {
        const now = Tone.now();
        if (now - lastJumpTimeRef.current < 0.05) return;
        lastJumpTimeRef.current = now;

        if (isRunning && !gameOver && playerStateRef.current.y >= gameSettings.groundY - gameSettings.playerSize - 5) {
            playerStateRef.current.vy = gameSettings.jumpStrength;
            Tone.Draw.schedule(() => {
                sounds.current.jump?.triggerAttackRelease("C5", "8n");
            }, "+0.01");
        }
    };

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.code === 'Space') {
                e.preventDefault();
                jump();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isRunning, gameOver]);

    const gameLoop = () => {
        if (!isRunning || !gameAreaRef.current) return;

        // --- Physics and State Updates (in memory) ---
        playerStateRef.current.vy += gameSettings.gravity;
        playerStateRef.current.y += playerStateRef.current.vy;

        if (playerStateRef.current.y >= gameSettings.groundY - gameSettings.playerSize) {
            playerStateRef.current.y = gameSettings.groundY - gameSettings.playerSize;
            playerStateRef.current.vy = 0;
        }
        
        gameSpeedRef.current += gameSettings.speedIncrease;
        scoreRef.current += 1;
        
        // --- Direct DOM Manipulation for Performance ---
        if (playerElementRef.current) {
            playerElementRef.current.style.transform = `translateY(${playerStateRef.current.y}px)`;
        }

        // --- Less Frequent React State Updates ---
        const currentScore = Math.floor(scoreRef.current / 10);
        if (displayScore !== currentScore) {
            setDisplayScore(currentScore);
        }

        if (currentScore > 0 && currentScore % 100 === 0 && currentScore !== lastScoreSoundRef.current) {
            Tone.Draw.schedule(() => {
                sounds.current.score?.triggerAttackRelease("E5", "16n");
            }, "+0.01");
            lastScoreSoundRef.current = currentScore;
        }
        
        const newSceneryLevel = Math.floor(currentScore / 500);
        if (newSceneryLevel > sceneryLevel) {
            setSceneryLevel(newSceneryLevel);
        }

        // --- Obstacle Management ---
        timeSinceLastObstacleRef.current += 16;
        if (timeSinceLastObstacleRef.current > gameSettings.obstacleInterval) {
            timeSinceLastObstacleRef.current = 0;
            const gameWidth = gameAreaRef.current.clientWidth;
            const isBird = Math.random() > 0.65;
            
            const element = document.createElement('div');
            element.className = 'absolute shadow-lg';

            let newObstacle: { x: number, width: number, height: number, type: 'ground' | 'air', y?: number, element: HTMLDivElement };

            if (isBird) {
                const width = 45 * obstacleScale;
                const height = 30 * obstacleScale;
                const y = gameSettings.groundY - 140 * obstacleScale + Math.random() * 80 * obstacleScale;
                element.className += ' bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full';
                element.style.top = `${y}px`;
                element.style.width = `${width}px`;
                element.style.height = `${height}px`;
                newObstacle = { x: gameWidth, width, height, type: 'air', y, element };
            } else {
                const width = (20 + Math.random() * 30) * obstacleScale;
                const height = (30 + Math.random() * 60) * obstacleScale;
                const y = gameSettings.groundY - height;
                element.className += ' bg-gradient-to-t from-red-600 to-red-400 rounded-t-lg';
                element.style.top = `${y}px`;
                element.style.width = `${width}px`;
                element.style.height = `${height}px`;
                newObstacle = { x: gameWidth, width, height, type: 'ground', element };
            }
            
            obstaclesRef.current.push(newObstacle);
            obstaclesContainerRef.current?.appendChild(element);
        }

        // --- Collision Detection & Obstacle Movement ---
        let isGameOver = false;
        const playerRect = {
            x: gameSettings.playerX + 5,
            y: playerStateRef.current.y + 5,
            width: gameSettings.playerSize - 10,
            height: gameSettings.playerSize - 10,
        };

        const remainingObstacles = [];
        for (const obs of obstaclesRef.current) {
            obs.x -= gameSpeedRef.current;
            if (obs.x + obs.width > 0) {
                remainingObstacles.push(obs);
                
                // Direct DOM manipulation for movement
                obs.element.style.transform = `translateX(${obs.x}px)`;
                
                const obsY = obs.type === 'ground' ? gameSettings.groundY - obs.height : obs.y!;
                const obsRect = { x: obs.x, y: obsY, width: obs.width, height: obs.height };
                if (
                    playerRect.x < obsRect.x + obsRect.width &&
                    playerRect.x + playerRect.width > obsRect.x &&
                    playerRect.y < obsRect.y + obsRect.height &&
                    playerRect.y + playerRect.height > obsRect.y
                ) {
                    isGameOver = true;
                }
            } else {
                // Remove element from DOM if off-screen
                obs.element.remove();
            }
        }
        obstaclesRef.current = remainingObstacles;

        if (isGameOver) {
            Tone.Draw.schedule(() => {
                sounds.current.gameOver?.triggerAttackRelease("C3", "0.5");
            }, "+0.01");
            setIsRunning(false);
            setGameOver(true);
            return;
        }

        requestRef.current = requestAnimationFrame(gameLoop);
    };

    useEffect(() => {
        if (isRunning) {
            requestRef.current = requestAnimationFrame(gameLoop);
        }
        return () => {
            if (requestRef.current) {
                cancelAnimationFrame(requestRef.current);
            }
        };
    }, [isRunning]);

    const sceneryClasses = ['bg-gray-900', 'bg-indigo-900', 'bg-red-900', 'bg-emerald-900'];
    const sceneryClass = sceneryClasses[sceneryLevel % sceneryClasses.length];

    return (
        <motion.div 
          className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm p-6 md:p-8 rounded-2xl text-center border border-gray-700/50"
          variants={scaleIn}
        >
            <h2 className="text-2xl md:text-3xl font-bold mb-6 flex items-center justify-center gap-3">
              <Zap className="h-8 w-8 text-yellow-400" />
              Tantangan Lompat Kubus
            </h2>
            <div
                ref={gameAreaRef}
                className={`relative w-full h-64 md:h-80 rounded-xl overflow-hidden cursor-pointer border-2 border-gray-700 transition-all duration-1000 ${sceneryClass} shadow-inner`}
                onClick={jump}
            >
                {/* UI elements that rely on React state */}
                <AnimatePresence>
                    {!isRunning && !gameOver && (
                        <motion.div 
                          className="absolute inset-0 flex flex-col items-center justify-center z-10 bg-black/60 backdrop-blur-sm rounded-xl"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.5 }}
                        >
                            <motion.p 
                              className="text-lg md:text-xl mb-6 text-center px-4"
                              animate={{ y: [0, -10, 0] }}
                              transition={{ duration: 2, repeat: Infinity }}
                            >
                              Tekan Spasi atau Klik untuk Melompat!
                            </motion.p>
                            <motion.button 
                              onClick={startGame} 
                              className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold py-3 px-8 rounded-xl text-xl shadow-lg shadow-cyan-400/30"
                              whileHover={{ scale: 1.05, y: -2 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              Mulai Permainan
                            </motion.button>
                        </motion.div>
                    )}
                    {gameOver && (
                         <motion.div 
                           className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm z-10 rounded-xl"
                           initial={{ opacity: 0, scale: 0.8 }}
                           animate={{ opacity: 1, scale: 1 }}
                           exit={{ opacity: 0 }}
                           transition={{ duration: 0.5 }}
                         >
                            <p className="text-3xl md:text-4xl font-bold text-red-400 mb-2">Permainan Selesai!</p>
                            <p className="text-xl md:text-2xl text-white mt-2 mb-6">Skor Akhir: {displayScore}</p>
                            <motion.button 
                              onClick={startGame} 
                              className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold py-3 px-8 rounded-xl text-xl shadow-lg shadow-cyan-400/30"
                              whileHover={{ scale: 1.05, y: -2 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              Main Lagi
                            </motion.button>
                        </motion.div>
                    )}
                </AnimatePresence>
                
                {/* Static and Game elements */}
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gray-400" style={{top: gameSettings.groundY}}/>
                
                {isRunning && (
                    <p className="absolute top-4 right-4 text-xl md:text-2xl font-bold text-white z-10 bg-black/50 px-3 py-1 rounded-lg backdrop-blur-sm">
                      Skor: {displayScore}
                    </p>
                )}
                <motion.div
                    ref={playerElementRef}
                    className="absolute bg-gradient-to-r from-cyan-400 to-blue-500 rounded-lg shadow-lg shadow-cyan-400/50"
                    style={{
                        left: gameSettings.playerX,
                        top: 0, // Initial top is 0, transform will handle positioning
                        width: gameSettings.playerSize,
                        height: gameSettings.playerSize,
                        // Using will-change to hint browser about upcoming transform changes
                        willChange: 'transform',
                    }}
                    animate={{ 
                        boxShadow: [
                            "0 0 20px rgba(34, 211, 238, 0.5)",
                            "0 0 30px rgba(34, 211, 238, 0.8)",
                            "0 0 20px rgba(34, 211, 238, 0.5)"
                        ]
                    }}
                    transition={{ duration: 1, repeat: Infinity }}
                />
                {/* Obstacles are now added programmatically to this container */}
                <div ref={obstaclesContainerRef} className="absolute top-0 left-0 w-full h-full" style={{willChange: 'transform'}} />
            </div>
        </motion.div>
    );
};

// --- Page Components ---
const NotFoundPage = ({ onGoHome }: { onGoHome: () => void }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white flex flex-col items-center justify-center text-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-md"
      >
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <AlertCircle className="w-24 h-24 text-yellow-400 mb-6 mx-auto" />
        </motion.div>
        <h1 className="text-6xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-red-400 to-yellow-400">404</h1>
        <h2 className="text-3xl font-semibold mb-6">Halaman Tidak Ditemukan</h2>
        <p className="text-gray-400 mb-8 leading-relaxed">
          Maaf, halaman yang Anda cari tidak ada atau telah dipindahkan.
        </p>
        <motion.button
          onClick={onGoHome}
          className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-bold py-3 px-8 rounded-xl transition duration-300 transform flex items-center gap-2 mx-auto shadow-lg shadow-cyan-400/30"
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
        >
          <Home size={20} />
          Kembali ke Beranda
        </motion.button>
      </motion.div>
    </div>
  );
};

const RegistrationPage = ({ onRegister }: { onRegister: (name: string) => void }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    nim: '',
    binusianEmail: '',
    privateEmail: '',
    major: '',
    phoneNumber: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isRegistrationOpen, setIsRegistrationOpen] = useState<boolean | null>(null);

  useEffect(() => {
    const fetchStatus = async () => {
        try {
            const response = await axios.get(`${API_URL}/api/settings/status`);
            setIsRegistrationOpen(response.data.isRegistrationOpen);
        } catch (error) {
            console.error("Gagal memuat status pendaftaran", error);
            setIsRegistrationOpen(false);
        }
    };
    fetchStatus();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.post(`${API_URL}/api/register`, formData);
      if (response.status === 201) {
        onRegister(response.data.data.fullName);
      }
    } catch (err: any) {
      if (axios.isAxiosError(err) && err.response) {
        setError(err.response.data.message || 'Terjadi sebuah kesalahan.');
      } else {
        setError('Tidak dapat terhubung ke server. Mohon coba lagi nanti.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const [isNavOpen, setIsNavOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 50);
  });

  const instructors = [
    { name: 'Sheren Aura Vi', title: 'Lead Instructor', avatar: 'lead.jpg' },
    { name: 'Arya Tegar Anubhawa', title: 'Workshop Assistant', avatar: 'asisten1.jpg' },
    { name: 'Ayatullah Bintang Qurne', title: 'Workshop Assistant', avatar: 'asisten2.jpg' },
    { name: 'Gregorio Keefe Jason S.', title: 'Workshop Assistant', avatar: 'asisten3.jpg' },
    { name: 'Raden Alexander Christianace D. W. P.', title: 'Workshop Assistant', avatar: 'asisten4.jpg' },
    { name: 'Nathasa Bintang Kayesa', title: 'Workshop Assistant', avatar: 'asisten5.jpg' },
    { name: 'Nadiva Agista', title: 'Workshop Assistant', avatar: 'asisten6.jpg' },
    { name: 'Ivanna Putri Paramitha', title: 'Workshop Assistant', avatar: 'asisten7.jpg' },
  ];
  
  const faqs = [
      { question: "Apakah saya perlu pengalaman sebelumnya?", answer: "Tidak perlu! Workshop ini dirancang untuk pemula yang belum pernah menggunakan Git atau GitHub sama sekali." },
      { question: "Apa yang harus saya bawa?", answer: "Anda wajib membawa laptop pribadi dengan charger. Pastikan juga Git sudah ter-install di laptop Anda sebelum acara dimulai." },
      { question: "Bagaimana cara install Git dan membuat akun GitHub?", answer: (
        <span>
          Anda bisa mengikuti panduan resmi. Untuk menginstall Git, kunjungi{" "}
          <a href="https://git-scm.com/downloads" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline">
            git-scm.com/downloads
          </a>
          . Untuk membuat akun GitHub, kunjungi{" "}
          <a href="https://github.com/signup" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline">
            github.com/signup
          </a>
          .
        </span>
      )},
      { question: "Apakah makan siang disediakan?", answer: "Ya, kami menyediakan makan siang untuk seluruh peserta." }
  ];

  // Enhanced mobile-friendly navigation
  const navLinks = [
    { name: "Tentang", href: "#about" },
    { name: "Instruktur", href: "#instructors" },
    { name: "Materi", href: "#learn" },
    { name: "Panduan", href: "#guidebook"},
    { name: "FAQ", href: "#faq" },
    { name: "Games", href: "#game" }
  ];

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const targetId = href.replace('#', '');
    const elem = document.getElementById(targetId);
    elem?.scrollIntoView({
      behavior: 'smooth',
    });
    setIsNavOpen(false);
  };

  useEffect(() => {
    const sections = navLinks.map(link => document.getElementById(link.href.replace('#', '')));

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        root: null,
        rootMargin: '0px',
        threshold: 0.6,
      }
    );

    sections.forEach(section => {
      if (section) observer.observe(section);
    });

    return () => {
      sections.forEach(section => {
        if (section) observer.unobserve(section);
      });
    };
  }, []);

  return (
    <>
      <Helmet>
        <title>GitReady with LnT - Workshop Git & GitHub BNCC</title>
        <meta 
          name="description" 
          content="Daftar untuk GitReady with LnT, sebuah workshop eksklusif dari BNCC untuk mempelajari dasar-dasar Git dan GitHub. Terbuka untuk semua member BNCC." 
        />
        <script type="application/ld+json">
          {`
            {
              "@context": "https://schema.org",
              "@type": "Event",
              "name": "GitReady with LnT",
              "startDate": "2025-09-27T09:00:00+07:00",
              "endDate": "2025-09-27T15:00:00+07:00",
              "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
              "eventStatus": "https://schema.org/EventScheduled",
              "location": {
                "@type": "Place",
                "name": "Auditorium, Kampus Binus@Malang",
                "address": {
                  "@type": "PostalAddress",
                  "streetAddress": "Jl. Araya Mansion No. 8-22",
                  "addressLocality": "Malang",
                  "postalCode": "65154",
                  "addressRegion": "Jawa Timur",
                  "addressCountry": "ID"
                }
              },
              "image": [
                "https://miro.medium.com/v2/resize:fit:1400/1*KSH-ELYLBI0dzE1Wt7mRKg.png"
               ],
              "description": "Pelatihan dasar Git & GitHub untuk mempersiapkan member BNCC berkolaborasi dalam proyek pengembangan software.",
              "organizer": {
                "@type": "Organization",
                "name": "BNCC (Bina Nusantara Computer Club)",
                "url": "https://bncc.net/"
              }
            }
          `}
        </script>
      </Helmet>
      
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white font-sans">
        {/* Enhanced Header with better mobile navigation */}
        <motion.header 
          className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
            scrolled ? 'bg-gray-900/95 backdrop-blur-md shadow-xl shadow-black/20 border-b border-gray-700/50' : 'bg-transparent'
          }`}
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <nav className="container mx-auto px-4 lg:px-6 py-3 relative">
            <div className="flex justify-between items-center">
              {/* Logo Section - Enhanced for mobile */}
              <motion.div 
                className="flex items-center space-x-2 md:space-x-4"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
              >
                <img 
                  src="https://miro.medium.com/v2/resize:fit:1400/1*KSH-ELYLBI0dzE1Wt7mRKg.png" 
                  alt="Logo BNCC Learning & Training" 
                  className="h-8 md:h-12 object-contain"
                />
                <img 
                  src="5.png"
                  alt="GitReady Logo"
                  className="h-8 md:h-12 object-contain"
                />
              </motion.div>

              {/* Desktop Navigation - Simplified */}
              <div className="hidden lg:flex items-center space-x-6">
                {navLinks.map((link, index) => {
                  const isActive = activeSection === link.href.replace('#', '');
                  return (
                    <motion.a
                      key={link.href}
                      href={link.href}
                      onClick={(e) => handleNavClick(e, link.href)}
                      className={`text-sm xl:text-base text-gray-300 hover:text-cyan-400 transition-all duration-300 cursor-pointer relative ${
                        isActive ? 'text-cyan-400 font-semibold' : ''
                      }`}
                      whileHover={{ y: -2 }}
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      {link.name}
                      {isActive && (
                        <motion.div
                          className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-cyan-400 to-blue-500"
                          layoutId="activeTab"
                          transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        />
                      )}
                    </motion.a>
                  );
                })}
              </div>

              {/* CTA Button - Desktop */}
              <motion.a 
                href="#form-pendaftaran" 
                onClick={(e) => handleNavClick(e, '#form-pendaftaran')} 
                className="hidden lg:inline-block bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-bold py-2 px-6 rounded-xl transition duration-300 cursor-pointer shadow-lg shadow-cyan-400/30"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                Daftar
              </motion.a>

              {/* Mobile Menu Button */}
              <motion.button 
                onClick={() => setIsNavOpen(!isNavOpen)}
                className="lg:hidden p-2 rounded-lg bg-gray-800/50 backdrop-blur-sm"
                whileTap={{ scale: 0.95 }}
              >
                <AnimatePresence mode="wait">
                  {isNavOpen ? (
                    <motion.div
                      key="close"
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <X size={24}/>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="menu"
                      initial={{ rotate: 90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Menu size={24}/>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            </div>

            {/* Mobile Navigation Menu */}
            <AnimatePresence>
              {isNavOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="absolute top-full left-0 right-0 z-40 lg:hidden bg-gray-900/95 backdrop-blur-md shadow-lg"
                >
                  <div className="flex flex-col space-y-1 p-4 border-t border-gray-700/50">
                    {navLinks.map((link, index) => (
                      <motion.a 
                        key={link.href} 
                        href={link.href} 
                        onClick={(e) => handleNavClick(e, link.href)} 
                        className="text-gray-300 hover:text-cyan-400 transition-colors text-lg cursor-pointer py-3 px-4 rounded-lg hover:bg-gray-800/50"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {link.name}
                      </motion.a>
                    ))}
                    <motion.a 
                      href="#form-pendaftaran" 
                      onClick={(e) => handleNavClick(e, '#form-pendaftaran')} 
                      className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-bold py-3 px-6 rounded-xl transition duration-300 text-center cursor-pointer shadow-lg shadow-cyan-400/30 mt-4"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Daftar Sekarang
                    </motion.a>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </nav>
        </motion.header>

       <main className="pt-24">
          {/* Enhanced Hero Section */}
          <section className="relative text-center min-h-[calc(100vh-6rem)] flex flex-col items-center justify-center px-4 lg:px-6">
           <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-gray-900/95 via-gray-900/70 to-gray-900 z-0"></div>

            <motion.div 
              className="relative z-10 max-w-6xl mx-auto"
              initial="hidden" 
              animate="visible" 
              variants={staggerContainer}
            >
              <motion.h1 
                variants={fadeInUp} 
                className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6 leading-tight"
              >
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600">
                  GitReady
                </span>{" "}
                <span className="text-white">with LnT</span>
              </motion.h1>
              
              <motion.p 
                variants={fadeInUp} 
                className="max-w-4xl mx-auto text-lg md:text-xl lg:text-2xl text-gray-300 mb-12 leading-relaxed"
              >
                Pelatihan dasar Git & GitHub untuk mempersiapkan Anda berkolaborasi dalam proyek pengembangan software layaknya seorang profesional.
              </motion.p>
              
              <motion.div variants={fadeInUp}>
                <Countdown isRegistrationOpen={isRegistrationOpen} />
              </motion.div>
            </motion.div>

            
          </section>

          <div className="max-w-6xl mx-auto">
            {/* About Section */}
            <motion.section 
              id="about" 
              className="py-20"
              initial="hidden" 
              whileInView="visible" 
              viewport={{ once: true, amount: 0.3 }} 
              variants={slideIn}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-8 border-l-4 border-cyan-400 pl-6">Tentang Workshop</h2>
              <div className="bg-gradient-to-r from-gray-800/50 to-gray-700/50 backdrop-blur-sm p-8 rounded-2xl border border-gray-700/50">
                <p className="text-lg md:text-xl text-gray-300 leading-relaxed">
                  GitReady with LnT adalah program kerja eksklusif yang dirancang untuk memberikan kesempatan kepada member BNCC dalam mempelajari dan menguasai Git & GitHub. Di era digital ini, version control adalah skill fundamental yang wajib dimiliki setiap developer. Melalui workshop ini, peserta akan dibimbing untuk memahami konsep dasar Git dan mempraktikkan cara berkolaborasi secara efisien menggunakan GitHub, platform yang menjadi standar industri.
                </p>
              </div>
            </motion.section>
            
            <SectionSeparator />

           {/* Instructors Section */}
            <motion.section 
              id="instructors" 
              className="py-20"
              initial="hidden" 
              whileInView="visible" 
              viewport={{ once: true, amount: 0.2 }} 
              variants={staggerContainer}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-12 border-l-4 border-cyan-400 pl-6">Temui Instruktur Kami</h2>
              
              {/* Lead Instructor - Featured */}
              <div className="flex justify-center mb-16">
                {instructors.length > 0 && (
                  <motion.div 
                    className="text-center group" 
                    variants={scaleIn}
                    whileHover={{ y: -10 }}
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  >
                    <div className="relative mb-6">
                      <motion.img 
                        src={instructors[0].avatar} 
                        alt={instructors[0].name} 
                        className="w-48 h-48 rounded-full mx-auto border-4 border-gray-700 group-hover:border-cyan-400 transition-all duration-300 object-cover shadow-xl" 
                        whileHover={{ scale: 1.1 }}
                        transition={{ type: "spring", stiffness: 400, damping: 25 }}
                      />
                      <motion.div
                        className="absolute inset-0 rounded-full bg-gradient-to-t from-cyan-400/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        whileHover={{ scale: 1.1 }}
                      />
                    </div>
                    <h3 className="font-bold text-xl lg:text-2xl mb-2">{instructors[0].name}</h3>
                    <p className="text-cyan-400 text-lg">{instructors[0].title}</p>
                  </motion.div>
                )}
              </div>

              {/* Workshop Assistants - In a Grid */}
              {instructors.length > 1 && (
                <>
                  <h3 className="text-2xl md:text-3xl font-bold text-center mb-12">Dibantu oleh Asisten Workshop</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
                    {instructors.slice(1).map((instructor) => (
                      <motion.div 
                        key={instructor.name || 'placeholder-assistant'} 
                        className="text-center group" 
                        variants={scaleIn}
                        whileHover={{ y: -10 }}
                        transition={{ type: "spring", stiffness: 300, damping: 25 }}
                      >
                        <div className="relative mb-6">
                          <motion.img 
                            src={instructor.avatar} 
                            alt={instructor.name} 
                            className="w-40 h-40 rounded-full mx-auto border-4 border-gray-700 group-hover:border-cyan-400 transition-all duration-300 object-cover shadow-xl" 
                            whileHover={{ scale: 1.1 }}
                            transition={{ type: "spring", stiffness: 400, damping: 25 }}
                          />
                          <motion.div
                            className="absolute inset-0 rounded-full bg-gradient-to-t from-cyan-400/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                            whileHover={{ scale: 1.1 }}
                          />
                        </div>
                        <h3 className="font-bold text-xl lg:text-2xl mb-2">{instructor.name}</h3>
                        <p className="text-cyan-400 text-lg">{instructor.title}</p>
                      </motion.div>
                    ))}
                  </div>
                </>
              )}
            </motion.section>

            <SectionSeparator />

            {/* Learning Section */}
            <motion.section 
              id="learn" 
              className="py-20"
              initial="hidden" 
              whileInView="visible" 
              viewport={{ once: true, amount: 0.3 }} 
              variants={staggerContainer}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-12 border-l-4 border-cyan-400 pl-6">Apa yang Akan Anda Pelajari?</h2>
              <div className="grid gap-6">
                {[
                  'Memahami konsep Version Control System (VCS)', 
                  'Inisialisasi repository dan melakukan commit', 
                  'Branching, merging, dan mengatasi konflik', 
                  'Tips & trik yang digunakan developer profesional'
                ].map((item, index) => (
                  <motion.div 
                    key={item} 
                    variants={fadeIn} 
                    className="flex items-start text-lg lg:text-xl bg-gradient-to-r from-gray-800/50 to-gray-700/30 p-6 rounded-xl border border-gray-700/50 backdrop-blur-sm hover:from-gray-700/50 hover:to-gray-600/30 transition-all duration-300"
                    whileHover={{ x: 10, scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: index * 0.2, type: "spring", stiffness: 400, damping: 25 }}
                    >
                      <ArrowRight className="h-6 w-6 lg:h-8 lg:w-8 text-cyan-400 mr-4 mt-1 flex-shrink-0" />
                    </motion.div>
                    <span className="text-gray-300">{item}</span>
                  </motion.div>
                ))}
              </div>
            </motion.section>

            <SectionSeparator />

            {/* Guidebook Section */}
            <motion.section 
              id="guidebook" 
              className="py-20"
              initial="hidden" 
              whileInView="visible" 
              viewport={{ once: true, amount: 0.3 }} 
              variants={fadeIn}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-12 border-l-4 border-cyan-400 pl-6">Buku Panduan</h2>
              <motion.div 
                className="bg-gradient-to-br from-gray-800/50 to-gray-700/50 backdrop-blur-sm p-6 lg:p-8 rounded-2xl border border-gray-700/50"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                <div className="aspect-w-16 aspect-h-9 mb-6">
                  <iframe 
                    src="/GitReady-GuideBook.pdf" 
                    className="w-full h-[400px] md:h-[500px] rounded-xl border-2 border-gray-700"
                    title="GitReady GuideBook"
                  ></iframe>
                </div>
                <motion.a 
                  href="/GitReady-GuideBook.pdf" 
                  download="GitReady-GuideBook.pdf"
                  className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-bold py-3 px-8 rounded-xl transition duration-300 w-full sm:w-auto shadow-lg shadow-cyan-400/30"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Download size={20} />
                  Unduh Buku Panduan
                </motion.a>
              </motion.div>
            </motion.section>
              
            <SectionSeparator />
              
            {/* FAQ Section */}
            <motion.section 
              id="faq" 
              className="py-20"
              initial="hidden" 
              whileInView="visible" 
              viewport={{ once: true, amount: 0.3 }} 
              variants={staggerContainer}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-12 border-l-4 border-cyan-400 pl-6">Tanya Jawab</h2>
              <div className="space-y-2 bg-gradient-to-br from-gray-800/30 to-gray-700/30 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-4 lg:p-6">
                {faqs.map((faq, index) => (
                  <FAQItem key={index} question={faq.question} answer={faq.answer} />
                ))}
              </div>
            </motion.section>

            <SectionSeparator />

            {/* Event Details */}
            <motion.section 
              className="py-20"
              initial="hidden" 
              whileInView="visible" 
              viewport={{ once: true, amount: 0.3 }} 
              variants={fadeIn}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-12 border-l-4 border-cyan-400 pl-6">Detail Acara</h2>
              <div className="grid sm:grid-cols-2 gap-6 lg:gap-8">
                <motion.div 
                  className="bg-gradient-to-br from-gray-800/50 to-gray-700/50 backdrop-blur-sm p-6 lg:p-8 rounded-xl flex items-center space-x-6 border border-gray-700/50"
                  whileHover={{ scale: 1.02, y: -5 }}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                >
                  <Calendar className="h-12 w-12 lg:h-16 lg:w-16 text-cyan-400 flex-shrink-0"/>
                  <div>
                    <h3 className="font-bold text-lg lg:text-xl mb-2">Tanggal</h3>
                    <p className="text-gray-300 text-base lg:text-lg">Jumat, 26 September 2025</p>
                  </div>
                </motion.div>
                
                <motion.div 
                  className="bg-gradient-to-br from-gray-800/50 to-gray-700/50 backdrop-blur-sm p-6 lg:p-8 rounded-xl flex items-center space-x-6 border border-gray-700/50"
                  whileHover={{ scale: 1.02, y: -5 }}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                >
                  <Clock className="h-12 w-12 lg:h-16 lg:w-16 text-cyan-400 flex-shrink-0"/>
                  <div>
                    <h3 className="font-bold text-lg lg:text-xl mb-2">Waktu</h3>
                    <p className="text-gray-300 text-base lg:text-lg">08:00 - 11:00 WIB</p>
                  </div>
                </motion.div>
                
                <motion.div 
                  className="bg-gradient-to-br from-gray-800/50 to-gray-700/50 backdrop-blur-sm p-6 lg:p-8 rounded-xl flex items-center space-x-6 col-span-full border border-gray-700/50"
                  whileHover={{ scale: 1.02, y: -5 }}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                >
                  <MapPin className="h-12 w-12 lg:h-16 lg:w-16 text-cyan-400 flex-shrink-0"/>
                  <div>
                    <h3 className="font-bold text-lg lg:text-xl mb-2">Lokasi</h3>
                    <p className="text-gray-300 text-base lg:text-lg">Kampus Binus@Malang (Onsite)</p>
                  </div>
                </motion.div>
              </div>
            </motion.section>

            {/* Registration Form */}
            <motion.section 
              className="py-20" 
              id="form-pendaftaran" 
              initial="hidden" 
              whileInView="visible" 
              viewport={{ once: true, amount: 0.2 }} 
              variants={fadeIn}
            >
              <motion.div 
                className="bg-gradient-to-br from-gray-800/80 to-gray-700/80 backdrop-blur-sm p-6 md:p-8 lg:p-12 rounded-2xl shadow-2xl shadow-cyan-500/10 max-w-2xl mx-auto border border-gray-700/50"
                whileHover={{ scale: 1.01 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
                  Formulir Pendaftaran
                </h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <FormInput 
                    icon={<User className="h-6 w-6 text-gray-400" />} 
                    placeholder="Nama Lengkap" 
                    id="fullName" 
                    name="fullName" 
                    value={formData.fullName} 
                    onChange={handleInputChange} 
                  />
                  <FormInput 
                    icon={<Hash className="h-6 w-6 text-gray-400" />} 
                    placeholder="NIM" 
                    id="nim" 
                    name="nim" 
                    value={formData.nim} 
                    onChange={handleInputChange} 
                    type="tel" 
                    pattern="[0-9]*" 
                    title="NIM harus berupa angka." 
                  />
                  <FormInput 
                    icon={<Mail className="h-6 w-6 text-gray-400" />} 
                    placeholder="Email Binusian (@binus.ac.id)" 
                    type="email" 
                    id="binusianEmail" 
                    name="binusianEmail"
                    value={formData.binusianEmail}
                    onChange={handleInputChange}
                    pattern=".+@binus\.ac\.id$"
                    title="Email harus diakhiri dengan @binus.ac.id"
                  />
                  <FormInput 
                    icon={<Mail className="h-6 w-6 text-gray-400" />} 
                    placeholder="Email Pribadi" 
                    type="email" 
                    id="privateEmail" 
                    name="privateEmail"
                    value={formData.privateEmail}
                    onChange={handleInputChange}
                  />
                  <FormInput 
                    icon={<GraduationCap className="h-6 w-6 text-gray-400" />} 
                    placeholder="Jurusan" 
                    id="major" 
                    name="major" 
                    value={formData.major} 
                    onChange={handleInputChange} 
                  />
                  <FormInput 
                    icon={<Phone className="h-6 w-6 text-gray-400" />} 
                    placeholder="Nomor Telepon (WhatsApp)" 
                    type="tel" 
                    id="phoneNumber" 
                    name="phoneNumber" 
                    value={formData.phoneNumber} 
                    onChange={handleInputChange} 
                    pattern="[0-9]*" 
                    title="Nomor telepon harus berupa angka." 
                  />
                  
                  {error && (
                    <motion.div 
                      className="bg-red-900/50 border border-red-500 text-red-300 px-4 py-3 rounded-xl flex items-center backdrop-blur-sm"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <AlertCircle className="h-5 w-5 mr-3 flex-shrink-0" />
                      <span>{error}</span>
                    </motion.div>
                  )}

                  <motion.button 
                    type="submit" 
                    disabled={isLoading || !isRegistrationOpen} 
                    className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-bold py-4 px-6 rounded-xl transition duration-300 text-xl disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed shadow-lg shadow-cyan-400/30"
                    whileHover={!isLoading && isRegistrationOpen ? { scale: 1.02, y: -2 } : {}}
                    whileTap={!isLoading && isRegistrationOpen ? { scale: 0.98 } : {}}
                  >
                    {isRegistrationOpen === false ? 'Pendaftaran Ditutup' : (isLoading ? 'Mendaftar...' : 'Daftar Sekarang')}
                  </motion.button>
                </form>
              </motion.div>
            </motion.section>

            <SectionSeparator />
            
            {/* Games Section */}
            <motion.section 
              id="game" 
              className="py-20"
              initial="hidden" 
              whileInView="visible" 
              viewport={{ once: true, amount: 0.3 }} 
              variants={fadeIn}
            >
              <GitMazeGame />
            </motion.section>
            
            <SectionSeparator />

            <motion.section 
              id="dino-game" 
              className="py-20"
              initial="hidden" 
              whileInView="visible" 
              viewport={{ once: true, amount: 0.3 }} 
              variants={fadeIn}
            >
              <DinoGame />
            </motion.section>
          </div>
        </main>

        {/* Enhanced Footer */}
        <motion.footer 
          className="bg-gradient-to-t from-gray-800/60 to-gray-900/40 backdrop-blur-sm text-center py-12 mt-20 border-t border-gray-700/50"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="container mx-auto px-6 max-w-4xl">
            <div className="mb-8">
              <h3 className="text-xl lg:text-2xl font-bold mb-4">Narahubung</h3>
              <p className="text-gray-400 text-lg">Stanley Pratama Teguh</p>
              <motion.a 
                href="https://wa.me/62895637876392" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-cyan-400 hover:text-cyan-300 transition-colors text-lg font-semibold"
                whileHover={{ scale: 1.05 }}
              >
                +62 895-6378-76392
              </motion.a>
            </div>
            
            <div className="mb-8">
              <h3 className="text-xl lg:text-2xl font-bold mb-6">Cari tahu lebih lanjut tentang BNCC di sini:</h3>
              <div className="flex justify-center space-x-6 flex-wrap gap-4">
                {[
                  { href: "https://bncc.net/", icon: "🌐", label: "Website" },
                  { href: "https://www.instagram.com/bnccmalang/", icon: Instagram, label: "Instagram Malang" },
                  { href: "https://www.instagram.com/bnccbinus/", icon: Instagram, label: "Instagram Pusat" },
                  { href: "https://www.facebook.com/bina.nusantara.computer.club", icon: Facebook, label: "Facebook" },
                  { href: "https://x.com/BNCC_Binus", icon: Twitter, label: "X (Twitter)" },
                  { href: "https://www.linkedin.com/company/bnccbinus/posts/?feedView=all", icon: Linkedin, label: "LinkedIn" }
                ].map((social, index) => (
                  <motion.a 
                    key={social.href}
                    href={social.href} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-gray-400 hover:text-cyan-400 transition-colors p-3 rounded-lg hover:bg-gray-800/50"
                    whileHover={{ scale: 1.2, y: -3 }}
                    whileTap={{ scale: 0.9 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <span className="sr-only">{social.label}</span>
                    {typeof social.icon === 'string' ? (
                      <span className="text-2xl">{social.icon}</span>
                    ) : (
                      <social.icon size={24} />
                    )}
                  </motion.a>
                ))}
              </div>
            </div>
            
            <motion.p 
              className="text-gray-500 text-sm border-t border-gray-700/50 pt-8"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              &copy; 2025 BNCC Learning & Training. Hak Cipta Dilindungi.
            </motion.p>
          </div>
        </motion.footer>
      </div>
    </>
  );
};

const ConfirmationPage = ({ registeredName, onGoBack }: { registeredName: string, onGoBack: () => void }) => {
    useEffect(() => {
        document.title = "Pendaftaran Berhasil! - GitReady with LnT";
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white font-sans flex items-center justify-center p-6">
            <motion.div 
              className="bg-gradient-to-br from-gray-800/80 to-gray-700/80 backdrop-blur-sm max-w-lg w-full p-8 md:p-12 rounded-2xl shadow-2xl shadow-cyan-500/20 text-center border border-gray-700/50" 
              initial={{ opacity: 0, scale: 0.8 }} 
              animate={{ opacity: 1, scale: 1 }} 
              transition={{ duration: 0.5, ease: 'easeOut' }}
            >
              <motion.div 
                initial={{ scale: 0 }} 
                animate={{ scale: 1, transition: { delay: 0.2, type: 'spring', stiffness: 200 } }}
              >
                <CheckCircle className="h-20 w-20 text-green-400 mx-auto mb-6" />
              </motion.div>
              
              <motion.h1 
                className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                Pendaftaran Berhasil, {registeredName}!
              </motion.h1>
              
              <motion.p 
                className="text-gray-300 text-base md:text-lg mb-8 leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                Terima kasih telah mendaftar untuk <span className="font-bold text-cyan-400">GitReady with LnT</span>.
                Tempat Anda sudah kami amankan.
              </motion.p>
              
              <motion.div 
                className="text-left bg-gray-900/50 backdrop-blur-sm p-6 rounded-xl mb-8 space-y-3 border border-gray-700/50"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <p><strong className="text-gray-400 w-20 inline-block">Acara</strong>: GitReady with LnT</p>
                <p><strong className="text-gray-400 w-20 inline-block">Tanggal</strong>: Jumat, 26 September 2025</p>
                <p><strong className="text-gray-400 w-20 inline-block">Lokasi</strong>: Kampus Binus@Malang</p>
              </motion.div>
              
              <motion.p 
                className="text-gray-400 mb-8 text-sm md:text-base"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                Silakan bergabung dengan grup WhatsApp kami untuk informasi lebih lanjut.
              </motion.p>
              
              <motion.div 
                className="flex flex-col sm:flex-row gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
              >
                <motion.a 
                  href="https://chat.whatsapp.com/ByIToL0D1PW5XOj8J74Dry" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-3 px-6 rounded-xl transition duration-300 shadow-lg shadow-green-400/30"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <MessageSquare size={20} />
                  Gabung Grup WhatsApp
                </motion.a>
                <motion.button 
                  onClick={onGoBack}
                  className="w-full flex items-center justify-center gap-2 bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-xl transition duration-300"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Home size={20} />
                  Kembali ke Beranda
                </motion.button>
              </motion.div>
            </motion.div>
        </div>
    );
};

function App() {
    const [isRegistered, setIsRegistered] = useState(false);
    const [registeredName, setRegisteredName] = useState('');

    useEffect(() => {
        document.title = "GitReady with LnT - BNCC";
    }, []);

    const handleRegistration = (name: string) => {
        setRegisteredName(name);
        setIsRegistered(true);
        window.scrollTo(0, 0);
    };

    const handleGoBack = () => {
        setIsRegistered(false);
        setRegisteredName('');
        window.scrollTo(0, 0);
    };

    return (
        <Router>
            <AnimatePresence mode="wait">
                <Routes>
                    <Route
                        path="/"
                        element={
                            isRegistered ? (
                                <motion.div 
                                  key="confirmation"
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  exit={{ opacity: 0 }}
                                  transition={{ duration: 0.5 }}
                                >
                                    <ConfirmationPage
                                        registeredName={registeredName}
                                        onGoBack={handleGoBack}
                                    />
                                </motion.div>
                            ) : (
                                <motion.div 
                                  key="registration"
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  exit={{ opacity: 0 }}
                                  transition={{ duration: 0.5 }}
                                >
                                    <RegistrationPage onRegister={handleRegistration} />
                                </motion.div>
                            )
                        }
                    />
                    <Route
                        path="*"
                        element={
                            <motion.div 
                              key="notfound"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              transition={{ duration: 0.5 }}
                            >
                                <NotFoundPage onGoHome={() => window.location.href = "/"} />
                            </motion.div>
                        }
                    />
                </Routes>
            </AnimatePresence>
        </Router>
    );
}

export default App;