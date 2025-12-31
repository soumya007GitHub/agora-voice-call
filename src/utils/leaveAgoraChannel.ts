import { IRtcEngine } from 'react-native-agora';

/**
 * Leave a Channel
 */
export const leaveAgoraChannel = (
    agoraEngineRef: React.MutableRefObject<IRtcEngine | undefined>,
    setJoined: (value: boolean) => void,
    showMessage: (msg: string) => void
) => {
    try {
        const agoraEngine = agoraEngineRef.current;

        if (!agoraEngine) {
            console.error('Agora engine not initialized');
            return;
        }

        agoraEngine.leaveChannel();
        setJoined(false);
        showMessage('Left the channel');
    } catch (e) {
        console.error('Error leaving channel:', e);
    }
};

