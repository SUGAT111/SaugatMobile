import React, { useEffect } from "react";
import { Slot, SplashScreen, useRouter, useSegments } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import SafeScreen from "../components/SafeScreen";
import { StatusBar } from "expo-status-bar";
import { useAuthStore } from "../store/authStore";
import { useFonts } from "expo-font";
import Header from "../components/CommonHeader"


SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const router = useRouter();
  const segments = useSegments();

  const checkAuth = useAuthStore((s) => s.checkAuth);

  const [fontsLoaded] = useFonts({
    "JetBrainsMono-Medium": require("../assets/fonts/JetBrainsMono-Medium.ttf")
  })

  useEffect(() => {
    if (fontsLoaded) SplashScreen.hideAsync();
  }, [fontsLoaded])

  useEffect(() => {
    let mounted = true;

    (async () => {
      await checkAuth();

      const { user, token } = useAuthStore.getState();

      if (!mounted) return;

      const isAuthScreen = segments[0] === "(auth)";
      const isSignedIn = !!user && !!token;

      if (!isSignedIn && !isAuthScreen) {
        router.replace("/(auth)");
      } else if (isSignedIn && isAuthScreen) {
        router.replace("/(tabs)");
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <SafeAreaProvider>
      <SafeScreen>
        <Header title="Saugat App" />
        <Slot />
      </SafeScreen>
      <StatusBar style="dark" />
    </SafeAreaProvider>
  );
}
