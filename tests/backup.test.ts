import { describe, it, expect } from 'vitest';
import {
  validateImportedJson,
  isFileSystemAccessSupported,
} from '../src/services/persistence/fileSystemBackup';
import { generateSimpleChecksum } from '../src/services/persistence/db';
import type { SaveDataPackage } from '../src/types';

describe('Système d\'Export et Import JSON', () => {
  const validMockPackage: SaveDataPackage = {
    formatVersion: '1.0.0',
    schemaVersion: 1,
    exportedAt: 1775692800000,
    generator: 'MathGame par Webdevoo',
    profile: {
      id: 'test_hero',
      name: 'Arthur',
      avatar: '🧙‍♂️',
      heroClass: 'mage',
      grade: 'CM1',
      world: 'primaire',
      level: 2,
      xp: 150,
      xpToNextLevel: 250,
      gold: 120,
      hp: 100,
      maxHp: 100,
      mana: 50,
      maxMana: 50,
      unlockedZoneIds: ['zone_val_arithmetique'],
      currentZoneId: 'zone_val_arithmetique',
      dailyStreak: 3,
      lastLoginDate: '2026-10-08',
      maxStreak: 3,
      createdAt: 1775692000000,
      updatedAt: 1775692800000,
    },
    masteryRecords: [],
    questStates: [],
    inventory: [],
    achievements: [],
    settings: {
      profileId: 'test_hero',
      soundEnabled: true,
      musicVolume: 0.7,
      sfxVolume: 0.8,
      reducedMotion: false,
      externalJsonBackupEnabled: false,
    },
    checksum: 'mg_test123',
  };

  it('valide un package de sauvegarde conforme', () => {
    const jsonStr = JSON.stringify(validMockPackage);
    const result = validateImportedJson(jsonStr);
    expect(result.isValid).toBe(true);
    expect(result.data?.profile.name).toBe('Arthur');
  });

  it('rejette les fichiers JSON corrompus ou invalides', () => {
    const corruptedStr = '{"formatVersion": 1.0, not a valid json';
    const result = validateImportedJson(corruptedStr);
    expect(result.isValid).toBe(false);
    expect(result.error).toBeDefined();
  });

  it('rejette les objets qui ne proviennent pas de MathGame', () => {
    const foreignJson = JSON.stringify({ app: 'autre_jeu', score: 1000 });
    const result = validateImportedJson(foreignJson);
    expect(result.isValid).toBe(false);
    expect(result.error).toContain('pas reconnu comme une sauvegarde MathGame valide');
  });

  it('génère un checksum déterministe', () => {
    const chk1 = generateSimpleChecksum('test_payload_123');
    const chk2 = generateSimpleChecksum('test_payload_123');
    expect(chk1).toBe(chk2);
    expect(chk1.startsWith('mg_')).toBe(true);
  });
});
