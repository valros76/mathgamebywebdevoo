import { describe, it, expect } from 'vitest';
import { CURRICULUM_NOTIONS, getNotionsForGrade } from '../src/engine/pedagogy/curriculum';
import {
  getExerciseForNotion,
  updateMastery,
  EXERCISE_DATABASE,
} from '../src/engine/pedagogy/exerciseGenerator';

describe('Moteur Pédagogique — Repères de Mathématiques (CP à 3e)', () => {
  it('contient des notions pédagogiques pour tous les niveaux du CP à la 3e', () => {
    const grades = ['CP', 'CE1', 'CE2', 'CM1', 'CM2', '6e', '5e', '4e', '3e'] as const;
    grades.forEach((grade) => {
      const notions = getNotionsForGrade(grade);
      expect(notions.length).toBeGreaterThan(0);
      notions.forEach((n) => {
        expect(n.grade).toBe(grade);
        expect(n.officialRef).toBeDefined();
        expect(n.learningObjectives.length).toBeGreaterThan(0);
        expect(n.competences.length).toBeGreaterThan(0);
      });
    });
  });

  it('génère des exercices valides pour les notions représentatives', () => {
    const cpEx = getExerciseForNotion('cp_additions_visuelles', 0);
    expect(cpEx.type).toBe('numeric');
    expect(cpEx.correctNumericAnswer).toBe(3);
    expect(cpEx.hints.length).toBe(3);

    const ce1Ex = getExerciseForNotion('ce1_tables_multiplication', 0);
    expect(ce1Ex.correctNumericAnswer).toBe(20);

    const pythEx = getExerciseForNotion('4e_theoreme_pythagore', 0);
    expect(pythEx.correctNumericAnswer).toBe(5);
  });

  it('calcule la maîtrise de manière juste et progressive', () => {
    // 1 succès initial -> en_cours
    let mastery = updateMastery(undefined, 'cp_additions_visuelles', 'CP', true, 0);
    expect(mastery.masteryLevel).toBe('en_cours');
    expect(mastery.successCount).toBe(1);

    // 2ème succès d'affilée sans indice -> consolide
    mastery = updateMastery(mastery, 'cp_additions_visuelles', 'CP', true, 0);
    expect(mastery.masteryLevel).toBe('consolide');

    // Erreur -> réinitialise la série consécutive mais conserve les succès
    mastery = updateMastery(mastery, 'cp_additions_visuelles', 'CP', false, 1);
    expect(mastery.consecutiveSuccesses).toBe(0);

    // 4 succès dont 3 consécutifs sans indice -> maitrise
    mastery = updateMastery(mastery, 'cp_additions_visuelles', 'CP', true, 0);
    mastery = updateMastery(mastery, 'cp_additions_visuelles', 'CP', true, 0);
    mastery = updateMastery(mastery, 'cp_additions_visuelles', 'CP', true, 0);
    expect(mastery.masteryLevel).toBe('maitrise');
  });
});
