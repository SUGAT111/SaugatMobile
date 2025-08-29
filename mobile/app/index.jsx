import { Link } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useAuthStore } from '../store/authStore.js'
import { useEffect } from "react";



export default function Index() {
  const { user, token, checkAuth, logout } = useAuthStore();

  console.log("User from store", user);
  console.log("Token from store", token);

  useEffect(() => {
    checkAuth()
  }, [])

  return (
    <View style={style.container}>

      <Text style={StyleSheet.title}>Hello {user?.username}</Text>
      <Text style={StyleSheet.title}> {token}</Text>


      <TouchableOpacity onPress={logout}>
        <Text>Logout</Text>
      </TouchableOpacity>

      <Link href="/(auth)/signup">Signup</Link>
      <Link href="/(auth)">Login</Link>
    </View>
  );
}


const style = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 20,
    fontWeight: "bold",
  },
});