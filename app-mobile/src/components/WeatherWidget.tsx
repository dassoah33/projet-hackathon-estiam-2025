import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { weatherService, WeatherData } from '../services/weather';

interface WeatherWidgetProps {
  city?: string;
  useGeolocation?: boolean;
  onPress?: () => void;
  compact?: boolean; // Version compacte pour petits espaces
}

export default function WeatherWidget({ 
  city = 'Paris',
  useGeolocation = false,
  onPress,
  compact = false
}: WeatherWidgetProps) {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  useEffect(() => {
    loadWeather();
    
    // Auto-refresh toutes les 10 minutes
    const interval = setInterval(loadWeather, 10 * 60 * 1000);
    return () => clearInterval(interval);
  }, [city, useGeolocation]);

  const loadWeather = async () => {
    setLoading(true);
    setError(null);

    try {
      let result;

      if (useGeolocation) {
        result = await loadWeatherByLocation();
      } else {
        result = await weatherService.getWeatherByCity(city);
      }
      
      if (result.success && result.data) {
        setWeather(result.data);
        setLastUpdate(new Date());
      } else {
        // En cas d'erreur, utiliser des données par défaut
        setWeather(weatherService.getDefaultWeather());
        setError(result.error || 'Impossible de charger la météo');
      }
    } catch (err) {
      setWeather(weatherService.getDefaultWeather());
      setError('Erreur de connexion météo');
    } finally {
      setLoading(false);
    }
  };

  const loadWeatherByLocation = async () => {
    try {
      // Demander la permission de géolocalisation
      const { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        throw new Error('Permission géolocalisation refusée');
      }

      // Obtenir la position actuelle
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const { latitude, longitude } = location.coords;
      
      // Récupérer la météo par coordonnées
      return await weatherService.getWeatherByCoordinates(latitude, longitude);
      
    } catch (err) {
      console.log('Erreur géolocalisation:', err);
      // Fallback sur la ville par défaut
      return await weatherService.getWeatherByCity(city);
    }
  };

  const handleRefresh = () => {
    loadWeather();
  };

  const handleLocationToggle = () => {
    Alert.alert(
      "Géolocalisation",
      "Voulez-vous utiliser votre position actuelle pour la météo ?",
      [
        { text: "Non", style: "cancel" },
        { 
          text: "Oui", 
          onPress: () => {
            loadWeatherByLocation();
          }
        }
      ]
    );
  };

  const formatLastUpdate = () => {
    if (!lastUpdate) return '';
    
    const now = new Date();
    const diffMs = now.getTime() - lastUpdate.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    
    if (diffMins === 0) return 'À l\'instant';
    if (diffMins === 1) return 'Il y a 1 min';
    if (diffMins < 60) return `Il y a ${diffMins} min`;
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours === 1) return 'Il y a 1h';
    return `Il y a ${diffHours}h`;
  };

  if (loading) {
    return (
      <View style={[styles.container, compact && styles.containerCompact]}>
        <View style={[styles.weatherCard, compact && styles.weatherCardCompact]}>
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color="#6366F1" />
            <Text style={styles.loadingText}>Chargement météo...</Text>
          </View>
        </View>
      </View>
    );
  }

  if (!weather) {
    return (
      <View style={[styles.container, compact && styles.containerCompact]}>
        <View style={[styles.weatherCard, styles.errorCard]}>
          <View style={styles.errorContainer}>
            <Ionicons name="cloud-offline-outline" size={24} color="#EF4444" />
            <Text style={styles.errorText}>Météo indisponible</Text>
          </View>
        </View>
      </View>
    );
  }

  if (compact) {
    return (
      <TouchableOpacity 
        style={styles.containerCompact} 
        onPress={onPress}
        activeOpacity={0.8}
      >
        <View style={styles.weatherCardCompact}>
          <View style={styles.compactContent}>
            <Ionicons 
              name={weather.icon as any} 
              size={24} 
              color="#6366F1" 
            />
            <Text style={styles.compactTemp}>{weather.temperature}°</Text>
            <Text style={styles.compactLocation}>{weather.location.split(',')[0]}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity 
      style={styles.container} 
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.weatherCard}>
        {/* Header avec localisation et actions */}
        <View style={styles.header}>
          <View style={styles.locationContainer}>
            <Ionicons name="location-outline" size={16} color="#6B7280" />
            <Text style={styles.locationText}>{weather.location}</Text>
          </View>
          <View style={styles.actions}>
            <TouchableOpacity onPress={handleLocationToggle} style={styles.actionButton}>
              <Ionicons name="navigate-outline" size={16} color="#6366F1" />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleRefresh} style={styles.actionButton}>
              <Ionicons name="refresh-outline" size={16} color="#6366F1" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Température principale */}
        <View style={styles.mainWeather}>
          <View style={styles.temperatureContainer}>
            <Ionicons 
              name={weather.icon as any} 
              size={32} 
              color="#6366F1" 
            />
            <Text style={styles.temperature}>{weather.temperature}°</Text>
          </View>
          <Text style={styles.description}>
            {weather.description.charAt(0).toUpperCase() + weather.description.slice(1)}
          </Text>
        </View>

        {/* Détails météo */}
        <View style={styles.details}>
          <View style={styles.detailItem}>
            <Ionicons name="thermometer-outline" size={14} color="#6B7280" />
            <Text style={styles.detailText}>{weather.feelsLike}°</Text>
            <Text style={styles.detailLabel}>Ressenti</Text>
          </View>
          <View style={styles.detailItem}>
            <Ionicons name="water-outline" size={14} color="#6B7280" />
            <Text style={styles.detailText}>{weather.humidity}%</Text>
            <Text style={styles.detailLabel}>Humidité</Text>
          </View>
          <View style={styles.detailItem}>
            <Ionicons name="stormy-outline" size={14} color="#6B7280" />
            <Text style={styles.detailText}>{weather.windSpeed} km/h</Text>
            <Text style={styles.detailLabel}>Vent</Text>
          </View>
        </View>

        {/* Footer avec dernière mise à jour et statut */}
        <View style={styles.footer}>
          {lastUpdate && (
            <Text style={styles.updateText}>
              Mis à jour {formatLastUpdate()}
            </Text>
          )}
          {error && (
            <View style={styles.warningContainer}>
              <Ionicons name="warning-outline" size={12} color="#F59E0B" />
              <Text style={styles.warningText}>Données par défaut</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  containerCompact: {
    marginBottom: 8,
  },
  weatherCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderLeftWidth: 4,
    borderLeftColor: "#6366F1",
  },
  weatherCardCompact: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    borderLeftWidth: 3,
    borderLeftColor: "#6366F1",
  },
  errorCard: {
    borderLeftColor: "#EF4444",
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    marginLeft: 8,
    fontSize: 14,
    color: "#6B7280",
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  errorText: {
    marginLeft: 8,
    fontSize: 14,
    color: "#EF4444",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  locationText: {
    marginLeft: 4,
    fontSize: 12,
    color: "#6B7280",
    fontWeight: "500",
  },
  actions: {
    flexDirection: "row",
    gap: 8,
  },
  actionButton: {
    padding: 4,
  },
  mainWeather: {
    alignItems: "center",
    marginBottom: 16,
  },
  temperatureContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  temperature: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#1F2937",
    marginLeft: 8,
  },
  description: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
  },
  details: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
    marginBottom: 12,
  },
  detailItem: {
    alignItems: "center",
  },
  detailText: {
    fontSize: 12,
    color: "#1F2937",
    fontWeight: "600",
    marginTop: 4,
  },
  detailLabel: {
    fontSize: 10,
    color: "#6B7280",
    marginTop: 2,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  updateText: {
    fontSize: 10,
    color: "#9CA3AF",
  },
  warningContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  warningText: {
    marginLeft: 4,
    fontSize: 10,
    color: "#F59E0B",
  },
  // Styles version compacte
  compactContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  compactTemp: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1F2937",
  },
  compactLocation: {
    fontSize: 12,
    color: "#6B7280",
    flex: 1,
    textAlign: "right",
  },
});