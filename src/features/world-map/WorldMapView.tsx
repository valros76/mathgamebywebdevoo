import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import type { PlayerProfile, ZoneData, Quest, QuestState, SchoolGrade } from '../../types';
import { GAME_ZONES, GAME_QUESTS } from '../../engine/game/worldData';
import { soundManager } from '../../services/audio/soundManager';
import { db } from '../../services/persistence/db';
import { saveManager } from '../../services/persistence/saveManager';
import { AvatarRenderer } from '../../components/avatar/AvatarRenderer';
import {
  IconCompass,
  IconBook,
  IconCastle,
  IconSword,
  IconLock,
  IconScroll,
  IconCoin,
  IconD20,
  IconCheck,
  IconTrophy,
  IconSparkles,
  IconFlame,
} from '../../components/icons/GameIcons';

interface WorldMapViewProps {
  player: PlayerProfile;
  onSelectQuest: (quest: Quest) => void;
  onOpenTutorial: (tutorialId: string) => void;
  onRestartGameNewGamePlus?: () => void;
}

export const WorldMapView: React.FC<WorldMapViewProps> = ({
  player,
  onSelectQuest,
  onOpenTutorial,
  onRestartGameNewGamePlus,
}) => {
  // Filter zones matching player's current grade
  const currentWorldZones = GAME_ZONES.filter((z) => z.grades.includes(player.grade));
  const [selectedZone, setSelectedZone] = useState<ZoneData>(() => {
    return currentWorldZones.find((z) => z.id === player.currentZoneId) || currentWorldZones[0];
  });

  useEffect(() => {
    const zones = GAME_ZONES.filter((z) => z.grades.includes(player.grade));
    if (zones.length > 0 && !zones.some((z) => z.id === selectedZone.id)) {
      setSelectedZone(zones[0]);
    }
  }, [player.grade]);
  const [completedQuestIds, setCompletedQuestIds] = useState<Set<string>>(new Set());

  // Load quest completion states from IndexedDB
  useEffect(() => {
    async function loadQuestStates() {
      try {
        const records = await db.questStates.where('profileId').equals(player.id).toArray();
        const completed = new Set(records.filter((r) => r.isCompleted).map((r) => r.questId));
        setCompletedQuestIds(completed);
      } catch (err) {
        console.warn('Erreur chargement états de quête:', err);
      }
    }
    loadQuestStates();
  }, [player.id, player.updatedAt]);

  const handleZoneClick = (zone: ZoneData) => {
    soundManager.playClick();
    setSelectedZone(zone);
  };

  const GRADE_ORDER: SchoolGrade[] = ['CP', 'CE1', 'CE2', 'CM1', 'CM2', '6e', '5e', '4e', '3e'];
  const currentGradeIdx = GRADE_ORDER.indexOf(player.grade);
  const nextGrade = currentGradeIdx >= 0 && currentGradeIdx < GRADE_ORDER.length - 1 ? GRADE_ORDER[currentGradeIdx + 1] : null;

  const handleAdvanceGrade = async () => {
    if (!nextGrade) return;
    soundManager.playReward();
    confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });

    const isNextCollege = ['6e', '5e', '4e', '3e'].includes(nextGrade);
    const updated: PlayerProfile = {
      ...player,
      grade: nextGrade,
      world: isNextCollege ? 'college' : 'primaire',
      level: player.level + 1,
      xp: player.xp + 500,
      gold: player.gold + 200,
      updatedAt: Date.now(),
    };
    await db.profiles.put(updated);
    saveManager.stageProfile(updated);
    saveManager.markDirty(true);
    window.location.reload();
  };

  const mapScrollRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.pageX - (mapScrollRef.current?.offsetLeft || 0));
    setScrollLeft(mapScrollRef.current?.scrollLeft || 0);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - (mapScrollRef.current?.offsetLeft || 0);
    const walk = (x - startX) * 1.5;
    if (mapScrollRef.current) {
      mapScrollRef.current.scrollLeft = scrollLeft - walk;
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Quests belonging to this player's grade across the current world
  const allPlayerGradeQuests = GAME_QUESTS.filter(
    (q) => q.grade === player.grade
  );
  const isAllQuestsCompleted =
    allPlayerGradeQuests.length > 0 &&
    allPlayerGradeQuests.every((q) => completedQuestIds.has(q.id));

  // Quêtes disponibles pour la zone sélectionnée
  const availableQuestsForZone = GAME_QUESTS.filter(
    (q) => q.zoneId === selectedZone.id && q.grade === player.grade
  );

  return (
    <div className="relative w-full flex flex-col gap-4">
      {/* Top Banner with World Title & Narrative Context */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-slate-900/80 border border-indigo-900/60 p-3.5 sm:p-4 rounded-2xl backdrop-blur-md">
        <div>
          <div className="flex items-center gap-2">
            <IconCompass className="w-5 h-5 text-amber-400" />
            <h2 className="text-base sm:text-lg font-bold text-amber-300 font-serif">
              {player.world === 'primaire' ? 'Monde des Fondations' : 'Royaume des Savoirs'}
            </h2>
            <span className="text-xs bg-indigo-950/80 border border-indigo-700/60 text-indigo-300 px-2 py-0.5 rounded-full font-semibold">
              Classe : {player.grade}
            </span>
            {player.prestigeLevel && player.prestigeLevel > 0 && (
              <span className="text-[10px] bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black px-2 py-0.5 rounded-full shadow">
                Prestige ★{player.prestigeLevel}
              </span>
            )}
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Sélectionne un territoire sur la carte pour accomplir des quêtes mathématiques et débloquer des reliques.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={() => {
              const tutId = player.world === 'primaire' ? 'tut_cp_complement10' : 'tut_5e_relatifs';
              onOpenTutorial(tutId);
            }}
            className="px-3 py-1.5 rounded-lg border border-purple-600/60 bg-purple-950/40 hover:bg-purple-900/50 text-purple-200 text-xs font-medium flex items-center gap-1.5 transition cursor-pointer shadow-sm"
          >
            <IconBook className="w-4 h-4 text-purple-300" />
            <span>Grimoire Pédagogique</span>
          </button>
        </div>
      </div>

      {/* SPECIAL ENDGAME SCREEN: IF ALL GRADE QUESTS ARE COMPLETED */}
      {isAllQuestsCompleted && (
        <div className="rounded-3xl border-2 border-amber-400 bg-gradient-to-r from-amber-950/90 via-purple-950/90 to-slate-950/90 p-5 sm:p-6 shadow-2xl relative overflow-hidden animate-in fade-in slide-in-from-top-4">
          <div className="flex flex-col sm:flex-row items-center gap-5 justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-amber-500/20 border-2 border-amber-400 flex items-center justify-center shrink-0 shadow-lg shadow-amber-500/30">
                <IconTrophy className="w-10 h-10 text-amber-300 animate-pulse" />
              </div>
              <div>
                <span className="text-xs uppercase font-mono tracking-wider text-amber-400 font-bold">
                  Triomphe Absolu du Royaume
                </span>
                <h3 className="text-lg sm:text-xl font-black text-amber-200 font-serif">
                  Félicitations, Maître {player.name} !
                </h3>
                <p className="text-xs text-slate-300 max-w-xl mt-1 leading-relaxed">
                  Tu as accompli avec succès toutes les quêtes et vaincu tous les gardiens du programme de {player.grade} ! Le royaume mathématique célèbre ta maîtrise exceptionnelle.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-2.5 w-full sm:w-auto">
              {nextGrade && (
                <button
                  onClick={handleAdvanceGrade}
                  className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-slate-950 font-black text-xs sm:text-sm shadow-xl shadow-emerald-500/30 transition transform hover:scale-105 cursor-pointer flex items-center justify-center gap-2 shrink-0 border border-emerald-300"
                >
                  <IconSparkles className="w-5 h-5 text-slate-950" />
                  <span>Passer en classe supérieure ({nextGrade}) ➔</span>
                </button>
              )}

              {onRestartGameNewGamePlus && (
                <button
                  onClick={() => {
                    soundManager.playReward();
                    onRestartGameNewGamePlus();
                  }}
                  className="w-full sm:w-auto px-4 py-3 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs sm:text-sm shadow-xl shadow-amber-500/30 transition transform hover:scale-105 cursor-pointer flex items-center justify-center gap-2 shrink-0 border border-amber-300"
                >
                  <IconSparkles className="w-4 h-4 text-slate-950" />
                  <span>New Game+ Prestige</span>
                </button>
              )}
            </div>
          </div>
          <p className="text-[11px] text-amber-300/80 mt-3 pt-3 border-t border-amber-500/30 flex items-center gap-1.5">
            <span>✨</span>
            <span>Le New Game+ réinitialise les quêtes pour un nouveau défi et débloque le <strong>Manteau Céleste d'Archimage Suprême</strong> et la <strong>Couronne Royale des Étoiles Pures</strong> dans ta Garde-Robe !</span>
          </p>
        </div>
      )}

      {/* Mobile-Friendly Horizontal Swipeable Zone Selector Strip */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1.5 scrollbar-none shrink-0">
        {currentWorldZones.map((zone) => {
          const isSelected = selectedZone.id === zone.id;
          const isZoneLocked = player.level < zone.requiredLevel;
          return (
            <button
              key={`strip_${zone.id}`}
              onClick={() => handleZoneClick(zone)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 shrink-0 border cursor-pointer ${
                isSelected
                  ? 'bg-amber-500 text-slate-950 border-amber-300 shadow-md scale-105'
                  : isZoneLocked
                  ? 'bg-slate-900/80 text-slate-500 border-slate-800 opacity-80'
                  : 'bg-slate-900/90 text-cyan-300 border-cyan-800/80 hover:border-amber-400'
              }`}
            >
              {isZoneLocked ? <IconLock className="w-3.5 h-3.5" /> : <IconCastle className="w-3.5 h-3.5" />}
              <span>{zone.name}</span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-950/60">
                Niv. {zone.requiredLevel}
              </span>
            </button>
          );
        })}
      </div>

      {/* Horizontal Straight-Line Scrollable Map with Drag-to-Scroll */}
      <div
        ref={mapScrollRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        className="relative w-full overflow-x-auto scrollbar-thin scrollbar-thumb-amber-500/50 scrollbar-track-slate-900 rounded-3xl border-2 border-amber-500/30 shadow-2xl bg-slate-950 p-6 sm:p-8 cursor-grab active:cursor-grabbing select-none"
      >
        <div className="relative min-w-[750px] sm:min-w-[950px] h-[240px] sm:h-[280px] flex items-center justify-between px-8">
          {/* Horizontal Golden Path / Ley Line */}
          <div className="absolute top-1/2 left-8 right-8 h-1 -translate-y-1/2 bg-gradient-to-r from-amber-500/40 via-amber-300 to-amber-500/40 rounded-full" />

          {currentWorldZones.map((zone) => {
            const isSelected = selectedZone.id === zone.id;
            const isZoneLocked = player.level < zone.requiredLevel;

            return (
              <div
                key={zone.id}
                onClick={(e) => {
                  e.stopPropagation();
                  handleZoneClick(zone);
                }}
                className="relative z-10 flex flex-col items-center group cursor-pointer transition-transform duration-300 hover:scale-110"
              >
                {/* Zone Node Pin */}
                <div
                  className={`relative w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center shadow-xl border-2 transition-all duration-300 ${
                    isSelected
                      ? 'border-amber-400 bg-gradient-to-br from-amber-500 to-amber-700 text-slate-950 scale-110 ring-4 ring-amber-400/40 shadow-amber-500/50'
                      : isZoneLocked
                      ? 'border-slate-700 bg-slate-900/90 text-slate-500 opacity-75'
                      : 'border-cyan-400/80 bg-slate-900/90 text-cyan-300 hover:border-amber-300 shadow-cyan-900/40'
                  }`}
                >
                  {isZoneLocked ? (
                    <IconLock className="w-6 h-6 text-slate-400" />
                  ) : isSelected ? (
                    <IconSword className="w-7 h-7 text-slate-950" />
                  ) : (
                    <IconCastle className="w-7 h-7 text-cyan-300" />
                  )}

                  {isSelected && (
                    <span className="absolute -inset-1 rounded-2xl bg-amber-400/20 animate-ping pointer-events-none" />
                  )}
                </div>

                {/* Hero Avatar Position Pin — Dynamic Follow on Selected Zone with Player Name */}
                {isSelected && (
                  <div className="absolute -top-10 bg-indigo-900/95 border border-amber-400 text-amber-300 text-[10px] font-bold px-2.5 py-1 rounded-full shadow-lg flex items-center gap-1.5 animate-bounce z-25">
                    <AvatarRenderer customization={player.customization} heroClass={player.heroClass} size="xs" />
                    <span className="max-w-[80px] truncate">{player.name}</span>
                  </div>
                )}

                {/* Node Label Card */}
                <div className="mt-3 px-3 py-1.5 rounded-xl bg-slate-950/90 border border-indigo-800/80 text-center shadow-lg backdrop-blur-sm pointer-events-none transition group-hover:border-amber-400 min-w-[130px]">
                  <p className="text-xs font-bold text-slate-100 whitespace-nowrap">
                    {zone.name}
                  </p>
                  <p className="text-[10px] text-amber-400/90 font-mono mt-0.5">
                    {isZoneLocked ? `Niv. ${zone.requiredLevel} requis` : `Niv. ${zone.requiredLevel}+`}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Zone Overview & Quests Drawer */}
      <div className="rounded-2xl border border-amber-500/30 bg-gradient-to-b from-slate-900/95 to-indigo-950/95 p-4 sm:p-5 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-indigo-900/60 pb-3 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <IconCastle className="w-6 h-6 text-amber-300" />
              <div>
                <h3 className="text-base sm:text-lg font-bold text-amber-300 font-serif">
                  {selectedZone.name}
                </h3>
                <p className="text-xs text-indigo-300">{selectedZone.subtitle}</p>
              </div>
            </div>
            <p className="text-xs text-slate-300 mt-2 max-w-2xl leading-relaxed">
              {selectedZone.description}
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <span className="text-xs text-slate-400">Classes cibles :</span>
            <div className="flex gap-1">
              {selectedZone.grades.map((g) => (
                <span
                  key={g}
                  className={`px-2 py-0.5 rounded text-[11px] font-semibold border ${
                    g === player.grade
                      ? 'border-amber-400 bg-amber-950/60 text-amber-300'
                      : 'border-slate-700 bg-slate-800/80 text-slate-400'
                  }`}
                >
                  {g}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Quests Available in this Zone */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-2.5 flex items-center gap-1.5">
            <IconScroll className="w-4 h-4 text-amber-400" />
            <span>Quêtes disponibles dans cette contrée :</span>
          </h4>

          {availableQuestsForZone.length === 0 ? (
            <div className="p-4 rounded-xl border border-dashed border-slate-800 bg-slate-950/50 text-center text-xs text-slate-400">
              Aucune quête active pour le niveau {player.grade} dans cette zone. Explore les autres régions sur la carte !
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {availableQuestsForZone.map((quest) => {
                const isCompleted = completedQuestIds.has(quest.id);

                // Sequential Locking Logic:
                // If the quest requires a previous quest, that previous quest MUST be completed
                let isSequentialLocked = false;
                let lockReason = '';

                if (quest.requiredPreviousQuestId && !completedQuestIds.has(quest.requiredPreviousQuestId)) {
                  const prevQuest = GAME_QUESTS.find((q) => q.id === quest.requiredPreviousQuestId);
                  isSequentialLocked = true;
                  lockReason = prevQuest ? `Termine d'abord : ${prevQuest.title}` : 'Quête précédente non accomplie';
                } else if (player.level < quest.requiredLevel) {
                  isSequentialLocked = true;
                  lockReason = `Niveau ${quest.requiredLevel} requis`;
                }

                return (
                  <div
                    key={quest.id}
                    className={`rounded-xl border p-3.5 flex flex-col justify-between gap-3 transition ${
                      isCompleted
                        ? 'border-emerald-500/50 bg-emerald-950/20'
                        : isSequentialLocked
                        ? 'border-slate-800 bg-slate-950/50 opacity-75'
                        : 'border-indigo-800/70 bg-slate-950/70 hover:border-amber-400/60'
                    }`}
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <div className="flex items-center gap-1.5 min-w-0">
                          {isCompleted ? (
                            <IconCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                          ) : isSequentialLocked ? (
                            <IconLock className="w-4 h-4 text-slate-500 shrink-0" />
                          ) : (
                            <IconSword className="w-4 h-4 text-amber-400 shrink-0" />
                          )}
                          <h5 className={`text-sm font-bold truncate ${isCompleted ? 'text-emerald-300' : 'text-slate-100'}`}>
                            {quest.title}
                          </h5>
                        </div>

                        {isCompleted ? (
                          <span className="text-[10px] font-mono text-emerald-300 border border-emerald-600/60 bg-emerald-950/60 px-2 py-0.5 rounded flex items-center gap-1 shrink-0">
                            <span>Sceau Royal</span>
                            <span>✨</span>
                          </span>
                        ) : (
                          <span className="text-[10px] font-mono text-emerald-400 border border-emerald-800/50 bg-emerald-950/30 px-2 py-0.5 rounded shrink-0">
                            +{quest.xpReward} XP
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-slate-300 leading-relaxed mb-2">
                        {quest.description}
                      </p>

                      <div className="text-[11px] text-indigo-300 flex items-center gap-2">
                        <span>Gardien : {quest.bossEnemy?.name || 'Gardien'}</span>
                        <span>•</span>
                        <span className="text-yellow-400">+{quest.goldReward} Or</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
                      <span className="text-[10px] text-slate-400">
                        {isCompleted
                          ? 'Complétée avec succès'
                          : isSequentialLocked
                          ? lockReason
                          : `Niveau requis : ${quest.requiredLevel}`}
                      </span>

                      {isCompleted ? (
                        <div
                          title="Cette quête a déjà été accomplie et son trésor a été récolté."
                          className="px-3 py-1.5 rounded-lg font-bold text-xs bg-emerald-950/60 text-emerald-400 border border-emerald-700/60 flex items-center gap-1.5 select-none"
                        >
                          <IconCheck className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Accomplie (Non répétable)</span>
                        </div>
                      ) : isSequentialLocked ? (
                        <div
                          title={lockReason}
                          className="px-3 py-1.5 rounded-lg font-bold text-xs bg-slate-900 text-slate-500 border border-slate-800 flex items-center gap-1.5 select-none"
                        >
                          <IconLock className="w-3.5 h-3.5 text-slate-500" />
                          <span>Verrouillée</span>
                        </div>
                      ) : (
                        <button
                          onClick={() => {
                            soundManager.playClick();
                            onSelectQuest(quest);
                          }}
                          className="px-4 py-2 rounded-lg font-bold text-xs bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-slate-950 shadow-md transition cursor-pointer flex items-center gap-1.5"
                        >
                          <span>Partir en Quête</span>
                          <span>⚔️</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Next Zone Advancement Button below the Quests List */}
        {(() => {
          const isZoneAllCompleted = availableQuestsForZone.length > 0 && availableQuestsForZone.every((q) => completedQuestIds.has(q.id));
          const currentZoneIdx = currentWorldZones.findIndex((z) => z.id === selectedZone.id);
          const nextZ = currentZoneIdx >= 0 && currentZoneIdx < currentWorldZones.length - 1 ? currentWorldZones[currentZoneIdx + 1] : null;

          if (isZoneAllCompleted && nextZ) {
            return (
              <div className="mt-4 pt-3 border-t border-indigo-900/60 flex items-center justify-between gap-3 bg-emerald-950/30 p-3 rounded-2xl border border-emerald-500/40">
                <div className="flex items-center gap-2">
                  <span className="text-base">✨</span>
                  <p className="text-xs font-bold text-emerald-300">Territoire entièrement maîtrisé !</p>
                </div>
                <button
                  onClick={() => {
                    soundManager.playClick();
                    setSelectedZone(nextZ);
                  }}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md transition cursor-pointer shrink-0"
                >
                  <span>Niveau suivant</span>
                  <span>➔</span>
                </button>
              </div>
            );
          }
          return null;
        })()}
      </div>
    </div>
  );
};

