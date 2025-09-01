import { View, Alert, Text, FlatList, TouchableOpacity, RefreshControl } from 'react-native';
import { useState } from 'react';
import { useRouter } from "expo-router";
import { useAuthStore } from '../store/authStore';
import { useEffect } from 'react';
import styles from '../assets/styles/profile.styles';
import { Ionicons } from '@expo/vector-icons';
import COLORS from '../constants/color';
import { Image } from "expo-image";
import Loader from './Loader';


export default function Recommend() {
    const [books, setBooks] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const { token } = useAuthStore();
    const router = useRouter()


    const fetchData = async () => {
        try {
            setIsLoading(true);

            const response = await fetch("https://saugatmobile.onrender.com/api/books/recommendedfivebooks", {
                headers: { Authorization: `Bearer ${token}` }
            })

            const data = await response.json();
            if (!response.ok) throw new Error(data.message || "Failed to fetch user books");
            setBooks(data.books);
        } catch (error) {
            console.error("Error fetcching data ", error);
            Alert.alert("Error", "failed to load profile data. pull down to refresh");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [])


    const renderBookItem = ({ item }) => {
        return (
            <View style={styles.bookItem}>
                <Image source={{ uri: item.image }} style={styles.bookImage} />
                <View style={styles.bookInfo}>
                    <Text style={styles.bookTitle}>{item.title}</Text>
                    <View style={styles.ratingContainer}>{renderStars(item.rating)}</View>
                    <Text style={styles.bookDate}>{new Date(item.createdAt).toLocaleString()}</Text>
                </View>
            </View>
        )
    }


    const renderStars = (rating) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <Ionicons
                    key={i}
                    name={i <= rating ? "star" : "star-outline"}
                    size={16}
                    color={i <= rating ? "#f4b400" : COLORS.textSecondary}
                    style={{ marginRight: 2 }}
                />
            );
        }
        return stars;
    };


    const handleRefresh = async () => {
        setIsRefreshing(true);
        await fetchData();
        setIsRefreshing(false);
    }

    if (isLoading && !isRefreshing) return <Loader />;

    return (
        <View style={styles.container}>
            {/* user Reomendation */}
            <View style={styles.booksHeader}>
                <Text style={styles.booksTitle}>Your Recomendation</Text>
                <Text style={styles.booksCount}>View All </Text>
            </View>

            <FlatList
                data={books}
                renderItem={renderBookItem}
                keyExtractor={(item) => item._id}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.booksListHorizontal}
                refreshControl={
                    <RefreshControl
                        refreshing={isRefreshing}
                        onRefresh={handleRefresh}
                        colors={[COLORS.primary]}
                        tintColor={COLORS.primary}
                    />
                }
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Ionicons name='book-outline' size={50} color={COLORS.textSecondary} />
                        <Text style={styles.emptyText}>No recommendation yet</Text>
                        <TouchableOpacity style={styles.addButton} onPress={() => router.push("/create")}>
                            <Text style={styles.addButtonText}>Add Your First Book</Text>
                        </TouchableOpacity>
                    </View>
                }
            />

        </View>
    )
}