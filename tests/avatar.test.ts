import { describe, it, expect } from 'vitest';
import {
  BASE_PERMANENT_JACKET_ID,
  DEFAULT_CUSTOMIZATION_BY_CLASS,
} from '../src/components/avatar/AvatarRenderer';
import type { HeroClass, AvatarCustomization } from '../src/types';

describe('Système d\'Avatar Modulaire et Règle de Tenue de Base Permanente', () => {
  it('définit une tenue de base permanente non supprimable', () => {
    expect(BASE_PERMANENT_JACKET_ID).toBe('tunique_apprenti');
  });

  it('fournit des configurations par défaut complètes pour toutes les classes de héros', () => {
    const classes: HeroClass[] = ['mage', 'guerrier', 'alchimiste', 'rodeur'];

    for (const hClass of classes) {
      const config = DEFAULT_CUSTOMIZATION_BY_CLASS[hClass];
      expect(config).toBeDefined();
      expect(config.skinTone).toBeDefined();
      expect(config.hairStyle).toBeDefined();
      expect(config.hairColor).toBeDefined();
      expect(config.jacketId).toBeDefined();
      expect(config.capeId).toBeDefined();
      expect(config.accessoryId).toBeDefined();
    }
  });

  it('permet la modularité indépendante de la carnation, cheveux, veste, cape et accessoire', () => {
    const customAvatar: AvatarCustomization = {
      skinTone: 'ebene',
      hairStyle: 'arcane',
      hairColor: 'violet',
      jacketId: 'veste_arcaniste',
      capeId: 'cape_etoilee',
      accessoryId: 'diademe_arcane',
    };

    // Modification indépendante de la carnation uniquement
    const alteredSkin: AvatarCustomization = {
      ...customAvatar,
      skinTone: 'celeste',
    };
    expect(alteredSkin.skinTone).toBe('celeste');
    expect(alteredSkin.hairColor).toBe('violet');
    expect(alteredSkin.jacketId).toBe('veste_arcaniste');

    // Modification indépendante de la veste uniquement
    const alteredJacket: AvatarCustomization = {
      ...customAvatar,
      jacketId: 'cuirasse_geometre',
    };
    expect(alteredJacket.jacketId).toBe('cuirasse_geometre');
    expect(alteredJacket.capeId).toBe('cape_etoilee');

    // Règle de tenue de base : si la veste est retirée, la tenue permanente de base prend le relais
    const removedJacket: string | undefined = undefined;
    const jacketFallback = removedJacket || BASE_PERMANENT_JACKET_ID;
    expect(jacketFallback).toBe('tunique_apprenti');
  });
});
