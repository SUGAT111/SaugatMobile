// app/(tabs)/create.jsx  (or wherever your file is)
import React, { useState } from "react";
import {
    View,
    Text,
    KeyboardAvoidingView,
    Platform,
    TextInput,
    ScrollView,
    TouchableOpacity,
    Alert,
    ActivityIndicator,
    Image,
} from "react-native";
import { useRouter } from "expo-router";
import styles from "../../assets/styles/create.styles";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import COLORS from "../../constants/color";
import { useAuthStore } from "../../store/authStore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "../../constants/api";

export default function Create() {
    const [title, setTitle] = useState("");
    const [publishedDate, setPublishedDate] = useState(new Date()); // keep as string for input
    const [genre, setGenre] = useState("");
    const [caption, setCaption] = useState("");
    const [image, setImage] = useState(null);
    const [imageBase64, setImageBase64] = useState(null);
    const [rating, setRating] = useState(1);
    const [author, setAuthor] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const router = useRouter();
    const { token } = useAuthStore();
    // not used directly here, but OK

    const pickImage = async () => {
        try {
            if (Platform.OS !== "web") {
                const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
                if (status !== "granted") {
                    Alert.alert("Permission required", "Please grant camera roll permissions");
                    return;
                }
            }

            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: "images",
                allowsEditing: true,
                aspect: [4, 3],
                quality: 0.1,
                base64: true,
            });

            if (!result.canceled) {
                const asset = result.assets[0];
                setImage(asset.uri);

                if (asset.base64) {
                    setImageBase64(asset.base64);
                } else {
                    const base64 = await FileSystem.readAsStringAsync(asset.uri, {
                        encoding: FileSystem.EncodingType.Base64,
                    });
                    setImageBase64(base64);
                }
            }
        } catch (error) {
            console.error("Error picking image:", error);
            Alert.alert("Error", "Could not pick image");
        }
    };

    const handleSubmit = async () => {
        if (!title || !caption || !imageBase64 || !rating) {
            Alert.alert("Missing Fields", "Please fill in all fields");
            return;
        }

        setIsLoading(true);

        try {
            const uriParts = image ? image.split(".") : [];
            const fileType = uriParts.length ? uriParts[uriParts.length - 1] : "jpeg";
            const imageType = fileType ? `image/${fileType.toLowerCase()}` : "image/jpeg";

            const imageDataUrl = `data:${imageType};base64,${imageBase64}`;

            const token = await AsyncStorage.getItem("token");

            const payload = {
                title,
                // convert publishedDate string to Date on server or send ISO string:
                publishedDate: publishedDate ? new Date(publishedDate).toISOString() : new Date().toISOString(),
                genre,
                caption,
                image: imageDataUrl,
                rating: Number(rating),
                author,
            };

            const response = await fetch("https://saugatmobile.onrender.com/api/books", {
                method: "POST",
                headers: {
                    Authorization: token ? `Bearer ${token}` : "",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const text = await response.text();
                console.error("💥 Non-JSON response:", text);
                throw new Error(text || `Request failed with status ${response.status}`);
            }


            const data = await response.json();
            if (!response.ok) throw new Error(data.message || "Something Went wrong");

            Alert.alert("Success", "Book recommendation added successfully!");
            setTitle("");
            setCaption("");
            setImage(null);
            setImageBase64(null);
            setRating(1);
            setAuthor("");
            setPublishedDate("");
            router.push("/"); 
        } catch (error) {
            console.error("Error submitting form:", error);
            Alert.alert("Error", error.message || "Could not submit form");
        } finally {
            setIsLoading(false);
        }
    };

    const renderRatingPicker = () => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <TouchableOpacity key={i} onPress={() => setRating(i)} style={styles.starButton}>
                    <Ionicons name={i <= rating ? "star" : "star-outline"} size={32} color={i <= rating ? COLORS.primary : COLORS.textSecondary} />
                </TouchableOpacity>
            );
        }
        return <View style={styles.ratingContainer}>{stars}</View>;
    };

    return (
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.container}>
            <ScrollView contentContainerStyle={styles.container} style={styles.scrollViewStyle}>
                <View style={styles.card}>
                    <Text style={styles.title}>Add Book Recomendation</Text>
                    <Text style={styles.subtitle}>Share your favorite book with others!</Text>
                </View>

                <View style={styles.form}>
                    <View style={styles.formGroup}>
                        <Text style={styles.label}>Title</Text>
                        <View style={styles.inputContainer}>
                            <Ionicons name="book-outline" size={20} color={COLORS.textSecondary} style={styles.inputIcon} />
                            <TextInput value={title} onChangeText={setTitle} placeholder="Enter book title" placeholderTextColor={COLORS.placeholderText} style={styles.input} />
                        </View>
                    </View>

                    <View style={styles.formGroup}>
                        <Text style={styles.label}>Author</Text>
                        <View style={styles.inputContainer}>
                            <Ionicons name="person-circle-outline" size={20} color={COLORS.textSecondary} style={styles.inputIcon} />
                            <TextInput value={author} onChangeText={setAuthor} placeholder="Enter book author" placeholderTextColor={COLORS.placeholderText} style={styles.input} />
                        </View>
                    </View>

                    
                    <View style={styles.formGroup}>
                        <Text style={styles.label}>Genre</Text>
                        <View style={styles.inputContainer}>
                            <Ionicons name="albums-outline" size={20} color={COLORS.textSecondary} style={styles.inputIcon} />
                            <TextInput value={genre} onChangeText={setGenre} placeholder="Enter book genre" placeholderTextColor={COLORS.placeholderText} style={styles.input} multiline />
                        </View>
                    </View>

                    <View style={styles.formGroup}>
                        <Text style={styles.label}>Your Rating</Text>
                        {renderRatingPicker()}
                    </View>

                    <View style={styles.formGroup}>
                        <Text style={styles.label}>Book Cover Image</Text>
                        <TouchableOpacity onPress={pickImage} style={styles.imagePicker}>
                            {image ? (
                                <Image source={{ uri: image }} style={styles.image} />
                            ) : (
                                <View style={styles.placeholderContainer}>
                                    <Ionicons name="image-outline" size={40} color={COLORS.textSecondary} />
                                    <Text style={styles.imagePlaceholder}>Tap to select an image</Text>
                                </View>
                            )}
                        </TouchableOpacity>
                    </View>

                    <View style={styles.formGroup}>
                        <Text style={styles.label}>Caption</Text>
                        <TextInput value={caption} onChangeText={setCaption} placeholder="Enter a caption" placeholderTextColor={COLORS.placeholderTextColor} style={styles.textArea} multiline />
                    </View>

                    <TouchableOpacity onPress={handleSubmit} style={styles.button} disabled={isLoading}>
                        {isLoading ? (
                            <ActivityIndicator color={COLORS.white} />
                        ) : (
                            <View style={{ flexDirection: "row", alignItems: "center" }}>
                                <Ionicons name="cloud-upload-outline" size={20} color={COLORS.white} style={styles.buttonIcon} />
                                <Text style={styles.buttonText}>Share</Text>
                            </View>
                        )}
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}
