import React, { useState } from 'react';
import type { PlayerProfile } from '../../types';
import { GAME_ITEMS, ACHIEVEMENT_BADGES } from '../../engine/game/worldData';
import { soundManager } from '../../services/audio/soundManager';
import { IconBackpack, IconCoin, IconTrophy, ItemIconRenderer } from '../../components/icons/GameIcons';

interface InventoryModalProps {
  player: PlayerProfile;
  onUseItem?: (itemId: string) => void;
  onClose: () => void;
}

export const InventoryModal: React.FC<InventoryModalProps> = ({
  player,
  onUseItem,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'inventory' | 'badges'>('inventory');

  const allItems = Object.values(GAME_ITEMS);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-3 sm:p-5">
      <div className="relative w-full max-w-2xl max-h-[92dvh] sm:max-h-[88vh] flex flex-col rounded-3xl border-2 border-amber-500/50 bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-950 shadow-2xl text-slate-100 overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-indigo-900/60 p-4 sm:p-5 shrink-0 bg-slate-900/90 z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-amber-950/70 border border-amber-500/60 flex items-center justify-center">
              <IconBackpack className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-amber-300 font-serif">
                Besace d'Aventurier & Médailles
              </h2>
              <p className="text-xs text-indigo-300 flex items-center gap-1">
                Or royal : <span className="text-yellow-400 font-bold">{player.gold}</span>
                <IconCoin className="w-3.5 h-3.5 text-yellow-400" />
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Fermer l'inventaire"
            className="rounded-xl p-2 text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 min-h-0">
          {/* Tab Switcher */}
          <div className="flex gap-2 border-b border-indigo-900/40 pb-2.5 shrink-0">
            <button
              onClick={() => {
                soundManager.playClick();
                setActiveTab('inventory');
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition cursor-pointer ${
                activeTab === 'inventory'
                  ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800'
              }`}
            >
              Objets & Reliques ({allItems.length})
            </button>
            <button
              onClick={() => {
                soundManager.playClick();
                setActiveTab('badges');
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition cursor-pointer ${
                activeTab === 'badges'
                  ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800'
              }`}
            >
              Badges des 6 Compétences ({ACHIEVEMENT_BADGES.length})
            </button>
          </div>

          {/* Scrollable Items or Badges content */}
          {activeTab === 'inventory' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {allItems.map((item) => (
                <div
                  key={item.id}
                  className="rounded-2xl border border-indigo-800/70 bg-slate-950/70 p-3.5 flex flex-col justify-between gap-2.5 hover:border-amber-400/50 transition"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-xl bg-indigo-950 border border-indigo-700/60 flex items-center justify-center shrink-0">
                      <ItemIconRenderer iconKey={item.icon} className="w-7 h-7 text-amber-300" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-100">{item.name}</h4>
                      <span className="text-[10px] uppercase font-semibold tracking-wider text-amber-400">
                        {item.rarity} • {item.type}
                      </span>
                      <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
                    <span className="text-emerald-400 text-[11px] font-medium">
                      {item.effectDescription}
                    </span>
                    {item.type === 'consumable' && onUseItem && (
                      <button
                        onClick={() => onUseItem(item.id)}
                        className="px-3 py-1 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs transition cursor-pointer"
                      >
                        Utiliser
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'badges' && (
            <div className="space-y-3">
              <p className="text-xs text-slate-300 leading-relaxed">
                Les 6 compétences mathématiques fondamentales travaillées dans MathGame :
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {ACHIEVEMENT_BADGES.map((badge) => (
                  <div
                    key={badge.id}
                    className="rounded-2xl border border-amber-500/30 bg-slate-950/70 p-3.5 flex items-start gap-3"
                  >
                    <div className="w-11 h-11 rounded-xl bg-amber-950/50 border border-amber-500/50 flex items-center justify-center shrink-0 shadow-sm shadow-amber-950/50">
                      <IconTrophy className="w-6 h-6 text-amber-300" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-amber-300">{badge.title}</h4>
                      <span className="text-[10px] text-indigo-300 font-mono uppercase block mb-1">
                        Compétence : {badge.competence}
                      </span>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        {badge.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-indigo-900/60 p-4 sm:p-5 shrink-0 bg-slate-950/90 flex items-center justify-end z-10">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl border border-slate-800 bg-slate-900 text-slate-300 hover:text-white text-xs font-bold transition cursor-pointer"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};
