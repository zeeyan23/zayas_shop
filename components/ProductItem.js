import { Actionsheet, Box, Center, Divider, Heading, IconButton, ScrollView, Stack, VStack, useDisclose } from "native-base";
import { useState } from "react";
import { Button, Image, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { mainURL } from "../utils/Urls";
import axios from "axios";
import { useToast } from 'native-base';
import { useDispatch } from "react-redux";
import { updateCount } from '../src/redux/reducers/reducer';
import { cartData } from "../src/Context/CartContext";
import { favData  } from "../src/Context/FavoritesContext";
import { useSelector } from 'react-redux';
0

function ProductItem({product}){

    const [quantity, setQuantity]=useState(0);
    const [selectedItem, setSelectedItem] = useState(null);
    const [favorited,setFavorited]=useState(false);
    const toast = useToast();
    const dispatch = useDispatch();
    const { updateUser } = cartData();
    const { updateFav } = favData();
    const user_id = useSelector((state) => state.user_id.value);

    const {
        isOpen,
        onOpen,
        onClose
      } = useDisclose();

    const handleInc = () => {
        setQuantity(quantity + 1);
      };
    
    const handleDecr = () => {
        if (quantity > 0) {
          setQuantity(quantity - 1);
        }
    };

    const openActionSheet = (item) => {
        setSelectedItem(item);
        onOpen();
    };

    async function addToCart(product_id){
        const formData={
            product_id: product_id,
            quantity : quantity
        }

        try {
            const response = await axios.post(`${mainURL}/zayas_shop/savetocart/`, formData)
            onClose();
            toast.show({
                description: "Successfully Added To The Cart!"
            });
            const newCount = response.data.total_count;
            updateUser(response.data.data)
            dispatch(updateCount(newCount));
        } catch (error) {
            console.log(error)
        }
    }

    async function favoritePressHandler(product_id){
        const formData={
            product_id: product_id,
            user_id: user_id
        }

        try {
            const response = await axios.post(`${mainURL}/zayas_shop/savetofavorite/`, formData)
            onClose();
            toast.show({
                description: "Successfully Added To The Favorites!"
            });
            setFavorited(true);
            updateFav(response.data.data);
        } catch (error) {
            console.log(error)
        }
    }

    return(
        <>
            <Pressable style={{marginHorizontal:20,width:150}} onPress={() => openActionSheet(product)}>
                <Image style={{width:150,height:150,resizeMode:'cover'}} borderRadius={20} source={{uri:`${mainURL}${product?.item_image}`}}/>
                <View style={{flexDirection:"row" ,justifyContent:'space-around',marginVertical:10}}>
                    <Text>{product.item_name}</Text>
                    <Text>{product.price}/Kg</Text>
                </View>
                <IconButton 
                    size="xxl"
                    borderRadius={"full"}
                    padding={"1.5"}
                    position='absolute'
                    right={0}
                    backgroundColor={"white"}
                    variant={"outline"}
                    colorScheme={"darkBlue"}
                    _icon={{
                        as: MaterialIcons,
                        name:  favorited ? 'favorite' : (product.is_favorited ? 'favorite' : 'favorite-border')
                    }} 
                    onPress={()=>favoritePressHandler(product.id)}
                />
            </Pressable>

            <Actionsheet isOpen={isOpen} onClose={onClose}> 
                <Actionsheet.Content>
                    <Image style={{width:150,height:150,resizeMode:'cover'}} borderRadius={10} source={{uri:`${mainURL}${selectedItem?.item_image}`}}/> 
                    <Actionsheet.Item containerStyle={{ backgroundColor: 'transparent' }} style={{justifyContent:'center',alignItems:'center'}}>{selectedItem && `${selectedItem.item_name} - ${selectedItem.price}/Kg`}</Actionsheet.Item>
                    <Actionsheet.Item style={{alignItems:'center'}}>
                        <View style={{flexDirection:"row"}}>
                            <IconButton 
                                size="sm" 
                                pl={10}
                                pr={10}
                                variant="solid" 
                                _icon={{
                                    as: MaterialIcons,
                                    name: "remove"
                                }} 
                                onPress={handleDecr}
                            />
                            <TextInput placeholder="0" editable={false} value={quantity.toString()} textAlign="center"/>
                            <IconButton 
                                size="xs" 
                                pl={10}
                                pr={10}
                                variant="solid" 
                                _icon={{
                                    as: MaterialIcons,
                                    name: "add"
                                }} 
                                onPress={handleInc}
                            />

                            <IconButton 
                                size="xxl"
                                borderRadius={"full"}
                                padding={"1.5"}
                                left={10}
                                variant={"outline"}
                                colorScheme={"darkBlue"}
                                _icon={{
                                    as: MaterialIcons,
                                    name: "add-shopping-cart"
                                }} 
                                onPress={()=>addToCart(selectedItem.id)}
                                style={{marginLeft:'auto'}}
                            />
                        </View>
                    </Actionsheet.Item>
                    <Actionsheet.Item>{selectedItem && selectedItem.item_short_description}</Actionsheet.Item>
                    <Actionsheet.Item>{selectedItem && selectedItem.item_long_description}</Actionsheet.Item>
                </Actionsheet.Content>
            </Actionsheet>
        </>
    )
}

const styles = StyleSheet.create({
    Pcontainer: {
      flex: 1,
      padding: 20,
    },
  });

export default ProductItem;