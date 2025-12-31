import React, { useEffect, useRef, useState } from 'react';
import { SafeAreaView, ScrollView, Text, View, TouchableOpacity, StyleSheet, TextInput, Alert } from 'react-native';
import { IRtcEngine, IRtcEngineEventHandler } from 'react-native-agora';
import { initializeAgoraEngine } from '../../utils/initializeAgoraEngine';
import { joinAgoraChannel } from '../../utils/joinAgoraChannel';
import { leaveAgoraChannel } from '../../utils/leaveAgoraChannel';

const DEFAULT_CHANNEL_NAME = 'test-channel';

export default function VoiceCall() {
    const [isJoined, setIsJoined] = useState(false);
    const [remoteUid, setRemoteUid] = useState<number | null>(null);
    const [message, setMessage] = useState('');
    const [channelName, setChannelName] = useState(DEFAULT_CHANNEL_NAME);
    const [localUid, setLocalUid] = useState<number | null>(null);

    const agoraEngineRef = useRef<IRtcEngine | undefined>(undefined);
    const eventHandlerRef = useRef<IRtcEngineEventHandler | undefined>(undefined);

    const showMessage = (msg: string) => {
        setMessage((prev) => prev + '\n' + msg);
    };

    useEffect(() => {
        // Initialize Agora Engine on mount
        const initEngine = async () => {
            // Create custom event handler that also updates remoteUid state
            const customShowMessage = (msg: string) => {
                showMessage(msg);
            };

            await initializeAgoraEngine(
                agoraEngineRef,
                eventHandlerRef,
                customShowMessage,
                false, // isVideoCall = false for voice call
                channelName
            );

            // Update event handler to track remote users and local UID
            // This must be done AFTER initializeAgoraEngine sets up the handlers
            if (eventHandlerRef.current && agoraEngineRef.current) {
                const originalOnJoinChannelSuccess = eventHandlerRef.current.onJoinChannelSuccess;
                eventHandlerRef.current.onJoinChannelSuccess = (connection, uid) => {
                    console.log('onJoinChannelSuccess called with UID:', uid);
                    setLocalUid(uid);
                    setIsJoined(true); // Set joined state when successfully joined
                    if (originalOnJoinChannelSuccess) {
                        originalOnJoinChannelSuccess(connection, uid);
                    }
                };

                const originalOnUserJoined = eventHandlerRef.current.onUserJoined;
                eventHandlerRef.current.onUserJoined = (connection, uid) => {
                    console.log('Remote user joined:', uid);
                    setRemoteUid(uid);
                    showMessage(`🎉 Remote user ${uid} joined! You can now talk to each other.`);
                    if (originalOnUserJoined) {
                        originalOnUserJoined(connection, uid);
                    }
                };

                const originalOnUserOffline = eventHandlerRef.current.onUserOffline;
                eventHandlerRef.current.onUserOffline = (connection, uid) => {
                    console.log('Remote user offline:', uid);
                    setRemoteUid((prevUid) => (prevUid === uid ? null : prevUid));
                    if (originalOnUserOffline) {
                        originalOnUserOffline(connection, uid);
                    }
                };

                // Re-register the updated event handler
                agoraEngineRef.current.registerEventHandler(eventHandlerRef.current);
            }
        };

        initEngine();

        // Cleanup on unmount
        return () => {
            if (agoraEngineRef.current) {
                try {
                    agoraEngineRef.current.leaveChannel();
                    agoraEngineRef.current.release();
                } catch (e) {
                    console.error('Error cleaning up:', e);
                }
            }
        };
    }, []);

    const handleJoin = async () => {
        if (!channelName.trim()) {
            Alert.alert('Error', 'Please enter a channel name');
            return;
        }
        
        console.log('Joining channel:', channelName);
        showMessage(`Attempting to join channel: ${channelName}`);
        
        try {
            // Re-initialize with new channel name if changed
            if (channelName !== DEFAULT_CHANNEL_NAME && !agoraEngineRef.current) {
                await initializeAgoraEngine(
                    agoraEngineRef,
                    eventHandlerRef,
                    showMessage,
                    false,
                    channelName
                );
            }
            
            await joinAgoraChannel(
                agoraEngineRef,
                true, // isHost - both users join as hosts so they can speak
                setIsJoined,
                showMessage,
                false, // isVideoCall
                channelName
            );
            
            console.log('Channel join initiated');
        } catch (error) {
            console.error('Error joining channel:', error);
            showMessage(`Error joining channel: ${error}`);
            Alert.alert('Error', `Failed to join channel: ${error}`);
        }
    };

    const handleLeave = () => {
        leaveAgoraChannel(agoraEngineRef, setIsJoined, showMessage);
    };

    return (
        <SafeAreaView style={styles.main}>
            <Text style={styles.head}>Agora Voice Calling</Text>

            {/* Channel Name Input */}
            {!isJoined && (
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Channel Name:</Text>
                    <TextInput
                        style={styles.input}
                        value={channelName}
                        onChangeText={setChannelName}
                        placeholder="Enter channel name"
                        placeholderTextColor="#999"
                        editable={!isJoined}
                    />
                    <Text style={styles.hint}>
                        💡 Both users must join the same channel name to connect
                    </Text>
                </View>
            )}

            {/* Channel Info when joined */}
            {isJoined && (
                <View style={styles.channelInfo}>
                    <Text style={styles.channelName}>Channel: {channelName}</Text>
                    {localUid !== null && (
                        <Text style={styles.uidText}>Your UID: {localUid}</Text>
                    )}
                </View>
            )}

            {/* Join/Leave Buttons */}
            <View style={styles.btnContainer}>
                <TouchableOpacity 
                    onPress={handleJoin} 
                    style={[styles.button, isJoined && styles.buttonDisabled]} 
                    disabled={isJoined}
                >
                    <Text style={styles.buttonText}>Join Channel</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    onPress={handleLeave} 
                    style={[styles.button, !isJoined && styles.buttonDisabled]} 
                    disabled={!isJoined}
                >
                    <Text style={styles.buttonText}>Leave Channel</Text>
                </TouchableOpacity>
            </View>

            {/* Connection Status */}
            <View style={styles.statusContainer}>
                {isJoined ? (
                    <View>
                        <Text style={styles.statusText}>
                            {remoteUid 
                                ? `✅ Connected! Remote user UID: ${remoteUid}` 
                                : '⏳ Waiting for another user to join...'}
                        </Text>
                        <Text style={styles.statusHint}>
                            {remoteUid 
                                ? 'You can now talk to each other!' 
                                : 'Share the channel name "' + channelName + '" with another user'}
                        </Text>
                    </View>
                ) : (
                    <Text style={styles.statusText}>Not connected</Text>
                )}
            </View>

            {/* Messages Log */}
            <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContainer}>
                <Text style={styles.logTitle}>Activity Log:</Text>
                <Text style={styles.messageText}>{message || 'No activity yet'}</Text>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    main: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        padding: 20,
    },
    head: {
        fontSize: 24,
        fontWeight: 'bold',
        marginTop: 20,
        marginBottom: 20,
        color: '#333',
        textAlign: 'center',
    },
    inputContainer: {
        width: '100%',
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 8,
    },
    input: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        marginBottom: 8,
    },
    hint: {
        fontSize: 12,
        color: '#666',
        fontStyle: 'italic',
    },
    channelInfo: {
        backgroundColor: '#e3f2fd',
        padding: 15,
        borderRadius: 8,
        marginBottom: 20,
        alignItems: 'center',
    },
    channelName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#0d47a1',
        marginBottom: 5,
    },
    uidText: {
        fontSize: 14,
        color: '#666',
    },
    btnContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 20,
    },
    button: {
        paddingHorizontal: 25,
        paddingVertical: 12,
        marginHorizontal: 5,
        backgroundColor: '#0055cc',
        borderRadius: 8,
        minWidth: 120,
        alignItems: 'center',
    },
    buttonDisabled: {
        backgroundColor: '#ccc',
        opacity: 0.6,
    },
    buttonText: {
        fontWeight: 'bold',
        color: '#ffffff',
        fontSize: 16,
    },
    statusContainer: {
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 8,
        marginBottom: 15,
        alignItems: 'center',
    },
    statusText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        textAlign: 'center',
        marginBottom: 5,
    },
    statusHint: {
        fontSize: 12,
        color: '#666',
        textAlign: 'center',
        fontStyle: 'italic',
    },
    scroll: {
        flex: 1,
        backgroundColor: '#ddeeff',
        width: '100%',
        borderRadius: 8,
    },
    scrollContainer: {
        padding: 15,
    },
    logTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
    },
    messageText: {
        fontSize: 12,
        color: '#666',
        textAlign: 'left',
        lineHeight: 18,
    },
});

