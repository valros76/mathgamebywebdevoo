import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { soundManager } from '../../services/audio/soundManager';
import { calculateStreakReward } from '../../engine/game/streakManager';
import { IconFlame, IconCoin, IconCheck, IconLock } from '../../components/icons/GameIcons';

interface DailyStreakModalProps {
  streakDays: number;
  bonusGold: number;
  onClose: () => void;
}

export const DailyStreakModal: React.FC<DailyStreakModalProps> = ({
  streakDays,
  bonusGold,
  onClose,
}) => {
  useEffect(() => {
    soundManager.playReward();
    try {
      confetti({
        particleCount: 60,
        spread: 65,
        origin: { y: 0.55 },
      });
    } catch {
      // Ignored if canvas unavailable
    }
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-3xl border-2 border-amber-500/50 bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-950 p-6 sm:p-7 shadow-2xl text-slate-100 text-center flex flex-col items-center">
        
        {/* Animated Flame Icon */}
        <div className="relative mb-3">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-500/30 to-orange-600/20 border border-amber-400/60 flex items-center justify-center shadow-xl shadow-amber-500/30 animate-pulse">
            <IconFlame className="w-10 h-10 text-orange-400" />
          </div>
          <span className="absolute -bottom-1 -right-1 bg-amber-500 text-slate-950 font-black text-xs px-2 py-0.5 rounded-full border border-amber-300 shadow">
            +{streakDays} j.
          </span>
        </div>

        {/* Title */}
        <h2 className="text-xl sm:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-200 font-serif tracking-wide mb-1">
          Série Quotidienne Activée !
        </h2>
        <p className="text-xs text-indigo-300 mb-4">
          Tu t'entraînes en mathématiques avec persévérance et régularité !
        </p>

        {/* Bonus Reward Badge */}
        <div className="w-full rounded-2xl bg-indigo-950/70 border border-amber-500/40 p-4 mb-5 shadow-inner">
          <span className="text-xs text-slate-400 block mb-1">Récompense du jour :</span>
          <div className="flex items-center justify-center gap-2">
            <span className="text-2xl font-black text-yellow-400 font-mono">+{bonusGold} Or Royal</span>
            <IconCoin className="w-6 h-6 text-yellow-400" />
          </div>
          <p className="text-[11px] text-amber-300/90 mt-1">
            Reviens demain pour remporter <strong>+{calculateStreakReward(streakDays + 1)} Or</strong> !
          </p>
        </div>

        {/* 7-Day Streak Roadmap */}
        <div className="w-full mb-6">
          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2.5">
            Parcours de la semaine
          </p>
          <div className="grid grid-cols-7 gap-1.5">
            {[1, 2, 3, 4, 5, 6, 7].map((day) => {
              const isPast = day < streakDays;
              const isToday = day === streakDays;
              return (
                <div
                  key={day}
                  className={`flex flex-col items-center py-2 px-1 rounded-xl border text-[10px] font-bold transition ${
                    isToday
                      ? 'border-amber-400 bg-amber-500/20 text-amber-300 ring-2 ring-amber-400/50 shadow-md shadow-amber-500/20 scale-105'
                      : isPast
                      ? 'border-emerald-700/60 bg-emerald-950/40 text-emerald-400'
                      : 'border-slate-800 bg-slate-900/50 text-slate-500'
                  }`}
                >
                  <span>J{day}</span>
                  <div className="h-4 flex items-center justify-center mt-0.5">
                    {isPast ? (
                      <IconCheck className="w-3.5 h-3.5 text-emerald-400" />
                    ) : isToday ? (
                      <IconFlame className="w-3.5 h-3.5 text-amber-400" />
                    ) : (
                      <IconLock className="w-3.5 h-3.5 text-slate-500" />
                    )}
                  </div>
                  <span className="text-[9px] font-mono text-slate-400 mt-1">
                    +{calculateStreakReward(day)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Claim Button */}
        <button
          onClick={() => {
            soundManager.playClick();
            onClose();
          }}
          className="w-full py-3 rounded-xl font-bold bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 shadow-lg shadow-amber-950/50 transition cursor-pointer text-sm font-serif"
        >
          Encaisser l'Or et Jouer ! ⚔️
        </button>
      </div>
    </div>
  );
};
