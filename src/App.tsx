import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  FlaskConical, 
  Settings, 
  Volume2, 
  VolumeX, 
  Moon, 
  Sun, 
  RotateCcw,
  BookOpen,
  ShoppingBag,
  X,
  CheckCircle2
} from 'lucide-react';
import { UserProfile, PetId } from './types';
import { EXPERIMENTS, QUEST_TEMPLATES, PET_INFO } from './constants';
import { Dashboard } from './components/Dashboard';
import { ExperimentModal } from './components/ExperimentModal';
import { LabModal } from './components/LabModal';
import { EncyclopediaModal } from './components/EncyclopediaModal';
import { Pet } from './components/Pet';
import { SidebarButton } from './components/SidebarButton';
import { ModalWrapper } from './components/ModalWrapper';
import { useLocalStorageState } from './hooks/useLocalStorage';
import { useTheme } from './hooks/useTheme';
import { useSoundEngine, SoundType } from './hooks/useSoundEngine';
import { cn } from './lib/utils';

const DEFAULT_PROFILE: UserProfile = {
  petName: null,
  petId: null,
  totalPoints: 0,
  petEnergy: 100,
  petHappiness: 100,
  lastLogin: null,
  experimentProgress: {},
  badges: [],
  unlockedItems: ['default', 'none'],
  equipped: { color: 'default', accessory: 'none' },
  dailyQuests: [],
  lastQuestGenerationDate: null
};

