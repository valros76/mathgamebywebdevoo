import React from 'react';

interface IconProps {
  className?: string;
  size?: number;
}

export const IconD20: React.FC<IconProps> = ({ className = 'w-5 h-5', size }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    className={className}
    style={size ? { width: size, height: size } : undefined}
    xmlns="http://www.w3.org/2000/svg"
  >
    <polygon
      points="12,2 21,7.5 21,16.5 12,22 3,16.5 3,7.5"
      fill="url(#d20grad)"
      stroke="#fbbf24"
      strokeWidth="1.5"
    />
    <polygon points="12,2 17,9 7,9" fill="#f59e0b" opacity="0.7" stroke="#fde68a" strokeWidth="0.8" />
    <polygon points="7,9 12,22 3,16.5" fill="#d97706" opacity="0.6" stroke="#fde68a" strokeWidth="0.8" />
    <polygon points="17,9 21,16.5 12,22" fill="#b45309" opacity="0.6" stroke="#fde68a" strokeWidth="0.8" />
    <polygon points="7,9 17,9 12,17" fill="#78350f" opacity="0.8" stroke="#fde68a" strokeWidth="0.8" />
    <text x="12" y="14" textAnchor="middle" fill="#ffffff" fontSize="5" fontWeight="900" fontFamily="serif">20</text>
    <defs>
      <linearGradient id="d20grad" x1="3" y1="2" x2="21" y2="22">
        <stop offset="0%" stopColor="#8b5cf6" />
        <stop offset="100%" stopColor="#4c1d95" />
      </linearGradient>
    </defs>
  </svg>
);

