package com.whatsappclone

import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.content.Context
import android.content.Intent
import android.media.AudioAttributes
import android.media.RingtoneManager
import android.os.Build
import androidx.core.app.NotificationCompat
import com.google.firebase.messaging.FirebaseMessagingService
import com.google.firebase.messaging.RemoteMessage

class NotificationService : FirebaseMessagingService() {
    
    companion object {
        private const val CHANNEL_ID = "whatsapp_clone_channel"
        private const val CHANNEL_NAME = "WhatsApp Clone Notifications"
        private const val CHANNEL_DESCRIPTION = "Notifications for WhatsApp Clone app"
        private var notificationCount = 0
    }
    
    override fun onNewToken(token: String) {
        super.onNewToken(token)
        // Send token to your server
        sendRegistrationToServer(token)
    }
    
    override fun onMessageReceived(remoteMessage: RemoteMessage) {
        super.onMessageReceived(remoteMessage)
        
        // Handle data payload
        remoteMessage.data.isNotEmpty().let {
            val title = remoteMessage.data["title"] ?: "New Message"
            val body = remoteMessage.data["body"] ?: "You have a new message"
            val screen = remoteMessage.data["screen"] ?: "home"
            
            // Create notification
            createNotification(title, body, screen)
            
            // Update badge count
            notificationCount++
            updateBadgeCount(notificationCount)
        }
        
        // Handle notification payload
        remoteMessage.notification?.let { notification ->
            val title = notification.title ?: "New Message"
            val body = notification.body ?: "You have a new message"
            
            createNotification(title, body, "home")
            notificationCount++
            updateBadgeCount(notificationCount)
        }
    }
    
    private fun createNotification(title: String, body: String, screen: String) {
        val notificationManager = getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
        
        // Create notification channel for Android O and above
        createNotificationChannel(notificationManager)
        
        // Create intent for when notification is tapped
        val intent = Intent(this, MainActivity::class.java).apply {
            flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TOP
            putExtra("screen", screen)
            putExtra("notification_data", body)
        }
        
        val pendingIntent = PendingIntent.getActivity(
            this, 0, intent,
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
        )
        
        // Create notification
        val notification = NotificationCompat.Builder(this, CHANNEL_ID)
            .setContentTitle(title)
            .setContentText(body)
            .setSmallIcon(R.drawable.ic_notification)
            .setAutoCancel(true)
            .setContentIntent(pendingIntent)
            .setPriority(NotificationCompat.PRIORITY_HIGH)
            .setCategory(NotificationCompat.CATEGORY_MESSAGE)
            .setSound(RingtoneManager.getDefaultUri(RingtoneManager.TYPE_NOTIFICATION))
            .setVibrate(longArrayOf(1000, 1000, 1000, 1000, 1000))
            .setLights(0xFF0000FF.toInt(), 3000, 3000)
            .build()
        
        notificationManager.notify(notificationCount, notification)
    }
    
    private fun createNotificationChannel(notificationManager: NotificationManager) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val channel = NotificationChannel(
                CHANNEL_ID,
                CHANNEL_NAME,
                NotificationManager.IMPORTANCE_HIGH
            ).apply {
                description = CHANNEL_DESCRIPTION
                enableLights(true)
                lightColor = 0xFF0000FF.toInt()
                enableVibration(true)
                setSound(
                    RingtoneManager.getDefaultUri(RingtoneManager.TYPE_NOTIFICATION),
                    AudioAttributes.Builder()
                        .setContentType(AudioAttributes.CONTENT_TYPE_SONIFICATION)
                        .setUsage(AudioAttributes.USAGE_NOTIFICATION_COMMUNICATION_INSTANT)
                        .build()
                )
            }
            notificationManager.createNotificationChannel(channel)
        }
    }
    
    private fun updateBadgeCount(count: Int) {
        // Update app badge count (works on some launchers)
        val intent = Intent("android.intent.action.BADGE_COUNT_UPDATE")
        intent.putExtra("badge_count", count)
        intent.putExtra("badge_count_package_name", packageName)
        intent.putExtra("badge_count_class_name", MainActivity::class.java.name)
        sendBroadcast(intent)
    }
    
    private fun sendRegistrationToServer(token: String) {
        // TODO: Send token to your backend server
        // This is where you would typically make an API call to your server
    }
} 