// app/_layout.jsx
import React, { useEffect } from "react";
import { Slot, SplashScreen, useRouter, useSegments } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import SafeScreen from "../components/SafeScreen";
import { StatusBar } from "expo-status-bar";
import { useAuthStore } from "../store/authStore";
import { useFonts } from "expo-font";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const router = useRouter();
  const segments = useSegments();

  // use the store actions/selectors (selecting the whole object here is fine)
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
      // 1) run auth check (loads user/token from AsyncStorage)
      await checkAuth();

      // 2) read state *after* checkAuth finishes
      const { user, token } = useAuthStore.getState();

      // 3) only navigate after auth check is done and after first render (effects run after first render)
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // run once on mount

  // IMPORTANT: render Slot immediately so navigation system mounts


  return (
    <SafeAreaProvider>
      <SafeScreen>
        <Slot /> {/* must be rendered on first render */}
      </SafeScreen>
      <StatusBar style="dark" />
    </SafeAreaProvider>
  );
}
