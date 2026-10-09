import React, { useState, useMemo } from 'react';
import confetti from 'canvas-confetti';
import type { PlayerProfile, Quest, Exercise, InventoryItem } from '../../types';
import { getUniqueExerciseForBattle, updateMastery } from '../../engine/pedagogy/exerciseGenerator';
import { getNotionById } from '../../engine/pedagogy/curriculum';
import { soundManager } from '../../services/audio/soundManager';
import { saveManager } from '../../services/persistence/saveManager';
import { db } from '../../services/persistence/db';
import { getThreeDeterministicStageRewards } from '../../engine/game/rewardManager';
import { InteractiveTutorialModal } from '../../components/tutorials/InteractiveTutorialModal';
import { BattleParticlesCanvas } from '../../components/effects/BattleParticlesCanvas';
import {
  IconSword,
  IconShield,
  IconPotion,
  IconBook,
  IconCoin,
  IconTrophy,
  IconD20,
  IconWardrobe,
  IconSparkles,
  ItemIconRenderer,
} from '../../components/icons/GameIcons';

interface MathBattleModalProps {
  quest: Quest;
  player: PlayerProfile;
  onVictory: (updatedPlayer: PlayerProfile) => void;
  onOpenWardrobe?: (updatedPlayer: PlayerProfile) => void;
  onClose: () => void;
}

