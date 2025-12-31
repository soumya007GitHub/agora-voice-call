/**
 * Agora Configuration
 * 
 * IMPORTANT: For production, never commit your App Certificate to version control!
 * Store it securely on your server and generate tokens server-side.
 */

import { fetchTokenFromServer } from '../utils/generateToken';

export const agoraConfig = {
    // Your Agora App ID
    appId: 'c2d8d080312d4991b6aff93dcf365ec1',

    // Your Agora App Certificate (needed for token generation)
    // Get this from: Agora Console → Your Project → App Certificate
    appCertificate: '9f257884b0db45ab97d047fcff309a2f',

    // Token expiration time in seconds (24 hours = 86400)
    tokenExpirationTime: 86400,
};

/**
 * Generate a token dynamically for any channel name
 * 
 * SETUP OPTIONS:
 * 
 * Option 1 (Recommended): Use your own server
 * - Set SERVER_URL below to your server endpoint
 * - See server-example/ folder for a simple Node.js server
 * 
 * Option 2: Disable token authentication in Agora Console
 * - Go to Agora Console → Your Project → Security
 * - Disable token authentication (for testing only)
 * - Then this function can return empty string
 */
export const getTestToken = async (channelName: string, uid: number = 0): Promise<string> => {
    // ============================================
    // OPTION 1: Use your own token server (RECOMMENDED)
    // ============================================
    // Uncomment and set your server URL:
    const SERVER_URL = 'http://192.168.69.22:3000'; // Change to your server URL
    // For production, use: 'https://your-server.com'

    try {
        const serverToken = await fetchTokenFromServer(channelName, uid, SERVER_URL);
        if (serverToken) {
            console.log('Token fetched from server successfully');
            return serverToken;
        }
    } catch (error) {
        console.warn('Server token fetch failed:', error);
        // Continue to try other options
    }

    // ============================================
    // OPTION 2: Return empty (if token auth is disabled)
    // ============================================
    // If you disabled token authentication in Agora Console,
    // you can return empty string here
    console.warn('No server configured. Using empty token. Make sure token auth is disabled in Agora Console for testing.');
    return '';
};

/**
 * Generate token using Agora's REST API
 * Note: This requires your App Certificate to be kept secure
 * For production, always generate tokens on your server
 */
const generateTokenViaAgoraAPI = async (
    channelName: string,
    uid: number
): Promise<string> => {
    // Agora doesn't provide a direct REST API for token generation
    // You need to use their token generator library on a server
    // Or use their online tool: https://www.agora.io/en/blog/token-generator/

    // For now, return empty and recommend server-side generation
    return '';
};

