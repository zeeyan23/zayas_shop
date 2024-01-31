import { Pressable, StyleSheet, Text } from "react-native";

function ChipButton({children, style, onPress}){
    return(
        <Pressable style={[style, styles.button]} onPress={onPress}>
            <Text style={[style, styles.buttonText]}>{children}</Text>
        </Pressable>
    )
}

export default ChipButton;

const styles = StyleSheet.create({
    button: {
        backgroundColor:"#005db4",
        paddingTop:5,
        paddingBottom:5,
        paddingLeft:12,
        paddingRight:12,
        borderRadius:10,
    },
    
    buttonText: {
        color:'white'
    }
})