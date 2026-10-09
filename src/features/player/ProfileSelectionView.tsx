import React, { useState, useEffect } from 'react';
import type { PlayerProfile, SchoolGrade, SchoolWorld, HeroClass } from '../../types';
import { db } from '../../services/persistence/db';
import { soundManager } from '../../services/audio/soundManager';
import { formatDateToIsoDay } from '../../engine/game/streakManager';
import {
  IconClassMage,
  IconClassWarrior,
  IconClassAlchemist,
  IconClassRanger,
  IconD20,
  IconCoin,
  IconFlame,
  MathGameBrandLogo,
} from '../../components/icons/GameIcons';

interface ProfileSelectionViewProps {
  onSelectProfile: (profile: PlayerProfile) => void;
}

const CLASS_DETAILS: Record<
  HeroClass,
  { name: string; desc: string; renderIcon: (className?: string) => React.ReactNode }
> = {
  mage: {
    name: 'Mage Arithmancien',
    desc: 'Canalise la puissance des formules et des runes arcaniques pour vaincre ses adversaires.',
    renderIcon: (cls = 'w-7 h-7') => <IconClassMage className={cls} />,
  },
  alchimiste: {
    name: 'Alchimiste des Nombres',
    desc: 'Maître des potions, de la proportionnalité et du partage équitable des ressources.',
    renderIcon: (cls = 'w-7 h-7') => <IconClassAlchemist className={cls} />,
  },
  guerrier: {
    name: 'Guerrier Géomètre',
    desc: 'Bâtisseur de boucliers géométriques solides et protecteur des théorèmes sacrés.',
    renderIcon: (cls = 'w-7 h-7') => <IconClassWarrior className={cls} />,
  },
  rodeur: {
    name: 'Rôdeur des Équations',
    desc: 'Traqueur agile d\'inconnues secrètes x et explorateur des zones oubliées.',
    renderIcon: (cls = 'w-7 h-7') => <IconClassRanger className={cls} />,
  },
};

