import { StyleSheet } from 'react-native';
import COLORS from '../../constants/color';

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 16,
        paddingVertical: 10,
        flex: 1,
        backgroundColor: COLORS.white,
        padding: 16,
        paddingBottom: 10,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.textPrimary,
    },
    viewAll: {
        fontSize: 14,
        color: COLORS.primary,
    },
    cardList: {
        paddingBottom: 10,
    },
    card: {
        width: 220,
        height: 220,
        marginRight: 12,
        borderRadius: 10,
        backgroundColor: '#fff',
        overflow: 'hidden',
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    cardImage: {
        width: '100%',
        height: 120,
    },
    cardBody: {
        padding: 10,
    },
    categoryText: {
        fontSize: 12,
        color: COLORS.textSecondary,
        marginBottom: 2,
    },
    titleText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: COLORS.textPrimary,
        marginBottom: 5,
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    ratingText: {
        marginLeft: 4,
        fontSize: 12,
        color: COLORS.textSecondary,
    },
    enrollButton: {
        backgroundColor: COLORS.primary,
        paddingVertical: 6,
        borderRadius: 6,
        alignItems: 'center',
    },
    enrollText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
    },
    booksHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 16,
    },
    booksTitle: {
        fontSize: 18,
        fontWeight: "700",
        color: COLORS.textPrimary,
    },
    booksCount: {
        fontSize: 14,
        color: COLORS.textSecondary,
    },
});

export default styles;
