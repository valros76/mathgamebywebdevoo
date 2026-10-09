import { describe, it, expect } from 'vitest';
import {
  checkAndApplyDailyStreak,
  calculateStreakReward,
  formatDateToIsoDay,
  getYesterdayIsoDay,
} from '../src/engine/game/streakManager';
import type { PlayerProfile } from '../src/types';

describe('Système de Série Quotidienne (Daily Streak)', () => {
  const baseProfile: PlayerProfile = {
    id: 'hero_streak_test',
    name: 'Sorcier Test',
    avatar: '🧙‍♂️',
    heroClass: 'mage',
    grade: 'CM2',
    world: 'primaire',
    level: 1,
    xp: 0,
    xpToNextLevel: 100,
    gold: 50,
    hp: 100,
    maxHp: 100,
    mana: 50,
    maxMana: 50,
    unlockedZoneIds: ['zone_val_arithmetique'],
    currentZoneId: 'zone_val_arithmetique',
    dailyStreak: 0,
    lastLoginDate: '',
    maxStreak: 0,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };

  it('calcule correctement les récompenses en or selon le barème', () => {
    expect(calculateStreakReward(1)).toBe(25);
    expect(calculateStreakReward(2)).toBe(40);
    expect(calculateStreakReward(3)).toBe(55);
    expect(calculateStreakReward(4)).toBe(70);
    expect(calculateStreakReward(5)).toBe(85);
    expect(calculateStreakReward(6)).toBe(100);
    expect(calculateStreakReward(7)).toBe(125); // Palier hebdomadaire
  });

  it('attribue le premier jour de série lors de la première connexion', () => {
    const today = '2026-10-08';
    const res = checkAndApplyDailyStreak(baseProfile, today);

    expect(res.isNewDay).toBe(true);
    expect(res.streakDays).toBe(1);
    expect(res.bonusGold).toBe(25);
    expect(res.updatedProfile.gold).toBe(75); // 50 + 25
    expect(res.updatedProfile.dailyStreak).toBe(1);
    expect(res.updatedProfile.maxStreak).toBe(1);
    expect(res.updatedProfile.lastLoginDate).toBe(today);
  });

  it('n\'accorde pas de double récompense lors d\'une reconnexion le même jour', () => {
    const today = '2026-10-08';
    const profileAfterDay1: PlayerProfile = {
      ...baseProfile,
      dailyStreak: 1,
      maxStreak: 1,
      lastLoginDate: today,
      gold: 75,
    };

    const res = checkAndApplyDailyStreak(profileAfterDay1, today);
    expect(res.isNewDay).toBe(false);
    expect(res.bonusGold).toBe(0);
    expect(res.streakDays).toBe(1);
    expect(res.updatedProfile.gold).toBe(75);
  });

  it('incrémente la série et accorde le bonus lors d\'une connexion consécutive le lendemain', () => {
    const yesterday = getYesterdayIsoDay();
    const today = formatDateToIsoDay();

    const profileYesterday: PlayerProfile = {
      ...baseProfile,
      dailyStreak: 2,
      maxStreak: 2,
      lastLoginDate: yesterday,
      gold: 90,
    };

    const res = checkAndApplyDailyStreak(profileYesterday, today);
    expect(res.isNewDay).toBe(true);
    expect(res.streakDays).toBe(3);
    expect(res.bonusGold).toBe(55); // Jour 3 = 55 or
    expect(res.updatedProfile.gold).toBe(90 + 55);
    expect(res.updatedProfile.dailyStreak).toBe(3);
    expect(res.updatedProfile.maxStreak).toBe(3);
    expect(res.updatedProfile.lastLoginDate).toBe(today);
  });

  it('réinitialise la série à 1 si plus d\'un jour a été manqué tout en conservant maxStreak', () => {
    const today = '2026-10-08';
    const oldLoginDate = '2026-10-01'; // 7 jours plus tôt

    const profileMissed: PlayerProfile = {
      ...baseProfile,
      dailyStreak: 5,
      maxStreak: 5,
      lastLoginDate: oldLoginDate,
      gold: 200,
    };

    const res = checkAndApplyDailyStreak(profileMissed, today);
    expect(res.isNewDay).toBe(true);
    expect(res.streakDays).toBe(1);
    expect(res.bonusGold).toBe(25);
    expect(res.updatedProfile.gold).toBe(225);
    expect(res.updatedProfile.dailyStreak).toBe(1);
    expect(res.updatedProfile.maxStreak).toBe(5); // Conservation du record !
    expect(res.updatedProfile.lastLoginDate).toBe(today);
  });
});
