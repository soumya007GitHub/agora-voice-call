import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/Route';

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

export default function HomeScreen() {
    const navigation = useNavigation<HomeScreenNavigationProp>();

    return (
        <View style={styles.container}>
            {/* Title Section */}
            <Text style={styles.title}>Welcome to Agora Call App</Text>
            <Text style={styles.subtitle}>
                Experience seamless communication with Agora's Video and Voice call features.
            </Text>

            {/* Buttons Section */}
            <TouchableOpacity
                style={[styles.button, styles.voiceButton]}
                onPress={() => navigation.navigate('VoiceCall')}
            >
                <Text style={styles.buttonText}>Start Voice Call</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#e3f2fd',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#0d47a1',
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 16,
        color: '#37474f',
        textAlign: 'center',
        marginBottom: 30,
    },
    button: {
        backgroundColor: '#1e88e5',
        padding: 15,
        borderRadius: 10,
        marginBottom: 15,
        width: '80%',
        alignItems: 'center',
    },
    voiceButton: {
        backgroundColor: '#8e24aa',
    },
    buttonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#ffffff',
    },
});

