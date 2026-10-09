import React from 'react';
import type {
  AvatarCustomization,
  HeroClass,
  SkinToneId,
  HairStyleId,
  HairColorId,
} from '../../types';

interface AvatarRendererProps {
  customization?: AvatarCustomization;
  heroClass?: HeroClass;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | number;
  className?: string;
}

export const DEFAULT_CUSTOMIZATION_BY_CLASS: Record<HeroClass, AvatarCustomization> = {
  mage: {
    skinTone: 'pale',
    hairStyle: 'arcane',
    hairColor: 'violet',
    jacketId: 'veste_arcaniste',
    capeId: 'cape_etoilee',
    accessoryId: 'chapeau_pointu',
  },
  alchimiste: {
    skinTone: 'doree',
    hairStyle: 'boucle',
    hairColor: 'roux',
    jacketId: 'manteau_alchimiste',
    capeId: 'cape_emeraude',
    accessoryId: 'lunettes_savant',
  },
  guerrier: {
    skinTone: 'ambree',
    hairStyle: 'court',
    hairColor: 'brun',
    jacketId: 'cuirasse_geometre',
    capeId: 'cape_pourpre',
    accessoryId: 'casque_ailes',
  },
  rodeur: {
    skinTone: 'ebene',
    hairStyle: 'tresse',
    hairColor: 'noir',
    jacketId: 'tunique_rodeur',
    capeId: 'cape_azur',
    accessoryId: 'masque_chasseur',
  },
};

export const BASE_PERMANENT_JACKET_ID = 'tunique_apprenti';

const SIZE_MAP: Record<string, string> = {
  xs: 'w-7 h-7',
  sm: 'w-10 h-10',
  md: 'w-14 h-14',
  lg: 'w-24 h-24',
  xl: 'w-36 h-36',
};

// Skin tone color palette (base and shaded)
const SKIN_PALETTE: Record<SkinToneId, { base: string; shadow: string; blush: string }> = {
  pale: { base: '#fce7db', shadow: '#f5c3ad', blush: '#fda4af' },
  doree: { base: '#f6d2a2', shadow: '#e0ab6a', blush: '#fb923c' },
  ambree: { base: '#cf8f54', shadow: '#aa682e', blush: '#e11d48' },
  ebene: { base: '#6b4028', shadow: '#4a2814', blush: '#be123c' },
  celeste: { base: '#c7d2fe', shadow: '#818cf8', blush: '#a78bfa' }, // magical elf / astral
};

// Hair color palette
const HAIR_PALETTE: Record<HairColorId, { base: string; highlight: string; shadow: string }> = {
  brun: { base: '#5c3a21', highlight: '#784d2f', shadow: '#3b2212' },
  blond: { base: '#eab308', highlight: '#fef08a', shadow: '#ca8a04' },
  roux: { base: '#ea580c', highlight: '#fb923c', shadow: '#9a3412' },
  noir: { base: '#1e293b', highlight: '#334155', shadow: '#0f172a' },
  argent: { base: '#cbd5e1', highlight: '#f8fafc', shadow: '#94a3b8' },
  violet: { base: '#9333ea', highlight: '#c084fc', shadow: '#581c87' },
};

