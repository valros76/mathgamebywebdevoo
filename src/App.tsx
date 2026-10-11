import React, { useState, useEffect } from 'react';
import type { PlayerProfile, PlayerSettings, Quest } from './types';
import { db } from './services/persistence/db';
import { saveManager } from './services/persistence/saveManager';
import { soundManager } from './services/audio/soundManager';
import { checkAndApplyDailyStreak, calculateStreakReward } from './engine/game/streakManager';
import { ProfileSelectionView } from './features/player/ProfileSelectionView';
import { WorldMapView } from './features/world-map/WorldMapView';
import { MathBattleModal } from './features/battles/MathBattleModal';
import { InventoryModal } from './features/inventory/InventoryModal';
import { SettingsModal } from './features/settings/SettingsModal';
import { PedagogicalDashboardModal } from './features/pedagogy/PedagogicalDashboardModal';
import { DailyStreakModal } from './features/player/DailyStreakModal';
import { InteractiveTutorialModal } from './components/tutorials/InteractiveTutorialModal';
import { WardrobeModal } from './features/wardrobe/WardrobeModal';
import { PRESTIGE_EXCLUSIVE_ITEMS } from './engine/game/rewardManager';
import { AvatarRenderer } from './components/avatar/AvatarRenderer';
import { InitialBackupChoiceBanner } from './features/persistence/InitialBackupChoiceBanner';
import { LegalPagesModal, type LegalPageSlug } from './features/legal/LegalPagesModal';
import { PWAInstallButton, OfflineIndicator } from './components/pwa/PWAInstallButton';
import {
  MathGameBrandLogo,
  IconBackpack,
  IconCoin,
  IconFlame,
  IconBook,
  IconD20,
  IconWardrobe,
  IconGear,
  IconSwitchHero,
  IconMenu,
} from './components/icons/GameIcons';

