const admin = require('firebase-admin');
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Firebase Admin SDK
// You need to download your Firebase service account key from Firebase Console
// Go to Project Settings > Service Accounts > Generate New Private Key
// Place the JSON file in this directory and update the path below
let serviceAccount;
try {
  serviceAccount = require('./firebase-service-account.json');
} catch (error) {
  console.log('⚠️  Firebase service account not found!');
  console.log('📝 To test FCM notifications:');
  console.log('1. Go to Firebase Console > Project Settings > Service Accounts');
  console.log('2. Click "Generate New Private Key"');
  console.log('3. Save the JSON file as "firebase-service-account.json" in this directory');
  console.log('4. Restart this server');
}

if (serviceAccount) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
  console.log('✅ Firebase Admin SDK initialized successfully!');
}

// Store FCM tokens (in a real app, you'd use a database)
const fcmTokens = new Set();

// Routes
app.post('/register-token', (req, res) => {
  const { token } = req.body;
  if (token) {
    fcmTokens.add(token);
    console.log('📱 FCM Token registered:', token.substring(0, 20) + '...');
    res.json({ success: true, message: 'Token registered successfully' });
  } else {
    res.status(400).json({ success: false, message: 'Token is required' });
  }
});

app.post('/send-notification', async (req, res) => {
  const { title, body, screen, token } = req.body;
  
  if (!admin.apps.length) {
    return res.status(500).json({ 
      success: false, 
      message: 'Firebase Admin SDK not initialized. Please add your service account key.' 
    });
  }

  try {
    const message = {
      notification: {
        title: title || 'New Message',
        body: body || 'You have a new message!',
      },
      data: {
        title: title || 'New Message',
        body: body || 'You have a new message!',
        screen: screen || 'home',
        timestamp: Date.now().toString(),
      },
      android: {
        priority: 'high',
        notification: {
          sound: 'default',
          channel_id: 'whatsapp_clone_channel',
          priority: 'high',
        },
      },
    };

    let result;
    if (token) {
      // Send to specific token
      result = await admin.messaging().send({
        ...message,
        token: token,
      });
      console.log('📤 Notification sent to specific token');
    } else {
      // Send to all registered tokens
      if (fcmTokens.size === 0) {
        return res.status(400).json({ 
          success: false, 
          message: 'No FCM tokens registered. Please register a token first.' 
        });
      }
      
      result = await admin.messaging().sendMulticast({
        ...message,
        tokens: Array.from(fcmTokens),
      });
      console.log(`📤 Notification sent to ${result.successCount}/${fcmTokens.size} devices`);
    }

    res.json({ 
      success: true, 
      message: 'Notification sent successfully',
      result: result
    });
  } catch (error) {
    console.error('❌ Error sending notification:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to send notification',
      error: error.message 
    });
  }
});

app.get('/tokens', (req, res) => {
  res.json({ 
    tokens: Array.from(fcmTokens),
    count: fcmTokens.size 
  });
});

app.delete('/clear-tokens', (req, res) => {
  fcmTokens.clear();
  res.json({ success: true, message: 'All tokens cleared' });
});

// Test endpoints
app.post('/test-message', async (req, res) => {
  const testMessage = {
    title: 'Test Message',
    body: 'This is a test notification from the backend!',
    screen: 'chat',
  };
  
  try {
    const result = await fetch(`http://localhost:${PORT}/send-notification`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testMessage),
    });
    
    const response = await result.json();
    res.json(response);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.post('/test-voice-call', async (req, res) => {
  const voiceCallMessage = {
    title: 'Incoming Voice Call',
    body: 'John Doe is calling you...',
    screen: 'call',
  };
  
  try {
    const result = await fetch(`http://localhost:${PORT}/send-notification`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(voiceCallMessage),
    });
    
    const response = await result.json();
    res.json(response);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.post('/test-video-call', async (req, res) => {
  const videoCallMessage = {
    title: 'Incoming Video Call',
    body: 'Jane Smith is calling you...',
    screen: 'call',
  };
  
  try {
    const result = await fetch(`http://localhost:${PORT}/send-notification`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(videoCallMessage),
    });
    
    const response = await result.json();
    res.json(response);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Backend simulation server running on http://localhost:${PORT}`);
  console.log('');
  console.log('📋 Available endpoints:');
  console.log(`  POST http://localhost:${PORT}/register-token - Register FCM token`);
  console.log(`  POST http://localhost:${PORT}/send-notification - Send notification`);
  console.log(`  GET  http://localhost:${PORT}/tokens - List registered tokens`);
  console.log(`  DELETE http://localhost:${PORT}/clear-tokens - Clear all tokens`);
  console.log(`  POST http://localhost:${PORT}/test-message - Send test message`);
  console.log(`  POST http://localhost:${PORT}/test-voice-call - Send voice call notification`);
  console.log(`  POST http://localhost:${PORT}/test-video-call - Send video call notification`);
  console.log('');
  console.log('💡 To test notifications:');
  console.log('1. Start your React Native app');
  console.log('2. Copy the FCM token from the app logs');
  console.log('3. Send a POST request to /register-token with the token');
  console.log('4. Send a POST request to /send-notification to test');
});

module.exports = app; 