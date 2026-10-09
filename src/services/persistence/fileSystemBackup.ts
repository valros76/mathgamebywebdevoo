// MathGame par Webdevoo — Gestionnaire de sauvegarde externe File System Access API
import type { SaveDataPackage } from '../../types';

// In-memory file handle storage for the active session
let activeFileHandle: FileSystemFileHandle | null = null;

/**
 * Détecte si l'application s'exécute dans une iframe (ex: panneau de prévisualisation AI Studio)
 */
export function isRunningInIframe(): boolean {
  try {
    return typeof window !== 'undefined' && window.self !== window.top;
  } catch {
    return true; // En cas d'erreur cross-origin sur window.top, on est forcément dans une iframe
  }
}

/**
 * Vérifie si le navigateur prend en charge l'API File System Access
 */
export function isFileSystemAccessSupported(): boolean {
  return typeof window !== 'undefined' && 'showSaveFilePicker' in window;
}

export type FilePickerStatus =
  | 'success'
  | 'cancelled'
  | 'not_supported'
  | 'iframe_security_restricted'
  | 'error';

export interface FilePickerResult {
  success: boolean;
  status: FilePickerStatus;
  message?: string;
}

/**
 * Demande le sélecteur de fichier avec diagnostic précis de l'environnement (iframe, permissions, etc.)
 */
export async function requestExternalJsonFilePicker(profileName: string): Promise<FilePickerResult> {
  if (!isFileSystemAccessSupported()) {
    return {
      success: false,
      status: 'not_supported',
      message: 'Votre navigateur ou environnement ne prend pas en charge l\'API File System Access.',
    };
  }

  // Vérification préventive de l'iframe
  if (isRunningInIframe()) {
    // Dans certains navigateurs, l'appel échouera immédiatement avec une SecurityError.
    // Nous tentons l'appel mais interceptons précisément l'erreur de sécurité du sous-cadre.
  }

  try {
    const handle = await (window as unknown as {
      showSaveFilePicker: (options: unknown) => Promise<FileSystemFileHandle>;
    }).showSaveFilePicker({
      suggestedName: `sauvegarde-mathgame-${profileName.toLowerCase().replace(/\s+/g, '-')}.json`,
      types: [
        {
          description: 'Sauvegarde JSON MathGame',
          accept: {
            'application/json': ['.json'],
          },
        },
      ],
    });

    activeFileHandle = handle;
    return {
      success: true,
      status: 'success',
      message: 'Fichier externe sélectionné avec succès.',
    };
  } catch (err: unknown) {
    const error = err as Error;
    if (error.name === 'AbortError') {
      return {
        success: false,
        status: 'cancelled',
        message: 'Sélection annulée par l\'utilisateur.',
      };
    }

    const isSecurityOrSubframe =
      error.name === 'SecurityError' ||
      error.message?.includes('Cross-origin') ||
      error.message?.includes('subframe') ||
      error.message?.includes('not allowed') ||
      isRunningInIframe();

    if (isSecurityOrSubframe) {
      console.info(
        '[FileSystemBackup] Restriction de sécurité du sous-cadre (iframe preview) détectée pour showSaveFilePicker.'
      );
      return {
        success: false,
        status: 'iframe_security_restricted',
        message:
          'Le panneau d\'aperçu du navigateur (iframe sécurisée) restreint l\'accès direct aux fichiers de votre disque par mesure de sécurité.',
      };
    }

    console.warn('[FileSystemBackup] Erreur lors de la sélection du fichier:', err);
    return {
      success: false,
      status: 'error',
      message: error.message || 'Une erreur inattendue est survenue lors de la sélection.',
    };
  }
}

/**
 * Demande explicitement à l'utilisateur de choisir un fichier de sauvegarde JSON externe.
 * Rétrocompatible : renvoie un booléen simple.
 */
export async function requestExternalJsonFileHandle(profileName: string): Promise<boolean> {
  const result = await requestExternalJsonFilePicker(profileName);
  return result.success;
}

/**
 * Écrit de manière sécurisée les données dans le fichier JSON externe choisi.
 */
export async function writeExternalJsonBackup(pkg: SaveDataPackage): Promise<boolean> {
  if (!activeFileHandle) {
    return false;
  }

  try {
    const writable = await (activeFileHandle as unknown as {
      createWritable: () => Promise<FileSystemWritableFileStream>;
    }).createWritable();

    const formattedJson = JSON.stringify(pkg, null, 2);
    await writable.write(formattedJson);
    await writable.close();
    return true;
  } catch (err) {
    console.warn('[FileSystemBackup] Impossible d\'écrire dans le fichier externe:', err);
    // Le handle a pu expirer ou perdre les permissions
    return false;
  }
}

/**
 * Exporte un SaveDataPackage sous forme de téléchargement manuel de fichier JSON (solution universelle de repli).
 */
export function exportSaveAsJsonFile(pkg: SaveDataPackage): void {
  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(pkg, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute('href', dataStr);
  const cleanName = pkg.profile.name.toLowerCase().replace(/[^a-z0-9]/gi, '_') || 'aventurier';
  downloadAnchor.setAttribute('download', `mathgame_sauvegarde_${cleanName}_${new Date().toISOString().slice(0, 10)}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}

/**
 * Validation et désérialisation sécurisée d'un fichier JSON importé.
 * Empêche l'exécution de code ou les structures corrompues.
 */
export function validateImportedJson(jsonString: string): { isValid: boolean; data?: SaveDataPackage; error?: string } {
  try {
    const parsed = JSON.parse(jsonString);

    if (!parsed || typeof parsed !== 'object') {
      return { isValid: false, error: 'Le fichier ne contient pas un objet JSON valide.' };
    }

    if (parsed.generator !== 'MathGame par Webdevoo' && !parsed.profile) {
      return { isValid: false, error: 'Ce fichier n\'est pas reconnu comme une sauvegarde MathGame valide.' };
    }

    if (!parsed.profile || typeof parsed.profile.id !== 'string' || !parsed.profile.grade) {
      return { isValid: false, error: 'Profil du joueur introuvable ou incomplet dans la sauvegarde.' };
    }

    if (!Array.isArray(parsed.masteryRecords) || !Array.isArray(parsed.questStates)) {
      return { isValid: false, error: 'Structure de progression ou de quêtes corrompue.' };
    }

    return { isValid: true, data: parsed as SaveDataPackage };
  } catch (err) {
    return { isValid: false, error: `Erreur de lecture du JSON: ${(err as Error).message}` };
  }
}