export const MathBattleModal: React.FC<MathBattleModalProps> = ({
  quest,
  player,
  onVictory,
  onOpenWardrobe,
  onClose,
}) => {
  const boss = quest.bossEnemy || {
    id: 'boss_default',
    name: 'Gardien Arithmétique',
    title: 'Sentinelle des Runes',
    avatarIcon: 'boss_gobelin_val',
    maxHp: 50,
    currentHp: 50,
    shield: 10,
    attackPower: 6,
    element: 'arcane',
    weaknessDomain: quest.domain,
    description: 'Une sentinelle mystique qui garde l\'accès au sanctuaire.',
  };

  const [monsterHp, setMonsterHp] = useState(boss.maxHp);
  const [playerHp, setPlayerHp] = useState(player.hp);
  const [playerMana, setPlayerMana] = useState(player.mana);
  const [exerciseIndex, setExerciseIndex] = useState(0);
  const [isVictory, setIsVictory] = useState(false);
  const [wonItems, setWonItems] = useState<InventoryItem[]>([]);
  const [latestUpdatedPlayer, setLatestUpdatedPlayer] = useState<PlayerProfile | null>(null);
  const [userNumericInput, setUserNumericInput] = useState('');
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [activeHintLevel, setActiveHintLevel] = useState(0); // 0 = none, 1, 2, 3
  const [showTutorial, setShowTutorial] = useState(false);
  const [combatLog, setCombatLog] = useState<string[]>([
    `Le duel commence contre ${boss.name} (${boss.title}) !`,
  ]);
  const [isShieldActive, setIsShieldActive] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState<{ text: string; isCorrect: boolean } | null>(null);
  const [particleTrigger, setParticleTrigger] = useState<'success' | 'victory' | 'attack' | null>(null);
  const [askedExerciseIds, setAskedExerciseIds] = useState<string[]>([]);

  // Notion and Exercise — Strict Zero Duplicate Guarantee
  const activeNotionId = quest.notionIds[0] || 'cp_additions_visuelles';
  const currentNotion = getNotionById(activeNotionId);
  const exercise: Exercise = useMemo(() => {
    return getUniqueExerciseForBattle(activeNotionId, askedExerciseIds, exerciseIndex);
  }, [activeNotionId, askedExerciseIds, exerciseIndex]);

  const addCombatLog = (msg: string) => {
    setCombatLog((prev) => [msg, ...prev.slice(0, 4)]);
  };

  const handleUseManaHint = () => {
    if (playerMana < 15 && activeHintLevel === 0) {
      addCombatLog('Pas assez de Mana pour invoquer un indice magique !');
      soundManager.playError();
      return;
    }
    soundManager.playClick();
    setPlayerMana((prev) => Math.max(0, prev - 15));
    setActiveHintLevel((prev) => Math.min(3, prev + 1));
    addCombatLog(`Indice arcanique de niveau ${Math.min(3, activeHintLevel + 1)} révélé !`);
  };

  const handleActivateShield = () => {
    soundManager.playClick();
    setIsShieldActive(true);
    addCombatLog('Bouclier Géométrique activé ! La riposte ennemie sera absorbée.');
  };

  const checkAnswer = () => {
    let isCorrect = false;

    if (exercise.type === 'numeric') {
      const parsed = parseFloat(userNumericInput.trim().replace(',', '.'));
      if (exercise.correctNumericAnswer !== undefined) {
        const tolerance = exercise.tolerance || 0.001;
        isCorrect = Math.abs(parsed - exercise.correctNumericAnswer) <= tolerance;
      }
    } else if (exercise.type === 'multiple_choice') {
      const chosen = exercise.options?.find((o) => o.id === selectedOptionId);
      isCorrect = chosen?.isCorrect ?? false;
    }

    // Update pedagogical mastery
    const updatedMastery = updateMastery(
      undefined,
      activeNotionId,
      player.grade,
      isCorrect,
      activeHintLevel
    );
    saveManager.stageMastery(updatedMastery, false);

    if (isCorrect) {
      soundManager.playSuccess();
      soundManager.playAttack();
      setParticleTrigger('success');

      const dmg = 25 + Math.floor(Math.random() * 10);
      const newMonsterHp = Math.max(0, monsterHp - dmg);
      setMonsterHp(newMonsterHp);
      setFeedbackMessage({ text: `Réponse exacte ! Sortilège lancé : ${dmg} dégâts infligés !`, isCorrect: true });
      addCombatLog(`Coup critique ! Tu infliges ${dmg} dégâts à ${boss.name} !`);

      if (newMonsterHp === 0) {
        triggerVictory();
        return;
      }

      // Next question preparation
      const currentExId = exercise.id;
      setTimeout(() => {
        setAskedExerciseIds((prev) => (prev.includes(currentExId) ? prev : [...prev, currentExId]));
        setExerciseIndex((prev) => prev + 1);
        setUserNumericInput('');
        setSelectedOptionId(null);
        setActiveHintLevel(0);
        setFeedbackMessage(null);
      }, 1400);
    } else {
      soundManager.playError();
      setFeedbackMessage({
        text: 'Ce n\'est pas la réponse attendue. Utilise l\'indice pour progresser pas-à-pas !',
        isCorrect: false,
      });

      // Monster counter-attacks politely
      const rawMonsterDmg = boss.attackPower;
      const actualDmg = isShieldActive ? Math.floor(rawMonsterDmg * 0.3) : rawMonsterDmg;
      setIsShieldActive(false);

      const newHp = Math.max(5, playerHp - actualDmg);
      setPlayerHp(newHp);
      addCombatLog(
        isShieldActive
          ? `Ton bouclier a absorbé la riposte de ${boss.name} (${actualDmg} dégâts subis).`
          : `${boss.name} riposte et inflige ${actualDmg} points de dégâts.`
      );

      // Offer hint 1 automatically on first mistake
      if (activeHintLevel === 0) {
        setActiveHintLevel(1);
      }
    }
  };

  const triggerVictory = async () => {
    setIsVictory(true);
    soundManager.playReward();
    soundManager.playLevelUp();
    setParticleTrigger('victory');

    try {
      // Salve féérique 1 : Explosion centrale dorée et améthyste
      confetti({
        particleCount: 80,
        spread: 90,
        origin: { y: 0.5 },
        colors: ['#f59e0b', '#c084fc', '#38bdf8', '#fbbf24', '#e879f9'],
      });

      // Salve féérique 2 (légèrement différée) : Pluie d'étoiles
      setTimeout(() => {
        try {
          confetti({
            particleCount: 50,
            angle: 60,
            spread: 60,
            origin: { x: 0.2, y: 0.6 },
            colors: ['#f59e0b', '#34d399', '#60a5fa', '#fef08a'],
          });
          confetti({
            particleCount: 50,
            angle: 120,
            spread: 60,
            origin: { x: 0.8, y: 0.6 },
            colors: ['#f59e0b', '#a855f7', '#38bdf8', '#fef08a'],
          });
        } catch {
          // Ignore
        }
      }, 350);
    } catch {
      // Ignored if canvas fails
    }

    addCombatLog(`VICTOIRE ! ${boss.name} a été vaincu !`);

    // Reward player with XP, Gold and state updates
    const newXp = player.xp + quest.xpReward;
    const newGold = player.gold + quest.goldReward;
    let newLevel = player.level;
    let nextXpCap = player.xpToNextLevel;

    if (newXp >= nextXpCap) {
      newLevel += 1;
      nextXpCap = Math.floor(nextXpCap * 1.5);
    }

    const updatedPlayer: PlayerProfile = {
      ...player,
      xp: newXp,
      gold: newGold,
      level: newLevel,
      xpToNextLevel: nextXpCap,
      hp: Math.min(player.maxHp, playerHp + 20),
      mana: Math.min(player.maxMana, playerMana + 30),
      updatedAt: Date.now(),
    };

    setLatestUpdatedPlayer(updatedPlayer);
    saveManager.stageProfile(updatedPlayer);
    saveManager.stageQuestState(
      {
        profileId: player.id,
        questId: quest.id,
        isCompleted: true,
        progressPercent: 100,
        completedAt: Date.now(),
      },
      true // Milestone
    );

    // DETERMINISTIC REWARD SYSTEM: EXACTLY THREE NEW UNIQUE ITEMS WITHOUT DUPLICATES
    try {
      const ownedRecords = await db.inventory.where('profileId').equals(player.id).toArray();
      const ownedIds = ownedRecords.map((r) => r.itemId);
      const stageRewards = getThreeDeterministicStageRewards(quest.id, ownedIds);
      setWonItems(stageRewards);

      for (const item of stageRewards) {
        saveManager.stageInventory({
          id: `inv_${player.id}_${item.id}`,
          profileId: player.id,
          itemId: item.id,
          quantity: 1,
          acquiredAt: Date.now(),
        });
      }
    } catch (err) {
      console.warn('Erreur attribution récompenses:', err);
    }

    if (quest.badgeRewardId) {
      saveManager.stageAchievement({
        id: quest.badgeRewardId,
        title: `Badge ${quest.domain}`,
        description: `Victoire lors de la quête : ${quest.title}`,
        competence: exercise.competence,
        icon: 'trophy',
        unlockedAt: Date.now(),
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-md p-2 sm:p-4">
      {/* Container constrained to 98% of viewport height so it fits 100% inside screen */}
      <div className="relative w-full max-w-3xl max-h-[96dvh] h-full sm:h-auto rounded-3xl border-2 border-amber-500/50 bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-950 p-3.5 sm:p-5 shadow-2xl text-slate-100 flex flex-col justify-between overflow-hidden">
        
        {/* Particle Canvas Effect Layer */}
        <BattleParticlesCanvas
          triggerType={particleTrigger}
          onFinished={() => setParticleTrigger(null)}
        />

        {/* Battle Arena Header */}
        <div className="flex items-center justify-between border-b border-indigo-900/60 pb-2.5 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-purple-950/80 border border-purple-500/60 flex items-center justify-center shadow-md">
              <IconD20 className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-black text-amber-300 font-serif leading-tight">
                {boss.name} — <span className="text-xs font-normal text-indigo-300">{boss.title}</span>
              </h2>
              <div className="flex items-center gap-2 text-[11px] text-slate-400">
                <span>Quête : {quest.title}</span>
                <span>•</span>
                <span className="text-emerald-400 capitalize">Domaine : {quest.domain.replace('_', ' ')}</span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Fermer l'arène"
            className="rounded-xl p-2 text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Health & Status Bars */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 my-2 shrink-0">
          {/* Monster Bar */}
          <div className="rounded-xl border border-rose-900/60 bg-slate-950/80 p-2.5">
            <div className="flex justify-between text-xs mb-1">
              <span className="font-bold text-rose-300 flex items-center gap-1.5">
                <IconSword className="w-3.5 h-3.5 text-rose-400" />
                {boss.name}
              </span>
              <span className="font-mono text-rose-400 font-semibold">{monsterHp} / {boss.maxHp} HP</span>
            </div>
            <div className="h-2.5 w-full bg-slate-900 rounded-full overflow-hidden border border-rose-950">
              <div
                className="h-full bg-gradient-to-r from-rose-600 via-rose-500 to-amber-500 transition-all duration-300"
                style={{ width: `${(monsterHp / boss.maxHp) * 100}%` }}
              />
            </div>
          </div>

          {/* Player Bar */}
          <div className="rounded-xl border border-indigo-800/60 bg-slate-950/80 p-2.5">
            <div className="flex justify-between text-xs mb-1">
              <span className="font-bold text-cyan-300 flex items-center gap-1.5">
                <IconShield className="w-3.5 h-3.5 text-cyan-400" />
                {player.name} (Niv. {player.level})
              </span>
              <span className="font-mono text-cyan-400 font-semibold">{playerHp} HP • {playerMana} Mana</span>
            </div>
            <div className="h-2.5 w-full bg-slate-900 rounded-full overflow-hidden mb-1 border border-indigo-950">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-cyan-400 transition-all duration-300"
                style={{ width: `${(playerHp / player.maxHp) * 100}%` }}
              />
            </div>
            <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 to-purple-400 transition-all duration-300"
                style={{ width: `${(playerMana / player.maxMana) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Victory Screen OR Active Combat Exercise */}
        <div className="flex-1 overflow-y-auto pr-1">
          {isVictory ? (
            <div className="rounded-2xl border-2 border-amber-500/70 bg-gradient-to-b from-amber-950/40 via-indigo-950/60 to-slate-950 p-4 sm:p-5 text-center animate-in zoom-in-95 duration-200">
              <div className="w-14 h-14 mx-auto mb-2 rounded-2xl bg-amber-500/20 border border-amber-400 flex items-center justify-center text-3xl shadow-lg shadow-amber-500/20">
                <IconTrophy className="w-8 h-8 text-amber-300" />
              </div>
              <h3 className="text-lg sm:text-xl font-black text-amber-300 font-serif mb-1">
                Félicitations, {player.name} !
              </h3>
              <p className="text-xs font-medium text-amber-200/90 mb-1">
                Tu as triomphé avec brio lors de cette épreuve mathématique !
              </p>
              <p className="text-xs text-slate-300 max-w-md mx-auto mb-3 italic">
                « {quest.narrativeOutro} »
              </p>

              {/* Badges XP / Or / Notion */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-w-md mx-auto mb-3.5 text-left text-xs">
                <div className="rounded-xl bg-indigo-950/70 border border-indigo-800/60 p-2">
                  <span className="text-slate-400 block text-[10px]">Expérience</span>
                  <span className="text-amber-300 font-bold text-xs sm:text-sm">+{quest.xpReward} XP</span>
                </div>
                <div className="rounded-xl bg-indigo-950/70 border border-indigo-800/60 p-2">
                  <span className="text-slate-400 block text-[10px]">Or royal</span>
                  <span className="text-yellow-400 font-bold text-xs sm:text-sm flex items-center gap-1">
                    +{quest.goldReward} <IconCoin className="w-3.5 h-3.5" />
                  </span>
                </div>
                <div className="rounded-xl bg-indigo-950/70 border border-indigo-800/60 p-2 col-span-2 sm:col-span-1">
                  <span className="text-slate-400 block text-[10px]">Apprentissage</span>
                  <span className="text-emerald-300 font-bold text-xs sm:text-sm">Notion Validée</span>
                </div>
              </div>

              {/* 3 DETERMINISTIC REWARDS WITH VISUAL CARDS WITHOUT DUPLICATES */}
              {wonItems.length > 0 && (
                <div className="mb-4 text-left max-w-lg mx-auto">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-amber-300 font-serif flex items-center gap-1.5">
                      <IconSparkles className="w-3.5 h-3.5 text-amber-400" />
                      3 Nouvelles Récompenses d'Étape Débloquées :
                    </span>
                    <span className="text-[10px] text-indigo-300 font-mono">Sans doublon</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {wonItems.map((item) => (
                      <div
                        key={item.id}
                        className="rounded-xl border border-amber-500/40 bg-slate-900/90 p-2.5 flex flex-col justify-between shadow-md"
                      >
                        <div className="flex items-center gap-2 mb-1.5">
                          <div className="w-8 h-8 rounded-lg bg-indigo-950/90 border border-indigo-700/60 flex items-center justify-center shrink-0">
                            <ItemIconRenderer iconKey={item.icon} className="w-5 h-5 text-amber-300" />
                          </div>
                          <div className="min-w-0">
                            <h4 className="text-xs font-bold text-slate-100 truncate" title={item.name}>
                              {item.name}
                            </h4>
                            <span className="text-[10px] uppercase font-mono px-1 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                              {item.rarity}
                            </span>
                          </div>
                        </div>
                        <p className="text-[10px] text-slate-400 line-clamp-2 leading-tight">
                          {item.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons: Wardrobe & Back to Adventure */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-2 pt-1">
                {onOpenWardrobe && (
                  <button
                    onClick={() => {
                      const finalPlayer = latestUpdatedPlayer || {
                        ...player,
                        xp: player.xp + quest.xpReward,
                        gold: player.gold + quest.goldReward,
                      };
                      onOpenWardrobe(finalPlayer);
                      onClose();
                    }}
                    className="w-full sm:w-auto px-4 py-2.5 rounded-xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-lg shadow-purple-950/50 transition cursor-pointer text-xs sm:text-sm font-serif flex items-center justify-center gap-1.5"
                  >
                    <IconWardrobe className="w-4 h-4 text-purple-200" />
                    <span>Garde-Robe : Essayer mes Récompenses</span>
                  </button>
                )}

                <button
                  onClick={() => {
                    const finalPlayer = latestUpdatedPlayer || {
                      ...player,
                      xp: player.xp + quest.xpReward,
                      gold: player.gold + quest.goldReward,
                    };
                    onVictory(finalPlayer);
                    onClose();
                  }}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl font-bold bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-slate-950 shadow-lg shadow-amber-950/50 transition cursor-pointer text-xs sm:text-sm font-serif"
                >
                  Retour à l'Aventure
                </button>
              </div>
            </div>
          ) : (
            /* Active Challenge Box */
            <div className="rounded-2xl border border-indigo-800/70 bg-slate-950/80 p-3 sm:p-4 flex flex-col gap-3">
              <div>
                <div className="flex items-center justify-between text-[11px] text-indigo-300 mb-1">
                  <span className="font-semibold text-amber-200">Notion : {currentNotion?.title}</span>
                  <span className="font-mono text-purple-300 uppercase">Compétence : {exercise.competence}</span>
                </div>
                <p className="text-xs text-slate-400 italic mb-1.5 leading-relaxed">
                  « {exercise.storyContext} »
                </p>
                <h4 className="text-sm sm:text-base font-bold text-slate-100 leading-snug">
                  {exercise.question}
                </h4>
              </div>

              {/* Input Form based on Exercise Type */}
              {exercise.type === 'numeric' && (
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
                  <input
                    type="number"
                    inputMode="decimal"
                    step="any"
                    value={userNumericInput}
                    onChange={(e) => setUserNumericInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && userNumericInput && checkAnswer()}
                    placeholder="Inscris ta réponse..."
                    className="w-full sm:w-60 rounded-xl border border-indigo-700 bg-slate-900 px-3.5 py-2 text-base text-amber-300 font-mono focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-400/30"
                  />
                  <button
                    onClick={checkAnswer}
                    disabled={!userNumericInput}
                    className={`px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition cursor-pointer flex items-center justify-center gap-1.5 ${
                      userNumericInput
                        ? 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-slate-950 shadow-md'
                        : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                    }`}
                  >
                    <IconSword className="w-4 h-4" />
                    <span>Lancer le Sort</span>
                  </button>
                </div>
              )}

              {exercise.type === 'multiple_choice' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {exercise.options?.map((opt) => {
                    const isSelected = selectedOptionId === opt.id;
                    return (
                      <button
                        key={opt.id}
                        onClick={() => setSelectedOptionId(opt.id)}
                        className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold border text-left transition cursor-pointer flex items-center justify-between ${
                          isSelected
                            ? 'border-amber-400 bg-amber-950/40 text-amber-200 ring-2 ring-amber-400/30'
                            : 'border-indigo-800/80 bg-slate-900/60 text-slate-200 hover:bg-indigo-900/40'
                        }`}
                      >
                        <span>{opt.label}</span>
                        {isSelected && <span className="text-amber-400">✓</span>}
                      </button>
                    );
                  })}
                </div>
              )}

              {exercise.type === 'multiple_choice' && (
                <div className="flex justify-end">
                  <button
                    onClick={checkAnswer}
                    disabled={!selectedOptionId}
                    className={`px-5 py-2 rounded-xl font-bold text-xs sm:text-sm transition cursor-pointer flex items-center gap-1.5 ${
                      selectedOptionId
                        ? 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-slate-950 shadow-md'
                        : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                    }`}
                  >
                    <IconSword className="w-4 h-4" />
                    <span>Valider la réponse</span>
                  </button>
                </div>
              )}

              {/* Feedback banner */}
              {feedbackMessage && (
                <div
                  className={`p-2.5 rounded-xl text-xs font-semibold border animate-in fade-in ${
                    feedbackMessage.isCorrect
                      ? 'border-emerald-500/50 bg-emerald-950/50 text-emerald-200'
                      : 'border-amber-500/50 bg-amber-950/50 text-amber-200'
                  }`}
                >
                  {feedbackMessage.text}
                </div>
              )}

              {/* Assistance & Actions Bar */}
              <div className="border-t border-indigo-900/60 pt-2 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleUseManaHint}
                    className="px-2.5 py-1.5 rounded-xl border border-purple-700/60 bg-purple-950/40 text-purple-300 hover:bg-purple-900/50 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
                  >
                    <IconPotion className="w-3.5 h-3.5" />
                    <span>Indice ({activeHintLevel}/3)</span>
                  </button>

                  <button
                    onClick={handleActivateShield}
                    disabled={isShieldActive}
                    className={`px-2.5 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition ${
                      isShieldActive
                        ? 'border-emerald-600 bg-emerald-950/40 text-emerald-400'
                        : 'border-cyan-700/60 bg-cyan-950/40 text-cyan-300 hover:bg-cyan-900/50 cursor-pointer'
                    }`}
                  >
                    <IconShield className="w-3.5 h-3.5" />
                    <span>{isShieldActive ? 'Bouclier Actif' : 'Bouclier'}</span>
                  </button>

                  {currentNotion?.tutorialAvailable && (
                    <button
                      onClick={() => setShowTutorial(true)}
                      className="px-2.5 py-1.5 rounded-xl border border-indigo-700/60 bg-indigo-950/40 text-indigo-300 hover:bg-indigo-900/50 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
                    >
                      <IconBook className="w-3.5 h-3.5" />
                      <span>Grimoire Tutoriel</span>
                    </button>
                  )}
                </div>

                <span className="text-[10px] text-slate-400">
                  Inspiré des repères de mathématiques 2026
                </span>
              </div>

              {/* Revealed Hints */}
              {activeHintLevel > 0 && (
                <div className="rounded-xl border border-amber-500/40 bg-amber-950/30 p-2.5 text-xs text-amber-200 space-y-1 animate-in fade-in">
                  <div className="font-bold flex items-center gap-1 text-amber-300 text-[11px]">
                    <span>Indice progressif ({activeHintLevel}/3) :</span>
                  </div>
                  {exercise.hints.slice(0, activeHintLevel).map((hint, i) => (
                    <p key={i} className="pl-3 border-l-2 border-amber-500/60 text-[11px] leading-relaxed">
                      <span className="text-amber-400 font-semibold">Niveau {i + 1} :</span> {hint}
                    </p>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Combat History Log (compact, 2 lines) */}
        <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-2 text-[10px] text-slate-400 font-mono space-y-0.5 shrink-0 mt-2">
          {combatLog.slice(0, 2).map((log, i) => (
            <div key={i} className="truncate">{log}</div>
          ))}
        </div>
      </div>

      {/* Tutorial Modal if requested */}
      {showTutorial && currentNotion?.tutorialId && (
        <InteractiveTutorialModal
          tutorialId={currentNotion.tutorialId}
          onClose={() => setShowTutorial(false)}
        />
      )}
    </div>
  );
};
