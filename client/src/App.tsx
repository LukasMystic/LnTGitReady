import React, { useState, useEffect, useRef } from 'react';
import { Calendar, MapPin, Clock, ArrowRight, CheckCircle, User, Mail, Hash, Phone, ChevronDown, Code2, Instagram, Facebook, Twitter, Linkedin, GraduationCap, Menu, X, AlertCircle, Home, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence, useScroll, useMotionValueEvent, useTransform } from 'framer-motion';
import { type Variants } from 'framer-motion';
import axios from 'axios';
import * as Tone from 'tone';
import { Helmet } from 'react-helmet-async';

const rawUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080';
const API_URL = rawUrl.replace(/\/$/, '');


// --- Animation Variants ---
const fadeIn: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" }
  }
};

const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15
    }
  }
};

// --- Reusable Components ---
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
  <div className="relative">
    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
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
      className="w-full pl-12 pr-4 py-4 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition duration-300 text-lg"
      placeholder={placeholder}
      required
    />
  </div>
);

interface FAQItemProps {
  question: string;
  answer: React.ReactNode;
}

const FAQItem = ({ question, answer }: FAQItemProps) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <motion.div className="border-b border-gray-700" variants={fadeIn}>
      <button
        className="w-full flex justify-between items-center text-left py-5"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="font-semibold text-xl">{question}</span>
        <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.3 }}>
          <ChevronDown className="h-7 w-7 text-cyan-400" />
        </motion.div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="overflow-hidden"
          >
            <div className="pb-5 text-gray-300 text-lg">{answer}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const SectionSeparator = () => (
    <div className="relative text-center my-24" aria-hidden="true">
        <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-700/50"></div>
        </div>
        <div className="relative inline-block px-4 bg-gray-900">
            <Code2 className="h-10 w-10 text-cyan-400/70" />
        </div>
    </div>
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
            <div className="max-w-4xl mx-auto mt-12 text-center">
                 <h3 className="text-3xl font-bold text-cyan-400">Pendaftaran Telah Ditutup</h3>
                 <p className="text-xl text-gray-300 mt-2">See you at the event!</p>
            </div>
        );
    }

    if (isRegistrationOpen === null) {
        return <div className="max-w-4xl mx-auto mt-12 text-center"><p>Loading registration status...</p></div>;
    }

    const timerComponents = Object.entries(timeLeft).map(([interval, value]) => {
        return (
            <div key={interval} className="text-center">
                <div className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-300 to-blue-400">
                    {String(value).padStart(2, '0')}
                </div>
                <div className="text-sm md:text-lg uppercase text-gray-400">{interval}</div>
            </div>
        );
    });

    return (
        <div className="max-w-4xl mx-auto mt-12">
            <h3 className="text-2xl text-center font-bold mb-6">Pendaftaran Ditutup Dalam</h3>
            <div className="flex justify-center gap-4 md:gap-8 p-6 bg-gray-800/50 rounded-2xl">
                {timerComponents.length ? timerComponents : <span>Registration has closed!</span>}
            </div>
            <p className="text-center text-yellow-400 mt-4 text-sm">*Kursi terbatas dan pendaftaran akan ditutup jika kuota sudah terpenuhi.</p>
        </div>
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
    const [message, setMessage] = useState('Welcome! Follow the guide to simulate your first Git workflow.');
    const [gameState, setGameState] = useState('start');
    const [nextCommand, setNextCommand] = useState('git checkout -b feature');

    const resetGame = () => {
        setMaze(initialMaze);
        setPlayerPosition([0, 1]);
        setMessage('Welcome! Follow the guide to simulate your first Git workflow.');
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
                setMessage('Great! You\'ve created a "feature" branch. This lets you work on new ideas without affecting the main code.');
                setNextCommand('git commit');
                break;
            case 'branched':
                setPlayerPosition([2, 2]);
                setGameState('committed');
                setMessage('Nice! You\'ve "committed" your work, saving a snapshot of your changes on the feature branch.');
                setNextCommand('git checkout main');
                break;
            case 'committed':
                setPlayerPosition([3, 1]);
                setGameState('on_main');
                setMessage('You\'re back on the main branch. Now it\'s time to merge your completed feature.');
                setNextCommand('git merge feature');
                break;
            case 'on_main':
                const newMazeMerge = [...maze];
                newMazeMerge[1][3] = 0; 
                setMaze(newMazeMerge);
                setGameState('merged');
                setMessage('Excellent! The feature is merged, and a bridge is built. The final step is to "push" it to the server.');
                setNextCommand('git push');
                break;
            case 'merged':
                setPlayerPosition([2, 4]);
                setGameState('win');
                setMessage('🎉 Success! Your code is live. You\'ve completed a full development cycle!');
                setNextCommand('');
                break;
        }
    };
    
    const getCellClass = (cell: number, row: number, col: number) => {
        const isPlayerHere = playerPosition[0] === row && playerPosition[1] === col;
        if(isPlayerHere) return 'bg-cyan-400 ring-2 ring-white';

        switch(cell) {
            case 1: return 'bg-gray-700';
            case 2: return 'bg-blue-500';
            case 3: return 'bg-green-500';
            case 4: return 'bg-gray-900';
            case 5: return 'bg-purple-600';
            default: return 'bg-gray-800';
        }
    };

    const CommandButton = ({ command }: { command: string }) => {
        const isNext = command === nextCommand;
        return (
            <button
                onClick={() => handleCommand(command)}
                className={`bg-gray-700 p-3 rounded-lg text-center transition-all duration-300 ${
                    isNext ? 'hover:bg-gray-600 ring-2 ring-cyan-400 animate-pulse' : 'opacity-50 cursor-not-allowed'
                }`}
                disabled={!isNext && gameState !== 'win'}
            >
                {command.replace('git ', '')}
            </button>
        );
    };

    return (
        <div className="bg-gray-800/50 p-8 rounded-2xl">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-3xl font-bold">Git Workflow Simulator</h2>
                <button onClick={resetGame} className="text-sm text-cyan-400 hover:underline">Reset</button>
            </div>
            <div className="grid md:grid-cols-2 gap-8 items-center">
                <div className="grid grid-cols-5 gap-1 border border-gray-600 p-2 rounded-lg bg-black">
                    {maze.map((row, rowIndex) => 
                        row.map((cell, colIndex) => (
                            <div key={`${rowIndex}-${colIndex}`} className={`w-full aspect-square rounded-sm transition-colors duration-300 ${getCellClass(cell, rowIndex, colIndex)}`}></div>
                        ))
                    )}
                </div>
                <div className="space-y-4">
                    <p className="h-16 text-gray-300">{message}</p>
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
        </div>
    );
};

