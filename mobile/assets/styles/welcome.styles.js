import { StyleSheet } from "react-native";
import COLORS from "../../constants/color";

const styles = StyleSheet.create({
    container: {
        backgroundColor: COLORS.white,
        paddingVertical: 16,
        paddingHorizontal: 20,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border, // subtle bottom line
    },
    greetingRow: {
        flexDirection: "row",
        alignItems: "center",
    },
    greetingText: {
        fontSize: 20,
        fontWeight: "bold",
        color: COLORS.textDark,
        marginRight: 6,
    },
    emoji: {
        fontSize: 22,
    },
    subText: {
        fontSize: 14,
        color: COLORS.textSecondary,
        marginTop: 4,
    },
    profileImage: {
        width: 80,
        height: 80,
        borderRadius: 40,
        marginRight: 16,
    },
});

export default styles;
