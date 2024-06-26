import axios from "axios";
import { Box, Button, Center, Checkbox, HStack, Icon, Pressable, Radio, Stack, Text, Toast, VStack, View, } from "native-base";
import { useCallback, useEffect, useState } from "react";
import { mainURL } from "../utils/Urls";
import { Animated, BackHandler, ScrollView, TouchableOpacity } from "react-native";
import { useFocusEffect, useIsFocused, useNavigation } from '@react-navigation/native';
import CartItem from "./Screens/CartItem";
import FavoriteItem from "./Screens/FavoriteItem";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import ChipButton from "../utils/ChipButton";
import { favData } from "../src/Context/FavoritesContext";
import { useSelector } from "react-redux";
import { Ionicons } from "@expo/vector-icons";

function AllFavorites(){

    const [allFavorites, setAllFavorites]=useState([]);
    const [animation] = useState(new Animated.Value(0));
    const navigation = useNavigation();
    const [showRadioButton, setShowRadioButton] = useState(false);

    const [checkedAll, setCheckedAll] = useState(false);
    const [checked, setChecked] = useState({});
    const user_id = useSelector((state) => state.user_id.value);
    const { fav } = favData();

    useEffect(()=>{
        async function getAllFavorites(){
            try {
                await axios.get(`${mainURL}/zayas_shop/savetofavorite/?user_id=${user_id}`).then((response)=>{
                    setAllFavorites(response.data.reverse());
                });
                

            } catch (error) {
                console.log(error)
            }
        }

        getAllFavorites();
    },[fav,setAllFavorites]);

    // useEffect(() => {
    //     const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
    //       resetAnimation();
    //       return true;
    //     });
    
    //     return () => {
    //       backHandler.remove();
    //     };
    // }, [navigation]);

    useEffect(() => {
        const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
            if (navigation.isFocused()) {
                resetAnimation();
                return true;
            }
            return false; // Allow normal back behavior if not focused
        });

        return () => {
            backHandler.remove();
        };
    }, [navigation]);


    useEffect(()=>{
        const unsubscribe = navigation.addListener('tabPress', e => {
            resetAnimation();
          });
      
        return unsubscribe;
    },[navigation]);

    function buttonLongPressHandler(){
        Animated.timing(animation, {
            toValue: 1,
            duration: 300,
            useNativeDriver: false,
        }).start(()=>{
            setShowRadioButton(true);
        });
    }

    const resetAnimation = () => {
        Animated.timing(animation, {
          toValue: 0,
          duration: 300,
          useNativeDriver: false,
        }).start(() => {
          setShowRadioButton(false);
        });
    };

    const translateX = animation.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 70],
    });

    useEffect(() => {
        const initialCheckedState = {};
        allFavorites.forEach(item => {
          initialCheckedState[item.id] = false;
        });
        setChecked(initialCheckedState);
      }, [allFavorites]);
    
      useEffect(() => {
        let allChecked = true;
        for (const inputName in checked) {
          if (!checked[inputName]) {
            allChecked = false;
            break;
          }
        }
        setCheckedAll(allChecked);
      }, [checked]);
    
      const toggleCheck = (inputId) => {
        setChecked((prevState) => ({
          ...prevState,
          [inputId]: !prevState[inputId],
        }));
      };
      
      const selectAll = (value) => {
        setCheckedAll(value);
        setChecked((prevState) => {
          const newState = {};
          for (const inputId in prevState) {
            newState[inputId] = value;
          }
          return newState;
        });
      };

    function cancelHandler(){
      resetAnimation();
    }
  

    async function deleteHandler(){
      const dataToSend = Object.keys(checked)
                        .filter(id => checked[id])
                        .map(id => ({
                            item_id: parseInt(id),
                            product_id: allFavorites.find(item => item.id === parseInt(id)).product_id.id
                        }));
      try {
          const response = await axios.post(`${mainURL}/zayas_shop/deletefavoriteitems/`, 
              { items: dataToSend },
              {
                  headers: {
                      'Content-Type': 'application/json',
                  }
              }
          );
          Toast.show({
            description: "Successfully removed favorites!"
          });
          const updatedFavorites = allFavorites.filter(item => !checked[item.id]);
          setAllFavorites(updatedFavorites);
          
          resetAnimation();
      } catch (error) {
          console.log(error)
      }
  }

  
    return(
        <>
            <VStack space={4} h={"full"}  padding={5} background={"white"}>
                {showRadioButton && <HStack space={6}>
                  <Checkbox
                          shadow={2}
                          value="test"
                          accessibilityLabel="This is a dummy checkbox"
                          isChecked={checkedAll || false}
                          onChange={() => selectAll(!checkedAll)}
                      >
                          Select all
                  </Checkbox>
                </HStack>}
                <ScrollView contentContainerStyle={{flex:1}}>
                  {allFavorites.length > 0 ? allFavorites.map((item,key) => (
                      <Animated.View style={{ transform: [{ translateX }] }} key={key}>
                          <Center w="full" marginBottom={10} padding={5} bg="#005db4" rounded="md" shadow={3} >
                              <Pressable onLongPress={buttonLongPressHandler} >
                                  <FavoriteItem favoriteItem={item.product_id} key={key}/>
                              </Pressable>
                          </Center>
                          {showRadioButton && <HStack space={3} alignSelf={"flex-start"} position={"absolute"} h={"full"}>
                              <Center w={"0.5"} right={"35"} rounded="md" h={"10"} alignSelf={"center"} >
                                      
                                      <Checkbox
                                          shadow={2}
                                          isChecked={checked[item.id] || false}
                                          onChange={()=> toggleCheck(item.id)}
                                          aria-label="close" >
                                          <Icon as={MaterialCommunityIcons} name="" />
                                      </Checkbox>
                              </Center>
                          </HStack>}
                      </Animated.View> 
                  )) : 
                  <Box flex={1} justifyContent={"center"} alignItems={"center"}>
                    <Icon as={<Ionicons name="heart-dislike-circle" />} size={"6xl"} color="#005db4" />
                    <Text fontSize={"2xl"} fontWeight={"semibold"} color="#005db4">No Favorited Items Found</Text>
                  </Box>}
                </ScrollView>
                {showRadioButton && <Stack space={3} alignItems="center">
                    <HStack space={100} alignItems="center">
                      <Button paddingRight={10} paddingLeft={10} backgroundColor={"blue.600"} onPress={cancelHandler}>Cancel</Button>
                      <Button paddingRight={10} paddingLeft={10} backgroundColor={"danger.500"} onPress={deleteHandler}>Delete</Button>
                    </HStack>
                </Stack>}
            </VStack>
        </>
    )
}


export default AllFavorites;