const DinoGame = () => {
    const gameAreaRef = useRef<HTMLDivElement>(null);
    const requestRef = useRef<number>();
    
    const playerRef = useRef({ y: 0, vy: 0 });
    const obstaclesRef = useRef<{ x: number, width: number, height: number, type: 'ground' | 'air', y?: number }[]>([]);
    const scoreRef = useRef(0);
    const gameSpeedRef = useRef(5);
    const timeSinceLastObstacleRef = useRef(0);

    const [sceneryLevel, setSceneryLevel] = useState(0);
    const [_, setForceRender] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    const [isRunning, setIsRunning] = useState(false);

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

    const gameSettings = {
        gravity: 0.8,
        jumpStrength: -19,
        playerX: 50,
        playerSize: 40,
        groundY: 280,
        initialSpeed: 6,
        speedIncrease: 0.002,
        obstacleInterval: 1800,
    };

    const startGame = () => {
        Tone.start();
        playerRef.current = { y: gameSettings.groundY - gameSettings.playerSize, vy: 0 };
        obstaclesRef.current = [];
        scoreRef.current = 0;
        gameSpeedRef.current = gameSettings.initialSpeed;
        timeSinceLastObstacleRef.current = 0;
        setGameOver(false);
        setIsRunning(true);
        setSceneryLevel(0);
    };
    const lastJumpTimeRef = useRef(0); 

    const jump = () => {
        const now = Tone.now();
        if (now - lastJumpTimeRef.current < 0.05) return;
        lastJumpTimeRef.current = now;

        if (isRunning && !gameOver && playerRef.current.y >= gameSettings.groundY - gameSettings.playerSize - 5) {
            playerRef.current.vy = gameSettings.jumpStrength;
            sounds.current.jump?.triggerAttackRelease("C5", "8n", now + 0.01); // Delay to ensure time increases
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

        playerRef.current.vy += gameSettings.gravity;
        playerRef.current.y += playerRef.current.vy;

        if (playerRef.current.y >= gameSettings.groundY - gameSettings.playerSize) {
            playerRef.current.y = gameSettings.groundY - gameSettings.playerSize;
            playerRef.current.vy = 0;
        }
        
        gameSpeedRef.current += gameSettings.speedIncrease;
        scoreRef.current += 1;

        const currentScore = Math.floor(scoreRef.current / 10);
        if (currentScore > 0 && currentScore % 100 === 0) {
            const now = Tone.now();
            sounds.current.score?.triggerAttackRelease("E5", "16n", now + 0.01);
        }

        
        const newSceneryLevel = Math.floor(currentScore / 500);
        if (newSceneryLevel > sceneryLevel) {
            setSceneryLevel(newSceneryLevel);
        }

        timeSinceLastObstacleRef.current += 16;
        if (timeSinceLastObstacleRef.current > gameSettings.obstacleInterval) {
            timeSinceLastObstacleRef.current = 0;
            const gameWidth = gameAreaRef.current.clientWidth;
            const isBird = Math.random() > 0.65;
            
            if (isBird) {
                obstaclesRef.current.push({
                    x: gameWidth,
                    width: 45,
                    height: 30,
                    type: 'air',
                    y: gameSettings.groundY - 140 + Math.random() * 80
                });
            } else {
                 obstaclesRef.current.push({
                    x: gameWidth,
                    width: 20 + Math.random() * 30,
                    height: 30 + Math.random() * 60,
                    type: 'ground'
                });
            }
        }

        let isGameOver = false;
        const playerRect = {
            x: gameSettings.playerX + 5,
            y: playerRef.current.y + 5,
            width: gameSettings.playerSize - 10,
            height: gameSettings.playerSize - 10,
        };

        const newObstacles = [];
        for (const obs of obstaclesRef.current) {
            obs.x -= gameSpeedRef.current;
            if (obs.x + obs.width > 0) {
                newObstacles.push(obs);
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
            }
        }
        obstaclesRef.current = newObstacles;

        if (isGameOver) {
            const now = Tone.now();
            sounds.current.gameOver?.triggerAttackRelease("C3", "0.5", now + 0.01);

            setIsRunning(false);
            setGameOver(true);
            return;
        }

        setForceRender(r => r + 1);
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
        <div className="bg-gray-800/50 p-8 rounded-2xl text-center">
            <h2 className="text-3xl font-bold mb-4">Cube Jump Challenge</h2>
            <div
                ref={gameAreaRef}
                className={`relative w-full h-80 rounded-lg overflow-hidden cursor-pointer border-2 border-gray-700 transition-colors duration-1000 ${sceneryClass}`}
                onClick={jump}
            >
                {!isRunning && !gameOver && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
                        <p className="text-xl mb-4">Press Space to Jump!</p>
                        <button onClick={startGame} className="bg-cyan-500 text-white font-bold py-3 px-6 rounded-lg text-xl">Start Game</button>
                    </div>
                )}
                {gameOver && (
                     <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 z-10">
                        <p className="text-4xl font-bold text-red-500">Game Over!</p>
                        <p className="text-2xl text-white mt-2">Final Score: {Math.floor(scoreRef.current / 10)}</p>
                        <button onClick={startGame} className="mt-6 bg-cyan-500 text-white font-bold py-3 px-6 rounded-lg text-xl">Play Again</button>
                    </div>
                )}
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gray-400" style={{top: gameSettings.groundY}}/>
                
                {isRunning && (
                    <>
                        <p className="absolute top-4 right-4 text-2xl font-bold text-white z-10">Score: {Math.floor(scoreRef.current / 10)}</p>
                        <div
                            className="absolute bg-cyan-400 rounded-t-md"
                            style={{
                                left: gameSettings.playerX,
                                top: playerRef.current.y,
                                width: gameSettings.playerSize,
                                height: gameSettings.playerSize,
                            }}
                        />
                        {obstaclesRef.current.map((o, i) => {
                            const yPos = o.type === 'ground' ? gameSettings.groundY - o.height : o.y!;
                            const color = o.type === 'ground' ? 'bg-red-500' : 'bg-yellow-400';
                            const shape = o.type === 'ground' ? '' : 'rounded-full';
                            return (
                                <div
                                    key={i}
                                    className={`absolute ${color} ${shape}`}
                                    style={{
                                        left: o.x,
                                        top: yPos,
                                        width: o.width,
                                        height: o.height,
                                    }}
                                />
                            );
                        })}
                    </>
                )}
            </div>
        </div>
    );
};



