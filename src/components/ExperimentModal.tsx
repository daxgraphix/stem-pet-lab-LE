import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  BookOpen, 
  GraduationCap, 
  Trophy,
  Star,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { Experiment, UserProfile, ExperimentProgress } from '../types';
import { cn } from '../lib/utils';
import { Pet } from './Pet';

interface ExperimentModalProps {
  experiment: Experiment;
  profile: UserProfile;
  onClose: () => void;
  onUpdateProfile: (updater: (p: UserProfile) => UserProfile) => void;
  onComplete: (stars: number, points: number) => void;
  playSound: (sound: string, note: string) => void;
  onFlipCard?: () => void;
  theme: 'dark' | 'light';
}

export const ExperimentModal: React.FC<ExperimentModalProps> = ({
  experiment,
  profile,
  onClose,
  onUpdateProfile,
  onComplete,
  playSound,
  onFlipCard,
  theme
}) => {
  const [stage, setStage] = useState<'overview' | 'knowledge' | 'training' | 'challenge' | 'results'>('overview');
  const progress = profile.experimentProgress[experiment.id] || { knowledge: false, training: false, challenge: false, stars: 0 };

  const handleStageComplete = (completedStage: keyof ExperimentProgress) => {
    onUpdateProfile(p => {
      const newProgress = { ...p.experimentProgress };
      newProgress[experiment.id] = { 
        ...(newProgress[experiment.id] || { knowledge: false, training: false, challenge: false, stars: 0 }),
        [completedStage]: true 
      };
      return { ...p, experimentProgress: newProgress };
    });
  };

  const handleChallengeComplete = (stars: number, points: number) => {
    const isFirstCompletion = !progress.challenge;
    onUpdateProfile(p => {
      const newProgress = { ...p.experimentProgress };
      newProgress[experiment.id] = {
        ...(newProgress[experiment.id] || { knowledge: false, training: false, challenge: false, stars: 0 }),
        challenge: true,
        stars: Math.max(stars, newProgress[experiment.id]?.stars || 0)
      };
      
      const updatedBadges = isFirstCompletion && !p.badges.includes(experiment.id)
        ? [...p.badges, experiment.id]
        : p.badges;

      return {
        ...p,
        totalPoints: p.totalPoints + points,
        petHappiness: Math.min(100, p.petHappiness + 20),
        experimentProgress: newProgress,
        badges: updatedBadges,
      };
    });
    onComplete(stars, points);
    setStage('results');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
        onClick={onClose}
      />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className={cn(
          "relative w-full max-w-4xl max-h-[90vh] rounded-[2.5rem] shadow-2xl border flex flex-col overflow-hidden transition-colors duration-500",
          theme === 'dark' ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"
        )}
      >
        {/* Header */}
        <div className={cn(
          "flex items-center justify-between p-6 sm:p-8 border-b transition-colors",
          theme === 'dark' ? "border-slate-800 bg-slate-800/30" : "border-slate-200 bg-slate-50"
        )}>
          <div className="flex items-center gap-4">
            <div className={cn(
              "w-10 h-10 rounded-xl flex items-center justify-center text-sky-400",
              theme === 'dark' ? "bg-sky-500/10" : "bg-white shadow-sm"
            )}>
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <h2 className={cn(
                "text-xl font-black tracking-tight uppercase",
                theme === 'dark' ? "text-white" : "text-slate-900"
              )}>{experiment.title}</h2>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                Stage: {stage.toUpperCase()}
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className={cn(
              "p-2 rounded-full transition-colors",
              theme === 'dark' ? "hover:bg-slate-700 text-slate-400 hover:text-white" : "hover:bg-slate-100 text-slate-400 hover:text-slate-900"
            )}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-grow overflow-y-auto p-8 sm:p-12">
          <AnimatePresence mode="wait">
            {stage === 'overview' && (
              <OverviewStage 
                key="overview"
                experiment={experiment} 
                progress={progress} 
                setStage={setStage} 
                playSound={playSound} 
                theme={theme}
              />
            )}
            {stage === 'knowledge' && (
              <KnowledgeStage 
                key="knowledge"
                experiment={experiment} 
                onComplete={() => { handleStageComplete('knowledge'); setStage('training'); }} 
                onBack={() => setStage('overview')}
                playSound={playSound} 
                theme={theme}
              />
            )}
            {stage === 'training' && (
              <TrainingStage 
                key="training"
                experiment={experiment} 
                onComplete={() => { handleStageComplete('training'); setStage('challenge'); }} 
                onBack={() => setStage('overview')}
                playSound={playSound} 
                onFlipCard={onFlipCard}
                theme={theme}
              />
            )}
            {stage === 'challenge' && (
              <ChallengeStage 
                key="challenge"
                experiment={experiment} 
                onComplete={handleChallengeComplete} 
                playSound={playSound} 
                theme={theme}
              />
            )}
            {stage === 'results' && (
              <ResultsStage 
                key="results"
                experiment={experiment} 
                stars={profile.experimentProgress[experiment.id]?.stars || 0}
                onClose={onClose} 
                theme={theme}
              />
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

const OverviewStage: React.FC<{ experiment: Experiment; progress: ExperimentProgress; setStage: any; playSound: any; theme: 'dark' | 'light' }> = ({ experiment, progress, setStage, playSound, theme }) => (
  <motion.div 
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className="text-center flex flex-col items-center h-full justify-center"
  >
    <div className={cn(
      "w-24 h-24 mb-8 rounded-3xl flex items-center justify-center shadow-xl transition-colors",
      theme === 'dark' ? "bg-slate-800" : "bg-slate-50 border border-slate-200"
    )}>
      <Trophy className="w-12 h-12 text-emerald-400" />
    </div>
    <h3 className={cn(
      "text-3xl font-black mb-4 tracking-tight",
      theme === 'dark' ? "text-white" : "text-slate-900"
    )}>{experiment.title}</h3>
    <p className={cn(
      "mb-10 max-w-md text-lg leading-relaxed",
      theme === 'dark' ? "text-slate-400" : "text-slate-600"
    )}>{experiment.description}</p>
    
    <div className="flex justify-center items-center gap-4 mb-12 w-full max-w-lg">
      {[
        { key: 'knowledge', name: 'Learn', icon: BookOpen, done: progress.knowledge },
        { key: 'training', name: 'Practice', icon: GraduationCap, done: progress.training },
        { key: 'challenge', name: 'Master', icon: Trophy, done: progress.challenge },
      ].map((s, i) => (
        <React.Fragment key={s.key}>
          <div className={cn(
            "flex-1 p-4 rounded-2xl border transition-all duration-300 flex flex-col items-center gap-2",
            s.done 
              ? "bg-emerald-500/10 border-emerald-500/50 text-emerald-400" 
              : (theme === 'dark' ? "bg-slate-800/50 border-slate-700 text-slate-500" : "bg-slate-50 border-slate-200 text-slate-400")
          )}>
            <s.icon className="w-5 h-5" />
            <span className="text-[10px] font-black uppercase tracking-widest">{s.name}</span>
            {s.done && <CheckCircle2 className="w-4 h-4" />}
          </div>
          {i < 2 && <div className={cn("w-4 h-px", theme === 'dark' ? "bg-slate-800" : "bg-slate-200")} />}
        </React.Fragment>
      ))}
    </div>
    
    <button 
      onClick={() => {
        playSound('click', 'D4');
        if (!progress.knowledge) setStage('knowledge');
        else if (!progress.training) setStage('training');
        else setStage('challenge');
      }}
      className="bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-black py-5 px-16 rounded-2xl text-xl shadow-xl shadow-emerald-500/20 transition-all hover:scale-105 active:scale-95 uppercase tracking-tight"
    >
      {progress.knowledge ? (progress.training ? 'Begin Challenge' : 'Start Practice') : 'Start Learning'}
    </button>
  </motion.div>
);

const KnowledgeStage: React.FC<{ experiment: Experiment; onComplete: any; onBack: any; playSound: any; theme: 'dark' | 'light' }> = ({ experiment, onComplete, onBack, playSound, theme }) => {
  const [page, setPage] = useState(0);
  const isLastPage = page === experiment.knowledge.pages.length - 1;

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="h-full flex flex-col"
    >
      <div className="flex flex-col md:flex-row gap-10 items-center flex-grow justify-center">
        <div className="w-48 flex-shrink-0">
          <Pet petId="roboPup" equipped={{ color: 'sky', accessory: 'goggles' }} size={180} />
        </div>
        <div className={cn(
          "w-full md:w-2/3 max-w-2xl p-10 rounded-[2rem] border shadow-xl relative transition-colors",
          theme === 'dark' ? "bg-slate-800/50 border-slate-700" : "bg-white border-slate-200"
        )}>
          <div className="absolute -top-4 -left-4 w-12 h-12 bg-sky-500 rounded-2xl flex items-center justify-center shadow-lg">
            <BookOpen className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-xl text-sky-400 font-black mb-6 uppercase tracking-tight">{experiment.knowledge.title}</h3>
          <p className={cn(
            "text-xl mb-10 leading-relaxed font-medium transition-colors",
            theme === 'dark' ? "text-slate-200" : "text-slate-700"
          )}>
            {experiment.knowledge.pages[page].text}
          </p>
          <div className={cn(
            "flex justify-between items-center pt-6 border-t transition-colors",
            theme === 'dark' ? "border-slate-700/50" : "border-slate-100"
          )}>
            <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest">
              Page {page + 1} / {experiment.knowledge.pages.length}
            </span>
            <div className="flex gap-4">
              <button 
                onClick={onBack}
                className="px-6 py-3 rounded-xl text-sm font-bold text-slate-400 hover:text-sky-500 transition-colors"
              >
                Back
              </button>
              <button 
                onClick={() => {
                  playSound('click', 'E4');
                  if (isLastPage) onComplete();
                  else setPage(p => p + 1);
                }}
                className="bg-sky-500 hover:bg-sky-400 text-white font-black py-3 px-8 rounded-xl shadow-lg transition-all hover:scale-105 uppercase tracking-tight"
              >
                {isLastPage ? "Practice" : "Next"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const TrainingStage: React.FC<{ experiment: Experiment; onComplete: any; onBack: any; playSound: any; onFlipCard?: () => void; theme: 'dark' | 'light' }> = ({ experiment, onComplete, onBack, playSound, onFlipCard, theme }) => {
  const [cardIndex, setCardIndex] = useState(0);
  const [isFlipped, setFlipped] = useState(false);
  const cards = experiment.training.flashcards;

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center flex flex-col h-full justify-center items-center"
    >
      <h3 className={cn(
        "text-2xl font-black mb-2 tracking-tight uppercase",
        theme === 'dark' ? "text-white" : "text-slate-900"
      )}>{experiment.training.title}</h3>
      <p className="text-slate-500 mb-10 font-bold uppercase tracking-widest text-[10px]">Tap card to reveal definition</p>
      
      <div 
        className="relative w-full max-w-md h-80 cursor-pointer perspective-1000 mb-10"
        onClick={() => { 
          playSound('click', 'C4'); 
          if (!isFlipped && onFlipCard) onFlipCard();
          setFlipped(!isFlipped); 
        }}
      >
        <motion.div 
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 20 }}
          className="w-full h-full relative preserve-3d"
        >
          {/* Front */}
          <div className={cn(
            "absolute inset-0 backface-hidden rounded-[2.5rem] border-2 flex flex-col items-center justify-center p-10 shadow-2xl transition-colors",
            theme === 'dark' ? "bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700" : "bg-white border-slate-200"
          )}>
            <span className="text-[10px] font-black text-sky-500 uppercase tracking-widest mb-4">Term</span>
            <h4 className={cn(
              "text-4xl font-black tracking-tight",
              theme === 'dark' ? "text-white" : "text-slate-900"
            )}>{cards[cardIndex].term}</h4>
          </div>
          {/* Back */}
          <div className={cn(
            "absolute inset-0 backface-hidden rounded-[2.5rem] border-2 flex flex-col items-center justify-center p-10 shadow-2xl rotate-y-180 transition-colors",
            theme === 'dark' ? "bg-slate-100 border-white" : "bg-slate-900 border-slate-800"
          )}>
            <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-4">Definition</span>
            <p className={cn(
              "text-xl font-bold leading-relaxed",
              theme === 'dark' ? "text-slate-800" : "text-white"
            )}>{cards[cardIndex].definition}</p>
          </div>
        </motion.div>
      </div>
      
      <div className="flex items-center gap-8 mb-12">
        <button 
          disabled={cardIndex === 0}
          onClick={() => { setCardIndex(i => i - 1); setFlipped(false); }}
          className={cn(
            "p-4 rounded-2xl transition-all disabled:opacity-20",
            theme === 'dark' ? "bg-slate-800 text-slate-400 hover:text-white" : "bg-slate-100 text-slate-400 hover:text-slate-900"
          )}
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <span className="text-sm font-black text-slate-500 font-mono tracking-widest">
          {cardIndex + 1} / {cards.length}
        </span>
        <button 
          disabled={cardIndex === cards.length - 1}
          onClick={() => { setCardIndex(i => i + 1); setFlipped(false); }}
          className={cn(
            "p-4 rounded-2xl transition-all disabled:opacity-20",
            theme === 'dark' ? "bg-slate-800 text-slate-400 hover:text-white" : "bg-slate-100 text-slate-400 hover:text-slate-900"
          )}
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>
      
      {cardIndex === cards.length - 1 && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex gap-4">
          <button onClick={onBack} className="px-8 py-4 rounded-2xl font-bold text-slate-500 hover:text-sky-500 transition-colors">Back</button>
          <button 
            onClick={onComplete}
            className="bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-black py-4 px-12 rounded-2xl shadow-xl shadow-emerald-500/20 transition-all hover:scale-105 uppercase tracking-tight"
          >
            Start Test
          </button>
        </motion.div>
      )}
    </motion.div>
  );
};

const ChallengeStage: React.FC<{ experiment: Experiment; onComplete: any; playSound: any; theme: 'dark' | 'light' }> = ({ experiment, onComplete, playSound, theme }) => {
  const [started, setStarted] = useState(false);
  
  if (!started) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center">
        <Pet petId="astroCritter" equipped={{ color: 'violet', accessory: 'beanie' }} size={160} />
        <div className={cn(
          "mt-10 p-10 rounded-[2.5rem] border max-w-lg shadow-2xl transition-colors",
          theme === 'dark' ? "bg-slate-800/50 border-slate-700" : "bg-white border-slate-200"
        )}>
          <h3 className={cn(
            "text-3xl font-black mb-4 tracking-tight uppercase",
            theme === 'dark' ? "text-white" : "text-slate-900"
          )}>Final Challenge</h3>
          <p className={cn(
            "text-lg mb-8 leading-relaxed font-medium transition-colors",
            theme === 'dark' ? "text-slate-400" : "text-slate-600"
          )}>
            Show off what you've learned! Complete the challenge to earn your badge and EXP.
          </p>
          <button 
            onClick={() => setStarted(true)}
            className="bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-black py-5 px-16 rounded-2xl text-xl shadow-xl shadow-emerald-500/20 transition-all hover:scale-105 active:scale-95 uppercase tracking-tight"
          >
            I'm Ready!
          </button>
        </div>
      </div>
    );
  }

  const { gameType, content } = experiment.challenge;

  if (gameType === 'dragAndDrop') return <DragAndDropGame challenge={content} onComplete={onComplete} playSound={playSound} theme={theme} />;
  if (gameType === 'chooseYourResponse') return <ChooseYourResponseGame challenges={content} onComplete={onComplete} playSound={playSound} theme={theme} />;
  if (gameType === 'matchThePairs') return <MatchThePairsGame challenges={content} onComplete={onComplete} playSound={playSound} theme={theme} />;
  if (gameType === 'sortTheSequence') return <SortTheSequenceGame challenges={content} onComplete={onComplete} playSound={playSound} theme={theme} />;

  return <div>Unknown game type</div>;
};