export const IconSword: React.FC<IconProps> = ({ className = 'w-5 h-5', size }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    className={className}
    style={size ? { width: size, height: size } : undefined}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M14.5 4.5L19.5 9.5L9.5 19.5L7 20L4 17L4.5 14.5L14.5 4.5Z" fill="url(#swordBlade)" stroke="#94a3b8" strokeWidth="1" />
    <path d="M14.5 4.5L18 2L22 6L19.5 9.5" fill="#38bdf8" />
    <path d="M14.5 4.5L19.5 9.5" stroke="#f8fafc" strokeWidth="1" />
    <path d="M6 15L9 18" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" />
    <path d="M4 17L2 19L5 22L7 20" fill="#d97706" stroke="#f59e0b" strokeWidth="1" />
    <circle cx="2" cy="22" r="1.5" fill="#fbbf24" />
    <defs>
      <linearGradient id="swordBlade" x1="14.5" y1="4.5" x2="4.5" y2="14.5">
        <stop offset="0%" stopColor="#e2e8f0" />
        <stop offset="100%" stopColor="#64748b" />
      </linearGradient>
    </defs>
  </svg>
);

export const IconShield: React.FC<IconProps> = ({ className = 'w-5 h-5', size }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    className={className}
    style={size ? { width: size, height: size } : undefined}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12 2L4 5V11C4 16.5 7.5 21.5 12 23C16.5 21.5 20 16.5 20 11V5L12 2Z"
      fill="url(#shieldGrad)"
      stroke="#38bdf8"
      strokeWidth="1.5"
    />
    <path
      d="M12 4.5L6 6.8V11C6 15.2 8.5 19.2 12 20.6C15.5 19.2 18 15.2 18 11V6.8L12 4.5Z"
      fill="url(#shieldInner)"
      opacity="0.8"
    />
    <path d="M12 7V17M7 12H17" stroke="#fde047" strokeWidth="1.5" strokeLinecap="round" />
    <circle cx="12" cy="12" r="2.5" fill="#38bdf8" />
    <defs>
      <linearGradient id="shieldGrad" x1="4" y1="2" x2="20" y2="23">
        <stop offset="0%" stopColor="#1e3a8a" />
        <stop offset="100%" stopColor="#0f172a" />
      </linearGradient>
      <linearGradient id="shieldInner" x1="6" y1="4.5" x2="18" y2="20.6">
        <stop offset="0%" stopColor="#0284c7" />
        <stop offset="100%" stopColor="#1e293b" />
      </linearGradient>
    </defs>
  </svg>
);

export const IconPotion: React.FC<IconProps> = ({ className = 'w-5 h-5', size }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    className={className}
    style={size ? { width: size, height: size } : undefined}
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect x="9" y="2" width="6" height="3" rx="1" fill="#78350f" stroke="#d97706" strokeWidth="0.8" />
    <path d="M10 5V8L6 14C5 15.5 5 18 6.5 20C8 22 10.5 22 12 22C13.5 22 16 22 17.5 20C19 18 19 15.5 18 14L14 8V5H10Z" fill="url(#potionGlass)" stroke="#a855f7" strokeWidth="1.5" />
    <path d="M7 15C8 14 10 16 12 15C14 14 16 16 17 15C18 16.5 18 18 17.5 19.5C16.5 21.5 14 21.5 12 21.5C10 21.5 7.5 21.5 6.5 19.5C6 18 6 16.5 7 15Z" fill="url(#potionLiquid)" />
    <circle cx="10" cy="17" r="1" fill="#ffffff" opacity="0.6" />
    <circle cx="13" cy="19" r="1.5" fill="#ffffff" opacity="0.7" />
    <circle cx="14" cy="16" r="0.8" fill="#ffffff" opacity="0.5" />
    <defs>
      <linearGradient id="potionGlass" x1="6" y1="5" x2="18" y2="22">
        <stop offset="0%" stopColor="#581c87" stopOpacity="0.4" />
        <stop offset="100%" stopColor="#1e1b4b" stopOpacity="0.8" />
      </linearGradient>
      <linearGradient id="potionLiquid" x1="6" y1="14" x2="18" y2="22">
        <stop offset="0%" stopColor="#c084fc" />
        <stop offset="50%" stopColor="#9333ea" />
        <stop offset="100%" stopColor="#6b21a8" />
      </linearGradient>
    </defs>
  </svg>
);

export const IconScroll: React.FC<IconProps> = ({ className = 'w-5 h-5', size }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    className={className}
    style={size ? { width: size, height: size } : undefined}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M6 3C4.5 3 3.5 4 3.5 5.5C3.5 7 4.5 8 6 8H18C19.5 8 20.5 7 20.5 5.5C20.5 4 19.5 3 18 3H6Z" fill="#fef08a" stroke="#d97706" strokeWidth="1" />
    <path d="M5 6V18C5 19.5 6 21 7.5 21H19C20.5 21 21.5 20 21.5 18.5C21.5 17 20.5 16 19 16H8C6.5 16 5.5 17 5.5 18" fill="#fef3c7" stroke="#b45309" strokeWidth="1" />
    <line x1="8" y1="10" x2="16" y2="10" stroke="#b45309" strokeWidth="1.2" strokeLinecap="round" />
    <line x1="8" y1="13" x2="14" y2="13" stroke="#b45309" strokeWidth="1.2" strokeLinecap="round" />
  </svg>
);

export const IconBook: React.FC<IconProps> = ({ className = 'w-5 h-5', size }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    className={className}
    style={size ? { width: size, height: size } : undefined}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M4 19.5V5C4 3.9 4.9 3 6 3H19C20.1 3 21 3.9 21 5V19.5C21 20.6 20.1 21.5 19 21.5H6C4.9 21.5 4 20.6 4 19.5Z" fill="#1e1b4b" stroke="#f59e0b" strokeWidth="1.5" />
    <path d="M6 3V21.5" stroke="#f59e0b" strokeWidth="1.5" />
    <path d="M12 7L13.5 10L17 10.5L14.5 13L15 16.5L12 15L9 16.5L9.5 13L7 10.5L10.5 10L12 7Z" fill="#fbbf24" stroke="#d97706" strokeWidth="0.8" />
  </svg>
);

export const IconFlame: React.FC<IconProps> = ({ className = 'w-5 h-5', size }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    className={className}
    style={size ? { width: size, height: size } : undefined}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12 2C10.5 5 8 7 8 11C8 13.5 9.5 15.5 11 16C10 15 9.5 13.5 9.5 12C9.5 9.5 11 7.5 13 5C14.5 7.5 17 10.5 17 14C17 18 14.5 22 11.5 22C6.5 22 4 17.5 4 13C4 8.5 7.5 5 12 2Z"
      fill="url(#fireOuter)"
    />
    <path
      d="M12 11C13 12.5 14 14 14 16C14 18 12.5 20 11 20C9.5 20 8.5 18.5 8.5 17C8.5 15 9.5 13.5 11 12C11 12.5 11.5 13 12 11Z"
      fill="url(#fireInner)"
    />
    <defs>
      <linearGradient id="fireOuter" x1="12" y1="2" x2="12" y2="22">
        <stop offset="0%" stopColor="#fef08a" />
        <stop offset="40%" stopColor="#f97316" />
        <stop offset="100%" stopColor="#dc2626" />
      </linearGradient>
      <linearGradient id="fireInner" x1="11" y1="11" x2="11" y2="20">
        <stop offset="0%" stopColor="#ffffff" />
        <stop offset="100%" stopColor="#fbbf24" />
      </linearGradient>
    </defs>
  </svg>
);

export const IconCoin: React.FC<IconProps> = ({ className = 'w-5 h-5', size }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    className={className}
    style={size ? { width: size, height: size } : undefined}
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="12" cy="12" r="10" fill="url(#coinGrad)" stroke="#b45309" strokeWidth="1.5" />
    <circle cx="12" cy="12" r="7.5" fill="none" stroke="#fef08a" strokeWidth="1" strokeDasharray="1.5 1.5" />
    <path d="M12 7V17M9 9.5C9 8.5 10.5 8 12 8C13.5 8 15 8.8 15 10C15 12 9 12 9 14C9 15.2 10.5 16 12 16C13.5 16 15 15.5 15 14.5" stroke="#78350f" strokeWidth="1.8" strokeLinecap="round" />
    <defs>
      <linearGradient id="coinGrad" x1="4" y1="4" x2="20" y2="20">
        <stop offset="0%" stopColor="#fef08a" />
        <stop offset="40%" stopColor="#f59e0b" />
        <stop offset="100%" stopColor="#d97706" />
      </linearGradient>
    </defs>
  </svg>
);

export const IconCrystal: React.FC<IconProps> = ({ className = 'w-5 h-5', size }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    className={className}
    style={size ? { width: size, height: size } : undefined}
    xmlns="http://www.w3.org/2000/svg"
  >
    <polygon points="12,2 18,7 15,22 9,22 6,7" fill="url(#crystalGrad)" stroke="#38bdf8" strokeWidth="1.2" />
    <polygon points="12,2 18,7 15,13 12,11 9,13 6,7" fill="#67e8f9" opacity="0.4" />
    <polygon points="12,11 15,13 15,22 12,20" fill="#0284c7" opacity="0.8" />
    <polygon points="12,11 9,13 9,22 12,20" fill="#0369a1" opacity="0.6" />
    <line x1="12" y1="2" x2="12" y2="20" stroke="#f0f9ff" strokeWidth="1" />
    <defs>
      <linearGradient id="crystalGrad" x1="6" y1="2" x2="18" y2="22">
        <stop offset="0%" stopColor="#e0f2fe" />
        <stop offset="50%" stopColor="#38bdf8" />
        <stop offset="100%" stopColor="#0369a1" />
      </linearGradient>
    </defs>
  </svg>
);

export const IconTrophy: React.FC<IconProps> = ({ className = 'w-5 h-5', size }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    className={className}
    style={size ? { width: size, height: size } : undefined}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M6 3H18V9C18 12.3 15.3 15 12 15C8.7 15 6 12.3 6 9V3Z" fill="url(#trophyGrad)" stroke="#d97706" strokeWidth="1.5" />
    <path d="M6 5H3C2.4 5 2 5.4 2 6V8C2 9.7 3.3 11 5 11H6" stroke="#f59e0b" strokeWidth="1.5" />
    <path d="M18 5H21C21.6 5 22 5.4 22 6V8C22 9.7 20.7 11 19 11H18" stroke="#f59e0b" strokeWidth="1.5" />
    <path d="M12 15V19M8 21H16" stroke="#d97706" strokeWidth="2" strokeLinecap="round" />
    <circle cx="12" cy="8.5" r="2.5" fill="#fef08a" />
    <defs>
      <linearGradient id="trophyGrad" x1="6" y1="3" x2="18" y2="15">
        <stop offset="0%" stopColor="#fde047" />
        <stop offset="100%" stopColor="#b45309" />
      </linearGradient>
    </defs>
  </svg>
);

export const IconBackpack: React.FC<IconProps> = ({ className = 'w-5 h-5', size }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    className={className}
    style={size ? { width: size, height: size } : undefined}
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect x="5" y="6" width="14" height="15" rx="3" fill="#78350f" stroke="#d97706" strokeWidth="1.5" />
    <path d="M8 6V4C8 2.9 8.9 2 10 2H14C15.1 2 16 2.9 16 4V6" stroke="#d97706" strokeWidth="1.5" />
    <rect x="7" y="11" width="10" height="7" rx="1.5" fill="#92400e" stroke="#fbbf24" strokeWidth="1" />
    <circle cx="12" cy="14" r="1" fill="#fef08a" />
  </svg>
);

export const IconCastle: React.FC<IconProps> = ({ className = 'w-5 h-5', size }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    className={className}
    style={size ? { width: size, height: size } : undefined}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M3 21H21V10L18 8V4H15V8L12 6L9 8V4H6V8L3 10V21Z" fill="#1e293b" stroke="#38bdf8" strokeWidth="1.5" />
    <path d="M10 21V15C10 13.9 10.9 13 12 13C13.1 13 14 13.9 14 15V21" fill="#0f172a" stroke="#fbbf24" strokeWidth="1.2" />
    <path d="M5 13H7M17 13H19M11 9H13" stroke="#f8fafc" strokeWidth="1" strokeLinecap="round" />
  </svg>
);

// Fantasy Character Class Icons
export const IconClassMage: React.FC<IconProps> = ({ className = 'w-6 h-6', size }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    className={className}
    style={size ? { width: size, height: size } : undefined}
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Wizard hat */}
    <path d="M12 2L4 16H20L12 2Z" fill="url(#mageHat)" stroke="#c084fc" strokeWidth="1.2" />
    <ellipse cx="12" cy="16" rx="9" ry="2.5" fill="#581c87" stroke="#e879f9" strokeWidth="1.2" />
    {/* Glowing gem on hat */}
    <circle cx="12" cy="11" r="2" fill="#38bdf8" />
    <polygon points="12,8 14,14 8,10 16,10 10,14" fill="#fde047" opacity="0.8" />
    <defs>
      <linearGradient id="mageHat" x1="4" y1="2" x2="20" y2="16">
        <stop offset="0%" stopColor="#7e22ce" />
        <stop offset="100%" stopColor="#3b0764" />
      </linearGradient>
    </defs>
  </svg>
);

export const IconClassWarrior: React.FC<IconProps> = ({ className = 'w-6 h-6', size }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    className={className}
    style={size ? { width: size, height: size } : undefined}
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Knight helmet */}
    <path d="M12 3C7 3 5 7 5 12V18L12 22L19 18V12C19 7 17 3 12 3Z" fill="url(#warriorHelm)" stroke="#cbd5e1" strokeWidth="1.5" />
    {/* Visor slit */}
    <rect x="7" y="11" width="10" height="2.5" rx="1" fill="#0f172a" stroke="#f59e0b" strokeWidth="0.8" />
    {/* Crest plume */}
    <path d="M12 1V5M10 2L12 5L14 2" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" />
    <defs>
      <linearGradient id="warriorHelm" x1="5" y1="3" x2="19" y2="22">
        <stop offset="0%" stopColor="#94a3b8" />
        <stop offset="100%" stopColor="#334155" />
      </linearGradient>
    </defs>
  </svg>
);