export function App() {
  const [activePlayer, setActivePlayer] = useState<PlayerProfile | null>(null);
  const [activeSettings, setActiveSettings] = useState<PlayerSettings>({
    profileId: '',
    soundEnabled: true,
    musicVolume: 0.7,
    sfxVolume: 0.8,
    reducedMotion: false,
    externalJsonBackupEnabled: false,
  });
  const [isLoading, setIsLoading] = useState(true);

  // First launch storage choice banner
  const [showInitialChoiceBanner, setShowInitialChoiceBanner] = useState(false);

  // Legal modal
  const [activeLegalSlug, setActiveLegalSlug] = useState<LegalPageSlug | null>(null);

  // Modals state
  const [activeQuest, setActiveQuest] = useState<Quest | null>(null);
  const [activeTutorialId, setActiveTutorialId] = useState<string | null>(null);
  const [showInventory, setShowInventory] = useState(false);
  const [showWardrobe, setShowWardrobe] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showPedagogyDashboard, setShowPedagogyDashboard] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [streakModalState, setStreakModalState] = useState<{
    isOpen: boolean;
    streakDays: number;
    bonusGold: number;
  } | null>(null);

  const activateProfileWithStreakCheck = (profile: PlayerProfile) => {
    saveManager.setActiveProfileId(profile.id);
    const streakResult = checkAndApplyDailyStreak(profile);

    if (streakResult.isNewDay) {
      setActivePlayer(streakResult.updatedProfile);
      saveManager.stageProfile(streakResult.updatedProfile);
      saveManager.markDirty(true);
      setStreakModalState({
        isOpen: true,
        streakDays: streakResult.streakDays,
        bonusGold: streakResult.bonusGold,
      });
    } else {
      setActivePlayer(streakResult.updatedProfile);
    }
  };

  // Load last active profile and check initial backup choice on mount
  useEffect(() => {
    async function initSession() {
      try {
        // Check if initial backup choice was made
        const choiceRecord = await db.saveMetadata.get('initial_backup_choice_completed');
        if (!choiceRecord) {
          setShowInitialChoiceBanner(true);
        }

        const profiles = await db.profiles.toArray();
        if (profiles.length > 0) {
          profiles.sort((a, b) => b.updatedAt - a.updatedAt);
          const current = profiles[0];
          activateProfileWithStreakCheck(current);

          const savedSettings = await db.settings.get(current.id);
          if (savedSettings) {
            setActiveSettings(savedSettings);
            soundManager.setMuted(!savedSettings.soundEnabled);
          }
        }
      } catch (err) {
        console.error('Erreur initialisation session:', err);
      } finally {
        setIsLoading(false);
      }
    }
    initSession();
  }, []);

  const handleSelectProfile = (profile: PlayerProfile) => {
    activateProfileWithStreakCheck(profile);
  };

  const handleSwitchProfile = () => {
    soundManager.playClick();
    setActivePlayer(null);
  };

  const handleQuestVictory = (updated: PlayerProfile) => {
    setActivePlayer(updated);
  };

  if (isLoading) {
    return (
      <div className="h-[100dvh] bg-slate-950 flex flex-col items-center justify-center text-slate-100">
        <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500 flex items-center justify-center text-2xl animate-spin mb-3">
          <IconD20 className="w-7 h-7" />
        </div>
        <p className="text-sm font-serif text-amber-300">Chargement de MathGame par Webdevoo...</p>
      </div>
    );
  }

  return (
    // STRICT VIEWPORT RULE: Never exceed 100% height, full height with internal scrolling
    <div className="h-[100dvh] max-h-[100dvh] overflow-hidden bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-slate-950">
      
      {/* Top RPG Navigation Header & HUD */}
      <header className="shrink-0 z-40 w-full border-b border-indigo-900/60 bg-slate-950/95 backdrop-blur-md px-3 sm:px-6 py-2">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          
          {/* Logo & Brand */}
          <MathGameBrandLogo />

          {/* Active Hero HUD Status */}
          {activePlayer && (
            <div className="flex items-center gap-2 sm:gap-3">
              
              {/* Hero Status Badge */}
              <div className="hidden sm:flex items-center gap-2 bg-indigo-950/70 border border-indigo-800/60 px-3 py-1.5 rounded-2xl shadow-sm">
                <div className="text-left">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-slate-100">{activePlayer.name}</span>
                    <span className="text-[10px] font-mono text-amber-300 font-semibold">
                      Niv. {activePlayer.level}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-slate-400">
                    <span className="text-emerald-400 font-semibold">{activePlayer.hp} HP</span>
                    <span>•</span>
                    <span className="text-yellow-400 font-semibold flex items-center gap-1">
                      {activePlayer.gold} <IconCoin className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </div>

              {/* Daily Streak Flame Button */}
              <button
                onClick={() => {
                  soundManager.playClick();
                  setStreakModalState({
                    isOpen: true,
                    streakDays: activePlayer.dailyStreak || 1,
                    bonusGold: calculateStreakReward(activePlayer.dailyStreak || 1),
                  });
                }}
                title={`Série quotidienne : ${activePlayer.dailyStreak || 1} jours consécutifs.`}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl border border-amber-500/50 bg-gradient-to-b from-amber-950/50 to-orange-950/40 hover:from-amber-900/60 hover:to-orange-900/50 text-amber-300 font-bold text-xs transition cursor-pointer shadow-sm shadow-amber-950/40"
              >
                <IconFlame className="w-3.5 h-3.5 text-orange-400" />
                <span className="font-mono">{activePlayer.dailyStreak || 1} j.</span>
              </button>

              {/* Desktop & Mobile Action Buttons */}
              <div className="flex items-center gap-1.5">
                {/* Desktop Action Buttons */}
                <div className="hidden xl:flex items-center gap-1.5">
                  <button
                    onClick={() => {
                      soundManager.playClick();
                      setShowWardrobe(true);
                    }}
                    title="Garde-Robe & Personnalisation de l'Avatar"
                    className="px-3 py-1.5 rounded-xl border border-pink-700/60 bg-pink-950/40 hover:bg-pink-900/60 text-xs font-semibold text-pink-200 transition cursor-pointer flex items-center gap-1.5 shadow-sm"
                  >
                    <IconWardrobe className="w-4 h-4 text-pink-300" />
                    <span>Garde-Robe</span>
                  </button>

                  <button
                    onClick={() => {
                      soundManager.playClick();
                      setShowInventory(true);
                    }}
                    title="Besace & Badges"
                    className="px-3 py-1.5 rounded-xl border border-indigo-700/60 bg-indigo-950/50 hover:bg-indigo-900/60 text-xs font-semibold text-slate-200 transition cursor-pointer flex items-center gap-1.5"
                  >
                    <IconBackpack className="w-4 h-4 text-amber-400" />
                    <span>Besace</span>
                  </button>

                  <button
                    onClick={() => {
                      soundManager.playClick();
                      setShowPedagogyDashboard(true);
                    }}
                    title="Bilan Pédagogique & Compétences"
                    className="px-3 py-1.5 rounded-xl border border-indigo-700/60 bg-indigo-950/50 hover:bg-indigo-900/60 text-xs font-semibold text-purple-200 transition cursor-pointer flex items-center gap-1.5"
                  >
                    <IconBook className="w-4 h-4 text-purple-300" />
                    <span>Bilan</span>
                  </button>

                  <button
                    onClick={() => {
                      soundManager.playClick();
                      setShowSettings(true);
                    }}
                    title="Paramètres & Sauvegardes"
                    className="px-3 py-1.5 rounded-xl border border-indigo-700/60 bg-indigo-950/50 hover:bg-indigo-900/60 text-xs font-semibold text-slate-200 transition cursor-pointer flex items-center gap-1.5"
                  >
                    <IconGear className="w-4 h-4 text-slate-300" />
                    <span>Options</span>
                  </button>

                  <button
                    onClick={handleSwitchProfile}
                    title="Changer de Héros"
                    className="p-2 rounded-xl border border-slate-800 bg-slate-900/80 hover:bg-slate-800 text-xs text-slate-400 hover:text-slate-200 transition cursor-pointer flex items-center justify-center"
                  >
                    <IconSwitchHero className="w-4 h-4 text-slate-400" />
                  </button>
                </div>

                {/* Mobile / Tablet Menu Hamburger Toggle Button */}
                <button
                  onClick={() => {
                    soundManager.playClick();
                    setMobileMenuOpen(true);
                  }}
                  title="Ouvrir le menu"
                  className="flex xl:hidden items-center justify-center p-2.5 rounded-xl border border-amber-500/50 bg-amber-950/40 hover:bg-amber-900/50 text-amber-300 cursor-pointer shadow-sm"
                >
                  <IconMenu className="w-5 h-5 text-amber-300" />
                </button>

                {/* PWA In-App Install Button */}
                <PWAInstallButton />
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Mobile / Tablet Menu Slide-Over Drawer */}
      {mobileMenuOpen && activePlayer && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-xs h-full bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-950 border-l border-amber-500/40 p-5 flex flex-col justify-between shadow-2xl overflow-y-auto">
            
            {/* Drawer Header */}
            <div>
              <div className="flex items-center justify-between border-b border-indigo-900/60 pb-4 mb-4">
                <div className="flex items-center gap-2.5">
                  <AvatarRenderer customization={activePlayer.customization} heroClass={activePlayer.heroClass} size="sm" />
                  <div>
                    <h3 className="text-sm font-bold text-slate-100">{activePlayer.name}</h3>
                    <span className="text-[11px] font-mono text-amber-300">Niv. {activePlayer.level} • {activePlayer.grade}</span>
                  </div>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer text-base font-bold"
                  title="Fermer"
                >
                  ✕
                </button>
              </div>

              {/* Status HUD in Drawer */}
              <div className="grid grid-cols-2 gap-2 mb-4 p-3 rounded-2xl bg-indigo-950/60 border border-indigo-800/60 text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px]">Points de Vie</span>
                  <span className="text-emerald-400 font-bold font-mono">{activePlayer.hp} / {activePlayer.maxHp} HP</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Trésor</span>
                  <span className="text-yellow-400 font-bold font-mono flex items-center gap-1">
                    {activePlayer.gold} <IconCoin className="w-3 h-3" />
                  </span>
                </div>
              </div>

              {/* Action Links */}
              <div className="space-y-2">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setShowWardrobe(true);
                  }}
                  className="w-full p-3 rounded-xl border border-pink-700/60 bg-pink-950/40 hover:bg-pink-900/60 text-xs font-semibold text-pink-200 transition cursor-pointer flex items-center gap-3"
                >
                  <IconWardrobe className="w-5 h-5 text-pink-300" />
                  <span>Garde-Robe & Avatar</span>
                </button>

                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setShowInventory(true);
                  }}
                  className="w-full p-3 rounded-xl border border-indigo-700/60 bg-indigo-950/50 hover:bg-indigo-900/60 text-xs font-semibold text-slate-200 transition cursor-pointer flex items-center gap-3"
                >
                  <IconBackpack className="w-5 h-5 text-amber-400" />
                  <span>Besace & Reliques</span>
                </button>

                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setShowPedagogyDashboard(true);
                  }}
                  className="w-full p-3 rounded-xl border border-indigo-700/60 bg-indigo-950/50 hover:bg-indigo-900/60 text-xs font-semibold text-purple-200 transition cursor-pointer flex items-center gap-3"
                >
                  <IconBook className="w-5 h-5 text-purple-300" />
                  <span>Bilan Pédagogique</span>
                </button>

                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setShowSettings(true);
                  }}
                  className="w-full p-3 rounded-xl border border-indigo-700/60 bg-indigo-950/50 hover:bg-indigo-900/60 text-xs font-semibold text-slate-200 transition cursor-pointer flex items-center gap-3"
                >
                  <IconGear className="w-5 h-5 text-slate-300" />
                  <span>Options & Sauvegardes</span>
                </button>
              </div>
            </div>

            {/* Drawer Footer / Switch Hero & Legal Links */}
            <div className="pt-4 border-t border-indigo-900/60 space-y-3">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleSwitchProfile();
                }}
                className="w-full p-3 rounded-xl border border-slate-700 bg-slate-900 hover:bg-slate-800 text-xs font-semibold text-slate-300 transition cursor-pointer flex items-center justify-center gap-2"
              >
                <IconSwitchHero className="w-4 h-4 text-slate-400" />
                <span>Changer de Héros</span>
              </button>

              {/* Legal Links inside Tablet/Mobile Drawer */}
              <div className="pt-2 border-t border-indigo-900/40 text-center text-[11px] text-slate-400 space-y-1.5">
                <div className="font-medium text-slate-300">MathGame par Webdevoo © 2026</div>
                <div className="flex items-center justify-center gap-2 flex-wrap">
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setActiveLegalSlug('mentions-legales');
                    }}
                    className="hover:text-amber-300 underline underline-offset-2 cursor-pointer"
                  >
                    Mentions Légales
                  </button>
                  <span>•</span>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setActiveLegalSlug('conditions-utilisation');
                    }}
                    className="hover:text-amber-300 underline underline-offset-2 cursor-pointer"
                  >
                    CGU
                  </button>
                  <span>•</span>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setActiveLegalSlug('confidentialite');
                    }}
                    className="hover:text-amber-300 underline underline-offset-2 cursor-pointer"
                  >
                    Confidentialité
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area — Scrolls internally if content is larger than viewport */}
      <main className="flex-1 min-h-0 overflow-y-auto max-w-7xl w-full mx-auto p-3 sm:p-5">
        {!activePlayer ? (
          <ProfileSelectionView onSelectProfile={handleSelectProfile} />
        ) : (
          <WorldMapView
            player={activePlayer}
            onSelectQuest={(quest) => setActiveQuest(quest)}
            onOpenTutorial={(tutId) => setActiveTutorialId(tutId)}
          />
        )}
      </main>

      {/* Footer with Legal Links (hidden on mobile/tablet, visible on desktop lg+) */}
      <footer className="hidden lg:flex shrink-0 border-t border-indigo-950/90 bg-slate-950 px-3 sm:px-6 py-2 text-center text-[11px] text-slate-500 items-center justify-between gap-1.5">
        <div>
          <span>MathGame par Webdevoo © 2026 — Jeu éducatif indépendant inspiré des repères 2026 (primaire & collège).</span>
        </div>
        <div className="flex items-center gap-3 text-slate-400">
          <button
            onClick={() => setActiveLegalSlug('mentions-legales')}
            className="hover:text-amber-300 underline underline-offset-2 cursor-pointer"
          >
            Mentions Légales
          </button>
          <span>•</span>
          <button
            onClick={() => setActiveLegalSlug('conditions-utilisation')}
            className="hover:text-amber-300 underline underline-offset-2 cursor-pointer"
          >
            CGU
          </button>
          <span>•</span>
          <button
            onClick={() => setActiveLegalSlug('confidentialite')}
            className="hover:text-amber-300 underline underline-offset-2 cursor-pointer"
          >
            Confidentialité
          </button>
        </div>
      </footer>

      {/* First Launch Storage Choice Banner */}
      {showInitialChoiceBanner && (
        <InitialBackupChoiceBanner
          onChoiceMade={() => setShowInitialChoiceBanner(false)}
        />
      )}

      {/* Legal Pages Modal */}
      {activeLegalSlug && (
        <LegalPagesModal
          initialSlug={activeLegalSlug}
          onClose={() => setActiveLegalSlug(null)}
        />
      )}

      {/* Modals */}
      {activeQuest && activePlayer && (
        <MathBattleModal
          quest={activeQuest}
          player={activePlayer}
          onVictory={handleQuestVictory}
          onOpenWardrobe={(updated) => {
            setActivePlayer(updated);
            setShowWardrobe(true);
          }}
          onClose={() => setActiveQuest(null)}
        />
      )}

      {showWardrobe && activePlayer && (
        <WardrobeModal
          player={activePlayer}
          onUpdateProfile={(updated) => {
            setActivePlayer(updated);
            saveManager.stageProfile(updated);
          }}
          onClose={() => setShowWardrobe(false)}
        />
      )}

      {showInventory && activePlayer && (
        <InventoryModal
          player={activePlayer}
          onClose={() => setShowInventory(false)}
        />
      )}

      {showSettings && activePlayer && (
        <SettingsModal
          player={activePlayer}
          settings={activeSettings}
          onUpdateSettings={(newSettings) => setActiveSettings(newSettings)}
          onProfileRestored={(restored) => setActivePlayer(restored)}
          onOpenLegal={(slug) => {
            setShowSettings(false);
            setActiveLegalSlug(slug);
          }}
          onClose={() => setShowSettings(false)}
        />
      )}

      {showPedagogyDashboard && activePlayer && (
        <PedagogicalDashboardModal
          player={activePlayer}
          onOpenTutorial={(tutId) => {
            setShowPedagogyDashboard(false);
            setActiveTutorialId(tutId);
          }}
          onClose={() => setShowPedagogyDashboard(false)}
        />
      )}

      {activeTutorialId && (
        <InteractiveTutorialModal
          tutorialId={activeTutorialId}
          onClose={() => setActiveTutorialId(null)}
          onStartPractice={() => {
            setActiveTutorialId(null);
          }}
        />
      )}

      {streakModalState?.isOpen && (
        <DailyStreakModal
          streakDays={streakModalState.streakDays}
          bonusGold={streakModalState.bonusGold}
          onClose={() => setStreakModalState(null)}
        />
      )}

      {/* Offline Status Toast */}
      <OfflineIndicator />
    </div>
  );
}

export default App;
