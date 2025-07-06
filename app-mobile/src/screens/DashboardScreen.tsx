// DashboardScreen.tsx
import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  ActivityIndicator,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { User, Card, Course } from '../types';
import { getStatusColor, getStatusText, getTypeColor, calculateStats } from '../utils/helpers';

const { width } = Dimensions.get('window');

interface DashboardScreenProps {
  currentUser: User | null;
  currentCard: Card | null;
  courses: Course[];
  onCoursePress: (course: Course) => void;
}

// Interface météo simple
interface WeatherData {
  location: string;
  temperature: number;
  description: string;
  icon: string;
  humidity: number;
  windSpeed: number;
}

export default function DashboardScreen({
  currentUser,
  currentCard,
  courses,
  onCoursePress,
}: DashboardScreenProps) {
  const stats = calculateStats(courses);
  
  // États météo
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [weatherLoading, setWeatherLoading] = useState(true);
  const [weatherError, setWeatherError] = useState<string | null>(null);

  // États pour gérer les erreurs d'images d'événements
  const [imageErrors, setImageErrors] = useState<{[key: string]: boolean}>({});

  // Fonction pour gérer les erreurs d'image d'événement
  const handleEventImageError = (courseId: string) => {
    setImageErrors(prev => ({
      ...prev,
      [courseId]: true
    }));
  };

  // Fonction pour récupérer la météo
  const loadWeather = async () => {
    setWeatherLoading(true);
    setWeatherError(null);

    try {
      // Utilisation de Open-Meteo API (gratuite, sans clé API)
      // Coordonnées de Paris : lat=48.8566, lon=2.3522
      const response = await fetch(
        'https://api.open-meteo.com/v1/forecast?latitude=48.8566&longitude=2.3522&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&timezone=Europe%2FParis'
      );

      if (!response.ok) {
        throw new Error('Erreur API météo');
      }

      const data = await response.json();
      
      setWeather({
        location: 'Paris, FR',
        temperature: Math.round(data.current.temperature_2m),
        description: getWeatherDescription(data.current.weather_code),
        icon: getWeatherIconFromCode(data.current.weather_code),
        humidity: data.current.relative_humidity_2m,
        windSpeed: Math.round(data.current.wind_speed_10m * 3.6), // conversion km/h
      });

    } catch (error) {
      console.log('Erreur météo:', error);
      setWeatherError('Erreur météo');
      // En cas d'erreur, essayer avec une API de backup
      tryBackupWeatherAPI();
    } finally {
      setWeatherLoading(false);
    }
  };

  // API de backup avec wttr.in
  const tryBackupWeatherAPI = async () => {
    try {
      const response = await fetch('https://wttr.in/Paris?format=j1');
      if (!response.ok) throw new Error('Backup API failed');
      
      const data = await response.json();
      const current = data.current_condition[0];
      
      setWeather({
        location: 'Paris, FR',
        temperature: parseInt(current.temp_C),
        description: current.weatherDesc[0].value.toLowerCase(),
        icon: getWeatherIconFromWttr(current.weatherCode),
        humidity: parseInt(current.humidity),
        windSpeed: parseInt(current.windspeedKmph),
      });
      
      setWeatherError(null);
    } catch (backupError) {
      console.log('Backup API aussi échoué:', backupError);
      // Dernière tentative avec une API simple
      setWeather({
        location: 'Paris, FR',
        temperature: 15, // Température réaliste pour Paris
        description: 'temps variable',
        icon: 'cloud-outline',
        humidity: 70,
        windSpeed: 15,
      });
    }
  };

  // Convertir les codes météo Open-Meteo en descriptions
  const getWeatherDescription = (weatherCode: number): string => {
    const descriptions: { [key: number]: string } = {
      0: 'ciel dégagé',
      1: 'principalement dégagé',
      2: 'partiellement nuageux',
      3: 'couvert',
      45: 'brouillard',
      48: 'brouillard givrant',
      51: 'bruine légère',
      53: 'bruine modérée',
      55: 'bruine dense',
      61: 'pluie légère',
      63: 'pluie modérée',
      65: 'pluie forte',
      71: 'neige légère',
      73: 'neige modérée',
      75: 'neige forte',
      80: 'averses légères',
      81: 'averses modérées',
      82: 'averses violentes',
      95: 'orage',
      96: 'orage avec grêle légère',
      99: 'orage avec grêle forte'
    };
    return descriptions[weatherCode] || 'temps variable';
  };

  // Convertir les codes météo Open-Meteo en icônes
  const getWeatherIconFromCode = (weatherCode: number): string => {
    const now = new Date();
    const hour = now.getHours();
    const isDay = hour >= 6 && hour < 20;

    const iconMap: { [key: number]: string } = {
      0: isDay ? 'sunny-outline' : 'moon-outline',
      1: isDay ? 'partly-sunny-outline' : 'cloudy-night-outline',
      2: 'cloud-outline',
      3: 'cloudy-outline',
      45: 'cloudy-outline',
      48: 'cloudy-outline',
      51: 'rainy-outline',
      53: 'rainy-outline',
      55: 'rainy-outline',
      61: 'rainy-outline',
      63: 'rainy-outline',
      65: 'rainy-outline',
      71: 'snow-outline',
      73: 'snow-outline',
      75: 'snow-outline',
      80: 'rainy-outline',
      81: 'rainy-outline',
      82: 'rainy-outline',
      95: 'thunderstorm-outline',
      96: 'thunderstorm-outline',
      99: 'thunderstorm-outline'
    };
    return iconMap[weatherCode] || 'cloud-outline';
  };

  // Convertir les codes wttr.in en icônes (pour l'API de backup)
  const getWeatherIconFromWttr = (weatherCode: string): string => {
    const now = new Date();
    const hour = now.getHours();
    const isDay = hour >= 6 && hour < 20;

    const iconMap: { [key: string]: string } = {
      '113': isDay ? 'sunny-outline' : 'moon-outline', // Clear
      '116': isDay ? 'partly-sunny-outline' : 'cloudy-night-outline', // Partly cloudy
      '119': 'cloudy-outline', // Cloudy
      '122': 'cloudy-outline', // Overcast
      '143': 'cloudy-outline', // Mist
      '176': 'rainy-outline', // Patchy rain possible
      '179': 'snow-outline', // Patchy snow possible
      '182': 'snow-outline', // Patchy sleet possible
      '185': 'snow-outline', // Patchy freezing drizzle possible
      '200': 'thunderstorm-outline', // Thundery outbreaks possible
      '227': 'snow-outline', // Blowing snow
      '230': 'snow-outline', // Blizzard
      '248': 'cloudy-outline', // Fog
      '260': 'cloudy-outline', // Freezing fog
      '263': 'rainy-outline', // Patchy light drizzle
      '266': 'rainy-outline', // Light drizzle
      '281': 'snow-outline', // Freezing drizzle
      '284': 'snow-outline', // Heavy freezing drizzle
      '293': 'rainy-outline', // Patchy light rain
      '296': 'rainy-outline', // Light rain
      '299': 'rainy-outline', // Moderate rain at times
      '302': 'rainy-outline', // Moderate rain
      '305': 'rainy-outline', // Heavy rain at times
      '308': 'rainy-outline', // Heavy rain
      '311': 'snow-outline', // Light freezing rain
      '314': 'snow-outline', // Moderate or heavy freezing rain
      '317': 'snow-outline', // Light sleet
      '320': 'snow-outline', // Moderate or heavy sleet
      '323': 'snow-outline', // Patchy light snow
      '326': 'snow-outline', // Light snow
      '329': 'snow-outline', // Patchy moderate snow
      '332': 'snow-outline', // Moderate snow
      '335': 'snow-outline', // Patchy heavy snow
      '338': 'snow-outline', // Heavy snow
      '350': 'snow-outline', // Ice pellets
      '353': 'rainy-outline', // Light rain shower
      '356': 'rainy-outline', // Moderate or heavy rain shower
      '359': 'rainy-outline', // Torrential rain shower
      '362': 'snow-outline', // Light sleet showers
      '365': 'snow-outline', // Moderate or heavy sleet showers
      '368': 'snow-outline', // Light snow showers
      '371': 'snow-outline', // Moderate or heavy snow showers
      '374': 'snow-outline', // Light showers of ice pellets
      '377': 'snow-outline', // Moderate or heavy showers of ice pellets
      '386': 'thunderstorm-outline', // Patchy light rain with thunder
      '389': 'thunderstorm-outline', // Moderate or heavy rain with thunder
      '392': 'thunderstorm-outline', // Patchy light snow with thunder
      '395': 'thunderstorm-outline', // Moderate or heavy snow with thunder
    };
    return iconMap[weatherCode] || 'cloud-outline';
  };

  // Charger la météo au démarrage
  useEffect(() => {
    loadWeather();
  }, []);

  // Composant pour l'icône/image d'événement
  const EventIcon = ({ course }: { course: Course }) => {
    const hasValidImage = course.image && 
                         typeof course.image === 'string' && 
                         course.image.trim() !== '' &&
                         !imageErrors[course.id];

    if (hasValidImage) {
      return (
        <View style={styles.courseIcon}>
          <Image
            source={{ uri: course.image }}
            style={styles.courseImage}
            onError={() => handleEventImageError(course.id)}
            resizeMode="cover"
          />
        </View>
      );
    }

    // Fallback vers l'icône si pas d'image ou erreur
    return (
      <View style={styles.courseIcon}>
        <Ionicons name={course.icon as any} size={24} color="#6366F1" />
      </View>
    );
  };

  // Widget météo
  const WeatherWidget = () => (
    <View style={styles.weatherCard}>
      {weatherLoading ? (
        <View style={styles.weatherLoading}>
          <ActivityIndicator size="small" color="#6366F1" />
          <Text style={styles.weatherLoadingText}>Chargement météo...</Text>
        </View>
      ) : (
        <View>
          {/* Header météo */}
          <View style={styles.weatherHeader}>
            <View style={styles.weatherLocation}>
              <Ionicons name="location-outline" size={14} color="#6B7280" />
              <Text style={styles.weatherLocationText}>{weather?.location}</Text>
            </View>
            <TouchableOpacity onPress={loadWeather} style={styles.weatherRefresh}>
              <Ionicons name="refresh-outline" size={14} color="#6366F1" />
            </TouchableOpacity>
          </View>

          {/* Température principale */}
          <View style={styles.weatherMain}>
            <View style={styles.weatherTempContainer}>
              <Ionicons 
                name={weather?.icon as any} 
                size={28} 
                color="#6366F1" 
              />
              <Text style={styles.weatherTemp}>{weather?.temperature}°</Text>
            </View>
            <Text style={styles.weatherDescription}>
              {weather?.description ? 
                weather.description.charAt(0).toUpperCase() + weather.description.slice(1) 
                : 'N/A'
              }
            </Text>
          </View>

          {/* Détails météo */}
          <View style={styles.weatherDetails}>
            <View style={styles.weatherDetail}>
              <Ionicons name="water-outline" size={12} color="#6B7280" />
              <Text style={styles.weatherDetailText}>{weather?.humidity}%</Text>
            </View>
            <View style={styles.weatherDetail}>
              <Ionicons name="stormy-outline" size={12} color="#6B7280" />
              <Text style={styles.weatherDetailText}>{weather?.windSpeed} km/h</Text>
            </View>
          </View>

          {/* Indicateur d'erreur */}
          {weatherError && (
            <View style={styles.weatherError}>
              <Ionicons name="warning-outline" size={10} color="#F59E0B" />
              <Text style={styles.weatherErrorText}>Données par défaut</Text>
            </View>
          )}
        </View>
      )}
    </View>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Carte Étudiante ESTIAM - MAINTENANT EN PREMIER */}
      <View style={styles.studentCard}>
        <View style={styles.cardBackground}>
          <View style={styles.cardHeader}>
            <View>
              <Text style={styles.cardSubtitle}>Carte Étudiante ESTIAM</Text>
              <Text style={styles.cardTitle}>
                {currentUser ? `${currentUser.firstname} ${currentUser.lastname}` : 'Étudiant'}
              </Text>
              <Text style={styles.cardClass}>
                {currentUser?.classe?.nom || 'Classe non définie'}
              </Text>
            </View>
            <View style={styles.nfcIcon}>
              <Ionicons name="school" size={20} color="#FFFFFF" />
            </View>
          </View>

          <View style={styles.cardFooter}>
            <View>
              <Text style={styles.cardSubtitle}>N° Carte</Text>
              <Text style={styles.cardId}>
                •••• {currentCard?.num_carte?.slice(-4) || currentUser?.id.toString().padStart(4, '0')}
              </Text>
            </View>
            <View style={styles.cardStats}>
              <Text style={styles.cardSubtitle}>
                {stats.active + stats.upcoming} cours actifs
              </Text>
              <Text style={styles.nfcText}>NFC</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Widget Météo - MAINTENANT APRÈS LA CARTE */}
      <WeatherWidget />

      {/* Statistiques rapides */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Ionicons name="book-outline" size={24} color="#6366F1" />
          <Text style={styles.statNumber}>{stats.upcoming}</Text>
          <Text style={styles.statLabel}>Cours à venir</Text>
        </View>
        <View style={styles.statCard}>
          <Ionicons name="checkmark-circle-outline" size={24} color="#10B981" />
          <Text style={styles.statNumber}>{stats.completed}</Text>
          <Text style={styles.statLabel}>Terminés</Text>
        </View>
        <View style={styles.statCard}>
          <Ionicons name="time-outline" size={24} color="#F59E0B" />
          <Text style={styles.statNumber}>{stats.active}</Text>
          <Text style={styles.statLabel}>En cours</Text>
        </View>
      </View>

      {/* Événements à venir */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Événements à venir</Text>
        {courses.length > 0 ? (
          courses
            .filter(c => c.status === "upcoming" || c.status === "active")
            .slice(0, 3)
            .map((course) => (
              <TouchableOpacity
                key={course.id}
                style={styles.courseCard}
                onPress={() => onCoursePress(course)}
              >
                <View style={styles.courseContent}>
                  {/* Utilisation du nouveau composant EventIcon */}
                  <EventIcon course={course} />
                  
                  <View style={styles.courseInfo}>
                    <Text style={styles.courseTitle}>{course.nom}</Text>
                    <Text style={styles.courseCode}>{course.code_matiere}</Text>
                    <Text style={styles.courseTime}>
                      {course.time} • {course.lieu}
                    </Text>
                    {course.professeur && (
                      <Text style={styles.courseProfessor}>{course.professeur}</Text>
                    )}
                  </View>
                  <View style={styles.courseRight}>
                    <View
                      style={[
                        styles.typeBadge,
                        { backgroundColor: getTypeColor(course.type) },
                      ]}
                    >
                      <Text style={styles.typeText}>{course.type}</Text>
                    </View>
                    <View
                      style={[
                        styles.statusBadge,
                        { backgroundColor: getStatusColor(course.status) },
                      ]}
                    >
                      <Text style={styles.statusText}>
                        {getStatusText(course.status)}
                      </Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            ))
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="calendar-outline" size={48} color="#9CA3AF" />
            <Text style={styles.emptyStateText}>Aucun événement à venir</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },

  // Styles carte étudiante - ajustés pour le nouveau positionnement
  studentCard: {
    marginTop: 16,
    marginBottom: 16,
  },
  cardBackground: {
    backgroundColor: "#6366F1",
    borderRadius: 16,
    padding: 24,
    position: "relative",
    overflow: "hidden",
    shadowColor: "#6366F1",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 32,
  },
  cardSubtitle: {
    fontSize: 12,
    color: "rgba(255,255,255,0.9)",
    marginBottom: 4,
    fontWeight: "500",
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
    marginBottom: 4,
  },
  cardClass: {
    fontSize: 14,
    color: "rgba(255,255,255,0.95)",
    fontWeight: "500",
  },
  nfcIcon: {
    width: 32,
    height: 32,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  cardId: {
    fontSize: 18,
    fontFamily: "monospace",
    color: "white",
    fontWeight: "600",
  },
  cardStats: {
    alignItems: "flex-end",
  },
  nfcText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
  },

  // Styles météo - ajustés pour le nouveau positionnement
  weatherCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16, // Changé de marginTop à marginBottom
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
    borderLeftWidth: 4,
    borderLeftColor: "#6366F1",
  },
  weatherLoading: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
  },
  weatherLoadingText: {
    marginLeft: 8,
    fontSize: 14,
    color: "#6B7280",
  },
  weatherHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  weatherLocation: {
    flexDirection: "row",
    alignItems: "center",
  },
  weatherLocationText: {
    marginLeft: 4,
    fontSize: 12,
    color: "#6B7280",
    fontWeight: "500",
  },
  weatherRefresh: {
    padding: 4,
  },
  weatherMain: {
    alignItems: "center",
    marginBottom: 12,
  },
  weatherTempContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  weatherTemp: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1F2937",
    marginLeft: 8,
  },
  weatherDescription: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
  },
  weatherDetails: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
  },
  weatherDetail: {
    flexDirection: "row",
    alignItems: "center",
  },
  weatherDetailText: {
    marginLeft: 4,
    fontSize: 12,
    color: "#6B7280",
    fontWeight: "500",
  },
  weatherError: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: "#FEF3C7",
  },
  weatherErrorText: {
    marginLeft: 4,
    fontSize: 10,
    color: "#F59E0B",
  },

  // Styles existants
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  statCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    width: (width - 48) / 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1F2937",
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: "#6B7280",
    textAlign: "center",
    fontWeight: "500",
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: 16,
  },
  courseCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  courseContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  courseIcon: {
    width: 48,
    height: 48,
    backgroundColor: "rgba(99, 102, 241, 0.1)",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    overflow: 'hidden', // Important pour que l'image reste dans les bordures arrondies
  },
  // Nouveau style pour les images d'événements
  courseImage: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
  },
  courseInfo: {
    flex: 1,
  },
  courseTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 4,
  },
  courseCode: {
    fontSize: 12,
    color: "#6366F1",
    marginBottom: 2,
    fontWeight: "600",
  },
  courseTime: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 2,
  },
  courseProfessor: {
    fontSize: 12,
    color: "#374151",
    fontStyle: "italic",
  },
  courseRight: {
    alignItems: "flex-end",
  },
  typeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 4,
  },
  typeText: {
    fontSize: 10,
    fontWeight: "600",
    color: "white",
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 4,
  },
  statusText: {
    fontSize: 10,
    fontWeight: "600",
    color: "white",
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 32,
  },
  emptyStateText: {
    fontSize: 16,
    color: "#6B7280",
    marginTop: 16,
  },
});