export const IconClassAlchemist: React.FC<IconProps> = ({ className = 'w-6 h-6', size }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    className={className}
    style={size ? { width: size, height: size } : undefined}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M9 2H15V6L20 17C21 19.5 19 22 16.5 22H7.5C5 22 3 19.5 4 17L9 6V2Z" fill="url(#alchemFlask)" stroke="#10b981" strokeWidth="1.5" />
    <path d="M5.5 16C7 15 9 17 12 16C15 15 17 17 18.5 16C19.5 18 18 21 16 21H8C6 21 4.5 18 5.5 16Z" fill="#34d399" />
    <circle cx="10" cy="18" r="1.5" fill="#ffffff" opacity="0.8" />
    <circle cx="14" cy="17" r="1" fill="#ffffff" opacity="0.7" />
    <defs>
      <linearGradient id="alchemFlask" x1="4" y1="2" x2="20" y2="22">
        <stop offset="0%" stopColor="#064e3b" />
        <stop offset="100%" stopColor="#022c22" />
      </linearGradient>
    </defs>
  </svg>
);

export const IconClassRanger: React.FC<IconProps> = ({ className = 'w-6 h-6', size }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    className={className}
    style={size ? { width: size, height: size } : undefined}
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Hunter Hood & Bow */}
    <path d="M12 2C8 2 5 6 5 11C5 15 8 18 12 21C16 18 19 15 19 11C19 6 16 2 12 2Z" fill="#14532d" stroke="#84cc16" strokeWidth="1.5" />
    <path d="M12 7C9.5 7 8 10 8 13C8 16 10 18 12 19C14 18 16 16 16 13C16 10 14.5 7 12 7Z" fill="#052e16" />
    {/* Eagle eyes / mask */}
    <ellipse cx="10.5" cy="12.5" rx="1.2" ry="0.8" fill="#facc15" />
    <ellipse cx="13.5" cy="12.5" rx="1.2" ry="0.8" fill="#facc15" />
  </svg>
);