export const AvatarRenderer: React.FC<AvatarRendererProps> = ({
  customization,
  heroClass = 'mage',
  size = 'md',
  className = '',
}) => {
  const uid = React.useId().replace(/:/g, '');
  // Safe defaults merged with class fallback and permanent base garment guarantee
  const effective: AvatarCustomization = {
    skinTone: customization?.skinTone || DEFAULT_CUSTOMIZATION_BY_CLASS[heroClass]?.skinTone || 'doree',
    hairStyle: customization?.hairStyle || DEFAULT_CUSTOMIZATION_BY_CLASS[heroClass]?.hairStyle || 'court',
    hairColor: customization?.hairColor || DEFAULT_CUSTOMIZATION_BY_CLASS[heroClass]?.hairColor || 'brun',
    // Rule: Base permanent outfit is guaranteed
    jacketId: customization?.jacketId || DEFAULT_CUSTOMIZATION_BY_CLASS[heroClass]?.jacketId || BASE_PERMANENT_JACKET_ID,
    capeId: customization?.capeId || 'aucune',
    accessoryId: customization?.accessoryId || 'aucun',
  };

  const skin = SKIN_PALETTE[effective.skinTone] || SKIN_PALETTE.doree;
  const hair = HAIR_PALETTE[effective.hairColor] || HAIR_PALETTE.brun;

  const sizeClass = typeof size === 'string' ? SIZE_MAP[size] || 'w-14 h-14' : '';
  const inlineSize = typeof size === 'number' ? { width: size, height: size } : undefined;

  return (
    <div
      className={`relative inline-flex items-center justify-center shrink-0 ${sizeClass} ${className}`}
      style={inlineSize}
    >
      <svg
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-md select-none"
      >
        <defs>
          {/* Background Aura */}
          <radialGradient id={`auraGrad_${uid}`} cx="60" cy="60" r="58" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#312e81" stopOpacity="0.8" />
            <stop offset="70%" stopColor="#1e1b4b" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#0f172a" stopOpacity="1" />
          </radialGradient>

          {/* Skin Gradient */}
          <linearGradient id={`skinGrad_${uid}`} x1="60" y1="20" x2="60" y2="85" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor={skin.base} />
            <stop offset="100%" stopColor={skin.shadow} />
          </linearGradient>

          {/* Cape Gradients */}
          <linearGradient id={`capeGrad_azur_${uid}`} x1="60" y1="40" x2="60" y2="120" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#0284c7" />
            <stop offset="100%" stopColor="#0c4a6e" />
          </linearGradient>
          <linearGradient id={`capeGrad_etoilee_${uid}`} x1="60" y1="40" x2="60" y2="120" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#7e22ce" />
            <stop offset="100%" stopColor="#2e1065" />
          </linearGradient>
          <linearGradient id={`capeGrad_emeraude_${uid}`} x1="60" y1="40" x2="60" y2="120" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#059669" />
            <stop offset="100%" stopColor="#064e3b" />
          </linearGradient>
          <linearGradient id={`capeGrad_pourpre_${uid}`} x1="60" y1="40" x2="60" y2="120" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#be123c" />
            <stop offset="100%" stopColor="#4c0519" />
          </linearGradient>
          <linearGradient id={`capeGrad_phenix_${uid}`} x1="60" y1="40" x2="60" y2="120" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#ea580c" />
            <stop offset="100%" stopColor="#7c2d12" />
          </linearGradient>
          <linearGradient id={`capeGrad_or_${uid}`} x1="60" y1="40" x2="60" y2="120" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#eab308" />
            <stop offset="100%" stopColor="#78350f" />
          </linearGradient>

          {/* Hair Gradient */}
          <linearGradient id={`hairGrad_${uid}`} x1="60" y1="10" x2="60" y2="60" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor={hair.highlight} />
            <stop offset="60%" stopColor={hair.base} />
            <stop offset="100%" stopColor={hair.shadow} />
          </linearGradient>
        </defs>

        {/* 1. Magical Background Disc */}
        <circle cx="60" cy="60" r="56" fill={`url(#auraGrad_${uid})`} stroke="#f59e0b" strokeWidth="2" />
        <circle cx="60" cy="60" r="53" stroke="#818cf8" strokeWidth="0.8" strokeDasharray="3 3" opacity="0.6" />

        {/* 2. Layer: Cape (Back draped folds behind shoulders) */}
        {effective.capeId !== 'aucune' && (
          <g id="layer-cape-back">
            <path
              d="M32 68C22 75 14 92 12 118C28 120 92 120 108 118C106 92 98 75 88 68C82 78 38 78 32 68Z"
              fill={
                effective.capeId === 'cape_azur'
                  ? `url(#capeGrad_azur_${uid})`
                  : effective.capeId === 'cape_emeraude'
                  ? `url(#capeGrad_emeraude_${uid})`
                  : effective.capeId === 'cape_pourpre'
                  ? `url(#capeGrad_pourpre_${uid})`
                  : effective.capeId === 'cape_phenix'
                  ? `url(#capeGrad_phenix_${uid})`
                  : effective.capeId === 'cape_or'
                  ? `url(#capeGrad_or_${uid})`
                  : `url(#capeGrad_etoilee_${uid})`
              }
              stroke="#fbbf24"
              strokeWidth="1.2"
            />
            {/* Cape inner folds */}
            <path d="M22 100C30 96 36 108 42 118" stroke="#ffffff" strokeWidth="1" opacity="0.25" />
            <path d="M98 100C90 96 84 108 78 118" stroke="#ffffff" strokeWidth="1" opacity="0.25" />
          </g>
        )}

        {/* 3. Layer: Body & Head / Skin */}
        <g id="layer-body-skin">
          {/* Neck */}
          <path d="M52 64H68V80H52V64Z" fill={skin.shadow} />

          {/* Ears */}
          {effective.skinTone === 'celeste' ? (
            // Pointed Elf Ears for celestial/arcanist
            <>
              <path d="M37 46C31 40 23 37 20 38C22 45 28 50 36 53Z" fill={skin.base} stroke={skin.shadow} strokeWidth="0.8" />
              <path d="M83 46C89 40 97 37 100 38C98 45 92 50 84 53Z" fill={skin.base} stroke={skin.shadow} strokeWidth="0.8" />
            </>
          ) : (
            // Round Ears
            <>
              <circle cx="37" cy="49" r="6" fill={skin.base} stroke={skin.shadow} strokeWidth="0.8" />
              <circle cx="83" cy="49" r="6" fill={skin.base} stroke={skin.shadow} strokeWidth="0.8" />
            </>
          )}

          {/* Face base */}
          <path
            d="M38 42C38 27 47 18 60 18C73 18 82 27 82 42C82 58 72 68 60 68C48 68 38 58 38 42Z"
            fill={`url(#skinGrad_${uid})`}
          />

          {/* Cheeks Blush */}
          <ellipse cx="46" cy="51" rx="4" ry="2" fill={skin.blush} opacity="0.5" />
          <ellipse cx="74" cy="51" rx="4" ry="2" fill={skin.blush} opacity="0.5" />

          {/* Expressive Fantasy Eyes */}
          {/* Left Eye */}
          <ellipse cx="49" cy="44" rx="4.5" ry="5.5" fill="#ffffff" />
          <ellipse cx="49.5" cy="44" rx="3.2" ry="4" fill="#1e1b4b" />
          <circle cx="50" cy="43.5" r="2.2" fill={heroClass === 'mage' ? '#818cf8' : heroClass === 'alchimiste' ? '#34d399' : heroClass === 'guerrier' ? '#f59e0b' : '#38bdf8'} />
          <circle cx="48.2" cy="41.8" r="1.2" fill="#ffffff" />
          <circle cx="50.8" cy="45.5" r="0.6" fill="#ffffff" opacity="0.8" />
          <path d="M44 38C46 36 52 36 55 38" stroke="#334155" strokeWidth="1.2" strokeLinecap="round" />

          {/* Right Eye */}
          <ellipse cx="71" cy="44" rx="4.5" ry="5.5" fill="#ffffff" />
          <ellipse cx="70.5" cy="44" rx="3.2" ry="4" fill="#1e1b4b" />
          <circle cx="70" cy="43.5" r="2.2" fill={heroClass === 'mage' ? '#818cf8' : heroClass === 'alchimiste' ? '#34d399' : heroClass === 'guerrier' ? '#f59e0b' : '#38bdf8'} />
          <circle cx="69.2" cy="41.8" r="1.2" fill="#ffffff" />
          <circle cx="71.8" cy="45.5" r="0.6" fill="#ffffff" opacity="0.8" />
          <path d="M65 38C68 36 74 36 76 38" stroke="#334155" strokeWidth="1.2" strokeLinecap="round" />

          {/* Nose */}
          <path d="M60 48L59 51H61" stroke={skin.shadow} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />

          {/* Friendly heroic smile */}
          <path d="M55 56C57 59 63 59 65 56" stroke="#991b1b" strokeWidth="1.6" strokeLinecap="round" fill="none" />
        </g>

        {/* 4. Layer: Veste / Tunique / Armure (Permanent Base Outfit Rule) */}
        <g id="layer-jacket">
          {effective.jacketId === 'veste_arcaniste' ? (
            // Arcanist Robes
            <>
              <path d="M30 76C24 88 20 105 18 120H102C100 105 96 88 90 76C80 72 40 72 30 76Z" fill="#3b0764" stroke="#c084fc" strokeWidth="1.5" />
              <path d="M44 74L60 92L76 74L60 120Z" fill="#581c87" />
              {/* Gold star runes on collar */}
              <path d="M60 74L54 84H66L60 74Z" fill="#fbbf24" stroke="#d97706" strokeWidth="0.8" />
              <circle cx="60" cy="88" r="3" fill="#38bdf8" stroke="#fbbf24" strokeWidth="1" />
            </>
          ) : effective.jacketId === 'cuirasse_geometre' ? (
            // Warrior Geometric Cuirass
            <>
              <path d="M30 76C24 88 20 105 18 120H102C100 105 96 88 90 76C80 72 40 72 30 76Z" fill="#334155" stroke="#94a3b8" strokeWidth="1.5" />
              {/* Steel chest plate */}
              <polygon points="60,74 78,82 72,110 60,118 48,110 42,82" fill="#475569" stroke="#f59e0b" strokeWidth="1.2" />
              <circle cx="60" cy="94" r="4.5" fill="#f59e0b" stroke="#fef08a" strokeWidth="1" />
              <line x1="52" y1="84" x2="68" y2="84" stroke="#94a3b8" strokeWidth="1.5" />
            </>
          ) : effective.jacketId === 'manteau_alchimiste' ? (
            // Alchemist Coat with vials
            <>
              <path d="M30 76C24 88 20 105 18 120H102C100 105 96 88 90 76C80 72 40 72 30 76Z" fill="#064e3b" stroke="#34d399" strokeWidth="1.5" />
              <path d="M46 74L60 90L74 74" fill="#022c22" stroke="#10b981" strokeWidth="1.2" />
              {/* Leather belt with potions */}
              <rect x="36" y="96" width="48" height="6" rx="1.5" fill="#78350f" stroke="#d97706" strokeWidth="0.8" />
              <rect x="42" y="93" width="5" height="11" rx="2" fill="#34d399" stroke="#064e3b" strokeWidth="0.8" />
              <rect x="52" y="93" width="5" height="11" rx="2" fill="#a855f7" stroke="#3b0764" strokeWidth="0.8" />
              <rect x="62" y="93" width="5" height="11" rx="2" fill="#38bdf8" stroke="#0c4a6e" strokeWidth="0.8" />
              <rect x="71" y="93" width="5" height="11" rx="2" fill="#f59e0b" stroke="#78350f" strokeWidth="0.8" />
            </>
          ) : effective.jacketId === 'tunique_rodeur' ? (
            // Ranger Leather Jerkin
            <>
              <path d="M30 76C24 88 20 105 18 120H102C100 105 96 88 90 76C80 72 40 72 30 76Z" fill="#14532d" stroke="#84cc16" strokeWidth="1.5" />
              <path d="M45 74L60 88L75 74V118H45V74Z" fill="#1e3a1f" stroke="#a16207" strokeWidth="1" />
              {/* Criss-cross stitches */}
              <line x1="55" y1="88" x2="65" y2="94" stroke="#ca8a04" strokeWidth="1.2" />
              <line x1="65" y1="88" x2="55" y2="94" stroke="#ca8a04" strokeWidth="1.2" />
              <line x1="55" y1="98" x2="65" y2="104" stroke="#ca8a04" strokeWidth="1.2" />
              <line x1="65" y1="98" x2="55" y2="104" stroke="#ca8a04" strokeWidth="1.2" />
            </>
          ) : (
            // Base Permanent Garment: Tunique d'Apprenti Aventurier
            <>
              <path d="M30 76C24 88 20 105 18 120H102C100 105 96 88 90 76C80 72 40 72 30 76Z" fill="#451a03" stroke="#d97706" strokeWidth="1.5" />
              <path d="M46 74L60 88L74 74V120H46V74Z" fill="#78350f" />
              {/* Leather cord & brass ring */}
              <circle cx="60" cy="85" r="3.5" fill="#f59e0b" stroke="#78350f" strokeWidth="1" />
              <line x1="52" y1="76" x2="60" y2="85" stroke="#fef08a" strokeWidth="1.2" />
              <line x1="68" y1="76" x2="60" y2="85" stroke="#fef08a" strokeWidth="1.2" />
            </>
          )}
        </g>

        {/* 5. Layer: Cape (Front clasp over shoulders) */}
        {effective.capeId !== 'aucune' && (
          <g id="layer-cape-front">
            {/* Shoulder pads/brooch */}
            <circle cx="38" cy="74" r="5" fill="#f59e0b" stroke="#78350f" strokeWidth="1" />
            <circle cx="82" cy="74" r="5" fill="#f59e0b" stroke="#78350f" strokeWidth="1" />
            <path d="M38 74C48 78 72 78 82 74" stroke="#fbbf24" strokeWidth="2.5" fill="none" />
            {/* Center Royal Gem */}
            <circle cx="60" cy="76" r="3.8" fill="#38bdf8" stroke="#f59e0b" strokeWidth="1" />
          </g>
        )}

        {/* 6. Layer: Hair */}
        <g id="layer-hair">
          {effective.hairStyle === 'court' ? (
            // Short spiky adventurer hair (properly centered at head 60,42)
            <>
              <path
                d="M38 38C36 22 46 14 60 14C74 14 84 22 82 38C80 30 78 22 72 18C66 16 64 20 60 18C56 16 54 16 48 18C42 22 40 30 38 38Z"
                fill={`url(#hairGrad_${uid})`}
              />
              <path d="M38 36L45 25L50 33L57 20L63 31L70 23L75 33L82 36" fill={`url(#hairGrad_${uid})`} stroke={hair.shadow} strokeWidth="0.8" />
              <path d="M39 39L36 46L43 41" fill={hair.base} />
              <path d="M81 39L84 46L77 41" fill={hair.base} />
            </>
          ) : effective.hairStyle === 'court_classique' ? (
            // Classic neat short gentleman haircut with side parting
            <>
              <path
                d="M38 40C36 24 46 15 60 15C74 15 84 24 82 40C80 32 75 20 62 18C50 18 40 28 38 40Z"
                fill={`url(#hairGrad_${uid})`}
              />
              {/* Neat side parting line */}
              <path d="M52 18C56 24 58 32 58 38" stroke={hair.shadow} strokeWidth="1.2" strokeLinecap="round" />
              <path d="M38 38L36 45L42 41" fill={hair.base} />
              <path d="M82 38L84 45L78 41" fill={hair.base} />
            </>
          ) : effective.hairStyle === 'court_degrade' ? (
            // Modern textured fade / spiky short haircut
            <>
              <path
                d="M37 39C35 21 45 13 60 13C75 13 85 21 83 39C78 28 72 21 66 19C60 18 54 18 48 19C42 21 39 28 37 39Z"
                fill={`url(#hairGrad_${uid})`}
              />
              <path d="M42 22L48 15L54 22L60 14L66 22L72 15L78 22" fill={hair.highlight} stroke={hair.shadow} strokeWidth="0.8" />
              <path d="M37 38L34 46L41 41" fill={hair.base} />
              <path d="M83 38L86 46L79 41" fill={hair.base} />
            </>
          ) : effective.hairStyle === 'boucle' ? (
            // Curly bouncy voluminous hair
            <>
              <circle cx="42" cy="24" r="10" fill={`url(#hairGrad_${uid})`} />
              <circle cx="60" cy="18" r="11" fill={`url(#hairGrad_${uid})`} />
              <circle cx="78" cy="24" r="10" fill={`url(#hairGrad_${uid})`} />
              <circle cx="34" cy="36" r="9" fill={`url(#hairGrad_${uid})`} />
              <circle cx="86" cy="36" r="9" fill={`url(#hairGrad_${uid})`} />
              <circle cx="34" cy="48" r="7" fill={hair.shadow} />
              <circle cx="86" cy="48" r="7" fill={hair.shadow} />
              <path d="M42 28C48 24 54 28 60 25C66 28 72 24 78 28" stroke={hair.highlight} strokeWidth="1.5" strokeLinecap="round" fill="none" />
            </>
          ) : effective.hairStyle === 'tresse' ? (
            // Braided hair with beads
            <>
              <path d="M36 38C34 20 44 15 60 15C76 15 86 20 84 38C78 25 68 22 60 22C52 22 42 25 36 38Z" fill={`url(#hairGrad_${uid})`} />
              {/* Left Braid */}
              <circle cx="32" cy="48" r="5" fill={hair.base} stroke={hair.shadow} strokeWidth="0.8" />
              <circle cx="30" cy="56" r="4.5" fill={hair.base} stroke={hair.shadow} strokeWidth="0.8" />
              <rect x="27.5" y="60" width="5" height="3" rx="1" fill="#f59e0b" />
              <circle cx="29" cy="65" r="3.5" fill={hair.shadow} />
              {/* Right Braid */}
              <circle cx="88" cy="48" r="5" fill={hair.base} stroke={hair.shadow} strokeWidth="0.8" />
              <circle cx="90" cy="56" r="4.5" fill={hair.base} stroke={hair.shadow} strokeWidth="0.8" />
              <rect x="87.5" y="60" width="5" height="3" rx="1" fill="#f59e0b" />
              <circle cx="91" cy="65" r="3.5" fill={hair.shadow} />
            </>
          ) : effective.hairStyle === 'chignon' ? (
            // High scholar ponytail / bun with magical stick
            <>
              <circle cx="60" cy="10" r="11" fill={`url(#hairGrad_${uid})`} stroke={hair.shadow} strokeWidth="1" />
              <line x1="48" y1="6" x2="72" y2="14" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" />
              <circle cx="73" cy="14" r="2" fill="#38bdf8" />
              <path d="M36 38C34 20 44 16 60 16C76 16 86 20 84 38C78 26 68 24 60 24C52 24 42 26 36 38Z" fill={`url(#hairGrad_${uid})`} />
            </>
          ) : effective.hairStyle === 'long' ? (
            // Flowing long locks
            <>
              <path d="M36 38C34 18 44 14 60 14C76 14 86 18 84 38C76 24 68 22 60 22C52 22 44 24 36 38Z" fill={`url(#hairGrad_${uid})`} />
              <path d="M34 38C30 50 28 66 32 80C34 68 38 52 40 42" fill={hair.base} stroke={hair.shadow} strokeWidth="0.8" />
              <path d="M86 38C90 50 92 66 88 80C86 68 82 52 80 42" fill={hair.base} stroke={hair.shadow} strokeWidth="0.8" />
            </>
          ) : (
            // Arcane energetic floating locks
            <>
              <path d="M36 36C32 20 44 12 60 12C76 12 88 20 84 36C78 24 66 20 60 20C54 20 42 24 36 36Z" fill={`url(#hairGrad_${uid})`} />
              {/* Floating fiery locks */}
              <path d="M52 14C50 6 56 2 60 1C62 4 58 8 60 12" fill={hair.highlight} />
              <path d="M42 20C38 10 44 5 46 4C47 8 44 12 46 18" fill={hair.highlight} />
              <path d="M78 20C82 10 76 5 74 4C73 8 76 12 74 18" fill={hair.highlight} />
              <path d="M35 34C28 32 26 42 28 48C31 44 33 40 37 38" fill={hair.base} />
              <path d="M85 34C92 32 94 42 92 48C89 44 87 40 83 38" fill={hair.base} />
            </>
          )}
        </g>

        {/* 7. Layer: Couvre-chef / Accessoire */}
        {effective.accessoryId && effective.accessoryId !== 'aucun' && (
          <g id="layer-accessory">
            {effective.accessoryId === 'diademe_cristal' ? (
              // Royal Crystal Circlet
              <>
                <path d="M40 33C50 30 70 30 80 33" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" />
                <polygon points="60,20 64,28 60,32 56,28" fill="#38bdf8" stroke="#fef08a" strokeWidth="1" />
                <circle cx="60" cy="26" r="1.5" fill="#ffffff" />
              </>
            ) : effective.accessoryId === 'chapeau_pointu' ? (
              // Starry Wizard Apprentice Hat
              <>
                <ellipse cx="60" cy="24" rx="34" ry="7" fill="#3b0764" stroke="#c084fc" strokeWidth="1.2" />
                <polygon points="60,-8 38,22 82,22" fill="#581c87" stroke="#e879f9" strokeWidth="1.2" />
                {/* Golden star badge */}
                <polygon points="60,10 62,15 67,15 63,18 65,23 60,20 55,23 57,18 53,15 58,15" fill="#fde047" stroke="#b45309" strokeWidth="0.6" />
                <circle cx="60" cy="16" r="1.5" fill="#38bdf8" />
              </>
            ) : effective.accessoryId === 'lunettes_savant' ? (
              // Round Scholar Spectacles
              <>
                <circle cx="49" cy="44" r="7" stroke="#f59e0b" strokeWidth="1.6" fill="rgba(56, 189, 248, 0.15)" />
                <circle cx="71" cy="44" r="7" stroke="#f59e0b" strokeWidth="1.6" fill="rgba(56, 189, 248, 0.15)" />
                <line x1="56" y1="44" x2="64" y2="44" stroke="#f59e0b" strokeWidth="1.8" />
                <line x1="42" y1="43" x2="37" y2="47" stroke="#d97706" strokeWidth="1.2" />
                <line x1="78" y1="43" x2="83" y2="47" stroke="#d97706" strokeWidth="1.2" />
              </>
            ) : effective.accessoryId === 'casque_ailes' ? (
              // Winged Battle Helmet
              <>
                <path d="M42 32C42 22 50 16 60 16C70 16 78 22 78 32C72 30 48 30 42 32Z" fill="#64748b" stroke="#cbd5e1" strokeWidth="1.2" />
                {/* Silver Winglets */}
                <polygon points="40,24 24,14 36,32" fill="#94a3b8" stroke="#f8fafc" strokeWidth="1" />
                <polygon points="80,24 96,14 84,32" fill="#94a3b8" stroke="#f8fafc" strokeWidth="1" />
                <circle cx="60" cy="22" r="3" fill="#f59e0b" stroke="#fef08a" strokeWidth="0.8" />
              </>
            ) : effective.accessoryId === 'masque_chasseur' ? (
              // Sleek Ranger Mask
              <>
                <path d="M42 41C48 43 54 41 60 43C66 41 72 43 78 41C76 49 60 52 42 41Z" fill="#14532d" stroke="#84cc16" strokeWidth="1" />
                <circle cx="60" cy="47" r="1.5" fill="#facc15" />
              </>
            ) : null}
          </g>
        )}
      </svg>
    </div>
  );
};
