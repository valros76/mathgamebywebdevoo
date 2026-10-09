import Dexie, { type Table } from 'dexie';
import type {
  PlayerProfile,
  NotionMastery,
  QuestState,
  InventoryRecord,
  AchievementBadge,
  PlayerSettings,
  SaveDataPackage,
} from '../../types';

export interface SaveMetadataRecord {
  key: string;
  value: string | number | boolean;
  updatedAt: number;
}

export class MathGameDatabase extends Dexie {
  profiles!: Table<PlayerProfile, string>;
  progress!: Table<NotionMastery, [string, string]>;
  questStates!: Table<QuestState, [string, string]>;
  inventory!: Table<InventoryRecord, string>;
  achievements!: Table<AchievementBadge & { profileId: string }, string>;
  settings!: Table<PlayerSettings, string>;
  saveMetadata!: Table<SaveMetadataRecord, string>;

  constructor() {
    super('MathGameWebdevooDB');

    // Schema version 1
    this.version(1).stores({
      profiles: 'id, name, grade, world, updatedAt',
      progress: '[profileId+notionId], profileId, notionId, grade, masteryLevel',
      questStates: '[profileId+questId], profileId, questId, isCompleted',
      inventory: 'id, profileId, itemId',
      achievements: 'id, profileId, badgeId, competence',
      settings: 'profileId',
      saveMetadata: 'key',
    });
  }
}

export const db = new MathGameDatabase();

/**
 * Charge l'ensemble des données d'un profil pour export ou calcul de sauvegarde.
 */
export async function getFullProfilePackage(profileId: string): Promise<SaveDataPackage | null> {
  const profile = await db.profiles.get(profileId);
  if (!profile) return null;

  const masteryRecords = await db.progress.where('profileId').equals(profileId).toArray();
  const questStates = await db.questStates.where('profileId').equals(profileId).toArray();
  const inventory = await db.inventory.where('profileId').equals(profileId).toArray();
  const rawAchievements = await db.achievements.where('profileId').equals(profileId).toArray();
  const settings = (await db.settings.get(profileId)) || {
    profileId,
    soundEnabled: true,
    musicVolume: 0.7,
    sfxVolume: 0.8,
    reducedMotion: false,
    externalJsonBackupEnabled: false,
  };

  const achievements: AchievementBadge[] = rawAchievements.map((a) => ({
    id: a.id,
    title: a.title,
    description: a.description,
    competence: a.competence,
    icon: a.icon,
    unlockedAt: a.unlockedAt,
  }));

  const payloadString = JSON.stringify({ profile, masteryRecords, questStates, inventory, achievements });
  const checksum = generateSimpleChecksum(payloadString);

  return {
    formatVersion: '1.0.0',
    schemaVersion: 1,
    exportedAt: Date.now(),
    generator: 'MathGame par Webdevoo',
    profile,
    masteryRecords,
    questStates,
    inventory,
    achievements,
    settings,
    checksum,
  };
}

/**
 * Importe ou restaure un SaveDataPackage complet dans IndexedDB de manière atomique.
 */
export async function restoreSavePackage(pkg: SaveDataPackage): Promise<void> {
  await db.transaction(
    'rw',
    [db.profiles, db.progress, db.questStates, db.inventory, db.achievements, db.settings, db.saveMetadata],
    async () => {
      const pid = pkg.profile.id;

      // Clean existing records for this profile
      await db.progress.where('profileId').equals(pid).delete();
      await db.questStates.where('profileId').equals(pid).delete();
      await db.inventory.where('profileId').equals(pid).delete();
      await db.achievements.where('profileId').equals(pid).delete();

      // Put profile and settings
      await db.profiles.put(pkg.profile);
      await db.settings.put(pkg.settings);

      // Bulk add relations
      if (pkg.masteryRecords.length > 0) {
        await db.progress.bulkPut(pkg.masteryRecords);
      }
      if (pkg.questStates.length > 0) {
        await db.questStates.bulkPut(pkg.questStates);
      }
      if (pkg.inventory.length > 0) {
        await db.inventory.bulkPut(pkg.inventory);
      }
      if (pkg.achievements.length > 0) {
        const enrichedAchievements = pkg.achievements.map((a) => ({
          ...a,
          profileId: pid,
        }));
        await db.achievements.bulkPut(enrichedAchievements);
      }

      await db.saveMetadata.put({
        key: `last_restore_${pid}`,
        value: Date.now(),
        updatedAt: Date.now(),
      });
    }
  );
}

export function generateSimpleChecksum(input: string): string {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    const char = input.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0; // Convert to 32bit integer
  }
  return `mg_${Math.abs(hash).toString(16)}`;
}