// MathGame by Webdevoo Full Fantasy Logo Badge
export const MathGameBrandLogo: React.FC<{ className?: string }> = ({ className = 'h-10' }) => (
  <div className={`flex items-center gap-3 select-none ${className}`}>
    <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-900 via-purple-950 to-slate-950 border border-amber-400/80 p-1 flex items-center justify-center shadow-lg shadow-purple-950/50">
      <IconD20 className="w-8 h-8" />
      <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-amber-400 animate-ping opacity-75" />
      <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-amber-300 border border-slate-900" />
    </div>
    <div className="flex flex-col">
      <div className="flex items-center gap-1.5">
        <span className="text-base sm:text-lg font-black tracking-wide bg-gradient-to-r from-amber-200 via-amber-400 to-amber-100 bg-clip-text text-transparent font-serif">
          MathGame
        </span>
        <span className="text-[10px] font-bold uppercase tracking-wider text-purple-300 bg-purple-950/80 border border-purple-700/60 px-1.5 py-0.2 rounded">
          RPG
        </span>
      </div>
      <span className="text-[10px] font-medium text-slate-400 tracking-tight">
        par Webdevoo
      </span>
    </div>
  </div>
);

// Settings Gear Icon (replaces raw emoji)
export const IconGear: React.FC<IconProps> = ({ className = 'w-4 h-4', size }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    className={className}
    style={size ? { width: size, height: size } : undefined}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z"
      stroke="#94a3b8"
      strokeWidth="2"
      fill="#334155"
    />
    <path
      d="M19.4 15A1.65 1.65 0 0 0 19.73 16.82L20.2 17.63A2 2 0 0 1 17.63 20.2L16.82 19.73A1.65 1.65 0 0 0 15 19.4A1.65 1.65 0 0 0 13.6 20.85L13.4 21.8A2 2 0 0 1 9.8 21.8L9.6 20.85A1.65 1.65 0 0 0 8.2 19.4A1.65 1.65 0 0 0 6.38 19.73L5.57 20.2A2 2 0 0 1 3 17.63L3.47 16.82A1.65 1.65 0 0 0 3.14 15A1.65 1.65 0 0 0 1.69 13.6L0.74 13.4A2 2 0 0 1 0.74 9.8L1.69 9.6A1.65 1.65 0 0 0 3.14 8.2A1.65 1.65 0 0 0 2.81 6.38L2.34 5.57A2 2 0 0 1 4.91 3L5.72 3.47A1.65 1.65 0 0 0 7.54 3.14A1.65 1.65 0 0 0 8.94 1.69L9.14 0.74A2 2 0 0 1 12.74 0.74L12.94 1.69A1.65 1.65 0 0 0 14.34 3.14A1.65 1.65 0 0 0 16.16 2.81L16.97 2.34A2 2 0 0 1 19.54 4.91L19.07 5.72A1.65 1.65 0 0 0 19.4 7.54A1.65 1.65 0 0 0 20.85 8.94L21.8 9.14A2 2 0 0 1 21.8 12.74L20.85 12.94A1.65 1.65 0 0 0 19.4 15Z"
      stroke="#94a3b8"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// Switch Hero / Profile Icon (replaces raw emoji)
export const IconSwitchHero: React.FC<IconProps> = ({ className = 'w-4 h-4', size }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    className={className}
    style={size ? { width: size, height: size } : undefined}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M17 1l4 4-4 4" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M3 11V9a4 4 0 0 1 4-4h14" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M7 23l-4-4 4-4" stroke="#a855f7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M21 13v2a4 4 0 0 1-4 4H3" stroke="#a855f7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// Wardrobe Icon (Hanger & Magical Robe)
export const IconWardrobe: React.FC<IconProps> = ({ className = 'w-5 h-5', size }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    className={className}
    style={size ? { width: size, height: size } : undefined}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M12 2C10.5 2 10.5 4 12 5C13.5 6 12 7 12 8" stroke="#f59e0b" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M12 8L3 13L5 15L12 11L19 15L21 13L12 8Z" fill="#78350f" stroke="#f59e0b" strokeWidth="1.2" />
    <path d="M6 14L4 22H20L18 14" fill="#1e1b4b" stroke="#c084fc" strokeWidth="1.5" />
    <circle cx="12" cy="16" r="1.5" fill="#fbbf24" />
    <circle cx="12" cy="19" r="1.5" fill="#38bdf8" />
  </svg>
);

// Cape Icon
export const IconCape: React.FC<IconProps> = ({ className = 'w-5 h-5', size }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    className={className}
    style={size ? { width: size, height: size } : undefined}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M8 3C10 4 14 4 16 3L20 8L18 21C14 19 10 19 6 21L4 8L8 3Z" fill="#581c87" stroke="#c084fc" strokeWidth="1.4" />
    <circle cx="12" cy="5" r="2" fill="#fbbf24" stroke="#d97706" strokeWidth="0.8" />
    <path d="M8 8C10 15 14 15 16 8" stroke="#e9d5ff" strokeWidth="1" strokeLinecap="round" />
  </svg>
);

// Jacket / Tunic Icon
export const IconJacket: React.FC<IconProps> = ({ className = 'w-5 h-5', size }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    className={className}
    style={size ? { width: size, height: size } : undefined}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M8 3L4 7L6 10L8 8V21H16V8L18 10L20 7L16 3C14 5 10 5 8 3Z" fill="#1e293b" stroke="#38bdf8" strokeWidth="1.4" />
    <path d="M12 5V21" stroke="#f59e0b" strokeWidth="1" strokeDasharray="2 2" />
    <circle cx="12" cy="11" r="1" fill="#fef08a" />
    <circle cx="12" cy="15" r="1" fill="#fef08a" />
  </svg>
);

// Crown / Diadem Icon
export const IconCrown: React.FC<IconProps> = ({ className = 'w-5 h-5', size }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    className={className}
    style={size ? { width: size, height: size } : undefined}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M2 19H22V17L19 7L14 13L12 4L10 13L5 7L2 17V19Z" fill="#ca8a04" stroke="#fef08a" strokeWidth="1.4" />
    <circle cx="12" cy="4" r="1.5" fill="#38bdf8" />
    <circle cx="5" cy="7" r="1.2" fill="#e11d48" />
    <circle cx="19" cy="7" r="1.2" fill="#10b981" />
  </svg>
);

// Sparkles / Magic Stars Icon
export const IconSparkles: React.FC<IconProps> = ({ className = 'w-5 h-5', size }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    className={className}
    style={size ? { width: size, height: size } : undefined}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M12 2L14 8L20 10L14 12L12 18L10 12L4 10L10 8L12 2Z" fill="#fbbf24" stroke="#f59e0b" strokeWidth="0.8" />
    <path d="M19 16L20 19L23 20L20 21L19 24L18 21L15 20L18 19L19 16Z" fill="#38bdf8" />
  </svg>
);

// Boss Vector Icons
export const IconBossGoblin: React.FC<IconProps> = ({ className = 'w-8 h-8', size }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    className={className}
    style={size ? { width: size, height: size } : undefined}
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Big goblin ears */}
    <polygon points="2,8 7,12 5,16" fill="#15803d" stroke="#86efac" strokeWidth="0.8" />
    <polygon points="22,8 17,12 19,16" fill="#15803d" stroke="#86efac" strokeWidth="0.8" />
    {/* Head */}
    <circle cx="12" cy="13" r="7" fill="#16a34a" stroke="#bbf7d0" strokeWidth="1" />
    {/* Mischievous red eyes */}
    <ellipse cx="9.5" cy="11.5" rx="1.6" ry="1.2" fill="#ef4444" />
    <circle cx="9.5" cy="11.5" r="0.6" fill="#000000" />
    <ellipse cx="14.5" cy="11.5" rx="1.6" ry="1.2" fill="#ef4444" />
    <circle cx="14.5" cy="11.5" r="0.6" fill="#000000" />
    {/* Pointy grin with fangs */}
    <path d="M9 16C10 18 14 18 15 16" stroke="#052e16" strokeWidth="1.5" strokeLinecap="round" />
    <polygon points="10,16 11,18 11.5,16" fill="#ffffff" />
    <polygon points="13.5,16 14,18 14.5,16" fill="#ffffff" />
  </svg>
);

export const IconBossWolf: React.FC<IconProps> = ({ className = 'w-8 h-8', size }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    className={className}
    style={size ? { width: size, height: size } : undefined}
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Wolf ears */}
    <polygon points="6,3 10,9 5,9" fill="#475569" stroke="#94a3b8" strokeWidth="1" />
    <polygon points="18,3 19,9 14,9" fill="#475569" stroke="#94a3b8" strokeWidth="1" />
    {/* Face */}
    <polygon points="12,21 4,10 20,10" fill="#334155" stroke="#94a3b8" strokeWidth="1" />
    {/* Spectral cyan eyes */}
    <ellipse cx="8.5" cy="11" rx="1.5" ry="1" fill="#38bdf8" />
    <ellipse cx="15.5" cy="11" rx="1.5" ry="1" fill="#38bdf8" />
    {/* Snout */}
    <polygon points="12,18 10,14 14,14" fill="#0f172a" />
  </svg>
);

