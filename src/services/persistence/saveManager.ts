// MathGame par Webdevoo — Moteur central de sauvegarde
import { db, getFullProfilePackage } from './db';
import { writeExternalJsonBackup } from './fileSystemBackup';
import type {
  PlayerProfile,
  NotionMastery,
  QuestState,
  InventoryRecord,
  AchievementBadge,
  PlayerSettings,
} from '../../types';

export interface SaveStatusState {
  isSaving: boolean;
  isDirty: boolean;
  lastSavedAt: number | null;
  error: string | null;
  saveCount: number;
}

type StatusListener = (status: SaveStatusState) => void;

class SaveManager {
  private isDirty = false;
  private isSaving = false;
  private hasPendingSaveWhileSaving = false;
  private lastSavedAt: number | null = null;
  private error: string | null = null;
  private saveCount = 0;

  private debounceTimer: ReturnType<typeof setTimeout> | null = null;
  private periodicInterval: ReturnType<typeof setInterval> | null = null;
  private readonly listeners = new Set<StatusListener>();

  // Active in-memory buffer
  private currentProfileId: string | null = null;
  private pendingProfile: PlayerProfile | null = null;
  private pendingMastery: Map<string, NotionMastery> = new Map();
  private pendingQuestStates: Map<string, QuestState> = new Map();
  private pendingInventory: Map<string, InventoryRecord> = new Map();
  private pendingAchievements: Map<string, AchievementBadge> = new Map();
  private pendingSettings: PlayerSettings | null = null;

  constructor() {
    this.initPeriodicTimer();
    this.initLifecycleListeners();
  }

  public subscribe(listener: StatusListener): () => void {
    this.listeners.add(listener);
    listener(this.getStatus());
    return () => this.listeners.delete(listener);
  }

  public getStatus(): SaveStatusState {
    return {
      isSaving: this.isSaving,
      isDirty: this.isDirty,
      lastSavedAt: this.lastSavedAt,
      error: this.error,
      saveCount: this.saveCount,
    };
  }

  private notify() {
    const status = this.getStatus();
    this.listeners.forEach((fn) => fn(status));
  }

  public setActiveProfileId(profileId: string) {
    this.currentProfileId = profileId;
  }

  /**
   * Marque une modification de l'état du joueur.
   * Déclenche un enregistrement avec debounce (750ms).
   */
  public markDirty(isCriticalEvent = false) {
    this.isDirty = true;
    this.error = null;
    this.notify();

    if (isCriticalEvent) {
      // Sauvegarde immédiate lors d'un événement critique (ex: récompense de complétion)
      if (this.debounceTimer) {
        clearTimeout(this.debounceTimer);
        this.debounceTimer = null;
      }
      this.executeSave();
    } else {
      // Regroupement debounce
      if (this.debounceTimer) clearTimeout(this.debounceTimer);
      this.debounceTimer = setTimeout(() => {
        this.executeSave();
      }, 750);
    }
  }

  public stageProfile(profile: PlayerProfile) {
    this.pendingProfile = profile;
    this.currentProfileId = profile.id;
    this.markDirty(false);
  }

  public stageMastery(mastery: NotionMastery, isMilestone = false) {
    this.pendingMastery.set(mastery.notionId, mastery);
    this.markDirty(isMilestone);
  }

  public stageQuestState(questState: QuestState, isCompleted = false) {
    this.pendingQuestStates.set(questState.questId, questState);
    this.markDirty(isCompleted); // Criticial si quête finie
  }

  public stageInventory(record: InventoryRecord) {
    this.pendingInventory.set(record.id, record);
    this.markDirty(false);
  }

  public stageAchievement(badge: AchievementBadge) {
    this.pendingAchievements.set(badge.id, badge);
    this.markDirty(true); // Milestone critique
  }

  public stageSettings(settings: PlayerSettings) {
    this.pendingSettings = settings;
    this.markDirty(false);
  }

  /**
   * Exécution sérialisée de la sauvegarde.
   */
  public async executeSave(): Promise<boolean> {
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
      this.debounceTimer = null;
    }

    if (!this.isDirty && !this.pendingProfile) {
      return true;
    }

    if (this.isSaving) {
      // Une écriture est déjà en cours. On note qu'une nouvelle passe est requise
      this.hasPendingSaveWhileSaving = true;
      return false;
    }

