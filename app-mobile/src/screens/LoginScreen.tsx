import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  TextInput,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { User, Card } from '../types';
import { authService } from '../services/auth';
import { nfcService } from '../services/nfc';

interface LoginScreenProps {
  onLoginSuccess: (user: User, card?: Card) => void;
}

export default function LoginScreen({ onLoginSuccess }: LoginScreenProps) {
  const [showLogin, setShowLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isScanning, setIsScanning] = useState(false);

  useEffect(() => {
    nfcService.initialize();
  }, []);

  const handleEmailLogin = async () => {
    if (!email || !password) {
      setLoginError('Veuillez remplir tous les champs');
      return;
    }

    setLoading(true);
    setLoginError('');

    try {
      const result = await authService.loginWithCredentials(email, password);
      
      if (result.success && result.user) {
        Alert.alert(
          'Connexion réussie',
          `Bienvenue ${result.user.firstname} ${result.user.lastname}`
        );
        onLoginSuccess(result.user, result.card);
      } else {
        setLoginError(result.error || 'Erreur de connexion');
      }
    } catch (error) {
      setLoginError('Erreur de connexion');
    } finally {
      setLoading(false);
    }
  };

  const handleNFCLogin = async () => {
    setIsScanning(true);
    
    try {
      const result = await authService.loginWithNFC();
      
      if (result.success && result.user) {
        Alert.alert(
          'Connexion NFC réussie ! 🎓',
          `Bienvenue ${result.user.firstname} ${result.user.lastname}`
        );
        onLoginSuccess(result.user, result.card);
      } else {
        Alert.alert('Erreur de connexion', result.error || 'Impossible de se connecter');
      }
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de lire la carte étudiante');
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logo}>
            <Ionicons name="school" size={32} color="white" />
          </View>
          <Text style={styles.title}>Smart Campus</Text>
          <Text style={styles.subtitle}>Accédez à votre espace étudiant</Text>
        </View>

        {/* Email Login Form */}
        {showLogin && (
          <View style={styles.loginForm}>
            <Text style={styles.formTitle}>Connexion</Text>
            
            <View style={styles.inputContainer}>
              <Ionicons name="mail-outline" size={20} color="#6B7280" style={styles.inputIcon} />
              <TextInput
                style={styles.textInput}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                editable={!loading}
              />
            </View>

            <View style={styles.inputContainer}>
              <Ionicons name="lock-closed-outline" size={20} color="#6B7280" style={styles.inputIcon} />
              <TextInput
                style={styles.textInput}
                placeholder="Mot de passe"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                editable={!loading}
              />
            </View>

            {loginError ? (
              <Text style={styles.errorText}>{loginError}</Text>
            ) : null}

            <TouchableOpacity
              style={[styles.loginButton, loading && styles.buttonDisabled]}
              onPress={handleEmailLogin}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={styles.loginButtonText}>Se connecter</Text>
              )}
            </TouchableOpacity>
          </View>
        )}

        {/* Separator */}
        <View style={styles.separator}>
          <View style={styles.separatorLine} />
          <Text style={styles.separatorText}>OU</Text>
          <View style={styles.separatorLine} />
        </View>

        {/* NFC Login */}
        <View style={styles.nfcSection}>
          <Text style={styles.nfcTitle}>Connexion par carte NFC</Text>
          <Text style={styles.nfcDescription}>
            Approchez votre carte étudiante du téléphone
          </Text>
          
          <TouchableOpacity
            style={[styles.nfcButton, isScanning && styles.buttonDisabled]}
            onPress={handleNFCLogin}
            disabled={isScanning}
          >
            <Ionicons 
              name={isScanning ? "radio-outline" : "card-outline"} 
              size={24} 
              color="white" 
            />
            <Text style={styles.nfcButtonText}>
              {isScanning ? "Lecture NFC..." : "Scanner Carte NFC"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Toggle Manual Login */}
        <TouchableOpacity
          style={styles.toggleButton}
          onPress={() => setShowLogin(!showLogin)}
        >
          <Text style={styles.toggleButtonText}>
            {showLogin ? "Masquer la connexion manuelle" : "Connexion manuelle"}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: "center",
  },
  header: {
    alignItems: "center",
    marginBottom: 48,
  },
  logo: {
    width: 64,
    height: 64,
    backgroundColor: "#6366F1",
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    shadowColor: "#6366F1",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#6B7280",
    textAlign: "center",
  },
  loginForm: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  formTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: 24,
    textAlign: "center",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F3F4F6",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  inputIcon: {
    marginRight: 12,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: "#1F2937",
  },
  errorText: {
    color: "#EF4444",
    fontSize: 14,
    marginBottom: 16,
    textAlign: "center",
  },
  loginButton: {
    backgroundColor: "#6366F1",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    shadowColor: "#6366F1",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  loginButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  separator: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 24,
  },
  separatorLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#E5E7EB",
  },
  separatorText: {
    marginHorizontal: 16,
    fontSize: 14,
    color: "#6B7280",
    fontWeight: "500",
  },
  nfcSection: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  nfcTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 8,
    textAlign: "center",
  },
  nfcDescription: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    marginBottom: 24,
  },
  nfcButton: {
    backgroundColor: "#10B981",
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#10B981",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  nfcButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  toggleButton: {
    alignItems: "center",
    paddingVertical: 12,
  },
  toggleButtonText: {
    fontSize: 14,
    color: "#6366F1",
    fontWeight: "500",
  },
  buttonDisabled: {
    opacity: 0.6,
  },
});