export const IconBossGolem: React.FC<IconProps> = ({ className = 'w-8 h-8', size }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    className={className}
    style={size ? { width: size, height: size } : undefined}
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect x="4" y="4" width="16" height="16" rx="3" fill="#334155" stroke="#f59e0b" strokeWidth="1.5" />
    {/* Runes */}
    <line x1="4" y1="12" x2="20" y2="12" stroke="#64748b" strokeWidth="1" />
    <line x1="12" y1="4" x2="12" y2="20" stroke="#64748b" strokeWidth="1" />
    {/* Glowing crystal core */}
    <polygon points="12,7 16,12 12,17 8,12" fill="#38bdf8" stroke="#e0f2fe" strokeWidth="1" />
    <circle cx="12" cy="12" r="2" fill="#ffffff" />
  </svg>
);

export const IconBossSpecter: React.FC<IconProps> = ({ className = 'w-8 h-8', size }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    className={className}
    style={size ? { width: size, height: size } : undefined}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12 2C7 2 5 6 5 11C5 17 4 22 7 21C9 20 10 22 12 21C14 22 15 20 17 21C20 22 19 17 19 11C19 6 17 2 12 2Z"
      fill="#4c1d95"
      stroke="#c084fc"
      strokeWidth="1.5"
    />
    <circle cx="9" cy="10" r="2" fill="#facc15" />
    <circle cx="15" cy="10" r="2" fill="#facc15" />
    <ellipse cx="12" cy="15" rx="2" ry="2.5" fill="#1e1b4b" />
  </svg>
);

