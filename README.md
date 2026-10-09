# MathGame par Webdevoo

**MathGame par Webdevoo** est une application web progressive (PWA) éducative sous forme de RPG d'aventure, destinée aux élèves de l'école primaire et du collège français (du CP à la 3e).

L'application est **100% fonctionnelle hors connexion** après sa mise en cache initiale, sans backend obligatoire, sans compte en ligne imposé, et stocke l'intégralité de la progression de manière atomique dans IndexedDB via Dexie.js.

---

## 1. Fonctionnalités Implémentées

### Pédagogie & Conformité Éducation Nationale
- **Référentiel officiel** : Conforme aux attendus des programmes de l'Éducation nationale française (Cycle 2, Cycle 3, Cycle 4).
- **Deux Mondes Scolaires distincts** :
  - *Monde des Fondations* (Primaire : CP, CE1, CE2, CM1, CM2).
  - *Royaume des Savoirs* (Collège : 6e, 5e, 4e, 3e).
- **Les 6 Compétences Mathématiques Fondamentales** : Chercher, Modéliser, Représenter, Raisonner, Calculer, Communiquer.
- **Domaines scolaires** : Nombres et calculs, Grandeurs et mesures, Espace et géométrie, Données et probabilités, Proportionnalité, Équations.
- **Indices progressifs en 3 niveaux** : Orientation sans donner la réponse, formule intermédiaire, puis explication détaillée.
- **Tutoriels visuels interactifs** : Explications animées sans vidéos distantes (compléments à 10, décomposition de multiplication en rangées, cristaux fractionnaires, nombres relatifs sous zéro, théorème de Pythagore).

### Aventure & Gameplay RPG
- **Série Quotidienne (Daily Streak)** : Récompense la régularité d'entraînement avec des bonus d'or croissants (25 Or au J1, 40 Or au J2... jusqu'à 125 Or au J7). Stocké de manière atomique dans IndexedDB (`dailyStreak`, `lastLoginDate`, `maxStreak`).
- **Multi-profils locaux** : Possibilité de créer et gérer plusieurs héros indépendants sur un même appareil (tablette de classe ou ordinateur familial).
- **Carte du Monde interactive** : Zones thématiques (Le Val Arithmétique, La Citadelle des Fractions, Le Bastion des Relatifs, Le Sanctuaire de Pythagore...), déblocage par palier de niveau.
- **Combats mathématiques bienveillants** : Affrontements contre des créatures runiques (Gobelins, Golems, Sphinx...), lancer de sorts par résolution mathématique, boucliers et potions sans défaite punitive.
- **Inventaire & Badges** : Reliques, fioles de mana, élixirs, et médailles officielles pour chacune des 6 compétences.

### Persistance & Sauvegarde (IndexedDB & JSON)
- **Source de vérité locale** : Base IndexedDB structurée (`MathGameWebdevooDB`).
- **Sauvegarde périodique (toutes les 5 minutes)** : Vérification du flag `isDirty` afin d'éviter les écritures superflues.
- **Sauvegarde événementielle** : Écriture atomique déclenchée lors des récompenses de complétion, fin de quête ou montée de niveau.
- **Sérialisation & Debounce** : File d'attente promise-queue et debounce (750 ms) pour regrouper les écritures rapprochées.
- **Export & Import JSON universel** : Téléchargement et restauration de fichier avec validation stricte de schéma et calcul de checksum.
- **Sauvegarde externe automatique facultative** : Intégration de la File System Access API (`showSaveFilePicker`) avec consentement explicite de l'utilisateur.

### Audio & Animations Hors Ligne
- **Moteur audio procédural Web Audio API** : 100% synthétisé par le code (Do-Mi-Sol-Do cristallin, fanfares, lancements de sorts, clics). Aucune ressource audio distante requise.
- **Accessibilité & Ergonomie** : Prise en charge de `prefers-reduced-motion`, coupure globale des effets sonores, contrastes WCAG AA, interface tactile 100% responsive sur mobile et tablette.

### Progressive Web App (PWA)
- Manifeste `manifest.webmanifest` complet avec icônes (192px, 512px, maskable, SVG).
- Service Worker `sw.js` avec mise en cache applicative et stratégie de secours hors ligne.
- Bouton d'installation in-app avec guide dédié pour iOS Safari.
- Indicateur visuel d'état hors ligne.

---

## 2. Commandes de Développement & Tests

```bash
# Lancement du serveur de développement (port 3000)
npm run dev

# Exécution des tests unitaires et pédagogiques
npm test

# Validation TypeScript et linting
npm run lint

# Compilation pour la production
npm run build
```

---

## 3. Structure des Données de Sauvegarde (JSON)

```json
{
  "formatVersion": "1.0.0",
  "schemaVersion": 1,
  "exportedAt": 1775692800000,
  "generator": "MathGame par Webdevoo",
  "profile": {
    "id": "hero_123",
    "name": "Arthur",
    "avatar": "🧙‍♂️",
    "heroClass": "mage",
    "grade": "CM1",
    "world": "primaire",
    "level": 2,
    "xp": 150,
    "gold": 120,
    "hp": 100,
    "mana": 50,
    "unlockedZoneIds": ["zone_val_arithmetique"]
  },
  "masteryRecords": [],
  "questStates": [],
  "inventory": [],
  "achievements": [],
  "settings": {
    "soundEnabled": true,
    "reducedMotion": false,
    "externalJsonBackupEnabled": false
  },
  "checksum": "mg_1a2b3c"
}
```

---

## 4. Statut des Livrables

| Composant | Statut | Vérification |
| :--- | :--- | :--- |
| Moteur Pédagogique (CP à 3e) | ✅ Implémenté | Validé par tests Vitest |
| Persistance IndexedDB & Debounce | ✅ Implémenté | Validé par tests & SaveManager |
| Export & Import JSON | ✅ Implémenté | Validé par tests de validation |
| File System Access API | ✅ Implémenté | Solution avec fallback universel |
| PWA & Service Worker | ✅ Implémenté | sw.js & manifest.webmanifest |
| Sons Web Audio API | ✅ Implémenté | Synthétiseur procédural temps réel |
| Tutoriels Interactifs | ✅ Implémenté | Visualisations SVG / DOM |
| Carte RPG & Combats | ✅ Implémenté | Arène responsive & Quêtes scénarisées |
