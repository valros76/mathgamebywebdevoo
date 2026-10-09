import React, { useState, useEffect } from 'react';
import type { PlayerProfile, PlayerSettings, SaveDataPackage } from '../../types';
import { soundManager } from '../../services/audio/soundManager';
import { saveManager, type SaveStatusState } from '../../services/persistence/saveManager';
import { getFullProfilePackage, restoreSavePackage, db } from '../../services/persistence/db';
import {
  isFileSystemAccessSupported,
  requestExternalJsonFileHandle,
  requestExternalJsonFilePicker,
  exportSaveAsJsonFile,
  validateImportedJson,
} from '../../services/persistence/fileSystemBackup';
import {
  IconShield,
  IconScroll,
  IconBook,
} from '../../components/icons/GameIcons';
import type { LegalPageSlug } from '../legal/LegalPagesModal';

interface SettingsModalProps {
  player: PlayerProfile;
  settings: PlayerSettings;
  onUpdateSettings: (newSettings: PlayerSettings) => void;
  onProfileRestored: (newProfile: PlayerProfile) => void;
  onOpenLegal: (slug: LegalPageSlug) => void;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  player,
  settings,
  onUpdateSettings,
  onProfileRestored,
  onOpenLegal,
  onClose,
}) => {
  const [saveStatus, setSaveStatus] = useState<SaveStatusState>(saveManager.getStatus());
  const [soundEnabled, setSoundEnabled] = useState(settings.soundEnabled);
  const [reducedMotion, setReducedMotion] = useState(settings.reducedMotion);
  const [externalBackupEnabled, setExternalBackupEnabled] = useState(settings.externalJsonBackupEnabled);
  const [importPreview, setImportPreview] = useState<SaveDataPackage | null>(null);
  const [importError, setImportError] = useState<string | null>(null);
  const [notificationMsg, setNotificationMsg] = useState<string | null>(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  useEffect(() => {
    const unsubscribe = saveManager.subscribe((st) => setSaveStatus(st));
    return () => unsubscribe();
  }, []);

  const handleToggleSound = (enabled: boolean) => {
    setSoundEnabled(enabled);
    soundManager.setMuted(!enabled);
    if (enabled) soundManager.playClick();
    const updated = { ...settings, soundEnabled: enabled };
    onUpdateSettings(updated);
    saveManager.stageSettings(updated);
  };

  const handleToggleReducedMotion = (enabled: boolean) => {
    setReducedMotion(enabled);
    const updated = { ...settings, reducedMotion: enabled };
    onUpdateSettings(updated);
    saveManager.stageSettings(updated);
  };

  const handleEnableExternalBackup = async () => {
    if (!isFileSystemAccessSupported()) {
      setNotificationMsg(
        'Votre navigateur ne prend pas en charge la sélection de fichier avec l\'API File System Access. Utilisez l\'export manuel ci-dessous.'
      );
      return;
    }

    const result = await requestExternalJsonFilePicker(player.name);
    if (result.success) {
      setExternalBackupEnabled(true);
      const updated = { ...settings, externalJsonBackupEnabled: true, lastExternalBackupDate: Date.now() };
      onUpdateSettings(updated);
      saveManager.stageSettings(updated);
      setNotificationMsg('Sauvegarde JSON activée ! Les prochaines sauvegardes mettront à jour la copie externe.');
    } else {
      if (result.status === 'iframe_security_restricted') {
        setNotificationMsg(
          'Aperçu sécurisé (iframe) : le navigateur bloque l\'accès direct aux fichiers disques dans ce mode. Ta partie est 100% sauvegardée dans IndexedDB ! Utilise « Exporter une copie JSON » ci-dessous pour télécharger un fichier manuel.'
        );
      } else if (result.status === 'cancelled') {
        setNotificationMsg('Sélection de fichier annulée.');
      } else {
        setNotificationMsg(result.message || 'Aucun fichier sélectionné. Les données restent sauvegardées dans IndexedDB.');
      }
    }
  };

  const handleDisableExternalBackup = () => {
    setExternalBackupEnabled(false);
    const updated = { ...settings, externalJsonBackupEnabled: false };
    onUpdateSettings(updated);
    saveManager.stageSettings(updated);
    setNotificationMsg(
      'Sauvegarde JSON externe désactivée. Note : le fichier JSON déjà créé sur votre disque n\'est pas supprimé automatiquement.'
    );
  };

  const handleManualExport = async () => {
    soundManager.playClick();
    const pkg = await getFullProfilePackage(player.id);
    if (pkg) {
      exportSaveAsJsonFile(pkg);
      setNotificationMsg('Fichier de sauvegarde JSON exporté dans vos téléchargements.');
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const content = evt.target?.result as string;
      const res = validateImportedJson(content);
      if (res.isValid && res.data) {
        setImportPreview(res.data);
        setImportError(null);
      } else {
        setImportError(res.error || 'Fichier JSON invalide.');
        setImportPreview(null);
      }
    };
    reader.readAsText(file);
  };

  const confirmImport = async () => {
    if (!importPreview) return;
    try {
      await restoreSavePackage(importPreview);
      saveManager.setActiveProfileId(importPreview.profile.id);
      onProfileRestored(importPreview.profile);
      setNotificationMsg('Sauvegarde restaurée avec succès !');
      setImportPreview(null);
      setTimeout(() => {
        onClose();
      }, 1200);
    } catch (err) {
      setImportError(`Erreur lors de la restauration: ${(err as Error).message}`);
    }
  };

  const handleResetProgress = async () => {
    const resetProfile: PlayerProfile = {
      ...player,
      level: 1,
      xp: 0,
      xpToNextLevel: 100,
      gold: 50,
      hp: 100,
      mana: 50,
      dailyStreak: 1,
      updatedAt: Date.now(),
    };

    // Clean mastery for this profile
    await db.progress.where('profileId').equals(player.id).delete();
    await db.questStates.where('profileId').equals(player.id).delete();
    await db.profiles.put(resetProfile);

    onProfileRestored(resetProfile);
    saveManager.stageProfile(resetProfile);
    saveManager.markDirty(true);
    setShowResetConfirm(false);
    setNotificationMsg('Progression du profil réinitialisée au niveau 1.');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-4 sm:pt-8 pb-12 bg-slate-950/85 backdrop-blur-md px-3 sm:px-5 overflow-y-auto">
      <div className="relative w-full max-w-xl max-h-[80vh] overflow-y-auto flex flex-col rounded-3xl border-2 border-amber-500/50 bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-950 p-4 sm:p-6 pb-20 sm:pb-24 shadow-2xl text-slate-100">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-indigo-900/60 pb-3 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-purple-950/80 border border-purple-500/60 flex items-center justify-center">
              <IconScroll className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-amber-300 font-serif">
                Paramètres & Sauvegardes
              </h2>
              <p className="text-xs text-indigo-300">
                Aventurier : <span className="text-amber-200 font-semibold">{player.name}</span> ({player.grade})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Fermer les paramètres"
            className="rounded-xl p-2 text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Notifications */}
        {notificationMsg && (
          <div className="p-3 my-2 rounded-xl border border-emerald-500/50 bg-emerald-950/50 text-emerald-200 text-xs shrink-0">
            {notificationMsg}
          </div>
        )}

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto pr-1 space-y-3.5 py-2">
          
          {/* Audio & Comfort */}
          <div className="rounded-2xl border border-indigo-900/70 bg-slate-950/80 p-4 space-y-3">
            <h3 className="text-xs font-black uppercase tracking-wider text-amber-400">
              Confort de jeu & Accessibilité
            </h3>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-200">Effets sonores féériques (Web Audio)</p>
                <p className="text-xs text-slate-400">Sons de sorts, fanfares et validations</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={soundEnabled}
                  onChange={(e) => handleToggleSound(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
              </label>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-900">
              <div>
                <p className="text-sm font-semibold text-slate-200">Réduction des animations</p>
                <p className="text-xs text-slate-400">Atténue les secousses et effets continus</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={reducedMotion}
                  onChange={(e) => handleToggleReducedMotion(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
              </label>
            </div>
          </div>

          {/* Données et sauvegardes Section */}
          <div className="rounded-2xl border border-indigo-900/70 bg-slate-950/80 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black uppercase tracking-wider text-amber-400">
                Données et sauvegardes
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full border border-emerald-500/60 bg-emerald-950/40 text-emerald-300">
                {saveStatus.isSaving ? 'Écriture en cours...' : 'IndexedDB actif'}
              </span>
            </div>

            <div className="text-xs text-slate-300 space-y-1 leading-relaxed">
              <p>• <strong>Statut local :</strong> Sauvegarde automatique active sur cet appareil.</p>
              <p>• <strong>Dernière écriture locale :</strong> {saveStatus.lastSavedAt ? new Date(saveStatus.lastSavedAt).toLocaleTimeString() : 'Session initiale'}</p>
              <p>• <strong>Statut copie JSON externe :</strong> {externalBackupEnabled ? 'Activée (mise à jour automatique)' : 'Désactivée'}</p>
            </div>

            <div className="pt-2 border-t border-slate-900 flex flex-wrap gap-2">
              {!externalBackupEnabled ? (
                <button
                  onClick={handleEnableExternalBackup}
                  className="px-3.5 py-1.5 rounded-xl border border-amber-500/60 bg-amber-950/40 hover:bg-amber-900/40 text-amber-300 text-xs font-bold transition cursor-pointer"
                >
                  Activer la sauvegarde JSON externe
                </button>
              ) : (
                <button
                  onClick={handleDisableExternalBackup}
                  className="px-3.5 py-1.5 rounded-xl border border-slate-700 bg-slate-900 text-slate-300 text-xs font-semibold hover:bg-slate-800 transition cursor-pointer"
                >
                  Désactiver la sauvegarde JSON externe
                </button>
              )}

              <button
                onClick={handleManualExport}
                className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition cursor-pointer"
              >
                Exporter une copie JSON manuelle
              </button>

              <label className="px-3.5 py-1.5 rounded-xl border border-indigo-700 bg-indigo-950/70 hover:bg-indigo-900 text-indigo-200 text-xs font-semibold transition cursor-pointer">
                Importer une sauvegarde JSON
                <input
                  type="file"
                  accept=".json"
                  onChange={handleFileInputChange}
                  className="hidden"
                />
              </label>
            </div>

            {/* Reset progression button */}
            <div className="pt-2 border-t border-slate-900">
              {!showResetConfirm ? (
                <button
                  onClick={() => setShowResetConfirm(true)}
                  className="text-xs text-rose-400 hover:text-rose-300 underline underline-offset-4 cursor-pointer"
                >
                  Réinitialiser la progression de ce profil
                </button>
              ) : (
                <div className="p-3 rounded-xl border border-rose-500/60 bg-rose-950/50 text-xs space-y-2">
                  <p className="font-bold text-rose-300">
                    Confirmer la réinitialisation au niveau 1 ?
                  </p>
                  <p className="text-[11px] text-slate-300">
                    Cette action réinitialise les exercices et l'or de ce profil, sans affecter les autres profils ni vos éventuels fichiers JSON externes.
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={handleResetProgress}
                      className="px-3 py-1 rounded-lg bg-rose-600 text-white font-bold text-xs"
                    >
                      Oui, réinitialiser
                    </button>
                    <button
                      onClick={() => setShowResetConfirm(false)}
                      className="px-3 py-1 rounded-lg bg-slate-800 text-slate-300 text-xs"
                    >
                      Annuler
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Legal Pages Links Section */}
          <div className="rounded-2xl border border-indigo-900/70 bg-slate-950/80 p-4 space-y-2.5">
            <h3 className="text-xs font-black uppercase tracking-wider text-amber-400">
              Transparence & Informations Légales
            </h3>
            <p className="text-xs text-slate-400">
              Consultables hors ligne à tout moment :
            </p>
            <div className="flex flex-wrap gap-2 text-xs">
              <button
                onClick={() => onOpenLegal('mentions-legales')}
                className="px-3 py-1.5 rounded-xl border border-indigo-800 bg-indigo-950/40 hover:bg-indigo-900/50 text-indigo-300 cursor-pointer"
              >
                Mentions Légales
              </button>
              <button
                onClick={() => onOpenLegal('conditions-utilisation')}
                className="px-3 py-1.5 rounded-xl border border-indigo-800 bg-indigo-950/40 hover:bg-indigo-900/50 text-indigo-300 cursor-pointer"
              >
                Conditions Générales (CGU)
              </button>
              <button
                onClick={() => onOpenLegal('confidentialite')}
                className="px-3 py-1.5 rounded-xl border border-indigo-800 bg-indigo-950/40 hover:bg-indigo-900/50 text-indigo-300 cursor-pointer"
              >
                Confidentialité & Sauvegardes
              </button>
            </div>
          </div>
        </div>

        {/* Import confirmation preview */}
        {importPreview && (
          <div className="p-3.5 my-2 rounded-2xl border-2 border-amber-500 bg-slate-950 text-xs space-y-2 shrink-0">
            <h4 className="text-sm font-bold text-amber-300">
              Confirmer la restauration du fichier ?
            </h4>
            <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800 text-slate-300">
              <p>• Aventurier : <strong>{importPreview.profile.name}</strong></p>
              <p>• Classe : {importPreview.profile.grade} (Niv. {importPreview.profile.level})</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={confirmImport}
                className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold"
              >
                Restaurer
              </button>
              <button
                onClick={() => setImportPreview(null)}
                className="px-4 py-1.5 rounded-xl bg-slate-800 text-slate-300"
              >
                Annuler
              </button>
            </div>
          </div>
        )}

        {importError && (
          <div className="p-3 my-2 rounded-xl border border-red-500 bg-red-950/60 text-red-200 text-xs shrink-0">
            {importError}
          </div>
        )}
      </div>
    </div>
  );
};
