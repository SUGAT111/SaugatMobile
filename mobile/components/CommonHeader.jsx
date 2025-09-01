import { View, Text, Image } from 'react-native'
import styles from '../assets/styles/header.styles'
// import { Image } from 'expo-image'

export default function Header({ title }) {
    return (
        <View style={styles.container}>
            <Image
                source={require("../assets/images/logo.png")}
                style={styles.logo}
                resizeMode='contain' />
            {/* {title && <Text style={styles.title}>{title}</Text>} */}

        </View>
    )
}