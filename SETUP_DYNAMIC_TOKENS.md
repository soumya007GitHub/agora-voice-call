# Setup Dynamic Token Generation for Any Channel Name

## Problem
Currently, tokens are tied to a specific channel name. If you generate a token for "temp-channel", it only works for that channel. You need tokens that work for **any channel name** the user enters.

## Solution Options

### Option 1: Set Up Your Own Token Server (Recommended)

This allows you to generate tokens dynamically for any channel name.

#### Step 1: Set Up the Server

1. **Navigate to server-example folder**:
   ```bash
   cd server-example
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Update credentials** in `token-server.js`:
   - App ID is already set
   - App Certificate is already set (from your config)

4. **Start the server**:
   ```bash
   npm start
   ```
   Server will run on `http://localhost:3000`

#### Step 2: Update App Config

1. Open `src/config/agoraConfig.ts`
2. Find the `SERVER_URL` in `getTestToken` function
3. Set it to your server URL:
   ```typescript
   const SERVER_URL = 'http://YOUR_IP:3000'; // For local testing
   // Or: 'https://your-server.com' for production
   ```

#### Step 3: Deploy Server (For Production)

- Deploy to Heroku, AWS, or any Node.js hosting
- Update `SERVER_URL` to your deployed server URL
- Make sure CORS is enabled (already in the code)

#### Step 4: Test

1. Start your token server
2. Rebuild your app: `npm run build:android:apk`
3. Test with different channel names - they should all work!

---

### Option 2: Disable Token Authentication (Testing Only)

If you're just testing, you can disable token authentication in Agora Console.

#### Steps:

1. **Go to Agora Console**: https://console.agora.io/
2. **Select your project**: "Ecohomely"
3. **Go to**: Security section
4. **Disable Token Authentication** (if available)
   - Note: Some projects require tokens and can't be disabled
5. **Update code**: The code will automatically use empty tokens

⚠️ **Warning**: Only for testing! Always use tokens in production.

---

### Option 3: Use Agora's Online Token Generator (Manual)

For quick testing with different channel names:

1. Go to: https://www.agora.io/en/blog/token-generator/
2. Enter:
   - App ID: `c2d8d080312d4991b6aff93dcf365ec1`
   - App Certificate: `9f257884b0db45ab97d047fcff309a2f`
   - Channel Name: (any name you want)
   - UID: `0`
   - Role: `Publisher`
3. Generate token
4. Test with that channel name

**Limitation**: You need to generate a new token for each channel name manually.

---

## Recommended: Option 1 (Token Server)

This is the best solution because:
- ✅ Works with any channel name automatically
- ✅ Secure (tokens generated server-side)
- ✅ Production-ready
- ✅ No manual token generation needed

## Quick Start with Token Server

```bash
# Terminal 1: Start token server
cd server-example
npm install
npm start

# Terminal 2: Update app config
# Edit src/config/agoraConfig.ts
# Set SERVER_URL to: 'http://YOUR_COMPUTER_IP:3000'
# (Find your IP: ipconfig on Windows, ifconfig on Mac/Linux)

# Terminal 3: Rebuild app
npm run build:android:apk
```

## Testing

1. Start token server
2. Install app on device
3. Enter any channel name (e.g., "room-123", "call-456")
4. Share the same channel name with another user
5. Both should be able to join and talk!

## Troubleshooting

**Server not reachable from device?**
- Make sure your phone and computer are on the same WiFi
- Use your computer's local IP (not localhost)
- Check firewall settings

**Still getting error 110?**
- Verify server is running: `http://YOUR_IP:3000/api/agora-token?channelName=test&uid=0`
- Check server logs for errors
- Verify App ID and Certificate in server code

**Token expires?**
- Tokens expire in 24 hours by default
- Server generates fresh tokens each time
- No need to manually regenerate!

