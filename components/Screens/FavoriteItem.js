import { Animated, Image, Text } from "react-native";
import { mainURL } from "../../utils/Urls";
import { AspectRatio, Box, Center, Container, HStack, Heading, Icon, Stack, View } from "native-base";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { Ionicons } from "@expo/vector-icons";
function FavoriteItem({favoriteItem}){

    return(
        <View style={{
            flexDirection:"column", 
            paddingVertical:20,
            marginVertical:20,
            paddingHorizontal:20,
            borderColor:'#005db4',
            borderWidth:2,
            borderRadius:10,}}>
            <View style={{
                flexDirection:"row", 
                justifyContent:'space-between' 
                }}>
                <View style={{flexDirection:"column" ,justifyContent:'space-around'}}>
                    <Text>{favoriteItem.item_name}</Text>
                    <Text>Price: {favoriteItem.price}/Kg</Text>
                </View>
                <Image style={{width:100,height:100,resizeMode:'cover'}} borderRadius={20} source={{uri:`${mainURL}${favoriteItem.item_image}`}}/>
            </View>
            <Text>
                {favoriteItem.item_short_description}
            </Text>
        </View>
    )
}

export default FavoriteItem;