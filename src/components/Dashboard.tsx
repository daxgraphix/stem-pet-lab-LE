import React from 'react';
import { motion } from 'motion/react';
import { 
  Zap, 
  Heart, 
  Trophy, 
  Menu, 
  Gift, 
  Target, 
  CheckCircle2,
  ChevronRight,
  FlaskConical
} from 'lucide-react';
import { UserProfile, DailyQuest } from '../types';
import { EXPERIMENTS } from '../constants';
import { Pet } from './Pet';
import { cn } from '../lib/utils';

interface DashboardProps {
  profile: UserProfile;
  onOpenExperiment: (id: string) => void;
  onOpenSidebar: () => void;
  onUpdateProfile: (updater: (p: UserProfile) => UserProfile) => void;
  dailyRewardAvailable: boolean;
  onClaimDaily: () => void;
  theme: 'dark' | 'light';
  playSound: (sound: string, note: string) => void;
}

const QuestWidget: React.FC<{ quests: DailyQuest[]; onClaim: (q: DailyQuest) => void; theme: 'dark' | 'light' }> = ({ quests, onClaim, theme }) => (
  <div className={cn(
    "rounded-3xl p-6 border shadow-xl transition-colors",
    theme === 'dark' ? "bg-slate-800/80 border-slate-700" : "bg-white border-slate-200"
  )}>
    <div className="flex justify-between items-center mb-6">
      <h3 className={cn(
        "text-lg font-bold flex items-center gap-2",
        theme === 'dark' ? "text-white" : "text-slate-900"
      )}>
        <Target className="text-emerald-400 w-5 h-5" />
        Daily Quests
      </h3>
      <div className={cn(
        "text-[10px] px-2 py-1 rounded font-mono uppercase tracking-wider",
        theme === 'dark' ? "bg-slate-700 text-slate-300" : "bg-slate-100 text-slate-500"
      )}>
        Resets in 24h
      </div>
    </div>
    <div className="space-y-4">
      {quests.map(quest => {
        const isComplete = quest.progress >= quest.target;
        const isClaimed = quest.claimed;
        return (
          <div 
            key={quest.id} 
            className={cn(
              "p-4 rounded-2xl border transition-all duration-300 flex justify-between items-center",
              isComplete && !isClaimed 
                ? "bg-emerald-500/10 border-emerald-500/50" 
                : (theme === 'dark' ? "bg-slate-900/50 border-slate-800" : "bg-slate-50 border-slate-100")
            )}
          >
            <div className="flex-grow mr-4">
              <div className="flex justify-between mb-2">
                <p className={cn(
                  "text-sm font-medium",
                  theme === 'dark' ? "text-slate-200" : "text-slate-700"
                )}>{quest.description}</p>
                {isComplete && !isClaimed && (
                  <span className="text-[10px] font-bold text-emerald-400 animate-pulse uppercase">Ready!</span>
                )}
              </div>
              <div className={cn(
                "w-full h-1.5 rounded-full overflow-hidden",
                theme === 'dark' ? "bg-slate-800" : "bg-slate-200"
              )}>
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(100, (quest.progress / quest.target) * 100)}%` }}
                  className="bg-emerald-500 h-full"
                />
              </div>
              <p className="text-[10px] text-slate-500 mt-2 font-mono">
                {Math.min(quest.progress, quest.target)} / {quest.target}
              </p>
            </div>
            {isClaimed ? (
              <div className="flex flex-col items-center opacity-40">
                <CheckCircle2 className="text-slate-400 w-6 h-6" />
              </div>
            ) : isComplete ? (
              <button 
                onClick={() => onClaim(quest)}
                className="bg-amber-500 hover:bg-amber-400 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-lg shadow-amber-900/40 animate-bounce transition-colors"
              >
                CLAIM
              </button>
            ) : (
              <div className={cn(
                "px-3 py-1.5 rounded-lg border text-[10px] font-bold",
                theme === 'dark' ? "bg-slate-800 border-slate-700 text-slate-400" : "bg-white border-slate-200 text-slate-500"
              )}>
                {quest.reward} XP
              </div>
            )}
          </div>
        );
      })}
    </div>
  </div>
);

export const Dashboard: React.FC<DashboardProps> = ({ 
  profile, 
  onOpenExperiment, 
  onOpenSidebar, 
  onUpdateProfile,
  dailyRewardAvailable,
  onClaimDaily,
  theme,
  playSound
}) => {
  const handleClaimQuest = (quest: DailyQuest) => {
    onUpdateProfile(p => ({
      ...p,
      totalPoints: p.totalPoints + quest.reward,
      dailyQuests: p.dailyQuests.map(q => q.id === quest.id ? { ...q, claimed: true } : q)
    }));
    playSound('purchase', 'C5');
  };

  const handleRecharge = () => {
    onUpdateProfile(p => ({ 
      ...p, 
      petEnergy: 100,
      dailyQuests: p.dailyQuests.map(q => q.type === 'energy' ? { ...q, progress: q.progress + 1 } : q)
    }));
    playSound('purchase', 'G4');
  };

  const handleFeed = () => {
    onUpdateProfile(p => ({
      ...p,
      petEnergy: Math.min(100, p.petEnergy + 20),
      petHappiness: Math.min(100, p.petHappiness + 10),
      dailyQuests: p.dailyQuests.map(q => q.type === 'feed' ? { ...q, progress: q.progress + 1 } : q)
    }));
    playSound('click', 'E5');
  };

  const handlePlay = () => {
    onUpdateProfile(p => ({
      ...p,
      petHappiness: Math.min(100, p.petHappiness + 25),
      petEnergy: Math.max(0, p.petEnergy - 10)
    }));
    playSound('click', 'A4');
  };

  return (
    <div className={cn(
      "flex flex-col h-full overflow-hidden transition-colors duration-500",
      theme === 'dark' ? "bg-[#0f172a]" : "bg-slate-50"
    )}>
      {/* Header */}
      <header className={cn(
        "flex items-center justify-between px-6 py-4 sm:px-10 sm:py-6 backdrop-blur-xl border-b z-20 transition-colors",
        theme === 'dark' ? "bg-slate-900/50 border-slate-800/50" : "bg-white/80 border-slate-200"
      )}>
        <div className="flex items-center gap-4">
          <button onClick={onOpenSidebar} className="p-2 rounded-xl text-slate-300 hover:bg-slate-800 lg:hidden transition-colors">
            <Menu className="w-6 h-6" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <FlaskConical className="w-5 h-5 text-white" />
            </div>
            <h1 className={cn(
              "text-xl sm:text-2xl font-black tracking-tight",
              theme === 'dark' ? "text-white" : "text-slate-900"
            )}>STEM LAB</h1>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="hidden sm:flex flex-col items-end">
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Lab Points</span>
            <div className="flex items-center gap-2">
              <Trophy className="w-4 h-4 text-amber-400" />
              <span className={cn(
                "text-xl font-black font-mono",
                theme === 'dark' ? "text-white" : "text-slate-900"
              )}>{profile.totalPoints}</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-amber-400 font-bold sm:hidden">
            {profile.totalPoints}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow overflow-y-auto p-6 sm:p-10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 xl:grid-cols-12 gap-8">
          
          {/* Left Column (Pet & Experiments) */}
          <div className="xl:col-span-8 space-y-8">
            {/* Pet Status Card */}
            <section className={cn(
              "relative overflow-hidden rounded-[2.5rem] border shadow-2xl p-8 sm:p-10 transition-colors duration-500",
              theme === 'dark' ? "bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700/50" : "bg-white border-slate-200"
            )}>
              <div className={cn(
                "absolute top-0 right-0 w-96 h-96 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none",
                theme === 'dark' ? "bg-emerald-500/5" : "bg-emerald-500/10"
              )} />
              
              <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-10">
                <div className="flex-shrink-0 relative">
                  <div className={cn(
                    "w-48 h-48 sm:w-56 sm:h-56 rounded-full border-8 flex items-center justify-center relative shadow-inner transition-colors",
                    theme === 'dark' ? "bg-slate-950/50 border-slate-800/50" : "bg-slate-50 border-slate-100"
                  )}>
                    <Pet petId={profile.petId} equipped={profile.equipped} size={160} />
                  </div>
                  {dailyRewardAvailable && (
                    <motion.button 
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={onClaimDaily}
                      className="absolute -bottom-2 -right-2 bg-amber-500 hover:bg-amber-400 text-white p-4 rounded-2xl shadow-xl shadow-amber-900/40 animate-bounce"
                    >
                      <Gift className="w-6 h-6" />
                    </motion.button>
                  )}
                </div>
                
                <div className="flex-grow w-full text-center md:text-left pt-4">
                  <div className="mb-8">
                    <h2 className={cn(
                      "text-4xl font-black mb-2 tracking-tight",
                      theme === 'dark' ? "text-white" : "text-slate-900"
                    )}>{profile.petName}</h2>
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                      <span className="text-[10px] text-emerald-400 font-black uppercase tracking-widest">
                        Level {Math.floor(profile.totalPoints / 500) + 1} Scientist
                      </span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-lg">
                    <div className={cn(
                      "p-5 rounded-3xl border transition-colors",
                      theme === 'dark' ? "bg-slate-950/30 border-slate-800/50" : "bg-slate-50 border-slate-100"
                    )}>
                      <div className="flex justify-between items-center mb-3">
                        <div className="flex items-center gap-2 text-[10px] font-black text-amber-500 uppercase tracking-widest">
                          <Zap className="w-4 h-4 fill-current" />
                          Energy
                        </div>
                        <span className="text-xs font-mono text-slate-400">{profile.petEnergy}%</span>
                      </div>
                      <div className={cn(
                        "h-2 rounded-full overflow-hidden",
                        theme === 'dark' ? "bg-slate-800" : "bg-slate-200"
                      )}>
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${profile.petEnergy}%` }}
                          className="h-full bg-gradient-to-r from-amber-600 to-amber-400" 
                        />
                      </div>
                      {profile.petEnergy < 30 && (
                        <button 
                          onClick={handleRecharge}
                          className={cn(
                            "mt-4 w-full py-2 text-[10px] font-black rounded-xl transition-colors uppercase tracking-widest",
                            theme === 'dark' ? "bg-slate-800 hover:bg-slate-700 text-white" : "bg-slate-200 hover:bg-slate-300 text-slate-900"
                          )}
                        >
                          Recharge System
                        </button>
                      )}
                    </div>
                    
                    <div className={cn(
                      "p-5 rounded-3xl border transition-colors",
                      theme === 'dark' ? "bg-slate-950/30 border-slate-800/50" : "bg-slate-50 border-slate-100"
                    )}>
                      <div className="flex justify-between items-center mb-3">
                        <div className="flex items-center gap-2 text-[10px] font-black text-rose-500 uppercase tracking-widest">
                          <Heart className="w-4 h-4 fill-current" />
                          Happiness
                        </div>
                        <span className="text-xs font-mono text-slate-400">{profile.petHappiness}%</span>
                      </div>
                      <div className={cn(
                        "h-2 rounded-full overflow-hidden",
                        theme === 'dark' ? "bg-slate-800" : "bg-slate-200"
                      )}>
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${profile.petHappiness}%` }}
                          className="h-full bg-gradient-to-r from-rose-600 to-rose-400" 
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4 mt-8">
                    <button 
                      onClick={handleFeed}
                      className="flex-1 bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-black py-4 rounded-2xl shadow-lg transition-all hover:scale-105 active:scale-95 uppercase tracking-tight text-sm"
                    >
                      Feed Pet
                    </button>
                    <button 
                      onClick={handlePlay}
                      className="flex-1 bg-sky-500 hover:bg-sky-400 text-white font-black py-4 rounded-2xl shadow-lg transition-all hover:scale-105 active:scale-95 uppercase tracking-tight text-sm"
                    >
                      Play Game
                    </button>
                  </div>
                </div>
              </div>
            </section>

            {/* Experiments Grid */}
            <section>
              <div className="flex items-center justify-between mb-8 px-2">
                <h3 className={cn(
                  "text-2xl font-black tracking-tight",
                  theme === 'dark' ? "text-white" : "text-slate-900"
                )}>Active Experiments</h3>
                <div className={cn(
                  "h-px flex-grow mx-6",
                  theme === 'dark' ? "bg-slate-800" : "bg-slate-200"
                )} />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.values(EXPERIMENTS).map(exp => {
                  const progress = profile.experimentProgress[exp.id] || { knowledge: false, training: false, challenge: false };
                  const isCompleted = progress.challenge;
                  const completedStages = (progress.knowledge ? 1 : 0) + (progress.training ? 1 : 0) + (progress.challenge ? 1 : 0);
                  
                  return (
                    <motion.div
                      key={exp.id}
                      whileHover={{ y: -5 }}
                      onClick={() => onOpenExperiment(exp.id)}
                      className={cn(
                        "group relative overflow-hidden rounded-[2rem] p-1 border cursor-pointer transition-all duration-300",
                        theme === 'dark' 
                          ? (isCompleted ? "bg-slate-800/50 border-emerald-500/30" : "bg-slate-800/50 border-slate-700/50 hover:border-sky-500/50")
                          : (isCompleted ? "bg-white border-emerald-200" : "bg-white border-slate-200 hover:border-sky-300")
                      )}
                    >
                      <div className={cn(
                        "rounded-[1.8rem] p-6 h-full flex flex-col relative z-10",
                        theme === 'dark' ? "bg-slate-900/80" : "bg-white"
                      )}>
                        <div className="flex justify-between items-start mb-6">
                          <div className={cn(
                            "w-14 h-14 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500",
                            theme === 'dark' ? "bg-slate-800 text-sky-400" : "bg-slate-100 text-sky-600"
                          )}>
                            <FlaskConical className="w-8 h-8" />
                          </div>
                          {isCompleted ? (
                            <div className="bg-emerald-500 text-slate-900 text-[10px] font-black px-3 py-1 rounded-full shadow-lg shadow-emerald-500/20 uppercase tracking-widest">
                              Mastered
                            </div>
                          ) : (
                            <div className="text-slate-500">
                              <ChevronRight className="w-5 h-5" />
                            </div>
                          )}
                        </div>
                        
                        <h4 className={cn(
                          "text-xl font-bold mb-2",
                          theme === 'dark' ? "text-white" : "text-slate-900"
                        )}>{exp.title}</h4>
                        <p className={cn(
                          "text-sm mb-6 flex-grow line-clamp-2 leading-relaxed",
                          theme === 'dark' ? "text-slate-400" : "text-slate-600"
                        )}>
                          {exp.description}
                        </p>
                        
                        <div className="mt-auto">
                          <div className="flex justify-between text-[10px] font-black text-slate-500 mb-2 uppercase tracking-widest">
                            <span>Progress</span>
                            <span>{completedStages} / 3</span>
                          </div>
                          <div className={cn(
                            "h-1.5 w-full rounded-full overflow-hidden",
                            theme === 'dark' ? "bg-slate-800" : "bg-slate-100"
                          )}>
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: `${(completedStages / 3) * 100}%` }}
                              className={cn(
                                "h-full transition-all duration-500",
                                isCompleted ? "bg-emerald-500" : "bg-sky-500"
                              )}
                            />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </section>
          </div>

          {/* Right Column (Quests) */}
          <div className="xl:col-span-4 space-y-8">
            <QuestWidget quests={profile.dailyQuests} onClaim={handleClaimQuest} theme={theme} />
            
            {/* Stats Summary */}
            <div className="bg-gradient-to-br from-indigo-600 to-violet-600 rounded-3xl p-8 text-white shadow-2xl shadow-indigo-900/20">
              <h4 className="text-lg font-bold mb-6 flex items-center gap-2">
                <Trophy className="w-5 h-5" />
                Achievements
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/10 rounded-2xl p-4 backdrop-blur-md">
                  <span className="block text-[10px] font-bold uppercase tracking-widest opacity-60 mb-1">Badges</span>
                  <span className="text-2xl font-black font-mono">{profile.badges.length}</span>
                </div>
                <div className="bg-white/10 rounded-2xl p-4 backdrop-blur-md">
                  <span className="block text-[10px] font-bold uppercase tracking-widest opacity-60 mb-1">Items</span>
                  <span className="text-2xl font-black font-mono">{profile.unlockedItems.length}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
