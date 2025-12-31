/**
 * Agora Configuration
 * 
 * IMPORTANT: For production, never commit your App Certificate to version control!
 * Store it securely on your server and generate tokens server-side.
 */

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
 * Generate a token for testing
 * 
 * For production, generate tokens on your server for security.
 * 
 * To get a temporary token for testing:
 * 1. Go to Agora Console → Your Project → Temporary Token
 * 2. Enter channel name and UID
 * 3. Copy the generated token
 * 4. Use it in the joinAgoraChannel function
 */
export const getTestToken = (channelName: string, uid: number = 0): string => {
    // For testing, you can paste a temporary token here
    // Get it from: Agora Console → Your Project → Temporary Token
    return '007eJxTYPii0hP4dK4hVy7jDt8l3FnrtP/Irjgv9UTHWupvt+g58ygFhmSjFIsUAwsDY0OjFBNLS8Mks8S0NEvjlOQ0YzPT1GTDrvMhmQ2BjAznPN4yMTJAIIjPw1CSWlyim5yRmJeXmsPAAAD18iHr';
};

