import axios from "axios";
import { Box, Center, HStack, Icon, Pressable, Radio, Text, VStack, View } from "native-base";
import { useEffect, useState } from "react";
import { mainURL } from "../utils/Urls";
import { Animated, BackHandler, ScrollView } from "react-native";
import { useNavigation } from '@react-navigation/native';
import CartItem from "./Screens/CartItem";
import FavoriteItem from "./Screens/FavoriteItem";
import { MaterialCommunityIcons } from "@expo/vector-icons";

function AllFavorites(){

    const [allFavorites, setAllFavorites]=useState([]);
    const [animation] = useState(new Animated.Value(0));
    const navigation = useNavigation();
    const [showRadioButton, setShowRadioButton] = useState(true);

    useEffect(()=>{
        async function getAllFavorites(){
            try {
                await axios.get(`${mainURL}/zayas_shop/savetofavorite/`).then((response)=>{
                    setAllFavorites(response.data);
                });
                

            } catch (error) {
                console.log(error)
            }
        }

        getAllFavorites();
    },[]);

    useEffect(() => {
        const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
          resetAnimation();
          return true;
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
    },[navigation])

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

      
    return(
        <>
            <VStack background={"white"} space={4} h={"full"} padding={5}>
                <ScrollView>
                    {allFavorites.map((favorites, index)=>(
                    <Animated.View style={{ transform: [{ translateX }] }} key={index}>
                        <Center w="full" marginBottom={10} padding={5} bg="primary.700" rounded="md" shadow={3} >
                            <Pressable onLongPress={buttonLongPressHandler} >
                                <FavoriteItem favoriteItem={favorites.product_id} key={index}/>
                            </Pressable>
                        </Center>
                        {showRadioButton && <HStack space={3} alignSelf={"flex-start"} position={"absolute"} h={"full"}>
                            <Center w={"0.5"} right={"35"} rounded="md" h={"10"} alignSelf={"center"} >
                                    {/* <Radio.Group>
                                        <Radio colorScheme="red" value="2"  aria-label="close" size={"sm"}
                                            icon={<Icon as={<MaterialCommunityIcons name="close" />} />} />
                                    </Radio.Group> */}
                                    <Radio.Group>
                                        <Radio colorScheme="red" value="2" aria-label="close" size="sm">
                                            <Icon as={MaterialCommunityIcons} name="" />
                                        </Radio>
                                    </Radio.Group>

                            </Center>
                        </HStack>}
                    </Animated.View>
                    ))}
                </ScrollView>
            </VStack>
        </>
    )
}


export default AllFavorites;