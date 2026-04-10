import React from 'react';
import { motion } from 'motion/react';
import { 
  Palette, 
  ShoppingBag, 
  CheckCircle2, 
  Lock,
  Sparkles,
  Zap,
  Heart
} from 'lucide-react';
import { UserProfile } from '../types';
import { CUSTOMIZATIONS } from '../constants';
import { Pet } from './Pet';
import { cn } from '../lib/utils';

interface LabModalProps {
  profile: UserProfile;
  onUpdateProfile: (updater: (p: UserProfile) => UserProfile) => void;
  playSound: (sound: string, note: string) => void;
  theme: 'dark' | 'light';
}

export const LabModal: React.FC<LabModalProps> = ({ profile, onUpdateProfile, playSound, theme }) => {
  const handleItemAction = (type: 'color' | 'accessory' | 'item', action: 'unlock' | 'equip' | 'buy', item: any) => {
    if (action === 'unlock' || action === 'buy') {
      if (profile.totalPoints >= item.cost) {
        playSound('purchase', 'A5');
        onUpdateProfile(p => {
          const updatedProfile = { ...p, totalPoints: p.totalPoints - item.cost };
          if (type === 'color' || type === 'accessory') {
            updatedProfile.unlockedItems = [...p.unlockedItems, item.id];
            updatedProfile.equipped = { ...p.equipped, [type]: item.id };
          }
          if (type === 'item') {
            if (item.id === 'battery') updatedProfile.petEnergy = Math.min(100, p.petEnergy + 50);
            if (item.id === 'treat') updatedProfile.petHappiness = Math.min(100, p.petHappiness + 30);
          }
          return updatedProfile;
        });
      }
    } else if (action === 'equip') {
      playSound('click', 'G4');
      onUpdateProfile(p => ({ ...p, equipped: { ...p.equipped, [type]: item.id } }));
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
      {/* Preview Section */}
      <div className="lg:col-span-4 space-y-8">
        <div className={cn(
          "rounded-[2.5rem] p-10 border flex flex-col items-center sticky top-0 shadow-2xl transition-colors",
          theme === 'dark' ? "bg-slate-800/50 border-slate-700" : "bg-white border-slate-200"
        )}>
          <h3 className={cn(
            "text-xl font-black mb-8 uppercase tracking-tight",
            theme === 'dark' ? "text-white" : "text-slate-900"
          )}>Pet Preview</h3>
          <div className={cn(
            "w-full aspect-square rounded-full flex items-center justify-center border-8 mb-8 shadow-inner",
            theme === 'dark' ? "bg-slate-950/50 border-slate-800/50" : "bg-slate-50 border-slate-100"
          )}>
            <Pet petId={profile.petId} equipped={profile.equipped} size={200} />
          </div>
          <div className="text-center w-full">
            <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-2">Available EXP</p>
            <div className={cn(
              "text-3xl font-black text-amber-400 py-4 rounded-2xl border font-mono",
              theme === 'dark' ? "bg-slate-900 border-slate-700" : "bg-white border-slate-200"
            )}>
              {profile.totalPoints}
            </div>
          </div>
        </div>
      </div>

      {/* Shop Section */}
      <div className="lg:col-span-8 space-y-12">
        {/* Colors */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-emerald-500/10 rounded-xl text-emerald-400">
              <Palette className="w-5 h-5" />
            </div>
            <h4 className={cn(
              "font-black text-lg uppercase tracking-tight",
              theme === 'dark' ? "text-white" : "text-slate-900"
            )}>Nano-Coating Colors</h4>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {CUSTOMIZATIONS.colors.map(color => {
              const isUnlocked = profile.unlockedItems.includes(color.id);
              const isEquipped = profile.equipped.color === color.id;
              const canAfford = profile.totalPoints >= color.cost;

              return (
                <motion.div 
                  key={color.id}
                  whileHover={{ y: -2 }}
                  className={cn(
                    "p-5 rounded-3xl border transition-all duration-300 flex flex-col items-center gap-4",
                    isEquipped 
                      ? "bg-emerald-500/10 border-emerald-500/50 ring-2 ring-emerald-500/20" 
                      : (theme === 'dark' ? "bg-slate-800/50 border-slate-700/50 hover:bg-slate-800" : "bg-white border-slate-200 hover:bg-slate-50")
                  )}
                >
                  <div className="w-12 h-12 rounded-2xl shadow-xl border-4 border-slate-900/50" style={{ backgroundColor: color.value }} />
                  {isEquipped ? (
                    <div className="w-full py-2 text-[10px] font-black text-emerald-500 bg-emerald-500/10 rounded-xl text-center uppercase tracking-widest">Active</div>
                  ) : isUnlocked ? (
                    <button 
                      onClick={() => handleItemAction('color', 'equip', color)}
                      className={cn(
                        "w-full py-2 text-[10px] font-black rounded-xl transition-colors uppercase tracking-widest",
                        theme === 'dark' ? "text-white bg-slate-700 hover:bg-slate-600" : "text-slate-900 bg-slate-200 hover:bg-slate-300"
                      )}
                    >
                      Equip
                    </button>
                  ) : (
                    <button 
                      onClick={() => handleItemAction('color', 'unlock', color)}
                      disabled={!canAfford}
                      className={cn(
                        "w-full py-2 text-[10px] font-black rounded-xl transition-all uppercase tracking-widest flex items-center justify-center gap-2",
                        canAfford ? "bg-sky-600 hover:bg-sky-500 text-white shadow-lg shadow-sky-900/40" : (theme === 'dark' ? "bg-slate-800 text-slate-600" : "bg-slate-100 text-slate-400")
                      )}
                    >
                      {!canAfford && <Lock className="w-3 h-3" />}
                      {color.cost} XP
                    </button>
                  )}
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* Accessories */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-sky-500/10 rounded-xl text-sky-400">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <h4 className={cn(
              "font-black text-lg uppercase tracking-tight",
              theme === 'dark' ? "text-white" : "text-slate-900"
            )}>Lab Equipment</h4>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {CUSTOMIZATIONS.accessories.map(acc => {
              const isUnlocked = profile.unlockedItems.includes(acc.id);
              const isEquipped = profile.equipped.accessory === acc.id;
              const canAfford = profile.totalPoints >= acc.cost;

              return (
                <motion.div 
                  key={acc.id}
                  whileHover={{ y: -2 }}
                  className={cn(
                    "p-5 rounded-3xl border transition-all duration-300 flex flex-col items-center justify-between gap-4 h-full",
                    isEquipped 
                      ? "bg-sky-500/10 border-sky-500/50 ring-2 ring-sky-500/20" 
                      : (theme === 'dark' ? "bg-slate-800/50 border-slate-700/50 hover:bg-slate-800" : "bg-white border-slate-200 hover:bg-slate-50")
                  )}
                >
                  <span className={cn(
                    "text-xs font-black text-center uppercase tracking-widest",
                    theme === 'dark' ? "text-white" : "text-slate-900"
                  )}>{acc.name}</span>
                  {isEquipped ? (
                    <div className="w-full py-2 text-[10px] font-black text-sky-500 bg-sky-500/10 rounded-xl text-center uppercase tracking-widest">Active</div>
                  ) : isUnlocked ? (
                    <button 
                      onClick={() => handleItemAction('accessory', 'equip', acc)}
                      className={cn(
                        "w-full py-2 text-[10px] font-black rounded-xl transition-colors uppercase tracking-widest",
                        theme === 'dark' ? "text-white bg-slate-700 hover:bg-slate-600" : "text-slate-900 bg-slate-200 hover:bg-slate-300"
                      )}
                    >
                      Equip
                    </button>
                  ) : (
                    <button 
                      onClick={() => handleItemAction('accessory', 'unlock', acc)}
                      disabled={!canAfford}
                      className={cn(
                        "w-full py-2 text-[10px] font-black rounded-xl transition-all uppercase tracking-widest flex items-center justify-center gap-2",
                        canAfford ? "bg-sky-600 hover:bg-sky-500 text-white shadow-lg shadow-sky-900/40" : (theme === 'dark' ? "bg-slate-800 text-slate-600" : "bg-slate-100 text-slate-400")
                      )}
                    >
                      {!canAfford && <Lock className="w-3 h-3" />}
                      {acc.cost} XP
                    </button>
                  )}
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* Consumables */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-amber-500/10 rounded-xl text-amber-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <h4 className={cn(
              "font-black text-lg uppercase tracking-tight",
              theme === 'dark' ? "text-white" : "text-slate-900"
            )}>Supplies</h4>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {CUSTOMIZATIONS.items.map(item => {
              const canAfford = profile.totalPoints >= item.cost;
              return (
                <div key={item.id} className={cn(
                  "p-6 rounded-[2rem] border transition-colors flex items-center justify-between gap-6",
                  theme === 'dark' ? "border-slate-700/50 bg-slate-800/50" : "border-slate-200 bg-white shadow-sm"
                )}>
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      "w-12 h-12 rounded-2xl flex items-center justify-center text-amber-500",
                      theme === 'dark' ? "bg-slate-900" : "bg-slate-50"
                    )}>
                      {item.id === 'battery' ? <Zap className="w-6 h-6 fill-current" /> : <Heart className="w-6 h-6 fill-current" />}
                    </div>
                    <div>
                      <h5 className={cn(
                        "text-sm font-black uppercase tracking-tight",
                        theme === 'dark' ? "text-white" : "text-slate-900"
                      )}>{item.name}</h5>
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">{item.description}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleItemAction('item', 'buy', item)}
                    disabled={!canAfford}
                    className={cn(
                      "px-6 py-3 text-[10px] font-black rounded-xl transition-all uppercase tracking-widest",
                      canAfford ? "bg-amber-500 hover:bg-amber-400 text-white shadow-lg shadow-amber-900/40" : (theme === 'dark' ? "bg-slate-800 text-slate-600" : "bg-slate-100 text-slate-400")
                    )}
                  >
                    {item.cost} XP
                  </button>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
};
