import { Animated, Image, Text } from "react-native";
import { mainURL } from "../../utils/Urls";
import { View } from "native-base";

function CartItem({cartItem}){

    const total_cost=cartItem.data[0].product_id.price*cartItem.data[0].quantity;
    return(
        <View style={{
            flexDirection:"row", 
            justifyContent:'space-between',
            paddingHorizontal:20,
            paddingVertical:20,
            marginHorizontal:20,
            marginVertical:20,
            borderColor:'#005db4',
            borderWidth:2,
            borderRadius:10,
            }}>
            <View style={{flexDirection:"column" ,justifyContent:'space-around',marginVertical:10}}>
                <Text>{cartItem.data[0].product_id.item_name}</Text>
                <Text>Price: {cartItem.data[0].product_id.price}/Kg</Text>
            </View>
            <View style={{flexDirection:"column" ,justifyContent:'space-around',marginVertical:10}}>
                <Text>Quantity: {cartItem.data[0].quantity}</Text>
                <Text>Total Price: {total_cost}</Text>
            </View>
            <Image style={{width:100,height:100,resizeMode:'cover'}} borderRadius={20} source={{uri:`${mainURL}${cartItem.data[0].product_id.item_image}`}}/>
        </View>
    )
}

export default CartItem;