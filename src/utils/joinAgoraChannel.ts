import { IRtcEngine } from 'react-native-agora';
import { ChannelProfileType, ClientRoleType } from 'react-native-agora';
import { getTestToken } from '../config/agoraConfig';
import { fetchTokenFromServer } from './generateToken';

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

        // Generate token dynamically for the channel name
        showMessage('Generating token for channel: ' + channelName);

        // Try to get token from server first (if configured)
        let token = await fetchTokenFromServer(channelName, uid);

        // If no server token, try to generate using config function
        if (!token) {
            token = await getTestToken(channelName, uid);
        }

        // If still no token, show warning
        if (!token) {
            console.warn('No token generated. Token authentication may be required.');
            showMessage('⚠️ No token available. Check if token auth is enabled in Agora Console.');
            // For testing: You might need to disable token auth or set up a server
            // For now, try with empty token (may work if token auth is optional)
            token = '';
        } else {
            showMessage('✅ Token generated successfully');
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

