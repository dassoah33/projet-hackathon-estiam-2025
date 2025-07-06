import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Alert,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { User } from '../types';

interface MessagesScreenProps {
  currentUser: User | null;
}

interface Message {
  id: number;
  sender: {
    name: string;
    role: 'student' | 'teacher' | 'admin';
    avatar?: string;
  };
  subject: string;
  content: string;
  timestamp: string;
  isRead: boolean;
  priority: 'low' | 'normal' | 'high';
  category: 'academic' | 'administrative' | 'general';
}

interface Conversation {
  id: number;
  participants: string[];
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
}

export default function MessagesScreen({ currentUser }: MessagesScreenProps) {
  const [activeTab, setActiveTab] = useState<'inbox' | 'conversations'>('inbox');
  const [searchQuery, setSearchQuery] = useState('');

  // Messages statiques
  const messages: Message[] = [
    {
      id: 1,
      sender: {
        name: "Prof. Martin Dubois",
        role: "teacher"
      },
      subject: "Rappel : Rendu du projet React Native",
      content: "Bonjour, je vous rappelle que le projet React Native est à rendre avant le 15 janvier. N'oubliez pas d'inclure la documentation.",
      timestamp: "il y a 2 heures",
      isRead: false,
      priority: "high",
      category: "academic"
    },
    {
      id: 2,
      sender: {
        name: "Administration ESTIAM",
        role: "admin"
      },
      subject: "Mise à jour des horaires d'ouverture",
      content: "Chers étudiants, veuillez noter que les horaires d'ouverture de la bibliothèque ont été modifiés pour les vacances.",
      timestamp: "il y a 4 heures",
      isRead: true,
      priority: "normal",
      category: "administrative"
    },
    {
      id: 3,
      sender: {
        name: "Sarah Leclerc",
        role: "student"
      },
      subject: "Groupe de travail - Projet IA",
      content: "Salut ! Est-ce que tu veux rejoindre notre groupe pour le projet d'intelligence artificielle ? On se retrouve demain à 14h.",
      timestamp: "il y a 6 heures",
      isRead: false,
      priority: "normal",
      category: "academic"
    },
    {
      id: 4,
      sender: {
        name: "Dr. Sophie Moreau",
        role: "teacher"
      },
      subject: "Résultats de l'examen de base de données",
      content: "Les résultats de l'examen de base de données sont disponibles sur la plateforme. Félicitations pour vos excellents résultats !",
      timestamp: "hier",
      isRead: true,
      priority: "normal",
      category: "academic"
    },
    {
      id: 5,
      sender: {
        name: "Service Scolarité",
        role: "admin"
      },
      subject: "Inscription aux cours optionnels",
      content: "Les inscriptions aux cours optionnels du semestre prochain sont ouvertes jusqu'au 30 janvier. Consultez le catalogue en ligne.",
      timestamp: "il y a 2 jours",
      isRead: true,
      priority: "low",
      category: "administrative"
    },
    {
      id: 6,
      sender: {
        name: "Bureau des Étudiants",
        role: "admin"
      },
      subject: "Soirée de fin d'année 🎉",
      content: "La soirée de fin d'année aura lieu le 25 janvier ! Inscriptions ouvertes, places limitées. Thème : années 90 !",
      timestamp: "il y a 3 jours",
      isRead: false,
      priority: "low",
      category: "general"
    }
  ];

  // Conversations statiques
  const conversations: Conversation[] = [
    {
      id: 1,
      participants: ["Prof. Martin Dubois"],
      lastMessage: "Merci pour votre question, je vous réponds demain.",
      timestamp: "il y a 30 min",
      unreadCount: 1
    },
    {
      id: 2,
      participants: ["Groupe Projet Mobile"],
      lastMessage: "Sarah: Parfait ! On se voit demain alors 👍",
      timestamp: "il y a 2 heures",
      unreadCount: 3
    },
    {
      id: 3,
      participants: ["Thomas Petit", "Alice Bernard"],
      lastMessage: "Alice: Les notes sont sorties !",
      timestamp: "hier",
      unreadCount: 0
    }
  ];

  // Fonction pour obtenir la couleur de priorité
  const getPriorityColor = (priority: Message['priority']) => {
    switch (priority) {
      case 'high': return '#EF4444';
      case 'normal': return '#6366F1';
      case 'low': return '#10B981';
      default: return '#6B7280';
    }
  };

  // Fonction pour obtenir l'icône de rôle
  const getRoleIcon = (role: Message['sender']['role']) => {
    switch (role) {
      case 'teacher': return 'school-outline';
      case 'admin': return 'business-outline';
      case 'student': return 'person-outline';
      default: return 'person-outline';
    }
  };

  // Fonction pour gérer le clic sur un message
  const handleMessagePress = (message: Message) => {
    Alert.alert(
      message.subject,
      `De: ${message.sender.name}\n\n${message.content}`,
      [
        { text: "Fermer", style: "cancel" },
        { text: "Répondre", onPress: () => Alert.alert("Fonctionnalité", "Réponse en cours de développement") }
      ]
    );
  };

  // Filtrer les messages selon la recherche
  const filteredMessages = messages.filter(message =>
    message.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
    message.sender.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Messages</Text>
        <Text style={styles.headerSubtitle}>
          {currentUser ? `${currentUser.firstname} ${currentUser.lastname}` : 'Étudiant'}
        </Text>
      </View>

      {/* Barre de recherche */}
      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={20} color="#6B7280" />
        <TextInput
          style={styles.searchInput}
          placeholder="Rechercher dans les messages..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Onglets */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'inbox' && styles.tabActive]}
          onPress={() => setActiveTab('inbox')}
        >
          <Ionicons 
            name="mail-outline" 
            size={16} 
            color={activeTab === 'inbox' ? "#6366F1" : "#6B7280"} 
          />
          <Text style={[
            styles.tabText,
            activeTab === 'inbox' && styles.tabTextActive
          ]}>
            Boîte de réception
          </Text>
          <View style={styles.unreadBadge}>
            <Text style={styles.unreadBadgeText}>
              {messages.filter(m => !m.isRead).length}
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === 'conversations' && styles.tabActive]}
          onPress={() => setActiveTab('conversations')}
        >
          <Ionicons 
            name="chatbubbles-outline" 
            size={16} 
            color={activeTab === 'conversations' ? "#6366F1" : "#6B7280"} 
          />
          <Text style={[
            styles.tabText,
            activeTab === 'conversations' && styles.tabTextActive
          ]}>
            Conversations
          </Text>
          <View style={styles.unreadBadge}>
            <Text style={styles.unreadBadgeText}>
              {conversations.reduce((sum, conv) => sum + conv.unreadCount, 0)}
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {activeTab === 'inbox' ? (
          // Liste des messages
          <>
            {filteredMessages.map((message) => (
              <TouchableOpacity
                key={message.id}
                style={[
                  styles.messageCard,
                  !message.isRead && styles.messageCardUnread
                ]}
                onPress={() => handleMessagePress(message)}
              >
                <View style={styles.messageHeader}>
                  <View style={styles.messageSender}>
                    <View style={[
                      styles.senderIcon,
                      { backgroundColor: `${getPriorityColor(message.priority)}15` }
                    ]}>
                      <Ionicons 
                        name={getRoleIcon(message.sender.role) as any} 
                        size={16} 
                        color={getPriorityColor(message.priority)} 
                      />
                    </View>
                    <View>
                      <Text style={styles.senderName}>{message.sender.name}</Text>
                      <Text style={styles.messageTime}>{message.timestamp}</Text>
                    </View>
                  </View>
                  
                  <View style={styles.messageStatus}>
                    {!message.isRead && <View style={styles.unreadDot} />}
                    <View style={[
                      styles.priorityIndicator,
                      { backgroundColor: getPriorityColor(message.priority) }
                    ]} />
                  </View>
                </View>

                <Text style={styles.messageSubject}>{message.subject}</Text>
                <Text style={styles.messagePreview} numberOfLines={2}>
                  {message.content}
                </Text>

                <View style={styles.messageFooter}>
                  <View style={[
                    styles.categoryBadge,
                    { backgroundColor: message.category === 'academic' ? '#EF444415' : 
                                     message.category === 'administrative' ? '#059669' + '15' : '#6366F1' + '15' }
                  ]}>
                    <Text style={[
                      styles.categoryText,
                      { color: message.category === 'academic' ? '#EF4444' : 
                              message.category === 'administrative' ? '#059669' : '#6366F1' }
                    ]}>
                      {message.category === 'academic' ? 'Académique' :
                       message.category === 'administrative' ? 'Administratif' : 'Général'}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </>
        ) : (
          // Liste des conversations
          <>
            {conversations.map((conversation) => (
              <TouchableOpacity
                key={conversation.id}
                style={styles.conversationCard}
                onPress={() => Alert.alert("Conversation", "Ouverture de la conversation...")}
              >
                <View style={styles.conversationHeader}>
                  <View style={styles.conversationInfo}>
                    <Text style={styles.conversationTitle}>
                      {conversation.participants.join(', ')}
                    </Text>
                    <Text style={styles.conversationTime}>{conversation.timestamp}</Text>
                  </View>
                  {conversation.unreadCount > 0 && (
                    <View style={styles.conversationUnreadBadge}>
                      <Text style={styles.conversationUnreadText}>
                        {conversation.unreadCount}
                      </Text>
                    </View>
                  )}
                </View>
                <Text style={styles.conversationLastMessage} numberOfLines={1}>
                  {conversation.lastMessage}
                </Text>
              </TouchableOpacity>
            ))}
          </>
        )}
      </ScrollView>

      {/* Bouton nouveau message */}
      <TouchableOpacity 
        style={styles.fabButton}
        onPress={() => Alert.alert("Nouveau message", "Rédaction en cours de développement")}
      >
        <Ionicons name="add" size={24} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1F2937",
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 2,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    marginHorizontal: 16,
    marginVertical: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: "#1F2937",
  },
  tabsContainer: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    marginHorizontal: 16,
    borderRadius: 12,
    padding: 4,
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  tabActive: {
    backgroundColor: "#F3F4F6",
  },
  tabText: {
    marginLeft: 6,
    fontSize: 14,
    fontWeight: "500",
    color: "#6B7280",
  },
  tabTextActive: {
    color: "#6366F1",
    fontWeight: "600",
  },
  unreadBadge: {
    backgroundColor: "#EF4444",
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 6,
  },
  unreadBadgeText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "600",
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  messageCard: {
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
  messageCardUnread: {
    borderLeftWidth: 4,
    borderLeftColor: "#6366F1",
  },
  messageHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  messageSender: {
    flexDirection: "row",
    alignItems: "center",
  },
  senderIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  senderName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1F2937",
  },
  messageTime: {
    fontSize: 12,
    color: "#6B7280",
  },
  messageStatus: {
    flexDirection: "row",
    alignItems: "center",
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#6366F1",
    marginRight: 8,
  },
  priorityIndicator: {
    width: 3,
    height: 20,
    borderRadius: 2,
  },
  messageSubject: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 4,
  },
  messagePreview: {
    fontSize: 14,
    color: "#6B7280",
    lineHeight: 20,
    marginBottom: 8,
  },
  messageFooter: {
    flexDirection: "row",
    justifyContent: "flex-start",
  },
  categoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: "500",
  },
  conversationCard: {
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
  conversationHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  conversationInfo: {
    flex: 1,
  },
  conversationTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
  },
  conversationTime: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 2,
  },
  conversationUnreadBadge: {
    backgroundColor: "#EF4444",
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  conversationUnreadText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "600",
  },
  conversationLastMessage: {
    fontSize: 14,
    color: "#6B7280",
  },
  fabButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    backgroundColor: "#6366F1",
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#6366F1",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});

