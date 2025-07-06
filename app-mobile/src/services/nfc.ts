import NfcManager, { NfcTech, Ndef } from "react-native-nfc-manager";
import { Alert } from "react-native";

class NFCService {
  private isInitialized = false;

  // Initialiser le service NFC
  async initialize(): Promise<boolean> {
    try {
      const isSupported = await NfcManager.isSupported();
      if (isSupported) {
        await NfcManager.start();
        this.isInitialized = true;
        return true;
      }
      return false;
    } catch (error) {
      console.log('Erreur initialisation NFC:', error);
      return false;
    }
  }

  // Vérifier si NFC est disponible et activé
  async checkNFCAvailability(): Promise<{ available: boolean; enabled: boolean }> {
    try {
      const available = await NfcManager.isSupported();
      const enabled = available ? await NfcManager.isEnabled() : false;
      
      return { available, enabled };
    } catch (error) {
      console.log('Erreur vérification NFC:', error);
      return { available: false, enabled: false };
    }
  }

  // Scanner une carte NFC et extraire le token
  async scanCard(): Promise<string> {
    return new Promise(async (resolve, reject) => {
      try {
        const { available, enabled } = await this.checkNFCAvailability();
        
        if (!available) {
          reject(new Error("NFC n'est pas supporté sur cet appareil"));
          return;
        }
        
        if (!enabled) {
          reject(new Error("Veuillez activer NFC dans les paramètres"));
          return;
        }
        
        // Démarrer la lecture NFC
        await NfcManager.requestTechnology(NfcTech.Ndef);
        
        const tag = await NfcManager.getTag();
        console.log('Carte étudiante détectée:', tag);
        
        // Extraire le token de la carte NFC
        let token = null;
        
        // Essayer d'extraire depuis NDEF
        if (tag.ndefMessage && tag.ndefMessage.length > 0) {
          const record = tag.ndefMessage[0];
          if (record.payload) {
            token = String.fromCharCode(...record.payload).replace(/^\x02en/, '');
          }
        }
        
        // Si pas de token dans NDEF, utiliser l'ID de la carte
        if (!token) {
          token = tag.id ? Array.from(tag.id).map(byte => 
            byte.toString(16).padStart(2, '0')
          ).join('').toUpperCase() : null;
        }

        if (!token) {
          reject(new Error("Impossible de lire le token de la carte"));
          return;
        }
        
        console.log('Token extrait:', token);
        resolve(token);
        
      } catch (error) {
        console.log('Erreur lecture carte:', error);
        
        if (error.toString().includes('cancelled')) {
          reject(new Error("Lecture de carte annulée"));
        } else {
          reject(new Error(error.message || "Impossible de lire la carte étudiante"));
        }
      } finally {
        this.cancelScanning();
      }
    });
  }

  // Annuler le scan en cours
  async cancelScanning(): Promise<void> {
    try {
      await NfcManager.cancelTechnologyRequest();
    } catch (error) {
      console.log('Erreur annulation scan:', error);
    }
  }

  // Nettoyer les ressources NFC
  async cleanup(): Promise<void> {
    try {
      await this.cancelScanning();
      if (this.isInitialized) {
        // Note: NfcManager.stop() peut causer des problèmes, on évite de l'appeler
        this.isInitialized = false;
      }
    } catch (error) {
      console.log('Erreur nettoyage NFC:', error);
    }
  }

  // Afficher une alerte pour guider l'utilisateur
  showScanAlert(onScan: () => void, onCancel: () => void): void {
    Alert.alert(
      "NFC Prêt", 
      "Approchez votre carte étudiante du téléphone",
      [
        {
          text: "Annuler",
          onPress: onCancel,
          style: "cancel"
        },
        {
          text: "Scanner",
          onPress: onScan
        }
      ]
    );
  }
}

export const nfcService = new NFCService();
export default nfcService;