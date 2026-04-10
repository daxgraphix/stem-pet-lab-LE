import React from 'react';
import { Book, Leaf, Cpu, Magnet, FlaskConical, Mountain, Bot } from 'lucide-react';
import { EXPERIMENTS } from '../constants';
import { cn } from '../lib/utils';

const IconMap: Record<string, any> = {
  Leaf,
  Cpu,
  Magnet,
  FlaskConical,
  Mountain,
  Bot
};

export const EncyclopediaModal: React.FC<{ theme: 'dark' | 'light' }> = ({ theme }) => {
  return (
    <div className="space-y-8">
      <div className={cn(
        "border rounded-[2rem] p-8 mb-8 transition-colors",
        theme === 'dark' ? "bg-sky-500/10 border-sky-500/20" : "bg-sky-50 border-sky-100"
      )}>
        <div className="flex items-center gap-4 mb-4">
          <div className="p-3 bg-sky-500 rounded-2xl shadow-lg shadow-sky-500/20">
            <Book className="w-8 h-8 text-white" />
          </div>
          <h3 className={cn(
            "text-2xl font-black tracking-tight uppercase",
            theme === 'dark' ? "text-white" : "text-slate-900"
          )}>Scientist's Handbook</h3>
        </div>
        <p className={cn(
          "leading-relaxed font-medium",
          theme === 'dark' ? "text-slate-400" : "text-slate-600"
        )}>
          Welcome to the Stempedia! Here you can review all the scientific terms and concepts you've discovered during your experiments. Knowledge is power!
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {Object.values(EXPERIMENTS).map(exp => {
          const Icon = IconMap[exp.icon] || FlaskConical;
          return (
            <div key={exp.id} className={cn(
              "border rounded-[2.5rem] overflow-hidden shadow-xl transition-colors",
              theme === 'dark' ? "bg-slate-800/50 border-slate-700/50" : "bg-white border-slate-200"
            )}>
              <div className={cn(
                "p-6 font-black text-lg flex items-center gap-4 border-b transition-colors",
                theme === 'dark' ? "bg-slate-800 border-slate-700/50" : "bg-slate-50 border-slate-200"
              )}>
                <div className={cn(
                  "p-2 rounded-xl text-sky-400 shadow-sm",
                  theme === 'dark' ? "bg-slate-900" : "bg-white"
                )}>
                  <Icon className="w-6 h-6" />
                </div>
                <span className={cn(
                  "uppercase tracking-tight",
                  theme === 'dark' ? "text-white" : "text-slate-900"
                )}>{exp.title}</span>
              </div>
              <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                {exp.training.flashcards.map(card => (
                  <div key={card.term} className={cn(
                    "p-6 rounded-2xl border transition-colors shadow-sm",
                    theme === 'dark' ? "bg-slate-900/50 border-slate-800 hover:border-sky-500/50" : "bg-white border-slate-100 hover:border-sky-300"
                  )}>
                    <p className="text-emerald-400 font-black text-[10px] mb-2 uppercase tracking-widest">{card.term}</p>
                    <p className={cn(
                      "text-sm leading-relaxed font-medium",
                      theme === 'dark' ? "text-slate-300" : "text-slate-700"
                    )}>{card.definition}</p>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
