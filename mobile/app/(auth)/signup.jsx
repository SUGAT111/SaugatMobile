import { View, Text, KeyboardAvoidingView, TextInput, TouchableOpacity, ActivityIndicator, Platform, Alert } from 'react-native'
import React from 'react'
import styles from "../../assets/styles/signup.styles.js"
import { Ionicons } from '@expo/vector-icons'
import COLORS from '../../constants/color'
import { router, useRouter } from 'expo-router'
import { useAuthStore } from '../../store/authStore.js'


export default function Signup() {

    const [username, setUsername] = React.useState("");
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [showPassword, setShowPassword] = React.useState(false);

    const { user, isLoading, register, token } = useAuthStore();

    const router = useRouter();

    const handleSignup = async () => {
        const result = await register(username, email, password);
        if (!result.success) {
            Alert.alert("Error", result.message);
        }
    }

    console.log("user", user);
    console.log("token", token);


    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}>
            <View style={styles.container}>
                <View style={styles.card}>

                    {/* header */}
                    <View style={styles.header}>
                        <Text style={styles.title}>Create Account</Text>
                        <Text style={styles.subtitle}>Please fill in the details below</Text>
                    </View>

                    <View style={styles.formContainer}>
                        {/* Username input */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Username</Text>
                            <View style={styles.inputContainer} >
                                <Ionicons
                                    name='person-outline'
                                    size={20}
                                    color={COLORS.primary}
                                    style={styles.inputIcon}
                                />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Enter your username"
                                    placeholderTextColor={COLORS.placeholderText}
                                    value={username}
                                    onChangeText={setUsername}
                                    autoCapitalize='none'
                                />
                            </View>
                        </View>

                        {/* Email input */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Email</Text>
                            <View style={styles.inputContainer} >
                                <Ionicons
                                    name='mail-outline'
                                    size={20}
                                    color={COLORS.primary}
                                    style={styles.inputIcon}
                                />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Enter your email"
                                    placeholderTextColor={COLORS.placeholderText}
                                    value={email}
                                    onChangeText={setEmail}
                                    autoCapitalize='none'
                                    keyboardType='email-address'
                                />
                            </View>
                        </View>

                        {/* Password */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Password</Text>
                            <View style={styles.inputContainer} >
                                <Ionicons
                                    name='lock-closed-outline'
                                    size={20}
                                    color={COLORS.primary}
                                    style={styles.inputIcon}
                                />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Enter your password"
                                    placeholderTextColor={COLORS.placeholderText}
                                    value={password}
                                    onChangeText={setPassword}
                                    secureTextEntry={!showPassword}
                                />
                                <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
                                    <Ionicons
                                        name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                                        size={20}
                                        color={COLORS.primary}

                                    />
                                </TouchableOpacity>
                            </View>
                        </View>


                        {/* handle signup */}
                        <TouchableOpacity onPress={handleSignup} style={styles.button} disabled={isLoading}>
                            {isLoading ?
                                <ActivityIndicator color='#fff' /> :
                                <Text style={styles.buttonText}>Sign Up</Text>}
                        </TouchableOpacity>


                        {/* footer */}

                        <View style={styles.footer}>
                            <Text style={styles.footerText}>Already have an account?</Text>
                            <TouchableOpacity onPress={() => router.back()}>
                                <Text style={styles.link}>Log In</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                </View>
            </View>
        </KeyboardAvoidingView>
    )
}