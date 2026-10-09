import React, { useState, useEffect } from 'react';
import type {
  PlayerProfile,
  AvatarCustomization,
  SkinToneId,
  HairStyleId,
  HairColorId,
} from '../../types';
import { AvatarRenderer, BASE_PERMANENT_JACKET_ID, DEFAULT_CUSTOMIZATION_BY_CLASS } from '../../components/avatar/AvatarRenderer';
import { soundManager } from '../../services/audio/soundManager';
import { saveManager } from '../../services/persistence/saveManager';
import { db } from '../../services/persistence/db';
import {
  IconWardrobe,
  IconJacket,
  IconCape,
  IconCrown,
  IconSparkles,
} from '../../components/icons/GameIcons';
import { REWARD_CATALOG } from '../../engine/game/rewardManager';

interface WardrobeModalProps {
  player: PlayerProfile;
  ownedItemIds?: string[];
  onUpdateProfile: (updated: PlayerProfile) => void;
  onClose: () => void;
}

const SKIN_TONES: { id: SkinToneId; label: string; previewColor: string }[] = [
  { id: 'pale', label: 'Pâle', previewColor: '#fce7db' },
  { id: 'doree', label: 'Dorée', previewColor: '#f6d2a2' },
  { id: 'ambree', label: 'Ambrée', previewColor: '#cf8f54' },
  { id: 'ebene', label: 'Ébène', previewColor: '#6b4028' },
  { id: 'celeste', label: 'Céleste', previewColor: '#c7d2fe' },
];

const HAIR_STYLES: { id: HairStyleId; label: string }[] = [
  { id: 'court', label: 'Court Ébouriffé' },
  { id: 'court_classique', label: 'Court Classique' },
  { id: 'court_degrade', label: 'Court Dégradé' },
  { id: 'boucle', label: 'Boucles Volumineuses' },
  { id: 'tresse', label: 'Tresses & Perles' },
  { id: 'long', label: 'Long Majestueux' },
  { id: 'chignon', label: 'Chignon Savant' },
  { id: 'arcane', label: 'Flamme d\'Arcane' },
];

const HAIR_COLORS: { id: HairColorId; label: string; previewColor: string }[] = [
  { id: 'brun', label: 'Brun', previewColor: '#5c3a21' },
  { id: 'blond', label: 'Blond', previewColor: '#eab308' },
  { id: 'roux', label: 'Roux', previewColor: '#ea580c' },
  { id: 'noir', label: 'Noir', previewColor: '#1e293b' },
  { id: 'argent', label: 'Argent', previewColor: '#cbd5e1' },
  { id: 'violet', label: 'Violet', previewColor: '#9333ea' },
];