// --- Page Components ---
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
            console.error("Failed to fetch registration status", error);
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
        setError(err.response.data.message || 'An error occurred.');
      } else {
        setError('Could not connect to the server. Please try again later.');
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

  const y = useTransform(scrollY, value => value * 0.3);

  const instructors = [
    { name: 'Andi Wijaya', title: 'Lead Instructor', avatar: 'https://placehold.co/400x400/374151/FFFFFF?text=AW' },
    { name: 'Siti Aminah', title: 'Workshop Assistant', avatar: 'https://placehold.co/400x400/374151/FFFFFF?text=SA' },
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

  const navLinks = [
    { name: "Tentang", href: "#about" },
    { name: "Pengajar", href: "#instructors" },
    { name: "Materi", href: "#learn" },
    { name: "FAQ", href: "#faq" },
    { name: "Simulator", href: "#game" },
    { name: "Cube Game", href: "#dino-game" }
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
      <div className="min-h-screen bg-gray-900 text-white font-sans overflow-x-hidden">
        <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-gray-900/80 backdrop-blur-sm shadow-lg' : 'bg-transparent'}`}>
          <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
            <img 
              src="https://miro.medium.com/v2/resize:fit:1400/1*KSH-ELYLBI0dzE1Wt7mRKg.png" 
              alt="Logo BNCC Learning & Training" 
              className="h-25 w-40"
            />
            <div className="hidden md:flex items-center space-x-8">
              {navLinks.map(link => {
                const isActive = activeSection === link.href.replace('#', '');
                return (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={(e) => handleNavClick(e, link.href)}
                    className={`text-gray-300 hover:text-cyan-400 transition-all duration-300 cursor-pointer ${
                      isActive ? 'underline underline-offset-8 decoration-cyan-400 font-semibold' : ''
                    }`}
                  >
                    {link.name}
                  </a>
                );
              })}
            </div>

            <a href="#form-pendaftaran" onClick={(e) => handleNavClick(e, '#form-pendaftaran')} className="hidden md:inline-block bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-2 px-6 rounded-lg transition duration-300 transform hover:scale-105 cursor-pointer">
              Daftar
            </a>
            <div className="md:hidden">
              <button onClick={() => setIsNavOpen(!isNavOpen)}>
                {isNavOpen ? <X size={28}/> : <Menu size={28}/>}
              </button>
            </div>
          </nav>
          <AnimatePresence>
          {isNavOpen && (
              <motion.div 
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="md:hidden bg-gray-900/90 backdrop-blur-sm pb-4"
              >
                  <div className="flex flex-col items-center space-y-4">
                      {navLinks.map(link => <a key={link.href} href={link.href} onClick={(e) => handleNavClick(e, link.href)} className="text-gray-300 hover:text-cyan-400 transition-colors text-lg cursor-pointer">{link.name}</a>)}
                      <a href="#form-pendaftaran" onClick={(e) => handleNavClick(e, '#form-pendaftaran')} className="bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-3 px-8 rounded-lg transition duration-300 w-11/12 text-center cursor-pointer">
                          Daftar Sekarang
                      </a>
                  </div>
              </motion.div>
          )}
          </AnimatePresence>
        </header>

        <main className="container mx-auto px-6 pt-24">
          <section className="relative text-center py-24 md:py-40">
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
              <motion.video 
                  style={{ y }}
                  autoPlay 
                  loop 
                  muted 
                  playsInline 
                  className="w-full h-full object-cover opacity-10" 
                  src="https://cdn.pixabay.com/video/2023/11/26/189073-887309919_large.mp4"
              ></motion.video>
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-gray-900 via-gray-900/70 to-transparent"></div>
            </div>
            <motion.div className="relative z-10" initial="hidden" animate="visible" variants={staggerContainer}>
              <motion.h1 variants={fadeIn} className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">GitReady</span> with LnT
              </motion.h1>
              <motion.p variants={fadeIn} className="max-w-4xl mx-auto text-xl md:text-2xl text-gray-300 mb-8">
                Pelatihan dasar Git & GitHub untuk mempersiapkan Anda berkolaborasi dalam proyek pengembangan software layaknya seorang profesional.
              </motion.p>
              <motion.div variants={fadeIn}>
                  <Countdown isRegistrationOpen={isRegistrationOpen} />
              </motion.div>
            </motion.div>
          </section>

          <div className="max-w-4xl mx-auto">
              <motion.section id="about" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} variants={fadeIn}>
                <h2 className="text-4xl font-bold mb-8 border-l-4 border-cyan-400 pl-4">Tentang Workshop</h2>
                <p className="text-xl text-gray-300 leading-relaxed">
                  GitReady with LnT adalah program kerja eksklusif yang dirancang untuk memberikan kesempatan kepada member BNCC dalam mempelajari dan menguasai Git & GitHub. Di era digital ini, version control adalah skill fundamental yang wajib dimiliki setiap developer. Melalui workshop ini, peserta akan dibimbing untuk memahami konsep dasar Git dan mempraktikkan cara berkolaborasi secara efisien menggunakan GitHub, platform yang menjadi standar industri.
                </p>
              </motion.section>
              
              <SectionSeparator />

              <motion.section id="instructors" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} variants={staggerContainer}>
                <h2 className="text-4xl font-bold mb-8 border-l-4 border-cyan-400 pl-4">Meet the Instructors</h2>
                <div className="flex flex-col sm:flex-row gap-12 justify-center">
                  {instructors.map((instructor) => (
                    <motion.div key={instructor.name} className="text-center group" variants={fadeIn}>
                      <img src={instructor.avatar} alt={instructor.name} className="w-40 h-40 rounded-full mx-auto mb-4 border-4 border-gray-700 group-hover:border-cyan-400 transition-colors duration-300" />
                      <h3 className="font-bold text-2xl">{instructor.name}</h3>
                      <p className="text-cyan-400 text-lg">{instructor.title}</p>
                    </motion.div>
                  ))}
                </div>
              </motion.section>

              <SectionSeparator />

              <motion.section id="learn" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} variants={staggerContainer}>
                <h2 className="text-4xl font-bold mb-8 border-l-4 border-cyan-400 pl-4">Apa yang Akan Anda Pelajari?</h2>
                <ul className="space-y-5">
                  {['Memahami konsep Version Control System (VCS)', 'Inisialisasi repository dan melakukan commit', 'Branching, merging, dan mengatasi konflik', 'Tips & trik yang digunakan developer profesional'].map((item) => (
                    <motion.li key={item} variants={fadeIn} className="flex items-start text-xl">
                      <ArrowRight className="h-8 w-8 text-cyan-400 mr-4 mt-1 flex-shrink-0" />
                      <span className="text-gray-300">{item}</span>
                    </motion.li>
                  ))}
                </ul>
              </motion.section>
              
              <SectionSeparator />
              
              <motion.section id="faq" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} variants={staggerContainer}>
                <h2 className="text-4xl font-bold mb-8 border-l-4 border-cyan-400 pl-4">FAQ</h2>
                <div className="space-y-4">
                  {faqs.map((faq, index) => (
                    <FAQItem key={index} question={faq.question} answer={faq.answer} />
                  ))}
                </div>
              </motion.section>

              <SectionSeparator />

              <motion.section initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} variants={fadeIn}>
                <h2 className="text-4xl font-bold mb-8 border-l-4 border-cyan-400 pl-4">Detail Acara</h2>
                <div className="grid sm:grid-cols-2 gap-8 text-lg">
                   <div className="bg-gray-800/50 p-8 rounded-xl flex items-center space-x-6"><Calendar className="h-12 w-12 text-cyan-400"/><div><h3 className="font-bold text-xl">Tanggal</h3><p className="text-gray-300">Sabtu, 27 September 2025</p></div></div>
                  <div className="bg-gray-800/50 p-8 rounded-xl flex items-center space-x-6"><Clock className="h-12 w-12 text-cyan-400"/><div><h3 className="font-bold text-xl">Waktu</h3><p className="text-gray-300">09:00 - 15:00 WIB</p></div></div>
                   <div className="bg-gray-800/50 p-8 rounded-xl flex items-center space-x-6 col-span-full"><MapPin className="h-12 w-12 text-cyan-400"/><div><h3 className="font-bold text-xl">Lokasi</h3><p className="text-gray-300">Auditorium, Kampus Binus@Malang (Onsite)</p></div></div>
                </div>
              </motion.section>

              <motion.section className="py-24" id="form-pendaftaran" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={fadeIn}>
                  <div className="bg-gray-800 p-8 sm:p-12 rounded-2xl shadow-2xl shadow-cyan-500/10 max-w-2xl mx-auto">
                    <h2 className="text-4xl font-bold text-center mb-8">Formulir Pendaftaran</h2>
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <FormInput icon={<User className="h-6 w-6 text-gray-400" />} placeholder="Nama Lengkap" id="fullName" name="fullName" value={formData.fullName} onChange={handleInputChange} />
                      <FormInput icon={<Hash className="h-6 w-6 text-gray-400" />} placeholder="NIM" id="nim" name="nim" value={formData.nim} onChange={handleInputChange} type="tel" pattern="[0-9]*" title="NIM harus berupa angka." />
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
                      <FormInput icon={<GraduationCap className="h-6 w-6 text-gray-400" />} placeholder="Jurusan" id="major" name="major" value={formData.major} onChange={handleInputChange} />
                      <FormInput icon={<Phone className="h-6 w-6 text-gray-400" />} placeholder="Nomor Telepon (WhatsApp)" type="tel" id="phoneNumber" name="phoneNumber" value={formData.phoneNumber} onChange={handleInputChange} pattern="[0-9]*" title="Nomor telepon harus berupa angka." />
                      
                      {error && (
                          <div className="bg-red-900/50 border border-red-500 text-red-300 px-4 py-3 rounded-lg flex items-center">
                              <AlertCircle className="h-5 w-5 mr-3" />
                              <span>{error}</span>
                          </div>
                      )}

                      <button type="submit" disabled={isLoading || !isRegistrationOpen} className="w-full bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-4 px-6 rounded-lg transition duration-300 transform hover:scale-105 text-xl disabled:bg-gray-600 disabled:cursor-not-allowed">
                        {isRegistrationOpen === false ? 'Pendaftaran Ditutup' : (isLoading ? 'Mendaftar...' : 'Daftar Sekarang')}
                      </button>
                    </form>
                  </div>
              </motion.section>

              <SectionSeparator />
              
              <motion.section id="game" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} variants={fadeIn}>
                  <GitMazeGame />
              </motion.section>
              
              <SectionSeparator />

              <motion.section id="dino-game" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} variants={fadeIn}>
                  <DinoGame />
              </motion.section>

          </div>
        </main>

        <footer className="bg-gray-800/40 text-center py-10 mt-20">
          <div className="container mx-auto px-6">
              <div className="mb-6">
                  <h3 className="text-xl font-bold mb-2">Contact Person</h3>
                  <p className="text-gray-400">Stanley Pratama Teguh</p>
                  <p className="text-gray-400">+62 895-6378-76392</p>
              </div>
              <div className="mb-6">
                  <h3 className="text-xl font-bold mb-4">Find out more about BNCC here:</h3>
                  <div className="flex justify-center space-x-6">
                      <a href="https://bncc.net/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-cyan-400 transition-colors"><span className="sr-only">Website</span><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.72" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.72-1.72" /></svg>
