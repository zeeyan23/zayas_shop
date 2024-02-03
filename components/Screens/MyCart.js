import React, { useEffect, useState } from "react";
import { Box, Button, Icon, Pressable, Stack } from "native-base";
import { Ionicons } from "@expo/vector-icons";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { SwipeListView } from "react-native-swipe-list-view";
import axios from "axios";
import { cartData } from "../../src/Context/CartContext";
import { mainURL } from "../../utils/Urls";
import CartItem from "./CartItem";

function MyCart() {
  const [cartItems, setCartItems] = useState([]);
  const { user } = cartData();
  const [mode, setMode] = useState('Basic');

  useEffect(() => {
    // if(user){
      async function getAllCartItems() {
        try {
          const response = await axios.get(`${mainURL}/zayas_shop/savetocart/`);
          setCartItems(response.data.data);
          console.log(response.data.data)
        } catch (error) {
          console.log(error);
        }
      }
  
      getAllCartItems();
    // }
    
  }, [user]);

  const closeRow = (rowMap, rowKey) => {
    if (rowMap[rowKey]) {
      rowMap[rowKey].closeRow();
    }
  };

  const deleteRow = (rowMap, rowKey) => {
    closeRow(rowMap, rowKey);
    const newData = [...cartItems];
    const prevIndex = cartItems.findIndex(item => item.key === rowKey);
    newData.splice(prevIndex, 1);
    setCartItems(newData);
  };

  const onRowDidOpen = rowKey => {
    console.log('This row opened', rowKey);
  };

  const renderItem = ({ item, index }) => (
    <Box style={{backgroundColor:'white'}}>
      <CartItem cartItem={item} key={index} />
    </Box>
  );

  const renderHiddenItem = (data, rowMap) => (
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
        onPress={() => deleteRow(rowMap, data.item.key)}
        _pressed={{
          opacity: 0.5
        }}
      >
        <Icon as={<MaterialIcons name="delete" />} color="white" />
      </Pressable>
    </Box>
  );

  return (
    <>
      <Box bg="white" safeArea flex={1}>
        <SwipeListView
          data={cartItems.reverse()}
          renderItem={renderItem}
          renderHiddenItem={renderHiddenItem}
          rightOpenValue={-130}
          previewRowKey={'1'}
          previewOpenValue={-40}
          previewOpenDelay={3000}
          onRowDidOpen={onRowDidOpen}
        />
      </Box>

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
    </>
  );
}

export default MyCart;

