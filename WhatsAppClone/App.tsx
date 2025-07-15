/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
  StatusBar,
} from 'react-native';
import NotificationHandler from './src/components/NotificationHandler';
import NotificationList from './src/components/NotificationList';

interface NotificationData {
  id: string;
  title: string;
  body: string;
  screen?: string;
  timestamp: number;
  read: boolean;
}

function App(): React.JSX.Element {
  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const [badgeCount, setBadgeCount] = useState(0);
  const [currentScreen, setCurrentScreen] = useState('home');

  const handleNotificationReceived = (notification: NotificationData) => {
    setNotifications(prev => [notification, ...prev]);
    setBadgeCount(prev => prev + 1);
  };

  const handleNotificationTap = (notification: NotificationData) => {
    // Mark as read
    setNotifications(prev => 
      prev.map(n => n.id === notification.id ? { ...n, read: true } : n)
    );
    setBadgeCount(prev => Math.max(0, prev - 1));
    
    // Navigate to specific screen if specified
    if (notification.screen) {
      setCurrentScreen(notification.screen);
      Alert.alert(
        'Notification Opened',
        `Navigating to: ${notification.screen}\n\nMessage: ${notification.body}`,
        [{ text: 'OK' }]
      );
    }
  };

  const handleClearAllNotifications = () => {
    setNotifications([]);
    setBadgeCount(0);
  };

  const simulateNotification = () => {
    const testNotification: NotificationData = {
      id: Date.now().toString(),
      title: 'Test Message',
      body: 'This is a test notification to simulate WhatsApp-style messaging!',
      screen: 'chat',
      timestamp: Date.now(),
      read: false,
    };
    
    handleNotificationReceived(testNotification);
    
    Alert.alert(
      'Test Notification Sent',
      'A test notification has been added to your list. This simulates receiving a push notification.',
      [{ text: 'OK' }]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>WhatsApp Clone</Text>
        {badgeCount > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{badgeCount}</Text>
          </View>
        )}
      </View>

      {/* Navigation Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, currentScreen === 'home' && styles.activeTab]}
          onPress={() => setCurrentScreen('home')}
        >
          <Text style={[styles.tabText, currentScreen === 'home' && styles.activeTabText]}>
            Home
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, currentScreen === 'notifications' && styles.activeTab]}
          onPress={() => setCurrentScreen('notifications')}
        >
          <Text style={[styles.tabText, currentScreen === 'notifications' && styles.activeTabText]}>
            Notifications
          </Text>
          {badgeCount > 0 && (
            <View style={styles.tabBadge}>
              <Text style={styles.tabBadgeText}>{badgeCount}</Text>
            </View>
          )}
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, currentScreen === 'chat' && styles.activeTab]}
          onPress={() => setCurrentScreen('chat')}
        >
          <Text style={[styles.tabText, currentScreen === 'chat' && styles.activeTabText]}>
            Chat
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <View style={styles.content}>
        {currentScreen === 'home' && (
          <View style={styles.homeContainer}>
            <Text style={styles.welcomeText}>Welcome to WhatsApp Clone!</Text>
            <Text style={styles.descriptionText}>
              This app demonstrates real-time push notifications similar to WhatsApp.
            </Text>
            
            <TouchableOpacity style={styles.testButton} onPress={simulateNotification}>
              <Text style={styles.testButtonText}>Send Test Notification</Text>
            </TouchableOpacity>
            
            <View style={styles.infoContainer}>
              <Text style={styles.infoTitle}>Features:</Text>
              <Text style={styles.infoText}>• Real-time push notifications</Text>
              <Text style={styles.infoText}>• Background notification handling</Text>
              <Text style={styles.infoText}>• Deep linking support</Text>
              <Text style={styles.infoText}>• Badge counts</Text>
              <Text style={styles.infoText}>• Local notification storage</Text>
            </View>
          </View>
        )}
        
        {currentScreen === 'notifications' && (
          <NotificationList
            notifications={notifications}
            onNotificationPress={handleNotificationTap}
            onClearAll={handleClearAllNotifications}
          />
        )}
        
        {currentScreen === 'chat' && (
          <View style={styles.chatContainer}>
            <Text style={styles.chatText}>Chat Screen</Text>
            <Text style={styles.chatSubtext}>
              This screen would contain your chat interface. Tap on a notification to navigate here.
            </Text>
        </View>
        )}
      </View>

      {/* Notification Handler (invisible component) */}
      <NotificationHandler
        onNotificationReceived={handleNotificationReceived}
        onNotificationTap={handleNotificationTap}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000000',
  },
  badge: {
    backgroundColor: '#FF3B30',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  badgeText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    position: 'relative',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#007AFF',
  },
  tabText: {
    fontSize: 14,
    color: '#666666',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#007AFF',
    fontWeight: '600',
  },
  tabBadge: {
    position: 'absolute',
    top: 8,
    right: 20,
    backgroundColor: '#FF3B30',
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabBadgeText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
  },
  homeContainer: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 12,
    textAlign: 'center',
  },
  descriptionText: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  testButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 32,
  },
  testButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  infoContainer: {
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 8,
    width: '100%',
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 4,
  },
  chatContainer: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chatText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 12,
  },
  chatSubtext: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 24,
  },
});

export default App;
