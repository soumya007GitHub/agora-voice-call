/**
 * Simple Agora Token Server
 * 
 * This is a basic Express server that generates Agora tokens dynamically
 * for any channel name.
 * 
 * Setup:
 * 1. Install: npm install express agora-access-token
 * 2. Update appId and appCertificate below
 * 3. Run: node token-server.js
 * 4. Server will run on http://localhost:3000
 * 
 * Usage:
 * GET /api/agora-token?channelName=test-channel&uid=0
 */

const express = require('express');
const { RtcTokenBuilder, RtcRole } = require('agora-access-token');

const app = express();
const PORT = 3000;

// Your Agora credentials (get from Agora Console)
const APP_ID = 'c2d8d080312d4991b6aff93dcf365ec1';
const APP_CERTIFICATE = '9f257884b0db45ab97d047fcff309a2f';

// Enable CORS for your React Native app
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

// Token generation endpoint
app.get('/api/agora-token', (req, res) => {
    const channelName = req.query.channelName;
    const uid = req.query.uid || 0;
    
    if (!channelName) {
        return res.status(400).json({ error: 'channelName is required' });
    }
    
    // Token expiration time (24 hours)
    const expirationTimeInSeconds = 3600 * 24;
    const currentTimestamp = Math.floor(Date.now() / 1000);
    const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds;
    
    // Generate token
    const token = RtcTokenBuilder.buildTokenWithUid(
        APP_ID,
        APP_CERTIFICATE,
        channelName,
        parseInt(uid),
        RtcRole.PUBLISHER, // Both users can publish (speak)
        privilegeExpiredTs
    );
    
    console.log(`Generated token for channel: ${channelName}, uid: ${uid}`);
    
    res.json({
        token,
        channelName,
        uid: parseInt(uid),
        expiresIn: expirationTimeInSeconds
    });
});

app.listen(PORT, () => {
    console.log(`Agora Token Server running on http://localhost:${PORT}`);
    console.log(`Test: http://localhost:${PORT}/api/agora-token?channelName=test&uid=0`);
});

