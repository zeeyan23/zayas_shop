import axios from "axios";
import { Box, Icon, Pressable, Radio, Text, View } from "native-base";
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
            // setShowRadioButton(true);
        });
    }

    const resetAnimation = () => {
        Animated.timing(animation, {
          toValue: 0,
          duration: 300,
          useNativeDriver: false,
        }).start(() => {
        //   setShowRadioButton(false);
        });
    };

    const translateX = animation.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 20],
    });

      
    return(
        <>
            <Box paddingLeft={7}>
                <ScrollView>
                {allFavorites.map((favorites, index)=>(
                    <Animated.View style={{ transform: [{ translateX }], flexDirection:'row' }} key={index}>
                        <Pressable onLongPress={buttonLongPressHandler} rounded="md" >
                            <FavoriteItem favoriteItem={favorites.product_id} key={index}/>
                        </Pressable>
                            {showRadioButton && 
                                <Radio.Group position={"absolute"} left={0} padding={7}>
                                    <Radio colorScheme="red" value="2"  aria-label="close" size={"sm"}
                                        icon={<Icon as={<MaterialCommunityIcons name="close" />} />}>
                                        
                                    </Radio>
                                </Radio.Group>
                            }
                    </Animated.View>
                ))}
                </ScrollView>
            </Box>
        </>
    )
}


export default AllFavorites;