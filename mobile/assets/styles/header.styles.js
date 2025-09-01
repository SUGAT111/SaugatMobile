import { StyleSheet } from "react-native";
import COLORS from "../../constants/color";

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: COLORS.logoBackground,
        padding: 12,
        borderBottomWidth: 1,
        borderBottomColor: "#ddd",
    },
    logo: {
        width: 50,
        height: 30,
        marginRight: 20,
    },
    title: {
        fontSize: 18,
        fontWeight: "7000",
    },
});


export default styles;