</a>
                      <a href="https://www.instagram.com/bnccmalang/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-cyan-400 transition-colors"><span className="sr-only">Instagram Malang</span><Instagram /></a>
                      <a href="https://www.instagram.com/bnccbinus/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-cyan-400 transition-colors"><span className="sr-only">Instagram Central</span><Instagram /></a>
                      <a href="https://www.facebook.com/bina.nusantara.computer.club" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-cyan-400 transition-colors"><span className="sr-only">Facebook</span><Facebook /></a>
                      <a href="https://x.com/BNCC_Binus" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-cyan-400 transition-colors"><span className="sr-only">X</span><Twitter /></a>
                      <a href="https://www.linkedin.com/company/bnccbinus/posts/?feedView=all" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-cyan-400 transition-colors"><span className="sr-only">LinkedIn</span><Linkedin /></a>
                  </div>
              </div>
              <p className="text-gray-500 text-sm">&copy; 2025 BNCC Learning & Training. All Rights Reserved.</p>
          </div>
        </footer>
      </div>
    </>
  );
};

const ConfirmationPage = ({ registeredName, onGoBack }: { registeredName: string, onGoBack: () => void }) => {
    useEffect(() => {
        document.title = "Pendaftaran Berhasil! - GitReady with LnT";
    }, []);

    return (
        <div className="min-h-screen bg-gray-900 text-white font-sans flex items-center justify-center p-6">
            <motion.div className="bg-gray-800 max-w-lg w-full p-8 md:p-12 rounded-2xl shadow-2xl shadow-cyan-500/20 text-center" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, ease: 'easeOut' }}>
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1, transition: { delay: 0.2, type: 'spring', stiffness: 200 } }}>
                <CheckCircle className="h-20 w-20 text-green-400 mx-auto mb-6" />
            </motion.div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Pendaftaran Berhasil, {registeredName}!</h1>
            <p className="text-gray-300 text-lg mb-8">
                Terima kasih telah mendaftar untuk <span className="font-bold text-cyan-400">GitReady with LnT</span>.
                Tempat Anda sudah kami amankan.
            </p>
            <div className="text-left bg-gray-900/50 p-6 rounded-xl mb-8 space-y-3">
                <p><strong className="text-gray-400 w-20 inline-block">Acara</strong>: GitReady with LnT</p>
                <p><strong className="text-gray-400 w-20 inline-block">Tanggal</strong>: Sabtu, 27 September 2025</p>
                <p><strong className="text-gray-400 w-20 inline-block">Lokasi</strong>: Kampus Binus@Malang</p>
            </div>
            <p className="text-gray-400 mb-8">
                Silakan bergabung dengan grup WhatsApp kami untuk informasi lebih lanjut.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
                <a 
                    href="https://chat.whatsapp.com/ByIToL0D1PW5XOj8J74Dry" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg transition duration-300 transform hover:scale-105"
                >
                    <MessageSquare size={20} />
                    Join Grup WhatsApp
                </a>
                <button 
                    onClick={onGoBack}
                    className="w-full flex items-center justify-center gap-2 bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300"
                >
                    <Home size={20} />
                    Kembali ke Beranda
                </button>
            </div>
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
    <AnimatePresence mode="wait">
      {isRegistered ? (
        <motion.div key="confirmation">
          <ConfirmationPage registeredName={registeredName} onGoBack={handleGoBack} />
        </motion.div>
      ) : (
        <motion.div key="registration">
          <RegistrationPage onRegister={handleRegistration} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default App;