export const WardrobeModal: React.FC<WardrobeModalProps> = ({
  player,
  ownedItemIds = [],
  onUpdateProfile,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'apparence' | 'veste' | 'cape' | 'accessoire'>('apparence');
  const [saveToast, setSaveToast] = useState(false);
  const [dbOwnedIds, setDbOwnedIds] = useState<string[]>([]);

  useEffect(() => {
    async function loadDbInventory() {
      try {
        const records = await db.inventory.where('profileId').equals(player.id).toArray();
        setDbOwnedIds(records.map((r) => r.itemId));
      } catch {
        setDbOwnedIds([]);
      }
    }
    loadDbInventory();
  }, [player.id]);

  // Initial customization
  const initialCustomization: AvatarCustomization = player.customization || {
    skinTone: DEFAULT_CUSTOMIZATION_BY_CLASS[player.heroClass]?.skinTone || 'doree',
    hairStyle: DEFAULT_CUSTOMIZATION_BY_CLASS[player.heroClass]?.hairStyle || 'court',
    hairColor: DEFAULT_CUSTOMIZATION_BY_CLASS[player.heroClass]?.hairColor || 'brun',
    jacketId: BASE_PERMANENT_JACKET_ID,
    capeId: 'aucune',
    accessoryId: 'aucun',
  };

  const [current, setCurrent] = useState<AvatarCustomization>(initialCustomization);

  // Unlocked items by category (combining passed props and fetched DB inventory)
  const combinedOwnedIds = Array.from(new Set([...ownedItemIds, ...dbOwnedIds]));
  const ownedSet = new Set(combinedOwnedIds);

  const availableJackets = [
    {
      id: BASE_PERMANENT_JACKET_ID,
      name: 'Tunique d\'Apprenti (Tenue Permanente)',
      desc: 'Ta tenue de voyage originelle en cuir souple. Toujours disponible.',
    },
    ...REWARD_CATALOG.filter((i) => i.category === 'wardrobe' && i.wardrobeSlot === 'jacket' && (ownedSet.has(i.id) || i.id === player.customization?.jacketId)).map((i) => ({
      id: i.id.replace('item_', ''),
      name: i.name,
      desc: i.description,
    })),
  ];

  const availableCapes = [
    { id: 'aucune', name: 'Aucune Cape', desc: 'Voyage léger sans manteau sur les épaules.' },
    ...REWARD_CATALOG.filter((i) => i.category === 'wardrobe' && i.wardrobeSlot === 'cape' && (ownedSet.has(i.id) || i.id === player.customization?.capeId)).map((i) => ({
      id: i.id.replace('item_', ''),
      name: i.name,
      desc: i.description,
    })),
  ];

  const availableAccessories = [
    { id: 'aucun', name: 'Aucun Accessoire', desc: 'Front dégagé sans bijou ni couvre-chef.' },
    ...REWARD_CATALOG.filter((i) => i.category === 'wardrobe' && i.wardrobeSlot === 'accessory' && (ownedSet.has(i.id) || i.id === player.customization?.accessoryId)).map((i) => ({
      id: i.id.replace('item_', ''),
      name: i.name,
      desc: i.description,
    })),
  ];

  const handleSave = async () => {
    soundManager.playReward();
    const updated: PlayerProfile = {
      ...player,
      customization: current,
      updatedAt: Date.now(),
    };

    await db.profiles.put(updated);
    saveManager.stageProfile(updated);
    saveManager.markDirty(true);
    onUpdateProfile(updated);

    setSaveToast(true);
    setTimeout(() => {
      setSaveToast(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-md p-3 sm:p-5">
      <div className="relative w-full max-w-4xl max-h-[92dvh] sm:max-h-[88vh] flex flex-col rounded-3xl border-2 border-amber-500/60 bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-950 shadow-2xl text-slate-100 overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-indigo-900/60 p-4 sm:p-5 shrink-0 bg-slate-900/90 z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-purple-950/80 border border-purple-500/60 flex items-center justify-center shadow-md">
              <IconWardrobe className="w-6 h-6 text-amber-300" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-amber-300 font-serif leading-tight">
                Garde-Robe & Personnalisation du Héros
              </h2>
              <p className="text-xs text-indigo-300">
                Ajuste la carnation, la coiffure et équipe les tenues et reliques de tes victoires !
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Fermer la garde-robe"
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Content Body: Scrollable area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 grid grid-cols-1 md:grid-cols-12 gap-4 items-start min-h-0">
          
          {/* Left Column: Live Avatar Display & Hero Card */}
          <div className="md:col-span-5 flex flex-col items-center justify-center p-4 rounded-2xl border border-indigo-800/60 bg-slate-950/85">
            <div className="relative p-2 rounded-full border-2 border-amber-400/80 bg-gradient-to-b from-purple-900/40 to-slate-950 shadow-xl mb-3">
              <AvatarRenderer
                customization={current}
                heroClass={player.heroClass}
                size={130}
                className="w-28 h-28 sm:w-36 sm:h-36"
              />
            </div>
            <h3 className="text-base font-bold text-slate-100 font-serif">{player.name}</h3>
            <span className="text-xs text-amber-300 font-mono">
              Niveau {player.level} • {player.grade}
            </span>
            <div className="mt-2 text-[11px] text-slate-400 text-center max-w-xs leading-relaxed hidden sm:block">
              <span className="text-emerald-400 font-semibold">Règle de tenue permanente :</span> Ton héros conserve toujours sa tenue de base et peut enfiler les nouvelles étoffes.
            </div>
          </div>

          {/* Right Column: Customization Tabs and Option Pickers */}
          <div className="md:col-span-7 flex flex-col rounded-2xl border border-indigo-800/60 bg-slate-950/70 p-3 sm:p-4">
            
            {/* Category Navigation Tabs */}
            <div className="flex gap-1.5 border-b border-indigo-900/60 pb-2 shrink-0 overflow-x-auto">
              <button
                onClick={() => {
                  soundManager.playClick();
                  setActiveTab('apparence');
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 shrink-0 ${
                  activeTab === 'apparence'
                    ? 'bg-amber-500 text-slate-950 shadow-md'
                    : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <IconSparkles className="w-3.5 h-3.5" />
                <span>Carnation & Cheveux</span>
              </button>

              <button
                onClick={() => {
                  soundManager.playClick();
                  setActiveTab('veste');
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 shrink-0 ${
                  activeTab === 'veste'
                    ? 'bg-amber-500 text-slate-950 shadow-md'
                    : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <IconJacket className="w-3.5 h-3.5" />
                <span>Vestes ({availableJackets.length})</span>
              </button>

              <button
                onClick={() => {
                  soundManager.playClick();
                  setActiveTab('cape');
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 shrink-0 ${
                  activeTab === 'cape'
                    ? 'bg-amber-500 text-slate-950 shadow-md'
                    : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <IconCape className="w-3.5 h-3.5" />
                <span>Capes ({availableCapes.length})</span>
              </button>

              <button
                onClick={() => {
                  soundManager.playClick();
                  setActiveTab('accessoire');
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 shrink-0 ${
                  activeTab === 'accessoire'
                    ? 'bg-amber-500 text-slate-950 shadow-md'
                    : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <IconCrown className="w-3.5 h-3.5" />
                <span>Accessoires ({availableAccessories.length})</span>
              </button>
            </div>

            {/* Controls panel */}
            <div className="py-3 space-y-4">
              
              {/* Tab: Apparence (Carnation & Hair) */}
              {activeTab === 'apparence' && (
                <div className="space-y-4">
                  {/* Gender Selection */}
                  <div>
                    <label className="block text-xs font-bold text-amber-300 mb-1.5 uppercase tracking-wide">
                      Genre de l'Avatar
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {(['garcon', 'fille', 'neutre'] as const).map((g) => (
                        <button
                          key={g}
                          onClick={() => {
                            soundManager.playClick();
                            setCurrent({ ...current, gender: g });
                          }}
                          className={`p-2.5 rounded-xl border-2 text-center transition cursor-pointer text-xs font-bold uppercase ${
                            (current.gender || 'neutre') === g
                              ? 'border-amber-400 bg-amber-950/40 text-amber-200 shadow-md'
                              : 'border-slate-800 bg-slate-900/60 text-slate-300 hover:bg-slate-800'
                          }`}
                        >
                          {g === 'garcon' ? 'Garçon' : g === 'fille' ? 'Fille' : 'Neutre'}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Carnation / Skin Tone */}
                  <div>
                    <label className="block text-xs font-bold text-amber-300 mb-1.5 uppercase tracking-wide">
                      Carnation & Teint
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {SKIN_TONES.map((st) => (
                        <button
                          key={st.id}
                          onClick={() => {
                            soundManager.playClick();
                            setCurrent({ ...current, skinTone: st.id });
                          }}
                          className={`p-2 rounded-xl border-2 text-left flex items-center gap-2.5 transition cursor-pointer ${
                            current.skinTone === st.id
                              ? 'border-amber-400 bg-amber-950/40 text-amber-200'
                              : 'border-slate-800 bg-slate-900/60 text-slate-300 hover:bg-slate-800'
                          }`}
                        >
                          <span
                            className="w-5 h-5 rounded-full border border-slate-700 shrink-0 ml-0.5"
                            style={{ backgroundColor: st.previewColor }}
                          />
                          <span className="text-xs font-semibold">{st.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Hairstyle */}
                  <div>
                    <label className="block text-xs font-bold text-amber-300 mb-1.5 uppercase tracking-wide">
                      Coupe de Cheveux
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {HAIR_STYLES.map((hs) => (
                        <button
                          key={hs.id}
                          onClick={() => {
                            soundManager.playClick();
                            setCurrent({ ...current, hairStyle: hs.id });
                          }}
                          className={`p-2.5 rounded-xl border-2 text-left transition cursor-pointer text-xs font-semibold ${
                            current.hairStyle === hs.id
                              ? 'border-amber-400 bg-amber-950/40 text-amber-200'
                              : 'border-slate-800 bg-slate-900/60 text-slate-300 hover:bg-slate-800'
                          }`}
                        >
                          {hs.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Hair Color */}
                  <div>
                    <label className="block text-xs font-bold text-amber-300 mb-1.5 uppercase tracking-wide">
                      Couleur des Cheveux
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {HAIR_COLORS.map((hc) => (
                        <button
                          key={hc.id}
                          onClick={() => {
                            soundManager.playClick();
                            setCurrent({ ...current, hairColor: hc.id });
                          }}
                          className={`p-2.5 rounded-xl border-2 text-left flex items-center gap-2.5 transition cursor-pointer ${
                            current.hairColor === hc.id
                              ? 'border-amber-400 bg-amber-950/40 text-amber-200'
                              : 'border-slate-800 bg-slate-900/60 text-slate-300 hover:bg-slate-800'
                          }`}
                        >
                          <span
                            className="w-4 h-4 rounded-full border border-slate-700 shrink-0 ml-0.5"
                            style={{ backgroundColor: hc.previewColor }}
                          />
                          <span className="text-xs font-semibold">{hc.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Tab: Vestes */}
              {activeTab === 'veste' && (
                <div className="space-y-2.5">
                  <p className="text-xs text-indigo-300 mb-2">
                    Choisis la tenue de ton héros. La tenue d'apprenti de base reste disponible en permanence.
                  </p>
                  {availableJackets.map((j) => {
                    const isEquipped = current.jacketId === j.id;
                    return (
                      <button
                        key={j.id}
                        onClick={() => {
                          soundManager.playClick();
                          setCurrent({ ...current, jacketId: j.id });
                        }}
                        className={`w-full p-3 rounded-2xl border-2 text-left transition cursor-pointer flex items-center justify-between gap-3 ${
                          isEquipped
                            ? 'border-amber-400 bg-amber-950/40 text-amber-200'
                            : 'border-slate-800 bg-slate-900/60 text-slate-300 hover:bg-slate-800'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-xl bg-slate-950 border border-slate-800 shrink-0">
                            <IconJacket className="w-5 h-5 text-amber-400" />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-slate-100">{j.name}</p>
                            <p className="text-[11px] text-slate-400 mt-0.5">{j.desc}</p>
                          </div>
                        </div>
                        {isEquipped && (
                          <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-500 text-slate-950 px-2 py-0.5 rounded-lg shrink-0">
                            Équipé
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Tab: Capes */}
              {activeTab === 'cape' && (
                <div className="space-y-2.5">
                  <p className="text-xs text-indigo-300 mb-2">
                    Les capes s'ajustent derrière les épaules et arborent un fermoir orné d'une gemme royale.
                  </p>
                  {availableCapes.map((c) => {
                    const isEquipped = current.capeId === c.id;
                    return (
                      <button
                        key={c.id}
                        onClick={() => {
                          soundManager.playClick();
                          setCurrent({ ...current, capeId: c.id });
                        }}
                        className={`w-full p-3 rounded-2xl border-2 text-left transition cursor-pointer flex items-center justify-between gap-3 ${
                          isEquipped
                            ? 'border-amber-400 bg-amber-950/40 text-amber-200'
                            : 'border-slate-800 bg-slate-900/60 text-slate-300 hover:bg-slate-800'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-xl bg-slate-950 border border-slate-800 shrink-0">
                            <IconCape className="w-5 h-5 text-purple-400" />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-slate-100">{c.name}</p>
                            <p className="text-[11px] text-slate-400 mt-0.5">{c.desc}</p>
                          </div>
                        </div>
                        {isEquipped && (
                          <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-500 text-slate-950 px-2 py-0.5 rounded-lg shrink-0">
                            Équipé
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Tab: Accessoires */}
              {activeTab === 'accessoire' && (
                <div className="space-y-2.5">
                  <p className="text-xs text-indigo-300 mb-2">
                    Diadèmes, masques, lunettes de savant ou casques ailés débloqués au fil des quêtes.
                  </p>
                  {availableAccessories.map((a) => {
                    const isEquipped = current.accessoryId === a.id;
                    return (
                      <button
                        key={a.id}
                        onClick={() => {
                          soundManager.playClick();
                          setCurrent({ ...current, accessoryId: a.id });
                        }}
                        className={`w-full p-3 rounded-2xl border-2 text-left transition cursor-pointer flex items-center justify-between gap-3 ${
                          isEquipped
                            ? 'border-amber-400 bg-amber-950/40 text-amber-200'
                            : 'border-slate-800 bg-slate-900/60 text-slate-300 hover:bg-slate-800'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-xl bg-slate-950 border border-slate-800 shrink-0">
                            <IconCrown className="w-5 h-5 text-yellow-400" />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-slate-100">{a.name}</p>
                            <p className="text-[11px] text-slate-400 mt-0.5">{a.desc}</p>
                          </div>
                        </div>
                        {isEquipped && (
                          <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-500 text-slate-950 px-2 py-0.5 rounded-lg shrink-0">
                            Équipé
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="border-t border-indigo-900/60 p-4 sm:p-5 shrink-0 bg-slate-950/90 flex items-center justify-between gap-3 z-10">
          <div className="text-xs text-slate-400">
            {saveToast && (
              <span className="text-emerald-400 font-bold animate-in fade-in">
                ✓ Tenue enregistrée avec succès !
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-800 bg-slate-900 text-slate-300 hover:text-white text-xs font-bold transition cursor-pointer"
            >
              Fermer
            </button>
            <button
              onClick={handleSave}
              className="px-5 py-2.5 rounded-xl font-bold bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-slate-950 shadow-md text-xs sm:text-sm font-serif transition cursor-pointer"
            >
              Enregistrer ma Tenue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
