import React, { useEffect, useState } from "react";
import { Avatar, Box, Button, HStack, Heading, Icon, Pressable, Stack, Text } from "native-base";
import { Ionicons } from "@expo/vector-icons";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { SwipeListView } from "react-native-swipe-list-view";
import axios from "axios";
import { cartData } from "../../src/Context/CartContext";
import { mainURL } from "../../utils/Urls";
import CartItem from "./CartItem";

function MyCart(){
  const [mode, setMode] = useState('Basic');
  const [cartItems, setCartItems] = useState([]);
  const { user } = cartData();

  useEffect(() => {
    // if(user){
      async function getAllCartItems() {
        try {
          const response = await axios.get(`${mainURL}/zayas_shop/savetocart/`);
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
    

    console.log(JSON.stringify(listData, null, 2))
  
    const closeRow = (rowMap, rowKey) => {
      if (rowMap[rowKey]) {
        rowMap[rowKey].closeRow();
      }
    };
  
    const deleteRow = (rowMap, rowKey) => {
      closeRow(rowMap, rowKey);
      const newData = [...listData];
      const prevIndex = listData.findIndex(item => item.key === rowKey);
      newData.splice(prevIndex, 1);
      setListData(newData);
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
  
    const renderHiddenItem = (data, rowMap) => <HStack flex={1} pl={2}>
        <Pressable px={4} ml="auto" cursor="pointer" bg="dark.500" justifyContent="center" onPress={() => closeRow(rowMap, data.item.key)} _pressed={{
        opacity: 0.5
      }}>
          <Icon as={<Ionicons name="close" />} color="white" />
        </Pressable>
        <Pressable px={4} cursor="pointer" bg="red.500" justifyContent="center" onPress={() => deleteRow(rowMap, data.item.key)} _pressed={{
        opacity: 0.5
      }}>
          <Icon as={<MaterialIcons name="delete" />} color="white" />
        </Pressable>
      </HStack>;
  
    return <Box bg="white" safeArea flex={1}>
        <SwipeListView data={listData} renderItem={renderItem} renderHiddenItem={renderHiddenItem} rightOpenValue={-130} previewRowKey={'0'} previewOpenValue={-40} previewOpenDelay={3000} onRowDidOpen={onRowDidOpen} />
      </Box>;
  }

  return <>
      <Box textAlign="center" bg="white" flex={1} safeAreaTop>
        <Basic />
      </Box>
    </>;
}

export default MyCart;