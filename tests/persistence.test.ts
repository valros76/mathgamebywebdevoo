import { describe, it, expect, vi } from 'vitest';
import { saveManager } from '../src/services/persistence/saveManager';
import type { PlayerProfile } from '../src/types';

describe('Système de Sauvegarde et Debounce (SaveManager)', () => {
  const dummyProfile: PlayerProfile = {
    id: 'test_persist_hero',
    name: 'Léa',
    avatar: '🏹',
    heroClass: 'rodeur',
    grade: '6e',
    world: 'college',
    level: 1,
    xp: 0,
    xpToNextLevel: 100,
    gold: 50,
    hp: 100,
    maxHp: 100,
    mana: 50,
    maxMana: 50,
    unlockedZoneIds: ['zone_bastion_relatifs'],
    currentZoneId: 'zone_bastion_relatifs',
    dailyStreak: 1,
    lastLoginDate: '2026-10-08',
    maxStreak: 1,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };

  it('gère le dirty flag et la file d\'attente', () => {
    saveManager.setActiveProfileId(dummyProfile.id);
    saveManager.stageProfile(dummyProfile);

    const status = saveManager.getStatus();
    expect(status.isDirty).toBe(true);
  });

  it('notifie les abonnés lors d\'un changement d\'état', () => {
    let notified = false;
    const unsub = saveManager.subscribe((st) => {
      if (st.isDirty) notified = true;
    });

    saveManager.markDirty(false);
    expect(notified).toBe(true);
    unsub();
  });
});