export default function App() {
  const [screen, setScreen] = useState<'splash' | 'creation' | 'dashboard'>('splash');
  const [profile, setProfile] = useLocalStorageState<UserProfile>('stemPetLabProfile', DEFAULT_PROFILE);
  const [soundEnabled, setSoundEnabled] = useLocalStorageState<boolean>('stemPetLabSoundEnabled', true);
  const { theme, setTheme } = useTheme();
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [activeModal, setActiveModal] = useState<'experiment' | 'petlab' | 'stempedia' | 'settings' | null>(null);
  const [currentExperimentId, setCurrentExperimentId] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [dailyRewardAvailable, setDailyRewardAvailable] = useState(false);

  const { init: initSoundEngine, play: playEngineSound } = useSoundEngine();
  const playSound = useCallback((sound: SoundType, note: string) => {
    playEngineSound(sound, note, soundEnabled);
  }, [playEngineSound, soundEnabled]);

  const themeClasses = useMemo(
    () => cn(
      'min-h-screen w-full overflow-hidden font-sans transition-colors duration-500',
      theme,
      theme === 'dark' ? 'bg-[#0f172a] text-white' : 'bg-slate-50 text-slate-900'
    ),
    [theme]
  );

  const isProfileCreated = Boolean(profile.petName && profile.petId);

  // Pet Stats Decay
  useEffect(() => {
    if (screen !== 'dashboard') return;
    
    const interval = setInterval(() => {
      setProfile(p => ({
        ...p,
        petEnergy: Math.max(0, p.petEnergy - 1),
        petHappiness: Math.max(0, p.petHappiness - 1)
      }));
    }, 60000); // Every minute

    return () => clearInterval(interval);
  }, [screen, setProfile]);

  useEffect(() => {
    const today = new Date().toDateString();
    setDailyRewardAvailable(profile.lastLogin !== today);

    setProfile((previous) => {
      const initial = { ...DEFAULT_PROFILE, ...previous };
      const nextProfile = { ...initial };

      if (initial.lastQuestGenerationDate !== today || initial.dailyQuests.length === 0) {
        const shuffled = [...QUEST_TEMPLATES].sort(() => Math.random() - 0.5);
        nextProfile.dailyQuests = shuffled.slice(0, 3).map(q => ({ ...q, progress: 0, claimed: false }));
        nextProfile.lastQuestGenerationDate = today;
      }

      return nextProfile;
    });

    setIsLoaded(true);
  }, []);

  const updateQuestProgress = useCallback((type: string, amount: number = 1) => {
    setProfile(p => ({
      ...p,
      dailyQuests: p.dailyQuests.map(q => 
        q.type === type ? { ...q, progress: q.progress + amount } : q
      )
    }));
  }, []);

  const handleStart = async () => {
    await initSoundEngine();
    playSound('click', 'C4');
    setScreen(isProfileCreated ? 'dashboard' : 'creation');
  };

  const handleReset = () => {
    if (confirm('Reset all progress? This cannot be undone.')) {
      setProfile(DEFAULT_PROFILE);
      setSoundEnabled(true);
      setTheme('dark');
      setScreen('splash');
      setActiveModal(null);
      setSidebarOpen(false);
      setDailyRewardAvailable(false);
    }
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white" role="status" aria-live="polite">
        Loading your STEM lab…
      </div>
    );
  }

  return (
    <div className={themeClasses}>
      <AnimatePresence mode="wait">
        {screen === 'splash' && (
          <motion.div 
            key="splash"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={cn(
              "absolute inset-0 flex flex-col items-center justify-center p-6 text-center",
              theme === 'dark' ? "bg-[#0f172a]" : "bg-slate-50"
            )}
          >
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px] animate-pulse" />
              <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-sky-500/10 rounded-full blur-[120px] animate-pulse delay-700" />
            </div>

            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, type: "spring" }}
              className="relative z-10"
            >
              <div className="flex justify-center gap-8 mb-12">
                <Pet petId="bioBlob" equipped={{ color: 'default', accessory: 'none' }} size={100} />
                <Pet petId="astroCritter" equipped={{ color: 'violet', accessory: 'beanie' }} size={100} />
              </div>
              <h1 className={cn(
                "text-6xl sm:text-8xl font-black mb-6 tracking-tighter",
                theme === 'dark' ? "text-white" : "text-slate-900"
              )}>
                STEM <span className="text-emerald-400">PET</span> LAB
              </h1>
              <p className={cn(
                "max-w-xl mx-auto text-lg sm:text-xl leading-relaxed mb-12 font-medium",
                theme === 'dark' ? "text-slate-400" : "text-slate-600"
              )}>
                Adopt a digital companion, master science experiments, and build your own high-tech laboratory!
              </p>
              <button 
                onClick={handleStart}
                className={cn(
                  "group relative font-black py-6 px-16 rounded-[2rem] text-2xl shadow-2xl transition-all hover:scale-105 active:scale-95 overflow-hidden",
                  theme === 'dark' ? "bg-white text-slate-950 shadow-white/10" : "bg-slate-900 text-white shadow-slate-900/10"
                )}
              >
                <span className="relative z-10 uppercase tracking-tight">Enter Laboratory</span>
                <div className={cn(
                  "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity",
                  theme === 'dark' ? "bg-gradient-to-r from-emerald-200 to-sky-200" : "bg-gradient-to-r from-emerald-500 to-sky-500"
                )} />
              </button>
            </motion.div>
          </motion.div>
        )}

        {screen === 'creation' && (
          <PetCreationScreen 
            key="creation"
            profile={profile}
            onConfirm={() => setScreen('dashboard')}
            onUpdate={setProfile}
            playSound={playSound}
            theme={theme}
          />
        )}

        {screen === 'dashboard' && (
          <div key="dashboard" className="h-full flex">
            {/* Desktop Sidebar */}
            <aside className={cn(
              "hidden lg:flex flex-col w-80 border-r p-8 transition-colors duration-500",
              theme === 'dark' ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"
            )}>
              <div className="flex items-center gap-3 mb-12">
                <div className="w-10 h-10 bg-emerald-500 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
                  <FlaskConical className="w-6 h-6 text-white" />
                </div>
                <h2 className={cn(
                  "text-xl font-black tracking-tight uppercase",
                  theme === 'dark' ? "text-white" : "text-slate-900"
                )}>Lab Menu</h2>
              </div>
              
              <nav className="space-y-3">
                <SidebarButton 
                  icon={ShoppingBag} 
                  label="Pet Laboratory" 
                  onClick={() => setActiveModal('petlab')} 
                  color="text-purple-400"
                  theme={theme}
                />
                <SidebarButton 
                  icon={BookOpen} 
                  label="Encyclopedia" 
                  onClick={() => setActiveModal('stempedia')} 
                  color="text-sky-400"
                  theme={theme}
                />
                <SidebarButton 
                  icon={Settings} 
                  label="Settings" 
                  onClick={() => setActiveModal('settings')} 
                  color="text-slate-400"
                  theme={theme}
                />
              </nav>

              <div className={cn(
                "mt-auto pt-8 border-t",
                theme === 'dark' ? "border-slate-800" : "border-slate-200"
              )}>
                <div className={cn(
                  "rounded-3xl p-6 border",
                  theme === 'dark' ? "bg-slate-800/50 border-slate-700/50" : "bg-slate-100 border-slate-200"
                )}>
                  <div className="flex items-center gap-4 mb-4">
                    <Pet petId={profile.petId} equipped={profile.equipped} size={48} />
                    <div>
                      <p className={cn(
                        "text-xs font-black uppercase tracking-tight",
                        theme === 'dark' ? "text-white" : "text-slate-900"
                      )}>{profile.petName}</p>
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Active Partner</p>
                    </div>
                  </div>
                  <button 
                    onClick={handleReset}
                    className="w-full py-3 text-[10px] font-black text-rose-400 hover:bg-rose-500/10 rounded-xl transition-colors uppercase tracking-widest flex items-center justify-center gap-2"
                  >
                    <RotateCcw className="w-3 h-3" />
                    Reset Data
                  </button>
                </div>
              </div>
            </aside>

            {/* Main Content */}
            <div className="flex-grow h-full relative">
              <Dashboard 
                profile={profile}
                onOpenExperiment={(id) => { setCurrentExperimentId(id); setActiveModal('experiment'); }}
                onOpenSidebar={() => setSidebarOpen(true)}
                onUpdateProfile={setProfile}
                dailyRewardAvailable={dailyRewardAvailable}
                onClaimDaily={() => {
                  setDailyRewardAvailable(false);
                  setProfile(p => ({ ...p, totalPoints: p.totalPoints + 50, lastLogin: new Date().toDateString() }));
                  playSound('purchase', 'A5');
                }}
                theme={theme}
                playSound={playSound}
              />
            </div>

            {/* Mobile Sidebar */}
            <AnimatePresence>
              {isSidebarOpen && (
                <div className="fixed inset-0 z-40 lg:hidden">
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
                    onClick={() => setSidebarOpen(false)}
                  />
                  <motion.aside 
                    initial={{ x: '-100%' }}
                    animate={{ x: 0 }}
                    exit={{ x: '-100%' }}
                    transition={{ type: "spring", damping: 25, stiffness: 200 }}
                    className={cn(
                      "absolute left-0 top-0 bottom-0 w-80 shadow-2xl flex flex-col p-8 transition-colors duration-500",
                      theme === 'dark' ? "bg-slate-900" : "bg-white"
                    )}
                  >
                    <div className="flex items-center justify-between mb-12">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-emerald-500 rounded-2xl flex items-center justify-center">
                          <FlaskConical className="w-6 h-6 text-white" />
                        </div>
                        <h2 className={cn(
                          "text-xl font-black tracking-tight uppercase",
                          theme === 'dark' ? "text-white" : "text-slate-900"
                        )}>Lab Menu</h2>
                      </div>
                      <button onClick={() => setSidebarOpen(false)} className="p-2 text-slate-500">
                        <X className="w-6 h-6" />
                      </button>
                    </div>
                    
                    <nav className="space-y-3">
                      <SidebarButton 
                        icon={ShoppingBag} 
                        label="Pet Laboratory" 
                        onClick={() => { setActiveModal('petlab'); setSidebarOpen(false); }} 
                        color="text-purple-400"
                        theme={theme}
                      />
                      <SidebarButton 
                        icon={BookOpen} 
                        label="Encyclopedia" 
                        onClick={() => { setActiveModal('stempedia'); setSidebarOpen(false); }} 
                        color="text-sky-400"
                        theme={theme}
                      />
                      <SidebarButton 
                        icon={Settings} 
                        label="Settings" 
                        onClick={() => { setActiveModal('settings'); setSidebarOpen(false); }} 
                        color="text-slate-400"
                        theme={theme}
                      />
                    </nav>

                    <div className={cn(
                      "mt-auto pt-8 border-t",
                      theme === 'dark' ? "border-slate-800" : "border-slate-200"
                    )}>
                      <button 
                        onClick={handleReset}
                        className="w-full py-3 text-[10px] font-black text-rose-400 hover:bg-rose-500/10 rounded-xl transition-colors uppercase tracking-widest flex items-center justify-center gap-2"
                      >
                        <RotateCcw className="w-3 h-3" />
                        Reset Data
                      </button>
                    </div>
                  </motion.aside>
                </div>
              )}
            </AnimatePresence>

            {/* Modals */}
            <AnimatePresence>
              {activeModal === 'experiment' && currentExperimentId && (
                <ExperimentModal 
                  experiment={EXPERIMENTS[currentExperimentId]}
                  profile={profile}
                  onClose={() => setActiveModal(null)}
                  onUpdateProfile={setProfile}
                  onComplete={(stars, points) => {
                    playSound('correct', 'G5');
                    updateQuestProgress('complete', 1);
                    updateQuestProgress('points', points);
                    if (stars === 3) updateQuestProgress('perfect_score', 1);
                  }}
                  playSound={playSound}
                  onFlipCard={() => updateQuestProgress('study', 1)}
                  theme={theme}
                />
              )}
              {activeModal === 'petlab' && (
                <ModalWrapper title="Pet Laboratory" icon={ShoppingBag} onClose={() => setActiveModal(null)} theme={theme}>
                  <LabModal profile={profile} onUpdateProfile={setProfile} playSound={playSound} theme={theme} />
                </ModalWrapper>
              )}
              {activeModal === 'stempedia' && (
                <ModalWrapper title="STEM Encyclopedia" icon={BookOpen} onClose={() => setActiveModal(null)} theme={theme}>
                  <EncyclopediaModal theme={theme} />
                </ModalWrapper>
              )}
              {activeModal === 'settings' && (
                <ModalWrapper title="Lab Settings" icon={Settings} onClose={() => setActiveModal(null)} theme={theme}>
                  <div className="space-y-8 max-w-md mx-auto py-8">
                    <div className={cn(
                      "flex items-center justify-between p-6 rounded-3xl border transition-colors",
                      theme === 'dark' ? "bg-slate-800/50 border-slate-700" : "bg-slate-100 border-slate-200"
                    )}>
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-slate-900 rounded-2xl text-sky-400">
                          {theme === 'dark' ? <Moon className="w-6 h-6" /> : <Sun className="w-6 h-6" />}
                        </div>
                        <span className={cn("font-bold", theme === 'dark' ? "text-white" : "text-slate-900")}>Interface Theme</span>
                      </div>
                      <button 
                        onClick={() => setTheme(t => t === 'dark' ? 'light' : 'dark')}
                        className="px-6 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-xl text-xs font-black uppercase tracking-widest"
                      >
                        {theme.toUpperCase()}
                      </button>
                    </div>
                    <div className={cn(
                      "flex items-center justify-between p-6 rounded-3xl border transition-colors",
                      theme === 'dark' ? "bg-slate-800/50 border-slate-700" : "bg-slate-100 border-slate-200"
                    )}>
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-slate-900 rounded-2xl text-emerald-400">
                          {soundEnabled ? <Volume2 className="w-6 h-6" /> : <VolumeX className="w-6 h-6" />}
                        </div>
                        <span className={cn("font-bold", theme === 'dark' ? "text-white" : "text-slate-900")}>Audio Effects</span>
                      </div>
                      <button 
                        onClick={() => setSoundEnabled(!soundEnabled)}
                        className={cn(
                          "px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest",
                          soundEnabled ? "bg-emerald-500 text-slate-900" : "bg-slate-700 text-white"
                        )}
                      >
                        {soundEnabled ? 'ON' : 'OFF'}
                      </button>
                    </div>
                  </div>
                </ModalWrapper>
              )}
            </AnimatePresence>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

const PetCreationScreen = ({ profile, onConfirm, onUpdate, playSound, theme }: any) => {
  const [name, setName] = useState('');
  const [selectedId, setSelectedId] = useState<PetId | null>(null);

  const handleConfirm = () => {
    if (!selectedId || !name.trim()) return;
    playSound('click', 'G4');
    onUpdate((p: UserProfile) => ({ ...p, petId: selectedId, petName: name.trim() }));
    onConfirm();
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={cn(
        "absolute inset-0 flex flex-col items-center justify-center p-8 overflow-y-auto transition-colors duration-500",
        theme === 'dark' ? "bg-[#0f172a]" : "bg-slate-50"
      )}
    >
      <div className={cn(
        "w-full max-w-4xl backdrop-blur-2xl rounded-[3rem] border shadow-2xl p-10 sm:p-16 transition-colors",
        theme === 'dark' ? "bg-slate-900/40 border-slate-800/50" : "bg-white border-slate-200"
      )}>
        <h1 className={cn(
          "text-4xl sm:text-5xl font-black text-center mb-16 tracking-tighter",
          theme === 'dark' ? "text-white" : "text-slate-900"
        )}>DESIGN YOUR PARTNER</h1>
        
        <div className="mb-16">
          <h2 className="text-xs uppercase tracking-[0.3em] text-emerald-400 font-black mb-8 text-center">1. Select Species</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {PET_INFO.map(pet => (
              <button
                key={pet.id}
                onClick={() => { setSelectedId(pet.id); playSound('click', 'E4'); }}
                className={cn(
                  "relative flex flex-col items-center p-6 rounded-[2rem] transition-all duration-500 border-2",
                  selectedId === pet.id 
                    ? (theme === 'dark' ? "bg-slate-800 border-emerald-500 shadow-2xl shadow-emerald-500/20 scale-105" : "bg-emerald-50 border-emerald-500 shadow-2xl shadow-emerald-500/10 scale-105")
                    : (theme === 'dark' ? "bg-slate-800/30 border-transparent hover:bg-slate-800 hover:border-slate-700" : "bg-slate-100 border-transparent hover:bg-slate-200 hover:border-slate-300")
                )}
              >
                <Pet petId={pet.id} equipped={{ color: 'default', accessory: 'none' }} size={100} />
                <span className={cn(
                  "mt-6 font-black text-sm uppercase tracking-tight",
                  theme === 'dark' ? "text-white" : "text-slate-900"
                )}>{pet.name}</span>
                {selectedId === pet.id && (
                  <div className="absolute -top-3 -right-3 bg-emerald-500 text-slate-950 p-1.5 rounded-full shadow-lg">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col items-center mb-16">
          <h2 className="text-xs uppercase tracking-[0.3em] text-emerald-400 font-black mb-8">2. Name Your Pet</h2>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={12}
            className={cn(
              "w-full max-w-md border-4 rounded-[2rem] px-8 py-6 text-center text-3xl font-black placeholder-slate-400 focus:border-emerald-500 focus:ring-8 focus:ring-emerald-500/10 outline-none transition-all tracking-tight",
              theme === 'dark' ? "bg-slate-800/50 border-slate-800 text-white" : "bg-slate-100 border-slate-200 text-slate-900"
            )}
            placeholder="ENTER NAME"
          />
        </div>

        <div className="text-center">
          <button 
            onClick={handleConfirm}
            disabled={!selectedId || !name.trim()}
            className="w-full max-w-md bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black py-6 rounded-[2rem] text-2xl shadow-2xl shadow-emerald-500/20 disabled:opacity-20 disabled:grayscale transition-all hover:scale-105 active:scale-95 uppercase tracking-tight"
          >
            Initialize System
          </button>
        </div>
      </div>
    </motion.div>
  );
};
