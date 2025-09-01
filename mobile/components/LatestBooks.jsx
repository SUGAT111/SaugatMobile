import { View, Alert, Text, FlatList, RefreshControl } from 'react-native';
import { useState } from 'react';
import { useRouter } from "expo-router";
import { useAuthStore } from '../store/authStore';
import { useEffect } from 'react';
import styles from '../assets/styles/slide.styles';
import { Ionicons } from '@expo/vector-icons';
import COLORS from '../constants/color';
import { Image } from "expo-image";
import Loader from './Loader';


export default function LatestBooks() {
    const [books, setBooks] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const { token } = useAuthStore();
    const router = useRouter()


    const fetchData = async () => {
        try {
            setIsLoading(true);
            const response = await fetch(`https://saugatmobile.onrender.com/api/books/fivePostedBooks`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            const data = await response.json();

            console.log("response", response)
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
            <View style={styles.card}>
                <Image source={{ uri: item.image }} style={styles.cardImage} />
                <View style={styles.cardBody}>
                    <Text style={styles.titleText}>{item.title}</Text>
                    <View style={styles.ratingContainer}>{renderStars(item.rating)}</View>
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
        <>
            {books.length > 0 &&
                <View style={styles.container}>
                    {/* user Reomendation */}
                    <View style={styles.booksHeader}>
                        <Text style={styles.booksTitle}>New Recomendation</Text>
                        <Text style={styles.booksCount}>View All </Text>
                    </View>

                    <FlatList
                        data={books}
                        renderItem={renderBookItem}
                        keyExtractor={(item) => item._id}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.booksListHorizontal}

                    />

                </View>}
        </>
    )
}