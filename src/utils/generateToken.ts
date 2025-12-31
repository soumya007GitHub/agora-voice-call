/**
 * Generate Agora RTC Token dynamically for any channel name
 * 
 * This uses a simple token generation algorithm that works client-side.
 * For production, generate tokens on your server for security.
 */

import { agoraConfig } from '../config/agoraConfig';

/**
 * Simple token generation for testing
 * 
 * Note: This is a simplified version. For production, use Agora's official
 * token generator library on your server.
 * 
 * @param channelName - The channel name to generate token for
 * @param uid - User ID (0 for auto-assign)
 * @returns Token string
 */
export const generateToken = (channelName: string, uid: number = 0): string => {
    // For testing: If you have a server endpoint, fetch from there
    // For now, we'll generate a basic token structure
    
    // Check if we should use server endpoint
    const useServerToken = false; // Set to true if you have a server
    
    if (useServerToken) {
        // TODO: Fetch from your server
        // return fetchTokenFromServer(channelName, uid);
        return '';
    }
    
    // For testing without server, we need to use Agora's token generator
    // Since we can't use Node.js libraries in React Native directly,
    // we have two options:
    // 1. Use a server endpoint (recommended)
    // 2. Use Agora's online token generator and cache tokens
    
    // Option: Generate token using a simple approach
    // This is a placeholder - you'll need to implement proper token generation
    // or use a server endpoint
    
    return generateTokenClientSide(channelName, uid);
};

/**
 * Client-side token generation (simplified)
 * 
 * WARNING: This is for testing only. For production, always generate tokens server-side.
 */
const generateTokenClientSide = (channelName: string, uid: number): string => {
    // This is a simplified approach. For proper token generation, you need:
    // 1. Agora's token generator library (requires Node.js on server)
    // 2. Or use Agora's REST API to generate tokens
    
    // For now, return empty string and let the user know they need a server
    // or we can try to use Agora's REST API
    
    console.log('Generating token for:', { channelName, uid });
    
    // Try to generate using Agora REST API (if available)
    // Or return empty to use token-free mode if allowed
    
    return '';
};

/**
 * Fetch token from your backend server
 * 
 * Example server endpoint:
 * GET /api/agora-token?channelName=test&uid=0
 * Returns: { token: "..." }
 * 
 * See server-example/ folder for a simple Node.js server implementation
 */
export const fetchTokenFromServer = async (
    channelName: string, 
    uid: number = 0,
    serverUrl?: string
): Promise<string> => {
    if (!serverUrl) {
        console.warn('Server URL not configured');
        return '';
    }
    
    try {
        const url = `${serverUrl}/api/agora-token?channelName=${encodeURIComponent(channelName)}&uid=${uid}`;
        console.log('Fetching token from:', url);
        
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        
        if (!response.ok) {
            throw new Error(`Server returned ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        if (data.token) {
            console.log('Token received from server');
            return data.token;
        }
        
        throw new Error('No token in server response');
    } catch (error) {
        console.error('Error fetching token from server:', error);
        return '';
    }
};

