import { View, Text, TouchableOpacity, FlatList, ActivityIndicator, RefreshControl } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useAuthStore } from '../../store/authStore';
import styles from '../../assets/styles/home.styles';
import { Image } from "expo-image"
import COLORS from '../../constants/color';
import { Ionicons } from '@expo/vector-icons';
import { formPublishDate } from '../../lib/utils';
import Loader from '../../components/Loader';

export default function Home() {
    const { token } = useAuthStore();
    const [books, setBooks] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    const fetchBooks = async (pageNum = 1, refresh = false) => {
        try {
            if (refresh) setIsRefreshing(true);
            else if (pageNum === 1) setIsLoading(true);


            const response = await fetch(`https://saugatmobile.onrender.com/api/books?page=${pageNum}&limit=2`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.message);

            // setBooks((prevBooks) => [...prevBooks, ...data.books])

            const uniqueBooks = refresh || pageNum === 1 ? data.books : Array.from(new Set([...books, ...data.books].map((book) => book._id))).map((id) =>
                [...books, ...data.books].find((book) => book._id === id)
            )
            setBooks(uniqueBooks);

            setHasMore(pageNum <= data.totalPages);

            setPage(pageNum)

        } catch (error) {
            console.log("Error fetchingBooks", error);
        } finally {
            if (refresh) { setIsRefreshing(false); }
            else setIsLoading(false);
        }
    }

    useEffect(() => {
        fetchBooks()
    }, []);

    const handleLoadMore = async () => {
        if (hasMore && !isLoading && !isRefreshing) {
            await fetchBooks(page + 1);
        }
    }
    const renderItem = ({ item }) => (
        <View style={styles.bookCard}>
            <View style={styles.bookHeader}>
                <View style={styles.userInfo}>
                    <Image source={{ uri: item.author.profileImage }} style={styles.avatar} />
                    <Text style={styles.username}>{item.author.username}</Text>
                </View>
            </View>

            <View style={styles.bookImageContainer}>
                <Image source={{ uri: item.image }} style={styles.bookImage} contentFit="cover" />
            </View>

            <View style={styles.bookDetails}>
                <Text style={styles.bookTitle}>{item.title}</Text>
                {/* <Text style={styles.bookGenre}>{item.genre}</Text> */}
                <View style={styles.ratingContainer}>{renderStars(item.rating)}</View>
                <Text style={styles.bookCaption}>{item.caption}</Text>
                <Text style={styles.date}> Shared on {formPublishDate(item.createdAt)}</Text>
            </View>


        </View>
    );

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

    if (isLoading) return <Loader size='large' />
    return (
        <View style={styles.container}>
            <FlatList
                data={books}
                renderItem={renderItem}
                keyExtractor={(item) => item._id}
                contentContainerStyle={styles.listContainer}
                showsVerticalScrollIndicator={false}

                refreshControl={
                    <RefreshControl
                        refreshing={isRefreshing}
                        onRefresh={() => fetchBooks(1, true)}
                        colors={[COLORS.primary]}
                        tintColor={COLORS.primary}
                    />
                }

                onEndReached={handleLoadMore}
                onEndReachedThreshold={0.1}

                ListHeaderComponent={
                    <View style={styles.header}>
                        <Text style={styles.headerTitle}>Books </Text>
                        <Text style={styles.headerSubtitle}>Discover great reads fom the community</Text>
                    </View>
                }

                ListFooterComponent={hasMore && books.length > 0 ? (
                    <ActivityIndicator style={styles.footerLoader} size="small" color={COLORS.primary} />
                ) : null}

                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Ionicons name="book-outline" size={60} color={COLORS.textSecondary} />
                        <Text style={styles.emptyText}>No Recomendation</Text>
                        <Text style={styles.emptySubtext}>Be the first to share a book! </Text>
                    </View>
                }
            />
        </View>
    )
}