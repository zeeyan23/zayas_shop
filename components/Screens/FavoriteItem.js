import { Animated, Image, StyleSheet, Text } from "react-native";
import { mainURL } from "../../utils/Urls";
import { AspectRatio, Box, Center, Container, HStack, Heading, Icon, Stack, View } from "native-base";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { Ionicons } from "@expo/vector-icons";
function FavoriteItem({favoriteItem}){

    return(
        <View style={{
            paddingHorizontal:10,
        }}
            >
            <View style={{
                flexDirection:"row", 
                justifyContent:'space-between'
                }}>
                <View style={{flexDirection:"column", justifyContent:'center'}}>
                    <Text style={[styles.textColor,styles.textHeading]}>{favoriteItem.item_name}</Text>
                    <Text style={styles.textColor}>Price: {favoriteItem.price}/Kg</Text>
                </View>
                <Image style={{width:100,height:100,resizeMode:'cover'}} borderRadius={20} source={{uri:`${mainURL}${favoriteItem.item_image}`}}/>
            </View>
            <Text style={styles.textColor}>
                {favoriteItem.item_short_description}
            </Text>
        </View>
    )
}

export default FavoriteItem;

const styles = StyleSheet.create({
    textColor:{
        color:'white'
    },
    textHeading:{
        fontSize:26
    }
})