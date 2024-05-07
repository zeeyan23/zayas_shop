import React, { useEffect, useState } from "react";
import { Avatar, Box, Button, HStack, Heading, Icon, Pressable, Stack, Text } from "native-base";
import { Ionicons } from "@expo/vector-icons";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { SwipeListView } from "react-native-swipe-list-view";
import axios from "axios";
import { cartData } from "../../src/Context/CartContext";
import { mainURL } from "../../utils/Urls";
import CartItem from "./CartItem";
import { useSelector } from "react-redux";


function MyCart(){
  const [mode, setMode] = useState('Basic');
  const [cartItems, setCartItems] = useState([]);
  const { user } = cartData();
  const user_id = useSelector((state) => state.user_id.value);

  useEffect(() => {
    // if(user){
      async function getAllCartItems() {
        try {
          const response = await axios.get(`${mainURL}/zayas_shop/savetocart/?user_id=${user_id}`);
          setCartItems(response.data.data);
        } catch (error) {
          console.log(error);
        }
      }
  
      getAllCartItems();
    // }
    
  }, [user]);

  function Basic() {

    const [listData, setListData] = useState(cartItems.map((item, i) => ({
      key: `${i}`,
      data: [item]
    })));

  
    const closeRow = (rowMap, rowKey) => {
      if (rowMap[rowKey]) {
        rowMap[rowKey].closeRow();
      }
    };
  
    async function deleteRow(rowMap, rowKey, data) {
      closeRow(rowMap, rowKey);
      const newData = [...listData];
      const prevIndex = listData.findIndex(item => item.key === rowKey);
      newData.splice(prevIndex, 1);
      setListData(newData);

      try {
        await axios.delete(`${mainURL}/zayas_shop/deletecartitem/${data.data[0].id}/`).then((response)=>{
            // setAllProducts(response.data);
        });

      } catch (error) {
          console.log(error)
      }

    };
  
    const onRowDidOpen = rowKey => {
      console.log('This row opened', rowKey);
    };
  
    const renderItem = ({
      item,
      index
    }) => 
      <Box style={{backgroundColor:'white'}}>
        <CartItem cartItem={item} key={index} />
      </Box>;
  
    const renderHiddenItem = (data, rowMap) => 
      <Box flexDirection={'row'} alignItems={"center"} height={"full"} paddingRight={5}>
        <Pressable
          p={4}
          borderRadius={5}
          ml="auto"
          cursor="pointer"
          bg="dark.500"
          onPress={() => closeRow(rowMap, data.item.key)}
          _pressed={{
            opacity: 0.5
          }}
        >
          <Icon as={<Ionicons name="close" />} color="white" />
        </Pressable>
        <Box style={{ width: 16 }} />
        <Pressable
          p={4}
          cursor="pointer"
          borderRadius={5}
          bg="red.500"
          onPress={() => deleteRow(rowMap, data.item.key,data.item)}
          _pressed={{
            opacity: 0.5
          }}
        >
          <Icon as={<MaterialIcons name="delete" />} color="white" />
        </Pressable>
      </Box>
  
    return <Box bg="white" safeArea flex={1}>
        {cartItems.length > 0 ? <SwipeListView data={listData} renderItem={renderItem} renderHiddenItem={renderHiddenItem} rightOpenValue={-130} previewRowKey={'0'} previewOpenValue={-40} previewOpenDelay={3000} onRowDidOpen={onRowDidOpen} /> :
          <Box flex={1} justifyContent={"center"} alignItems={"center"} backgroundColor={"contrastThreshold"}>
            <Icon as={<Ionicons name="alert-circle-outline" />} size={"6xl"} color="rose.900" />
            <Text fontSize={"2xl"} color="rose.800">No cart items found</Text>
          </Box>
        }
      </Box>;
  }

  return <>
      <Box textAlign="center" bg="white" flex={1} safeAreaTop>
        <Basic />
        <Box
          p="2"
          bg="#005db4"
          _text={{
            fontSize: 'md',
            fontWeight: 'medium',
            color: 'warmGray.50',
            letterSpacing: 'lg'
          }}
          shadow={2}
        >
          <Stack direction={{
            base: "column",
            md: "row"
          }} space={4}>
            <Button variant="subtle" background={"white"} endIcon={<Icon as={Ionicons} name="cart" size="sm" />}>
              Proceed to Buy
            </Button>
          </Stack>
        </Box>
      </Box>
    </>;
}

export default MyCart;