const DragAndDropGame: React.FC<{ challenge: any; onComplete: any; playSound: any; theme: 'dark' | 'light' }> = ({ challenge, onComplete, playSound, theme }) => {
  const [items, setItems] = useState(challenge.items);
  const [zones, setZones] = useState<Record<string, any[]>>(challenge.zones.reduce((acc: any, z: any) => ({...acc, [z.id]: [] }), {}));
  const [selectedItem, setSelectedItem] = useState<any>(null);

  const handleZoneClick = (zoneId: string) => {
    if (!selectedItem) return;
    if (selectedItem.type === zoneId) {
      playSound('correct', 'E5');
      setItems((i: any[]) => i.filter(item => item.text !== selectedItem.text));
      setZones((z: any) => ({...z, [zoneId]: [...z[zoneId], selectedItem]}));
    } else {
      playSound('incorrect', 'C3');
    }
    setSelectedItem(null);
  };

  useEffect(() => {
    if (items.filter((i: any) => i.type !== 'distractor').length === 0) {
      setTimeout(() => onComplete(3, 100), 1000);
    }
  }, [items, onComplete]);

  return (
    <div className="flex flex-col gap-8 w-full max-w-3xl mx-auto">
      <div className={cn(
        "p-6 rounded-3xl border transition-colors",
        theme === 'dark' ? "bg-slate-800/50 border-slate-700" : "bg-slate-50 border-slate-200"
      )}>
        <h4 className="text-center text-slate-400 mb-6 font-bold uppercase tracking-widest text-xs">Select an item</h4>
        <div className="flex flex-wrap justify-center gap-3">
          {items.map((item: any) => (
            <button 
              key={item.text} 
              onClick={() => setSelectedItem(selectedItem === item ? null : item)}
              className={cn(
                "px-6 py-3 rounded-xl text-sm font-bold transition-all duration-200",
                selectedItem === item 
                  ? "bg-sky-500 text-white ring-4 ring-sky-500/30 scale-105" 
                  : (theme === 'dark' ? "bg-slate-700 hover:bg-slate-600 text-slate-200" : "bg-white hover:bg-slate-100 text-slate-700 border border-slate-200")
              )}
            >
              {item.text}
            </button>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {challenge.zones.map((zone: any) => (
          <div 
            key={zone.id} 
            onClick={() => handleZoneClick(zone.id)}
            className={cn(
              "min-h-[160px] rounded-3xl border-2 border-dashed p-6 transition-all",
              theme === 'dark' ? "bg-slate-900/50" : "bg-slate-50/50",
              selectedItem ? "border-emerald-500/50 cursor-pointer hover:bg-emerald-500/5" : (theme === 'dark' ? "border-slate-800" : "border-slate-200")
            )}
          >
            <h4 className={cn("font-black text-center mb-4 uppercase tracking-tight", zone.color)}>{zone.title}</h4>
            <div className="flex flex-wrap gap-2 justify-center">
              {zones[zone.id].map(item => (
                <div key={item.text} className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors",
                  theme === 'dark' ? "bg-slate-800 text-slate-300 border-slate-700" : "bg-white text-slate-700 border-slate-200 shadow-sm"
                )}>
                  {item.text}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const ChooseYourResponseGame: React.FC<{ challenges: any[]; onComplete: any; playSound: any; theme: 'dark' | 'light' }> = ({ challenges, onComplete, playSound, theme }) => {
  const [qIndex, setQIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<any>(null);

  const handleAnswer = (option: any) => {
    if (feedback) return;
    setFeedback({ text: option.feedback, correct: option.correct });
    if (option.correct) {
      playSound('correct', 'G5');
      setScore(s => s + 1);
    } else {
      playSound('incorrect', 'C3');
    }

    setTimeout(() => {
      setFeedback(null);
      if (qIndex + 1 < challenges.length) {
        setQIndex(q => q + 1);
      } else {
        const finalScore = score + (option.correct ? 1 : 0);
        const stars = finalScore === challenges.length ? 3 : (finalScore > 0 ? 2 : 1);
        onComplete(stars, finalScore * 50);
      }
    }, 2000);
  };

  const q = challenges[qIndex];
  
  return (
    <div className="max-w-xl mx-auto w-full">
      <div className={cn(
        "p-8 rounded-[2rem] border shadow-xl mb-8 transition-colors",
        theme === 'dark' ? "bg-slate-800/80 border-slate-700" : "bg-white border-slate-200"
      )}>
        <h4 className={cn(
          "text-xl font-bold text-center leading-relaxed transition-colors",
          theme === 'dark' ? "text-slate-100" : "text-slate-800"
        )}>{q.scenario}</h4>
      </div>
      <div className="flex flex-col gap-4">
        {q.options.map((o: any, i: number) => (
          <button 
            key={i} 
            onClick={() => handleAnswer(o)} 
            disabled={!!feedback}
            className={cn(
              "text-left p-6 rounded-2xl border-2 transition-all duration-300 font-bold",
              feedback 
                ? (o.correct 
                    ? "bg-emerald-500/20 border-emerald-500 text-emerald-100" 
                    : (o.text === feedback.text ? "bg-red-500/20 border-red-500 text-red-100" : (theme === 'dark' ? "bg-slate-800 border-slate-700 opacity-50" : "bg-slate-50 border-slate-100 opacity-50"))) 
                : (theme === 'dark' ? "bg-slate-800 border-slate-700 hover:border-sky-500 hover:bg-slate-750 text-white" : "bg-white border-slate-200 hover:border-sky-500 hover:bg-slate-50 text-slate-700")
            )}
          >
            {o.text}
          </button>
        ))}
      </div>
      <AnimatePresence>
        {feedback && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              "mt-8 text-center p-6 rounded-2xl border transition-colors",
              theme === 'dark' ? "bg-slate-900 border-slate-800" : "bg-slate-50 border-slate-200"
            )}
          >
            <p className={cn("font-black text-lg uppercase tracking-tight", feedback.correct ? "text-emerald-400" : "text-rose-400")}>
              {feedback.correct ? "Excellent!" : "Not quite!"}
            </p>
            <p className="mt-2 text-slate-400 font-medium">{feedback.text}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const MatchThePairsGame: React.FC<{ challenges: any[]; onComplete: any; playSound: any; theme: 'dark' | 'light' }> = ({ challenges, onComplete, playSound, theme }) => {
  const [items, setItems] = useState<any[]>([]);
  const [selected, setSelected] = useState<any[]>([]);
  const [matched, setMatched] = useState<number[]>([]);
  const [isChecking, setIsChecking] = useState(false);

  useEffect(() => {
    let flatItems: any[] = [];
    challenges.forEach((pair, i) => {
      flatItems.push({ text: pair.item, pairId: i, id: `item-${i}` });
      flatItems.push({ text: pair.match, pairId: i, id: `match-${i}` });
    });
    setItems(flatItems.sort(() => Math.random() - 0.5));
  }, [challenges]);

  const handleSelect = (item: any) => {
    if (isChecking || matched.includes(item.pairId) || selected.find(s => s.id === item.id)) return;
    playSound('click', 'C4');
    const newSelected = [...selected, item];
    setSelected(newSelected);
    
    if (newSelected.length === 2) {
      setIsChecking(true);
      if (newSelected[0].pairId === newSelected[1].pairId) {
        playSound('correct', 'F5');
        setTimeout(() => {
          setMatched(m => [...m, newSelected[0].pairId]);
          setSelected([]);
          setIsChecking(false);
        }, 500);
      } else {
        playSound('incorrect', 'C3');
        setTimeout(() => {
          setSelected([]);
          setIsChecking(false);
        }, 1000);
      }
    }
  };

  useEffect(() => {
    if (challenges.length > 0 && matched.length === challenges.length) {
      setTimeout(() => onComplete(3, 100), 1000);
    }
  }, [matched, challenges, onComplete]);

  return (
    <div className="w-full max-w-3xl mx-auto">
      <p className="text-center mb-8 text-slate-500 font-bold uppercase tracking-widest text-[10px]">Find the matching pairs</p>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {items.map(item => {
          const isMatched = matched.includes(item.pairId);
          const isSelected = selected.find(s => s.id === item.id);
          return (
            <button
              key={item.id}
              onClick={() => handleSelect(item)}
              className={cn(
                "min-h-[120px] p-4 rounded-2xl border-2 transition-all duration-300 flex items-center justify-center text-center font-bold text-sm",
                isMatched 
                  ? "bg-emerald-500/10 border-emerald-500/50 text-emerald-400 opacity-50 scale-95" 
                  : isSelected 
                    ? "bg-sky-500 border-sky-400 text-white scale-105 shadow-xl shadow-sky-500/20" 
                    : (theme === 'dark' ? "bg-slate-800 border-slate-700 hover:border-slate-600 text-slate-200" : "bg-white border-slate-200 hover:border-slate-300 text-slate-700 shadow-sm")
              )}
            >
              {item.text}
            </button>
          );
        })}
      </div>
    </div>
  );
};

const SortTheSequenceGame: React.FC<{ challenges: any[]; onComplete: any; playSound: any; theme: 'dark' | 'light' }> = ({ challenges, onComplete, playSound, theme }) => {
  const [cIndex, setCIndex] = useState(0);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const challenge = challenges[cIndex];

  const handleSelect = (option: any) => {
    if (isCorrect !== null) return;
    if (option === challenge.answer) {
      playSound('correct', 'G5');
      setIsCorrect(true);
    } else {
      playSound('incorrect', 'C3');
      setIsCorrect(false);
    }

    setTimeout(() => {
      setIsCorrect(null);
      if (cIndex + 1 < challenges.length) {
        setCIndex(i => i + 1);
      } else {
        onComplete(3, 100);
      }
    }, 2000);
  };

  return (
    <div className="text-center max-w-2xl mx-auto w-full">
      <div className={cn(
        "rounded-[2rem] p-10 border mb-10 shadow-xl transition-colors",
        theme === 'dark' ? "bg-slate-800/80 border-slate-700" : "bg-white border-slate-200"
      )}>
        <h4 className="text-xs font-black text-slate-500 mb-8 uppercase tracking-[0.3em]">Complete the sequence</h4>
        <div className="flex flex-wrap justify-center items-center gap-4 text-3xl font-black font-mono">
          {challenge.sequence.map((item: any, i: number) => (
            <div key={i} className={cn(
              "w-20 h-20 flex items-center justify-center rounded-2xl shadow-inner border-2 transition-colors",
              item === '?' 
                ? (isCorrect !== null ? (isCorrect ? "border-emerald-500 bg-emerald-500/10 text-emerald-400" : "border-rose-500 bg-rose-500/10 text-rose-400") : "border-sky-500 bg-slate-900 animate-pulse") 
                : (theme === 'dark' ? "bg-slate-900 border-slate-800 text-white" : "bg-slate-50 border-slate-100 text-slate-900")
            )}>
              {item === '?' ? (isCorrect !== null ? challenge.answer : '?') : item}
            </div>
          ))}
        </div>
      </div>
      <div className="flex justify-center gap-6">
        {challenge.options.map((opt: any) => (
          <button 
            key={opt} 
            onClick={() => handleSelect(opt)} 
            disabled={isCorrect !== null}
            className={cn(
              "w-24 h-24 text-2xl font-black rounded-3xl shadow-xl transition-all transform hover:-translate-y-1",
              isCorrect !== null 
                ? (opt === challenge.answer ? "bg-emerald-500 text-slate-900" : (theme === 'dark' ? "bg-slate-800 opacity-50" : "bg-slate-100 opacity-50")) 
                : "bg-sky-600 hover:bg-sky-500 text-white"
            )}
          >
            {opt}
          </button>
        ))}
      </div>
      {isCorrect !== null && (
        <p className={cn("mt-10 font-black text-lg uppercase tracking-tight animate-bounce", isCorrect ? "text-emerald-400" : "text-rose-400")}>
          {isCorrect ? "Perfect!" : `The answer was ${challenge.answer}`}
        </p>
      )}
    </div>
  );
};

const ResultsStage: React.FC<{ experiment: Experiment; stars: number; onClose: any; theme: 'dark' | 'light' }> = ({ experiment, stars, onClose, theme }) => (
  <motion.div 
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    className="text-center flex flex-col items-center justify-center h-full"
  >
    <div className={cn(
      "p-12 rounded-[3rem] border shadow-2xl max-w-md w-full relative transition-colors",
      theme === 'dark' ? "bg-slate-800/80 border-slate-700" : "bg-white border-slate-200"
    )}>
      <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-20 h-20 bg-amber-500 rounded-3xl flex items-center justify-center shadow-xl rotate-12">
        <Trophy className="w-10 h-10 text-white" />
      </div>
      
      <h2 className="text-3xl font-black text-emerald-400 mb-8 mt-4 tracking-tight uppercase">Experiment Mastered!</h2>
      
      <div className="flex justify-center gap-4 mb-10">
        {[1, 2, 3].map(i => (
          <motion.div
            key={i}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: i * 0.2 }}
          >
            <Star className={cn(
              "w-12 h-12",
              i <= stars ? "fill-amber-400 text-amber-400 drop-shadow-lg" : (theme === 'dark' ? "text-slate-700" : "text-slate-200")
            )} />
          </motion.div>
        ))}
      </div>
      
      <div className="mb-10">
        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Badge Earned</p>
        <div className={cn(
          "text-2xl font-black py-4 rounded-2xl border transition-colors",
          theme === 'dark' ? "text-white bg-slate-900 border-slate-700" : "text-slate-900 bg-slate-50 border-slate-200"
        )}>
          {experiment.badgeName}
        </div>
      </div>
      
      <button 
        onClick={onClose}
        className="w-full bg-sky-500 hover:bg-sky-400 text-white font-black py-5 rounded-2xl text-lg shadow-xl shadow-sky-500/20 transition-all hover:scale-105 uppercase tracking-tight"
      >
        Return to Lab
      </button>
    </div>
  </motion.div>
);

const FlaskConical = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M10 2v8L4.5 20.29A2 2 0 0 0 6.2 23h11.6a2 2 0 0 0 1.7-2.71L14 10V2" />
    <path d="M8.5 2h7" />
    <path d="M7 16h10" />
  </svg>
);
