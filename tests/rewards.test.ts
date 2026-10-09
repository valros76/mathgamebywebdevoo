import { describe, it, expect } from 'vitest';
import {
  REWARD_CATALOG,
  getThreeDeterministicStageRewards,
  getRewardItemsForStage,
} from '../src/engine/game/rewardManager';

describe('Système Déterministe de Récompenses (3 objets sans doublon par étape)', () => {
  it('dispose d\'un catalogue d\'au moins 20 objets diversifiés (garde-robe, reliques, potions)', () => {
    expect(REWARD_CATALOG.length).toBeGreaterThanOrEqual(20);
    // Vérifie la présence des différentes catégories
    const hasWardrobe = REWARD_CATALOG.some((item) => item.wardrobeSlot !== undefined);
    const hasRelics = REWARD_CATALOG.some((item) => item.type === 'relic');
    const hasConsumables = REWARD_CATALOG.some((item) => item.type === 'consumable');

    expect(hasWardrobe).toBe(true);
    expect(hasRelics).toBe(true);
    expect(hasConsumables).toBe(true);
  });

  it('accorde exactement 3 objets par étape', () => {
    const rewardsStage1 = getThreeDeterministicStageRewards('quest_val_addition_1', []);
    expect(rewardsStage1).toHaveLength(3);

    const rewardsStage2 = getThreeDeterministicStageRewards('quest_val_multiplication_3', []);
    expect(rewardsStage2).toHaveLength(3);
  });

  it('ne contient AUCUN doublon parmi les 3 objets accordés pour une étape', () => {
    const testQuests = [
      'quest_val_addition_1',
      'quest_val_multiplication_3',
      'quest_geometrie_formes_1',
      'quest_tour_algebre_1',
      'quest_bastion_probabilites_1',
    ];

    for (const qId of testQuests) {
      const rewards = getThreeDeterministicStageRewards(qId, []);
      const uniqueIds = new Set(rewards.map((r) => r.id));
      expect(uniqueIds.size).toBe(3);
    }
  });

  it('est déterministe pour une même quête et un même inventaire', () => {
    const runA = getThreeDeterministicStageRewards('quest_val_addition_1', []);
    const runB = getThreeDeterministicStageRewards('quest_val_addition_1', []);

    expect(runA.map((r) => r.id)).toEqual(runB.map((r) => r.id));
  });

  it('évite les répétitions en tenant compte des objets déjà possédés par le joueur', () => {
    const firstDrop = getThreeDeterministicStageRewards('quest_val_addition_1', []);
    const alreadyOwnedIds = firstDrop.map((item) => item.id);

    // Même quête rejouée ou étape suivante avec inventaire contenant le premier drop
    const nextDrop = getThreeDeterministicStageRewards('quest_val_addition_1', alreadyOwnedIds);

    expect(nextDrop).toHaveLength(3);
    // Aucun objet du second drop ne doit être dans le premier drop (tant que le catalogue le permet)
    for (const item of nextDrop) {
      expect(alreadyOwnedIds).not.toContain(item.id);
    }
  });

  it('getRewardItemsForStage retourne les récompenses déterministes par défaut', () => {
    const stageItems = getRewardItemsForStage('quest_val_addition_1');
    expect(stageItems.length).toBeGreaterThanOrEqual(1);
  });
});