    const profileId = this.currentProfileId || this.pendingProfile?.id;
    if (!profileId) {
      return false;
    }

    this.isSaving = true;
    this.notify();

    try {
      // 1. Snapshot des données en attente
      const profileToSave = this.pendingProfile;
      const masteryToSave = Array.from(this.pendingMastery.values());
      const questsToSave = Array.from(this.pendingQuestStates.values());
      const inventoryToSave = Array.from(this.pendingInventory.values());
      const achievementsToSave = Array.from(this.pendingAchievements.values());
      const settingsToSave = this.pendingSettings;

      // 2. Transaction atomique IndexedDB
      await db.transaction(
        'rw',
        [db.profiles, db.progress, db.questStates, db.inventory, db.achievements, db.settings, db.saveMetadata],
        async () => {
          if (profileToSave) {
            await db.profiles.put({
              ...profileToSave,
              updatedAt: Date.now(),
            });
          }

          if (masteryToSave.length > 0) {
            await db.progress.bulkPut(masteryToSave);
          }

          if (questsToSave.length > 0) {
            await db.questStates.bulkPut(questsToSave);
          }

          if (inventoryToSave.length > 0) {
            await db.inventory.bulkPut(inventoryToSave);
          }

          if (achievementsToSave.length > 0) {
            const enriched = achievementsToSave.map((a) => ({ ...a, profileId }));
            await db.achievements.bulkPut(enriched);
          }

          if (settingsToSave) {
            await db.settings.put(settingsToSave);
          }

          await db.saveMetadata.put({
            key: `last_saved_${profileId}`,
            value: Date.now(),
            updatedAt: Date.now(),
          });
        }
      );

      // Nettoyage des maps enregistrées
      masteryToSave.forEach((m) => this.pendingMastery.delete(m.notionId));
      questsToSave.forEach((q) => this.pendingQuestStates.delete(q.questId));
      inventoryToSave.forEach((i) => this.pendingInventory.delete(i.id));
      achievementsToSave.forEach((a) => this.pendingAchievements.delete(a.id));
      this.pendingProfile = null;
      this.pendingSettings = null;

      this.isDirty = false;
      this.lastSavedAt = Date.now();
      this.saveCount += 1;
      this.error = null;

      // 3. Optionnel : Synchronisation fichier JSON externe si activée
      const settings = await db.settings.get(profileId);
      if (settings?.externalJsonBackupEnabled) {
        const fullPkg = await getFullProfilePackage(profileId);
        if (fullPkg) {
          await writeExternalJsonBackup(fullPkg);
        }
      }

      return true;
    } catch (err) {
      console.error('[SaveManager] Échec de la sauvegarde IndexedDB:', err);
      this.error = 'Échec de la sauvegarde locale. Les modifications restent en mémoire.';
      return false;
    } finally {
      this.isSaving = false;
      this.notify();

      // Si de nouveaux changements sont arrivés pendant l'écriture, relancer
      if (this.hasPendingSaveWhileSaving) {
        this.hasPendingSaveWhileSaving = false;
        setTimeout(() => this.executeSave(), 100);
      }
    }
  }

  /**
   * Sauvegarde périodique toutes les 5 minutes (300 000 ms).
   * Ne réécrit RIEN si isDirty est faux.
   */
  private initPeriodicTimer() {
    const FIVE_MINUTES_MS = 5 * 60 * 1000;
    this.periodicInterval = setInterval(() => {
      if (this.isDirty) {
        this.executeSave();
      }
    }, FIVE_MINUTES_MS);
  }

  /**
   * Capture les transitions de cycle de vie (quitter la page, passer en arrière-plan)
   */
  private initLifecycleListeners() {
    if (typeof document !== 'undefined') {
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'hidden' && this.isDirty) {
          this.executeSave();
        }
      });

      window.addEventListener('pagehide', () => {
        if (this.isDirty) {
          this.executeSave();
        }
      });
    }
  }

  public destroy() {
    if (this.periodicInterval) clearInterval(this.periodicInterval);
    if (this.debounceTimer) clearTimeout(this.debounceTimer);
    this.listeners.clear();
  }
}

export const saveManager = new SaveManager();
