import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
export const useAuthStore = create(set => ({
    user: null,
    token: null,
    isLoading: false,

    register: async (username, email, password) => {

        set({ isLoading: true });
        try {
            const response = await fetch('https://saugatmobile.onrender.com/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, email, password }),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Something Went wrong');

            await AsyncStorage.setItem('user', JSON.stringify(data.user));
            await AsyncStorage.setItem('token', data.token);
            set({ user: data.user, token: data.token, isLoading: false });

            return { success: true };

        } catch (error) {
            set({ isLoading: false });
            return { success: false, message: error.message };
        }

    },

    login: async (email, password) => {
        set({ isLoading: true });
        try {
            const response = await fetch("https://saugatmobile.onrender.com/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Something Went wrong');

            await AsyncStorage.setItem('user', JSON.stringify(data.user));
            await AsyncStorage.setItem("token", data.token);

            set({ user: data.user, token: data.token, isLoading: false });

            console.log("Login Successful:", data);

            return { success: true, data };

        } catch (error) {
            set({ isLoading: false });
            return { success: false, message: error.message };
        }
    },

    checkAuth: async () => {
        try {

            const userJson = await AsyncStorage.getItem('user');
            const token = await AsyncStorage.getItem('token');
            const user = userJson ? JSON.parse(userJson) : null;

            set({ user, token, isLoading: false });

        } catch (error) {
            set({ isLoading: false });
            console.log('Error checking auth:', error);
        }
    },

    logout: async () => {
        await AsyncStorage.removeItem('user');
        await AsyncStorage.removeItem('token');
        set({ user: null, token: null });
    }


}));
