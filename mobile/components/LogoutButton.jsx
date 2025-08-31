import { Alert, TouchableOpacity } from 'react-native'
import React from 'react'
import { useAuthStore } from '../store/authStore'
import { Ionicons } from "@expo/vector-icons";
import COLORS from '../constants/color';
import styles from '../assets/styles/profile.styles';

export default function LogoutButton() {

    const { logout } = useAuthStore();

    const confirmLogout = () => {
        Alert.alert("Logout", "Are you sure you want to logout?", [
            { text: "Cancle", style: "cancel" },
            { text: "Logout", onPress: () => logout(), style: "destructive" },
        ])
    }

    return (
        <TouchableOpacity style={styles.logoutButton} onPress={confirmLogout}>
            <Ionicons name='log-out-outline' size={20} color={COLORS.white} />
        </TouchableOpacity>
    )
}