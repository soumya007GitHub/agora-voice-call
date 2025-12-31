import { Platform } from 'react-native';
import { createAgoraRtcEngine, IRtcEngine, IRtcEngineEventHandler } from 'react-native-agora';
import { getPermission } from '../helper/helper';
import { agoraConfig } from '../config/agoraConfig';

/**
 * Initialize Agora Engine for Video or Voice Calls
 */
export const initializeAgoraEngine = async (
    agoraEngineRef: React.MutableRefObject<IRtcEngine | undefined>,
    eventHandlerRef: React.MutableRefObject<IRtcEngineEventHandler | undefined>,
    showMessage: (msg: string) => void,
    isVideoCall: boolean,
    channelName: string
) => {
    try {
        if (Platform.OS === 'android') {
            await getPermission();
        }

        agoraEngineRef.current = createAgoraRtcEngine();
        const agoraEngine = agoraEngineRef.current;

        // Initialize Agora Engine first
        const initResult = agoraEngine.initialize({ appId: agoraConfig.appId });
        console.log('Agora engine initialized:', initResult);
        
        if (initResult !== 0) {
            showMessage(`Warning: Engine initialization returned code: ${initResult}`);
        }

        // Enable audio for voice calls
        agoraEngine.enableAudio();
        console.log('Audio enabled');

        // Enable video if it's a video call
        if (isVideoCall) {
            agoraEngine.enableVideo();
        }

        // Event Handlers - must be set up after initialization
        eventHandlerRef.current = {
            onJoinChannelSuccess: (connection, uid) => {
                console.log('Join channel success! UID:', uid);
                showMessage(`✅ Successfully joined ${isVideoCall ? 'video' : 'voice'} channel: ${channelName}`);
                showMessage(`Your UID: ${uid}`);
            },
            onUserJoined: (connection, uid) => {
                showMessage(`Remote user ${uid} joined`);
            },
            onUserOffline: (connection, uid) => {
                showMessage(`Remote user ${uid} left the channel`);
            },
            onError: (err, msg) => {
                console.error('Agora error:', err, msg);
                let errorMsg = `Error ${err}: ${msg}`;
                
                // Common error codes
                if (err === 110) {
                    errorMsg = `Error ${err}: Invalid App ID or Token. Check your Agora App ID configuration.`;
                } else if (err === 101) {
                    errorMsg = `Error ${err}: Invalid App ID. Please verify your App ID.`;
                } else if (err === 109) {
                    errorMsg = `Error ${err}: Token expired or invalid.`;
                }
                
                showMessage(errorMsg);
            },
            onConnectionStateChanged: (state, reason) => {
                console.log('Connection state changed:', state, reason);
                if (state === 5) { // DISCONNECTED
                    showMessage('Connection lost. Reason: ' + reason);
                } else if (state === 3) { // RECONNECTING
                    showMessage('Reconnecting...');
                } else if (state === 1) { // CONNECTING
                    showMessage('Connecting...');
                } else if (state === 2) { // CONNECTED
                    showMessage('Connected to Agora');
                }
            },
        };

        // Register Event Handlers
        agoraEngine.registerEventHandler(eventHandlerRef.current);
    } catch (e) {
        console.error('Error initializing Agora Engine:', e);
    }
};