export const ProfileSelectionView: React.FC<ProfileSelectionViewProps> = ({ onSelectProfile }) => {
  const [existingProfiles, setExistingProfiles] = useState<PlayerProfile[]>([]);
  const [isCreatingNew, setIsCreatingNew] = useState(false);

  // Form State
  const [heroName, setHeroName] = useState('');
  const [selectedWorld, setSelectedWorld] = useState<SchoolWorld>('primaire');
  const [selectedGrade, setSelectedGrade] = useState<SchoolGrade>('CM1');
  const [selectedClass, setSelectedClass] = useState<HeroClass>('mage');

  useEffect(() => {
    async function loadProfiles() {
      const all = await db.profiles.toArray();
      setExistingProfiles(all);
      if (all.length === 0) {
        setIsCreatingNew(true);
      }
    }
    loadProfiles();
  }, []);

  const handleWorldChange = (world: SchoolWorld) => {
    soundManager.playClick();
    setSelectedWorld(world);
    if (world === 'primaire') {
      setSelectedGrade('CM1');
    } else {
      setSelectedGrade('5e');
    }
  };

  const handleCreateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalName = heroName.trim() || 'Aventurier des Nombres';

    const newProfile: PlayerProfile = {
      id: `hero_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      name: finalName,
      avatar: selectedClass, // Store class identifier
      heroClass: selectedClass,
      grade: selectedGrade,
      world: selectedWorld,
      level: 1,
      xp: 0,
      xpToNextLevel: 100,
      gold: 50,
      hp: 100,
      maxHp: 100,
      mana: 50,
      maxMana: 50,
      unlockedZoneIds: [selectedWorld === 'primaire' ? 'zone_val_arithmetique' : 'zone_bastion_relatifs'],
      currentZoneId: selectedWorld === 'primaire' ? 'zone_val_arithmetique' : 'zone_bastion_relatifs',
      dailyStreak: 1,
      lastLoginDate: formatDateToIsoDay(),
      maxStreak: 1,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    soundManager.playReward();
    await db.profiles.put(newProfile);
    onSelectProfile(newProfile);
  };

  const renderHeroAvatar = (p: PlayerProfile) => {
    const cls = (p.heroClass || (p.avatar in CLASS_DETAILS ? p.avatar : 'mage')) as HeroClass;
    const detail = CLASS_DETAILS[cls] || CLASS_DETAILS.mage;
    return detail.renderIcon('w-7 h-7');
  };

  return (
    <div className="w-full flex items-center justify-center py-2 sm:py-4">
      <div className="w-full max-w-xl rounded-3xl border-2 border-amber-500/50 bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-950 p-5 sm:p-7 shadow-2xl text-slate-100">
        
        {/* Brand Header */}
        <div className="flex flex-col items-center text-center mb-5">
          <MathGameBrandLogo className="mb-2" />
          <p className="text-xs text-indigo-200 mt-1 max-w-md leading-relaxed">
            L'aventure RPG fantastique des mathématiques, inspirée des repères scolaires du primaire et du collège.
          </p>
        </div>

        {/* Existing profiles list if available */}
        {!isCreatingNew && existingProfiles.length > 0 && (
          <div className="space-y-3.5">
            <h2 className="text-xs font-black uppercase tracking-widest text-amber-400 text-center">
              Choisis ton Aventurier
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-72 overflow-y-auto pr-1">
              {existingProfiles.map((p) => (
                <button
                  key={p.id}
                  onClick={() => {
                    soundManager.playClick();
                    onSelectProfile(p);
                  }}
                  className="rounded-2xl border-2 border-indigo-800/80 bg-slate-950/80 p-3.5 text-left hover:border-amber-400 hover:bg-indigo-950/50 transition cursor-pointer flex items-start gap-3 group shadow-md"
                >
                  <div className="w-12 h-12 rounded-xl bg-indigo-950 border border-indigo-700/60 flex items-center justify-center shrink-0 group-hover:scale-105 transition">
                    {renderHeroAvatar(p)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-bold text-slate-100 group-hover:text-amber-300 break-words leading-snug">
                      {p.name}
                    </h3>
                    <p className="text-xs text-indigo-300 mt-0.5">
                      Classe {p.grade} • Niveau {p.level}
                    </p>
                    <div className="flex items-center gap-2 text-[11px] text-amber-400/90 font-mono mt-1">
                      <span className="flex items-center gap-1 font-semibold">
                        {p.gold} <IconCoin className="w-3.5 h-3.5" />
                      </span>
                      <span>•</span>
                      <span className="text-orange-400 font-semibold flex items-center gap-0.5">
                        <IconFlame className="w-3 h-3" /> {p.dailyStreak || 1} j.
                      </span>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            <div className="pt-2 text-center">
              <button
                onClick={() => {
                  soundManager.playClick();
                  setIsCreatingNew(true);
                }}
                className="text-xs text-amber-400 hover:text-amber-300 font-bold underline underline-offset-4 cursor-pointer"
              >
                + Créer un nouveau héros
              </button>
            </div>
          </div>
        )}

        {/* Profile Creation Form */}
        {isCreatingNew && (
          <form onSubmit={handleCreateProfile} className="space-y-4">
            <div className="flex items-center justify-between border-b border-indigo-900/60 pb-2">
              <h2 className="text-xs font-black uppercase tracking-widest text-amber-400">
                Créer ton Héros
              </h2>
              {existingProfiles.length > 0 && (
                <button
                  type="button"
                  onClick={() => setIsCreatingNew(false)}
                  className="text-xs text-slate-400 hover:text-white cursor-pointer"
                >
                  ← Retour aux héros
                </button>
              )}
            </div>

            {/* Pseudonym */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Nom d'aventurier ou Prénom
              </label>
              <input
                type="text"
                required
                value={heroName}
                onChange={(e) => setHeroName(e.target.value)}
                placeholder="Ex: Arthur, Léa, Merlin, Diane..."
                className="w-full rounded-xl border border-indigo-700 bg-slate-950 px-3.5 py-2 text-sm text-slate-100 placeholder-slate-500 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-400/30"
              />
            </div>

            {/* World Selection */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Monde de départ
              </label>
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => handleWorldChange('primaire')}
                  className={`p-3 rounded-2xl border-2 text-left transition cursor-pointer ${
                    selectedWorld === 'primaire'
                      ? 'border-emerald-500 bg-emerald-950/60 text-emerald-200 ring-2 ring-emerald-500/40'
                      : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:bg-slate-900'
                  }`}
                >
                  <p className="text-xs font-bold text-emerald-300">Monde des Fondations</p>
                  <p className="text-[11px] text-slate-300 leading-tight mt-0.5">Primaire (CP au CM2)</p>
                </button>
                <button
                  type="button"
                  onClick={() => handleWorldChange('college')}
                  className={`p-3 rounded-2xl border-2 text-left transition cursor-pointer ${
                    selectedWorld === 'college'
                      ? 'border-cyan-500 bg-cyan-950/60 text-cyan-200 ring-2 ring-cyan-500/40'
                      : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:bg-slate-900'
                  }`}
                >
                  <p className="text-xs font-bold text-cyan-300">Royaume des Savoirs</p>
                  <p className="text-[11px] text-slate-300 leading-tight mt-0.5">Collège (6e à la 3e)</p>
                </button>
              </div>
            </div>

            {/* Grade Selection */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Classe scolaire
              </label>
              <div className="flex flex-wrap gap-2">
                {(selectedWorld === 'primaire'
                  ? (['CP', 'CE1', 'CE2', 'CM1', 'CM2'] as const)
                  : (['6e', '5e', '4e', '3e'] as const)
                ).map((grade) => (
                  <button
                    key={grade}
                    type="button"
                    onClick={() => {
                      soundManager.playClick();
                      setSelectedGrade(grade);
                    }}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                      selectedGrade === grade
                        ? 'bg-amber-500 text-slate-950 shadow-md ring-2 ring-amber-400/50'
                        : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    {grade}
                  </button>
                ))}
              </div>
            </div>

            {/* Hero Class Selection - Text completely visible without ellipsis truncate */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Classe d'Aventurier D&D
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {(Object.keys(CLASS_DETAILS) as HeroClass[]).map((cls) => {
                  const info = CLASS_DETAILS[cls];
                  const isSelected = selectedClass === cls;
                  return (
                    <button
                      key={cls}
                      type="button"
                      onClick={() => {
                        soundManager.playClick();
                        setSelectedClass(cls);
                      }}
                      className={`p-3 rounded-2xl border-2 text-left transition cursor-pointer flex items-start gap-2.5 ${
                        isSelected
                          ? 'border-amber-400 bg-amber-950/40 text-amber-200 ring-2 ring-amber-400/40'
                          : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:bg-slate-900'
                      }`}
                    >
                      <div className="p-1 rounded-xl bg-slate-900 border border-slate-700 shrink-0">
                        {info.renderIcon()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-slate-200 leading-tight">{info.name}</p>
                        <p className="text-[11px] text-slate-300 leading-relaxed mt-0.5 break-words">
                          {info.desc}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-2xl font-bold bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 text-slate-950 shadow-lg shadow-amber-950/50 transition cursor-pointer text-xs sm:text-sm font-serif tracking-wide"
            >
              Créer mon Héros & Entrer dans le Jeu !
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
