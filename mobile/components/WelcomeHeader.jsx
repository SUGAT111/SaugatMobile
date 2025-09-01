import { View, Text } from 'react-native';
import { useAuthStore } from '../store/authStore';
import styles from '../assets/styles/welcome.styles';
import { Image } from "expo-image";
import { formatMemberSince } from '../lib/utils';

export default function WelcomeHeader() {

    const { user } = useAuthStore();

    if (!user) return null;
    return (
        <View style={styles.container}>
            <View style={styles.greetingRow}>
                <Text style={styles.greetingText}>Hello {user.username}</Text>
                <Text style={styles.emoji}>👋</Text>
            </View>
            <Text style={styles.subText}>Let's Discover great reads fom the community today!</Text>
        </View>
    )
}