export const IconBossArchmage: React.FC<IconProps> = ({ className = 'w-8 h-8', size }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    className={className}
    style={size ? { width: size, height: size } : undefined}
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Crown of stars */}
    <polygon points="12,1 14,5 18,3 17,7 21,9 17,11 19,15 14,13 12,17 10,13 5,15 7,11 3,9 7,7 6,3 10,5" fill="#f59e0b" stroke="#fef08a" strokeWidth="0.8" />
    <circle cx="12" cy="11" r="5" fill="#581c87" stroke="#c084fc" strokeWidth="1" />
    {/* Glowing rune eyes */}
    <circle cx="10" cy="10" r="1.2" fill="#38bdf8" />
    <circle cx="14" cy="10" r="1.2" fill="#38bdf8" />
    <path d="M9 16C10 21 14 21 15 16" fill="#e2e8f0" />
  </svg>
);

// Universal Item / Badge SVG Icon Renderer
export const ItemIconRenderer: React.FC<{ iconKey: string; className?: string }> = ({
  iconKey,
  className = 'w-6 h-6',
}) => {
  switch (iconKey) {
    case 'item_fiole_mana':
    case 'potion':
    case 'fiole':
      return <IconPotion className={className} />;
    case 'item_potion_soin':
    case 'soin':
      return <IconPotion className={className} />;
    case 'item_cristal_fraction':
    case 'cristal':
    case 'gemme':
      return <IconCrystal className={className} />;
    case 'item_amulette_glace':
    case 'bouclier':
    case 'armure':
      return <IconShield className={className} />;
    case 'item_compas_or':
    case 'compas':
      return <IconD20 className={className} />;
    case 'item_diademe_hermes':
    case 'couronne':
    case 'diademe':
      return <IconCrown className={className} />;
    case 'cape':
    case 'cape_azur':
    case 'cape_etoilee':
    case 'cape_emeraude':
    case 'cape_pourpre':
    case 'cape_phenix':
    case 'cape_or':
      return <IconCape className={className} />;
    case 'veste':
    case 'tunique':
    case 'veste_arcaniste':
    case 'cuirasse_geometre':
    case 'manteau_alchimiste':
    case 'tunique_rodeur':
      return <IconJacket className={className} />;
    case 'epee':
    case 'lame':
      return <IconSword className={className} />;
    case 'livre':
    case 'grimoire':
      return <IconBook className={className} />;
    case 'parchemin':
    case 'carte':
      return <IconScroll className={className} />;
    case 'trophee':
    case 'medaille':
    case 'badge':
      return <IconTrophy className={className} />;
    case 'flamme':
    case 'feu':
      return <IconFlame className={className} />;
    case 'or':
    case 'piece':
      return <IconCoin className={className} />;
    case 'boss_gobelin_val':
      return <IconBossGoblin className={className} />;
    case 'boss_loup_meute':
      return <IconBossWolf className={className} />;
    case 'boss_golem_fractions':
      return <IconBossGolem className={className} />;
    case 'boss_spectre_angles':
      return <IconBossSpecter className={className} />;
    case 'boss_archimage_chronos':
      return <IconBossArchmage className={className} />;
    default:
      return <IconSparkles className={className} />;
  }
};

