// MathGame par Webdevoo — Gestionnaire de Série Quotidienne (Daily Streak)
import type { PlayerProfile } from '../../types';

export function formatDateToIsoDay(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getYesterdayIsoDay(date: Date = new Date()): string {
  const yesterday = new Date(date);
  yesterday.setDate(yesterday.getDate() - 1);
  return formatDateToIsoDay(yesterday);
}

/**
 * Barème de récompense en or selon la série :
 * Jour 1: 25 or
 * Jour 2: 40 or
 * Jour 3: 55 or
 * Jour 4: 70 or
 * Jour 5: 85 or
 * Jour 6: 100 or
 * Jour 7+: 125 or (Palier hebdomadaire épique)
 */
export function calculateStreakReward(streak: number): number {
  if (streak <= 1) return 25;
  if (streak >= 7) return 125;
  return 25 + (streak - 1) * 15;
}

export interface StreakCheckResult {
  updatedProfile: PlayerProfile;
  isNewDay: boolean;
  streakDays: number;
  bonusGold: number;
}

/**
 * Vérifie et actualise la série quotidienne du profil.
 */
export function checkAndApplyDailyStreak(
  profile: PlayerProfile,
  customToday?: string
): StreakCheckResult {
  const today = customToday || formatDateToIsoDay();
  const yesterday = getYesterdayIsoDay();

  const currentStreak = profile.dailyStreak || 0;
  const currentMax = profile.maxStreak || currentStreak;
  const lastLogin = profile.lastLoginDate;

  // Si le joueur s'est déjà connecté aujourd'hui
  if (lastLogin === today) {
    return {
      updatedProfile: profile,
      isNewDay: false,
      streakDays: currentStreak,
      bonusGold: 0,
    };
  }

  let newStreak = 1;

  // Connexion le lendemain consécutif
  if (lastLogin === yesterday) {
    newStreak = currentStreak + 1;
  } else {
    // Premier jour ou série brisée
    newStreak = 1;
  }

  const bonusGold = calculateStreakReward(newStreak);
  const newMaxStreak = Math.max(currentMax, newStreak);

  const updatedProfile: PlayerProfile = {
    ...profile,
    dailyStreak: newStreak,
    maxStreak: newMaxStreak,
    lastLoginDate: today,
    gold: profile.gold + bonusGold,
    updatedAt: Date.now(),
  };

  return {
    updatedProfile,
    isNewDay: true,
    streakDays: newStreak,
    bonusGold,
  };
}
