import React, { useState } from 'react';
import { IconBook } from '../../components/icons/GameIcons';

export type LegalPageSlug = 'mentions-legales' | 'conditions-utilisation' | 'confidentialite';

interface LegalPagesModalProps {
  initialSlug?: LegalPageSlug;
  onClose: () => void;
}

export const LegalPagesModal: React.FC<LegalPagesModalProps> = ({
  initialSlug = 'mentions-legales',
  onClose,
}) => {
  const [activeSlug, setActiveSlug] = useState<LegalPageSlug>(initialSlug);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-md p-3 sm:p-5">
      <div className="relative w-full max-w-3xl max-h-[92dvh] flex flex-col rounded-3xl border-2 border-amber-500/50 bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-950 p-4 sm:p-6 shadow-2xl text-slate-100 overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-indigo-900/60 pb-3 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-purple-950/80 border border-purple-500/60 flex items-center justify-center">
              <IconBook className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-amber-300 font-serif">
                Informations Légales & Confidentialité
              </h2>
              <p className="text-xs text-indigo-300">
                Transparence, gratuité et respect absolu de la vie privée
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Fermer les mentions légales"
            className="rounded-xl p-2 text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Tab navigation */}
        <div className="flex gap-2 border-b border-indigo-900/40 py-2.5 shrink-0 overflow-x-auto">
          <button
            onClick={() => setActiveSlug('mentions-legales')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition shrink-0 cursor-pointer ${
              activeSlug === 'mentions-legales'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'bg-slate-900/90 text-slate-300 hover:bg-slate-800'
            }`}
          >
            Mentions Légales
          </button>
          <button
            onClick={() => setActiveSlug('conditions-utilisation')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition shrink-0 cursor-pointer ${
              activeSlug === 'conditions-utilisation'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'bg-slate-900/90 text-slate-300 hover:bg-slate-800'
            }`}
          >
            Conditions d'Utilisation (CGU)
          </button>
          <button
            onClick={() => setActiveSlug('confidentialite')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition shrink-0 cursor-pointer ${
              activeSlug === 'confidentialite'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'bg-slate-900/90 text-slate-300 hover:bg-slate-800'
            }`}
          >
            Confidentialité & Sauvegardes
          </button>
        </div>

        {/* Content area with internal scroll so modal never exceeds viewport */}
        <div className="flex-1 overflow-y-auto pr-2 py-3 text-xs text-slate-300 space-y-4 leading-relaxed font-sans">
          {activeSlug === 'mentions-legales' && (
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-amber-300 font-serif">1. Mentions Légales</h3>
              
              <div className="rounded-xl bg-slate-950/80 border border-indigo-900/60 p-3.5 space-y-1.5 font-mono text-[11px] text-slate-300">
                <p><strong>Application :</strong> MathGame par Webdevoo</p>
                <p><strong>Éditeur :</strong> Webdevoo (Entrepreneur individuel)</p>
                <p><strong>SIRET :</strong> 84959557400013 — <strong>RCS :</strong> Amiens</p>
                <p><strong>TVA intracommunautaire :</strong> FR87849595574</p>
                <p><strong>Responsable de la publication :</strong> Valérian Dufrène</p>
                <p><strong>Adresse :</strong> 25 rue de la Vallée, 80132 Cahon, France</p>
                <p><strong>Téléphone :</strong> 07 50 47 47 57</p>
                <p><strong>Courriel :</strong> developpeur@webdevoo.com</p>
                <p><strong>Site éditeur :</strong> https://webdevoo.com</p>
                <p><strong>Application :</strong> https://mathgame.webdevoo.com</p>
              </div>

              <div className="rounded-xl bg-slate-950/80 border border-indigo-900/60 p-3.5 space-y-1.5 font-mono text-[11px] text-slate-300">
                <p><strong>Hébergeur :</strong> PLANETHOSTER</p>
                <p>4416 Louis B. Mayer, Laval (Québec) H7P 0G1, Canada</p>
                <p>Site : https://www.planethoster.com/</p>
              </div>

              <div className="rounded-xl bg-amber-950/30 border border-amber-600/40 p-3.5 text-amber-200 space-y-2">
                <p className="font-semibold text-amber-300">Avertissement de non-affiliation ministérielle :</p>
                <p>
                  MathGame est une application éducative indépendante proposant des activités ludiques de mathématiques, notamment pour les élèves du primaire et du collège. Elle est gratuite et ne nécessite aucun compte.
                </p>
                <p>
                  MathGame n'est ni éditée, ni validée, ni approuvée par le ministère de l'Éducation nationale. Les activités constituent un support complémentaire d'apprentissage et ne remplacent en aucun cas les enseignements dispensés par les enseignants.
                </p>
              </div>

              <p>
                L'application est conçue pour fonctionner hors connexion après le chargement initial des ressources nécessaires. La disponibilité dépend du navigateur, de l'espace de stockage et de la mise en cache.
              </p>
              <p>
                Les contenus originaux de MathGame sont soumis aux droits de propriété intellectuelle applicables, sous réserve des licences et droits des tiers. Les ressources externes restent soumises à leurs propres licences.
              </p>
              <p>
                L'application est proposée sans garantie de disponibilité permanente et peut comporter des erreurs ou dysfonctionnements. La perte de données locales peut survenir notamment à la suite d'une suppression du stockage du navigateur ou d'un incident technique.
              </p>
              <p>
                Pour toute question : developpeur@webdevoo.com. Les présentes mentions sont soumises au droit français.
              </p>
            </div>
          )}

          {activeSlug === 'conditions-utilisation' && (
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-amber-300 font-serif">2. Conditions Générales d'Utilisation (CGU)</h3>
              <p>
                MathGame est une application gratuite d'entraînement en mathématiques. Elle ne nécessite ni compte, ni paiement, ni abonnement.
              </p>
              <p>
                L'application peut proposer des exercices, des corrections, des explications, des niveaux, des récompenses virtuelles et des éléments narratifs. Ces fonctionnalités ne constituent ni une évaluation scolaire officielle, ni une certification, ni une garantie de maîtrise d'une compétence.
              </p>
              <p>
                L'application est conçue pour fonctionner hors connexion après le chargement initial des ressources nécessaires. Les mises à jour peuvent nécessiter une connexion temporaire.
              </p>
              <p>
                La progression est conservée localement dans le navigateur. Une sauvegarde JSON externe est facultative et nécessite une action explicite et, lorsque le navigateur le demande, une autorisation explicite.
              </p>
              <p>
                Le stockage du navigateur (IndexedDB) et le fichier JSON sont distincts. Supprimer les données du navigateur ne supprime pas nécessairement le fichier externe ; désactiver la sauvegarde externe ne supprime pas la progression locale.
              </p>
              <p>
                L'importation d'un fichier peut remplacer la progression existante après confirmation. L'utilisateur doit conserver ses sauvegardes dans un emplacement sûr.
              </p>
              <p>
                Webdevoo s'efforce de proposer des contenus exacts, mais des erreurs ou dysfonctionnements peuvent subsister. MathGame est un outil complémentaire qui ne remplace pas les enseignants ou les parents.
              </p>
              <p>
                Contact : developpeur@webdevoo.com. Droit applicable : droit français.
              </p>
            </div>
          )}

          {activeSlug === 'confidentialite' && (
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-amber-300 font-serif">3. Confidentialité & Sauvegardes</h3>
              
              <div className="rounded-xl bg-emerald-950/40 border border-emerald-600/50 p-3 text-emerald-200">
                <span className="font-bold text-emerald-300 block mb-1">Engagement Zéro Traceur :</span>
                MathGame est conçue sans compte utilisateur, sans transmission de progression à Webdevoo et sans aucun outil publicitaire, pixel, télémétrie ou mesure d'audience intégrée.
              </div>

              <p>
                Les données de jeu nécessaires à la progression (profils locaux, exercices réalisés, résultats, inventaire et préférences) sont conservées exclusivement sur votre appareil dans le stockage sécurisé du navigateur (IndexedDB).
              </p>
              <p>
                L'application n'exige ni votre nom réel, ni votre adresse électronique, ni votre date de naissance. Un pseudonyme d'aventurier suffit.
              </p>
              <p>
                La sauvegarde JSON externe est entièrement facultative. Lorsqu'elle est activée, le fichier est enregistré sur votre appareil selon les capacités de votre navigateur et les autorisations accordées.
              </p>
              <p>
                L'accès initial au site nécessite un hébergement web. L'hébergeur (Planethoster) peut traiter certaines données techniques liées aux requêtes HTTP de chargement et à la sécurité réseau, selon sa configuration. Ces éventuels traitements techniques sont strictement distincts de la progression du jeu qui reste stockée localement sur votre appareil.
              </p>
              <p>
                Pour toute question relative à la protection des données : developpeur@webdevoo.com.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-indigo-900/60 flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition cursor-pointer"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};