// Compass Icon for map exploration
export const IconCompass: React.FC<IconProps> = ({ className = 'w-5 h-5', size }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    className={className}
    style={size ? { width: size, height: size } : undefined}
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="12" cy="12" r="10" stroke="#f59e0b" strokeWidth="1.5" fill="#0f172a" />
    <circle cx="12" cy="12" r="8" stroke="#38bdf8" strokeWidth="0.8" strokeDasharray="1 2" />
    <polygon points="12,4 15,12 12,10 9,12" fill="#ef4444" stroke="#dc2626" strokeWidth="0.5" />
    <polygon points="12,20 15,12 12,14 9,12" fill="#94a3b8" stroke="#64748b" strokeWidth="0.5" />
    <circle cx="12" cy="12" r="1.5" fill="#fde047" />
  </svg>
);

// Lock Icon for quest unlocking
export const IconLock: React.FC<IconProps> = ({ className = 'w-5 h-5', size }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    className={className}
    style={size ? { width: size, height: size } : undefined}
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect x="5" y="11" width="14" height="10" rx="2" fill="#334155" stroke="#94a3b8" strokeWidth="1.5" />
    <path d="M8 11V7C8 4.79 9.79 3 12 3C14.21 3 16 4.79 16 7V11" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" />
    <circle cx="12" cy="16" r="1.5" fill="#f59e0b" />
    <path d="M12 17.5V19" stroke="#f59e0b" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

// Check Icon for completed missions/streaks
export const IconCheck: React.FC<IconProps> = ({ className = 'w-5 h-5', size }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    className={className}
    style={size ? { width: size, height: size } : undefined}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M4 12.5L9.5 18L20 6" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// Menu Icon for mobile slide-over drawer
export const IconMenu: React.FC<IconProps> = ({ className = 'w-5 h-5', size }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    className={className}
    style={size ? { width: size, height: size } : undefined}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M4 6H20M4 12H20M4 18H20" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

