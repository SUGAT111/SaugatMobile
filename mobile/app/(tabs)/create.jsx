import { View, Text, KeyboardAvoidingView, Platform, TextInput, ScrollView, TouchableOpacity } from 'react-native'
import React from 'react'
import { useState } from "react";
import { useRouter } from 'expo-router';
import styles from "../../assets/styles/create.styles";
import { Ionicons } from '@expo/vector-icons';


export default function Create() {
    const [title, setTitle] = useState("");                 // String
    const [publishedDate, setPublishedDate] = useState(""); // Date (string for now)
    const [genre, setGenre] = useState("");                 // String
    const [caption, setCaption] = useState("");             // String
    const [image, setImage] = useState(null);
    const [imageBase64, setImageBase64] = useState(null);      // String (Base64)
    const [rating, setRating] = useState(1);                // Number (default within 1–5)
    const [author, setAuthor] = useState("");               // ObjectId (as string)
    const [isLoading, setIsLoading] = useState(false);      // Boolean

    const router = useRouter();

    const pickImage = async () => {
        // Logic to pick an image
    };

    const handleSubmit = async () => {
        setIsLoading(true);
        try {
            // Logic to handle form submission
        } catch (error) {
            console.error("Error submitting form:", error);
        } finally {
            setIsLoading(false);
        }
    }


    const renderRatingPicker = () => {
        const stars = [];

        for (let i = 1; i <= 5; i++) {
            stars.push(
                <TouchableOpacity key={i} onPress={() => setRating(i)} style={styles.starButton}>
                    <Ionicons
                        name={i <= rating ? "star" : "star-outline"}
                        size={32}
                        color={i <= rating ? COLORS.primary : COLORS.textSecondary}
                    />
                </TouchableOpacity>
            );
        }
        return <View style={styles.ratingContainer}>{stars}</View>;
    }
    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.container}
        >
            <ScrollView contentContainerStyle={styles.container} style={styles.scrollViewStyle}>
                <View style={styles.card}>
                    <Text style={styles.title}>Add Book Recommendation</Text>
                    <Text style={styles.subtitle}>Share your favorite book with others!</Text>
                </View>


                <View style={styles.form}>
                    <View style={styles.formGroup}>
                        <Text style={styles.label}>Title</Text>
                        <View style={styles.inputContainer}>
                            <Ionicons
                                name="book-outline"
                                size={20}
                                color={COLORS.textSecondary}
                                style={styles.inputIcon}
                            />
                            <TextInput
                                style={styles.input}
                                value={title}
                                onChangeText={setTitle}
                                placeholder="Enter book title"
                                placeholderTextColor={COLORS.placeholderTextColor}
                            />
                        </View>
                    </View>

                    {/* rating */}
                    <View style={styles.formGroup}>
                        <Text style={styles.label}>Your Rating</Text>
                        {renderRatingPicker()}
                    </View>

                </View>


            </ScrollView>
        </KeyboardAvoidingView>
    )
}