import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { User, Card } from '../types';
import { authService } from '../services/auth';

interface ScanScreenProps {
  onLoginSuccess: (user: User, card?: Card) => void;
  onLogout: () => void;
}

export default function ScanScreen({ onLoginSuccess, onLogout }: ScanScreenProps) {
  const [isScanning, setIsScanning] = useState(false);

  const handleNFCLogin = async () => {
    setIsScanning(true);
    
    try {
      const result = await authService.loginWithNFC();
      
      if (result.success && result.user) {
        Alert.alert(
          'Connexion NFC réussie ! 🎓',
          `Bienvenue ${result.user.firstname} ${result.user.lastname}`,
          [
            {
              text: 'Voir mon planning',
              onPress: () => onLoginSuccess(result.user, result.card)
            },
            {
              text: 'OK',
              style: 'cancel'
            }
          ]
        );
      } else {
        Alert.alert(
          'Erreur de connexion',
          result.error || 'Impossible de se connecter avec cette carte.',
          [
            {
              text: 'Réessayer',
              onPress: () => handleNFCLogin()
            },
            {
              text: 'Annuler',
              style: 'cancel'
            }
          ]
        );
      }
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de lire la carte étudiante');
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.scanArea}>
        <View style={[styles.scanBox, isScanning && styles.scanBoxActive]}>
          <View style={styles.scanIconContainer}>
            <Ionicons
              name={isScanning ? "radio-outline" : "card-outline"}
              size={48}
              color="#FFFFFF"
            />
          </View>
          <Text style={styles.scanTitle}>
            {isScanning ? "Lecture en cours..." : "Placez votre carte étudiante"}
          </Text>
          <Text style={styles.scanSubtitle}>
            {isScanning ? "Veuillez patienter" : "Approchez la carte du téléphone"}
          </Text>
        </View>
      </View>

      <View style={styles.scanContent}>
        <Text style={styles.scanHeading}>Scanner ma carte</Text>
        <Text style={styles.scanDescription}>
          Accédez à votre planning et vos cours
        </Text>

        <View style={styles.scanButtons}>
          <TouchableOpacity
            style={[styles.primaryButton, isScanning && styles.buttonDisabled]}
            onPress={handleNFCLogin}
            disabled={isScanning}
          >
            <Text style={styles.primaryButtonText}>
              {isScanning ? "Lecture NFC..." : "Scanner Carte NFC"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.secondaryButton}
            onPress={onLogout}
          >
            <Text style={styles.secondaryButtonText}>Déconnexion</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  scanArea: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  scanBox: {
    width: 250,
    height: 250,
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: "#6366F1",
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(99, 102, 241, 0.05)",
  },
  scanBoxActive: {
    borderColor: "#10B981",
    backgroundColor: "rgba(16, 185, 129, 0.05)",
  },
  scanIconContainer: {
    width: 64,
    height: 64,
    backgroundColor: "#6366F1",
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  scanTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 8,
    textAlign: "center",
  },
  scanSubtitle: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
  },
  scanContent: {
    paddingBottom: 32,
    alignItems: "center",
  },
  scanHeading: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: 8,
  },
  scanDescription: {
    fontSize: 16,
    color: "#6B7280",
    marginBottom: 32,
  },
  scanButtons: {
    width: "100%",
    maxWidth: 320,
  },
  primaryButton: {
    backgroundColor: "#6366F1",
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#6366F1",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
  secondaryButton: {
    backgroundColor: "#F3F4F6",
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#D1D5DB",
  },
  secondaryButtonText: {
    color: "#374151",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
  buttonDisabled: {
    opacity: 0.6,
  },
});