import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  AppState,
  AppStateStatus,
} from 'react-native';
import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface NotificationData {
  id: string;
  title: string;
  body: string;
  screen?: string;
  timestamp: number;
  read: boolean;
}

interface NotificationHandlerProps {
  onNotificationReceived?: (notification: NotificationData) => void;
  onNotificationTap?: (notification: NotificationData) => void;
}

const NotificationHandler: React.FC<NotificationHandlerProps> = ({
  onNotificationReceived,
  onNotificationTap,
}) => {
  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const [badgeCount, setBadgeCount] = useState(0);

  useEffect(() => {
    // Request permission for notifications
    requestUserPermission();

    // Load stored notifications
    loadStoredNotifications();

    // Set up notification listeners
    setupNotificationListeners();

    // Handle app state changes
    const subscription = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      subscription?.remove();
    };
  }, []);

  const requestUserPermission = async () => {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log('Authorization status:', authStatus);
      getFCMToken();
    } else {
      Alert.alert(
        'Notification Permission',
        'Please enable notifications to receive messages like WhatsApp!',
        [{ text: 'OK' }],
      );
    }
  };

  const getFCMToken = async () => {
    try {
      const token = await messaging().getToken();
      console.log('FCM Token:', token);

      // Store token for backend use
      await AsyncStorage.setItem('fcm_token', token);

      // TODO: Send token to your backend server
      // sendTokenToServer(token);
    } catch (error) {
      console.error('Error getting FCM token:', error);
    }
  };

  const setupNotificationListeners = () => {
    // Handle foreground messages
    const unsubscribeForeground = messaging().onMessage(async remoteMessage => {
      console.log('Foreground message received:', remoteMessage);

      const notificationData: NotificationData = {
        id: Date.now().toString(),
        title:
          (remoteMessage.data?.title as string) ||
          (remoteMessage.notification?.title as string) ||
          'New Message',
        body:
          (remoteMessage.data?.body as string) ||
          (remoteMessage.notification?.body as string) ||
          'You have a new message',
        screen: (remoteMessage.data?.screen as string) || 'home',
        timestamp: Date.now(),
        read: false,
      };

      // Add to local storage
      await storeNotification(notificationData);

      // Update badge count
      updateBadgeCount();

      // Call callback
      onNotificationReceived?.(notificationData);

      // Show alert for foreground messages
      Alert.alert(notificationData.title, notificationData.body, [
        { text: 'View', onPress: () => handleNotificationTap(notificationData) },
        { text: 'Dismiss', style: 'cancel' },
      ]);
    });

    // Handle background/quit state messages
    messaging().onNotificationOpenedApp(remoteMessage => {
      console.log('App opened from background state:', remoteMessage);

      const notificationData: NotificationData = {
        id: Date.now().toString(),
        title:
          (remoteMessage.data?.title as string) ||
          (remoteMessage.notification?.title as string) ||
          'New Message',
        body:
          (remoteMessage.data?.body as string) ||
          (remoteMessage.notification?.body as string) ||
          'You have a new message',
        screen: (remoteMessage.data?.screen as string) || 'home',
        timestamp: Date.now(),
        read: true,
      };

      onNotificationTap?.(notificationData);
    });

    // Handle app opened from quit state
    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage) {
          console.log('App opened from quit state:', remoteMessage);

          const notificationData: NotificationData = {
            id: Date.now().toString(),
            title:
              (remoteMessage.data?.title as string) ||
              (remoteMessage.notification?.title as string) ||
              'New Message',
            body:
              (remoteMessage.data?.body as string) ||
              (remoteMessage.notification?.body as string) ||
              'You have a new message',
            screen: (remoteMessage.data?.screen as string) || 'home',
            timestamp: Date.now(),
            read: true,
          };

          onNotificationTap?.(notificationData);
        }
      });

    return unsubscribeForeground;
  };

  const handleAppStateChange = (nextAppState: AppStateStatus) => {
    if (nextAppState === 'active') {
      // App became active, update badge count
      updateBadgeCount();
    }
  };

  const storeNotification = async (notification: NotificationData) => {
    try {
      const storedNotifications = await AsyncStorage.getItem('notifications');
      const notificationsArray: NotificationData[] = storedNotifications
        ? JSON.parse(storedNotifications)
        : [];

      notificationsArray.unshift(notification);

      // Keep only last 50 notifications
      const trimmedNotifications = notificationsArray.slice(0, 50);

      await AsyncStorage.setItem(
        'notifications',
        JSON.stringify(trimmedNotifications),
      );
      setNotifications(trimmedNotifications);
    } catch (error) {
      console.error('Error storing notification:', error);
    }
  };

  const loadStoredNotifications = async () => {
    try {
      const storedNotifications = await AsyncStorage.getItem('notifications');
      if (storedNotifications) {
        const notificationsArray: NotificationData[] = JSON.parse(
          storedNotifications,
        );
        setNotifications(notificationsArray);
        updateBadgeCount();
      }
    } catch (error) {
      console.error('Error loading stored notifications:', error);
    }
  };

  const updateBadgeCount = async () => {
    try {
      const unreadCount = notifications.filter(n => !n.read).length;
      setBadgeCount(unreadCount);

      // Update app badge (works on some devices)
      await AsyncStorage.setItem('badge_count', unreadCount.toString());
    } catch (error) {
      console.error('Error updating badge count:', error);
    }
  };

  const handleNotificationTap = (notification: NotificationData) => {
    // Mark as read
    const updatedNotifications = notifications.map(n =>
      n.id === notification.id ? { ...n, read: true } : n,
    );
    setNotifications(updatedNotifications);
    AsyncStorage.setItem('notifications', JSON.stringify(updatedNotifications));

    // Update badge count
    updateBadgeCount();

    // Call callback
    onNotificationTap?.(notification);
  };

  return null; // This component doesn't render anything
};

export default NotificationHandler; 