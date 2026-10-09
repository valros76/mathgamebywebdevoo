import React, { useState } from 'react';
import { db } from '../../services/persistence/db';
import {
  isFileSystemAccessSupported,
  isRunningInIframe,
  requestExternalJsonFilePicker,
} from '../../services/persistence/fileSystemBackup';
import { IconShield, IconScroll, IconSparkles } from '../../components/icons/GameIcons';

interface InitialBackupChoiceBannerProps {
  onChoiceMade: (choice: 'local_only' | 'local_plus_json' | 'remind_later') => void;
}

export const InitialBackupChoiceBanner: React.FC<InitialBackupChoiceBannerProps> = ({
  onChoiceMade,
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isIframeNotice, setIsIframeNotice] = useState(false);

  const handleChooseLocalOnly = async () => {
    setIsProcessing(true);
    await db.saveMetadata.put({
      key: 'initial_backup_choice_completed',
      value: 'local_only',
      updatedAt: Date.now(),
    });
    onChoiceMade('local_only');
  };

  const handleChooseLocalPlusJson = async () => {
    setIsProcessing(true);
    setErrorMessage(null);
    setIsIframeNotice(false);

    if (!isFileSystemAccessSupported()) {
      setErrorMessage(
        'Votre navigateur ne prend pas en charge la sélection directe de fichier externe. Votre progression reste sauvegardée dans le navigateur, et vous pourrez exporter manuellement votre sauvegarde à tout moment dans les Paramètres.'
      );
      setIsProcessing(false);
      return;
    }

    const result = await requestExternalJsonFilePicker('sauvegarde');
    if (result.success) {
      await db.saveMetadata.put({
        key: 'initial_backup_choice_completed',
        value: 'local_plus_json',
        updatedAt: Date.now(),
      });
      setSuccessMessage(
        'Sauvegarde JSON activée ! Ta progression est conservée dans le navigateur et une copie est enregistrée dans le fichier choisi. MathGame vérifiera les autorisations nécessaires pour mettre cette copie à jour.'
      );
      setTimeout(() => {
        onChoiceMade('local_plus_json');
      }, 2200);
    } else {
      setIsProcessing(false);
      if (result.status === 'iframe_security_restricted') {
        setIsIframeNotice(true);
        setErrorMessage(
          'Environnement d\'aperçu détecté (iFrame sécurisée) : Le navigateur bloque l\'ouverture du sélecteur de disque direct depuis un sous-cadre intégré pour protéger votre système.'
        );
      } else if (result.status === 'cancelled') {
        setErrorMessage(
          'Sélection de fichier annulée. Tu peux réessayer ou continuer avec la sauvegarde locale uniquement.'
        );
      } else {
        setErrorMessage(
          result.message || 'Aucun fichier sélectionné. Tu peux réessayer ou continuer avec la sauvegarde locale uniquement.'
        );
      }
    }
  };

  const handleRemindLater = () => {
    onChoiceMade('remind_later');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-3 sm:p-5">
      <div className="relative w-full max-w-2xl max-h-[95dvh] flex flex-col rounded-3xl border-2 border-amber-500/50 bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-950 p-5 sm:p-7 shadow-2xl text-slate-100 overflow-y-auto">
        
        {/* Header */}
        <div className="text-center mb-5">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-400 mb-2">
            <IconShield className="w-6 h-6 text-amber-300" />
          </div>
          <h2 className="text-lg sm:text-xl font-black text-amber-300 font-serif tracking-wide">
            Comment veux-tu sauvegarder ta progression ?
          </h2>
          <p className="text-xs text-slate-300 mt-2 max-w-lg mx-auto leading-relaxed">
            MathGame enregistre automatiquement ta progression sur cet appareil. Tu peux aussi choisir de conserver une copie dans un fichier JSON, pour faciliter la récupération de ta partie. Tu peux modifier ce choix plus tard dans les paramètres.
          </p>
        </div>

        {/* Notifications */}
        {successMessage && (
          <div className="mb-4 p-3.5 rounded-2xl border border-emerald-500/60 bg-emerald-950/60 text-emerald-200 text-xs leading-relaxed animate-in fade-in">
            <span className="font-bold text-emerald-300 block mb-1">Sauvegarde JSON activée</span>
            {successMessage}
          </div>
        )}

        {isIframeNotice && (
          <div className="mb-4 p-4 rounded-2xl border-2 border-amber-500/80 bg-gradient-to-b from-amber-950/80 to-slate-950 p-4 text-amber-100 text-xs leading-relaxed space-y-2.5 animate-in fade-in">
            <div className="font-bold text-amber-300 flex items-center gap-2 text-sm font-serif">
              <IconSparkles className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Pourquoi ce message apparaît dans l'aperçu ?</span>
            </div>
            <p className="text-slate-200">
              Dans le panneau d'aperçu d'AI Studio, l'application tourne dans un <strong>sous-cadre sécurisé (iframe)</strong>. Par mesure de protection standard de votre navigateur, l'accès direct aux fichiers du disque local est restreint dans ce mode.
            </p>
            <div className="p-2.5 rounded-xl bg-emerald-950/50 border border-emerald-500/50 text-emerald-200 font-medium">
              ✨ <strong>Aucune inquiétude :</strong> Ta partie est sauvegardée à 100% dans la base de données <strong>IndexedDB</strong> de cet appareil ! Tu peux également télécharger un fichier JSON de sauvegarde à tout moment dans les <em>Options</em>.
            </div>
            <div className="pt-1 flex flex-col sm:flex-row gap-2">
              <button
                onClick={handleChooseLocalOnly}
                className="px-4 py-2 rounded-xl font-bold bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-slate-950 text-xs shadow-md transition cursor-pointer"
              >
                Continuer avec la sauvegarde locale (Recommandé)
              </button>
            </div>
          </div>
        )}

        {errorMessage && !isIframeNotice && (
          <div className="mb-4 p-3 rounded-2xl border border-amber-500/60 bg-amber-950/60 text-amber-200 text-xs leading-relaxed">
            {errorMessage}
          </div>
        )}

        {/* Two choice cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
          {/* Choice A */}
          <div className="rounded-2xl border border-indigo-800/80 bg-slate-950/70 p-4 flex flex-col justify-between hover:border-amber-400/60 transition group">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <IconShield className="w-5 h-5 text-cyan-400" />
                <h3 className="text-sm font-bold text-slate-100 group-hover:text-amber-300 transition">
                  Sur cet appareil uniquement
                </h3>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Ta progression est enregistrée automatiquement dans le navigateur. Aucune sauvegarde JSON supplémentaire n'est créée. C'est le choix le plus simple pour commencer.
              </p>
            </div>
            <button
              onClick={handleChooseLocalOnly}
              disabled={isProcessing}
              className="mt-4 w-full py-2.5 rounded-xl font-bold text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition cursor-pointer"
            >
              Continuer
            </button>
          </div>

          {/* Choice B */}
          <div className="rounded-2xl border-2 border-amber-500/50 bg-gradient-to-b from-indigo-950/60 to-slate-950/80 p-4 flex flex-col justify-between hover:border-amber-400 transition">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <IconScroll className="w-5 h-5 text-amber-400" />
                <h3 className="text-sm font-bold text-amber-300">
                  Sur cet appareil + une copie JSON
                </h3>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Ta progression restera enregistrée dans le navigateur. En complément, MathGame pourra mettre à jour un fichier JSON que tu auras choisi et autorisé. Cette copie pourra servir à restaurer ta progression si les données du navigateur sont perdues.
              </p>
            </div>
            <button
              onClick={handleChooseLocalPlusJson}
              disabled={isProcessing}
              className="mt-4 w-full py-2.5 rounded-xl font-bold text-xs bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-slate-950 shadow-md transition cursor-pointer"
            >
              Choisir mon fichier de sauvegarde
            </button>
          </div>
        </div>

        {/* Secondary option */}
        <div className="text-center pt-2 border-t border-indigo-900/40">
          <button
            onClick={handleRemindLater}
            disabled={isProcessing}
            className="text-xs text-slate-400 hover:text-slate-200 underline underline-offset-4 cursor-pointer"
          >
            Me le rappeler plus tard
          </button>
        </div>
      </div>
    </div>
  );
};
