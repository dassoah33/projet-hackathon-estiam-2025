import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { User } from '../types';

interface DocumentsScreenProps {
  currentUser: User | null;
}

interface Document {
  id: number;
  title: string;
  description: string;
  type: 'academic' | 'administrative' | 'certificate';
  icon: string;
  color: string;
  status: 'available' | 'pending' | 'unavailable';
  fileSize?: string;
  lastUpdate?: string;
}

export default function DocumentsScreen({ currentUser }: DocumentsScreenProps) {
  
  // Documents statiques pour les étudiants
  const documents: Document[] = [
    {
      id: 1,
      title: "Relevé de notes",
      description: "Relevé de notes du semestre en cours",
      type: "academic",
      icon: "document-text-outline",
      color: "#6366F1",
      status: "available",
      fileSize: "245 KB",
      lastUpdate: "Mis à jour il y a 2 jours"
    },
    {
      id: 2,
      title: "Certificat de scolarité",
      description: "Certificat attestant de votre inscription",
      type: "certificate",
      icon: "school-outline",
      color: "#059669",
      status: "available",
      fileSize: "180 KB",
      lastUpdate: "Mis à jour il y a 1 semaine"
    },
    {
      id: 3,
      title: "Emploi du temps",
      description: "Planning des cours de la semaine",
      type: "academic",
      icon: "calendar-outline",
      color: "#DC2626",
      status: "available",
      fileSize: "120 KB",
      lastUpdate: "Mis à jour aujourd'hui"
    },
    {
      id: 4,
      title: "Carte d'étudiant PDF",
      description: "Version numérique de votre carte",
      type: "administrative",
      icon: "card-outline",
      color: "#7C3AED",
      status: "available",
      fileSize: "95 KB",
      lastUpdate: "Mis à jour il y a 3 jours"
    },
    {
      id: 5,
      title: "Attestation d'assurance",
      description: "Couverture responsabilité civile étudiante",
      type: "administrative",
      icon: "shield-checkmark-outline",
      color: "#0891B2",
      status: "available",
      fileSize: "320 KB",
      lastUpdate: "Mis à jour il y a 1 mois"
    },
    {
      id: 6,
      title: "Bulletin de paie (stage)",
      description: "Rémunération du stage en entreprise",
      type: "administrative",
      icon: "receipt-outline",
      color: "#EA580C",
      status: "pending",
      lastUpdate: "En attente de validation"
    },
    {
      id: 7,
      title: "Diplôme intermédiaire",
      description: "Certification de fin de cycle",
      type: "certificate",
      icon: "trophy-outline",
      color: "#CA8A04",
      status: "unavailable",
      lastUpdate: "Disponible en fin d'année"
    },
    {
      id: 8,
      title: "Convention de stage",
      description: "Document tripartite école-entreprise-étudiant",
      type: "administrative",
      icon: "document-outline",
      color: "#9333EA",
      status: "available",
      fileSize: "445 KB",
      lastUpdate: "Mis à jour il y a 2 semaines"
    }
  ];

  // Fonction pour obtenir le texte du statut
  const getStatusText = (status: Document['status']) => {
    switch (status) {
      case 'available': return 'Disponible';
      case 'pending': return 'En attente';
      case 'unavailable': return 'Indisponible';
      default: return 'Inconnu';
    }
  };

  // Fonction pour obtenir la couleur du statut
  const getStatusColor = (status: Document['status']) => {
    switch (status) {
      case 'available': return '#10B981';
      case 'pending': return '#F59E0B';
      case 'unavailable': return '#6B7280';
      default: return '#6B7280';
    }
  };

  // Gestion du clic sur un document
  const handleDocumentPress = (document: Document) => {
    if (document.status === 'available') {
      Alert.alert(
        "Téléchargement",
        `Voulez-vous télécharger "${document.title}" ?`,
        [
          { text: "Annuler", style: "cancel" },
          { 
            text: "Télécharger", 
            onPress: () => {
              Alert.alert("Succès", "Document téléchargé dans vos fichiers !");
            }
          }
        ]
      );
    } else if (document.status === 'pending') {
      Alert.alert("Information", "Ce document est en cours de traitement.");
    } else {
      Alert.alert("Information", "Ce document n'est pas encore disponible.");
    }
  };

  // Grouper les documents par type
  const documentsByType = {
    academic: documents.filter(doc => doc.type === 'academic'),
    administrative: documents.filter(doc => doc.type === 'administrative'),
    certificate: documents.filter(doc => doc.type === 'certificate'),
  };

  const typeLabels = {
    academic: "Documents académiques",
    administrative: "Documents administratifs", 
    certificate: "Certificats et diplômes"
  };

  const typeIcons = {
    academic: "book-outline",
    administrative: "folder-outline",
    certificate: "medal-outline"
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Mes Documents</Text>
        <Text style={styles.headerSubtitle}>
          {currentUser ? `${currentUser.firstname} ${currentUser.lastname}` : 'Étudiant'}
        </Text>
        <Text style={styles.headerClass}>
          {currentUser?.classe?.nom || 'Classe non définie'} • {currentUser?.filiere?.nom || 'Filière non définie'}
        </Text>
      </View>

      {/* Statistiques rapides */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Ionicons name="checkmark-circle-outline" size={24} color="#10B981" />
          <Text style={styles.statNumber}>
            {documents.filter(d => d.status === 'available').length}
          </Text>
          <Text style={styles.statLabel}>Disponibles</Text>
        </View>
        <View style={styles.statCard}>
          <Ionicons name="time-outline" size={24} color="#F59E0B" />
          <Text style={styles.statNumber}>
            {documents.filter(d => d.status === 'pending').length}
          </Text>
          <Text style={styles.statLabel}>En attente</Text>
        </View>
        <View style={styles.statCard}>
          <Ionicons name="document-outline" size={24} color="#6366F1" />
          <Text style={styles.statNumber}>{documents.length}</Text>
          <Text style={styles.statLabel}>Total</Text>
        </View>
      </View>

      {/* Documents par catégorie */}
      {Object.entries(documentsByType).map(([type, docs]) => (
        <View key={type} style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons 
              name={typeIcons[type as keyof typeof typeIcons] as any} 
              size={20} 
              color="#6366F1" 
            />
            <Text style={styles.sectionTitle}>
              {typeLabels[type as keyof typeof typeLabels]}
            </Text>
            <View style={styles.sectionBadge}>
              <Text style={styles.sectionBadgeText}>{docs.length}</Text>
            </View>
          </View>

          {docs.map((document) => (
            <TouchableOpacity
              key={document.id}
              style={[
                styles.documentCard,
                document.status !== 'available' && styles.documentCardDisabled
              ]}
              onPress={() => handleDocumentPress(document)}
              activeOpacity={0.7}
            >
              <View style={styles.documentContent}>
                <View style={[styles.documentIcon, { backgroundColor: `${document.color}15` }]}>
                  <Ionicons 
                    name={document.icon as any} 
                    size={24} 
                    color={document.color} 
                  />
                </View>
                
                <View style={styles.documentInfo}>
                  <Text style={styles.documentTitle}>{document.title}</Text>
                  <Text style={styles.documentDescription}>{document.description}</Text>
                  
                  <View style={styles.documentMeta}>
                    {document.fileSize && (
                      <Text style={styles.documentMetaText}>
                        📄 {document.fileSize}
                      </Text>
                    )}
                    <Text style={styles.documentMetaText}>
                      🕒 {document.lastUpdate}
                    </Text>
                  </View>
                </View>

                <View style={styles.documentRight}>
                  <View style={[
                    styles.statusBadge,
                    { backgroundColor: getStatusColor(document.status) }
                  ]}>
                    <Text style={styles.statusText}>
                      {getStatusText(document.status)}
                    </Text>
                  </View>
                  
                  {document.status === 'available' && (
                    <Ionicons name="download-outline" size={20} color="#6B7280" />
                  )}
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      ))}

      {/* Footer informatif */}
      <View style={styles.footer}>
        <Ionicons name="information-circle-outline" size={16} color="#6B7280" />
        <Text style={styles.footerText}>
          Les documents sont automatiquement mis à jour. Contactez l'administration pour toute question.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  header: {
    paddingVertical: 24,
    paddingHorizontal: 4,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: "#6B7280",
    marginBottom: 2,
  },
  headerClass: {
    fontSize: 14,
    color: "#6366F1",
    fontWeight: "600",
  },
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
    flex: 1,
    marginHorizontal: 4,
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
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1F2937",
    marginLeft: 8,
    flex: 1,
  },
  sectionBadge: {
    backgroundColor: "#6366F1",
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  sectionBadgeText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "600",
  },
  documentCard: {
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
  documentCardDisabled: {
    opacity: 0.6,
  },
  documentContent: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  documentIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  documentInfo: {
    flex: 1,
  },
  documentTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 4,
  },
  documentDescription: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 8,
  },
  documentMeta: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  documentMetaText: {
    fontSize: 12,
    color: "#9CA3AF",
  },
  documentRight: {
    alignItems: "flex-end",
    justifyContent: "space-between",
    height: 48,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 10,
    fontWeight: "600",
    color: "white",
  },
  footer: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#F9FAFB",
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  footerText: {
    marginLeft: 8,
    fontSize: 12,
    color: "#6B7280",
    lineHeight: 16,
    flex: 1,
  },
});