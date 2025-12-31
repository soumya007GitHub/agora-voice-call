import { IRtcEngine } from 'react-native-agora';
import { ChannelProfileType, ClientRoleType } from 'react-native-agora';
import { getTestToken } from '../config/agoraConfig';

/**
 * Join a Channel for Video or Voice Calls
 */
export const joinAgoraChannel = async (
    agoraEngineRef: React.MutableRefObject<IRtcEngine | undefined>,
    isHost: boolean,
    setJoined: (value: boolean) => void,
    showMessage: (msg: string) => void,
    isVideoCall: boolean,
    channelName: string
) => {
    try {
        // Use 0 to let Agora auto-assign UID, or use a unique number for each user
        const uid = 0;
        
        // Get token - for testing, use getTestToken() or paste a temporary token
        // For production, fetch token from your server
        let token = getTestToken(channelName, uid);
        
        // If token is empty, try to get from environment or use empty (will fail if token auth is required)
        if (!token) {
            // You can also set a temporary token directly here for testing:
            // token = 'YOUR_TEMPORARY_TOKEN_HERE';
            token = '';
        }
        
        if (!token) {
            console.warn('No token provided. If token authentication is enabled, this will fail.');
            showMessage('Warning: No token provided. Getting token from Agora Console...');
        }

        const agoraEngine = agoraEngineRef.current;

        if (!agoraEngine) {
            console.error('Agora engine not initialized');
            showMessage('Error: Agora engine not initialized');
            return;
        }

        console.log('Joining channel with:', { channelName, uid, isHost });

        const clientRoleType = isHost
            ? ClientRoleType.ClientRoleBroadcaster
            : ClientRoleType.ClientRoleAudience;

        const result = await agoraEngine.joinChannel(token, channelName, uid, {
            channelProfile: ChannelProfileType.ChannelProfileCommunication,
            clientRoleType,
            publishMicrophoneTrack: isHost,
            publishCameraTrack: isHost && isVideoCall,
            autoSubscribeAudio: true,
            autoSubscribeVideo: isVideoCall,
        });

        console.log('Join channel result:', result);

        // Ensure audio is enabled after joining
        if (!isVideoCall) {
            agoraEngine.enableAudio();
            agoraEngine.muteLocalAudioStream(false);
        }

        if (isHost && isVideoCall) {
            agoraEngine.startPreview();
        }

        // Don't set joined here - wait for onJoinChannelSuccess callback
        // The callback will handle setting the joined state
        console.log('Join channel call completed');
    } catch (e: any) {
        console.error('Error joining channel:', e);
        showMessage(`Failed to join channel: ${e?.message || e}`);
        // Show specific error if available
        if (e?.code) {
            showMessage(`Error code: ${e.code}`);
        }
    }
};

