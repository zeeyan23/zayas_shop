import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View,  Dimensions, Image } from "react-native";
import axios from "axios";
import ProductItem from "./ProductItem";
import { mainURL } from "../utils/Urls";
import Carousel, { Pagination, PaginationLight } from 'react-native-x-carousel';
import { Button, HStack, VStack } from "native-base";
import ChipButton from "../utils/ChipButton";

const { width } = Dimensions.get('window');

function AllProducts(){
    
    const [allProducts,setAllProducts]=useState([]);
    const [allCategories,setAllCategories]=useState([]);
    const [offersItems,setOffersItems]=useState([]);

    useEffect(()=>{
        async function getOfferItems(){
            try {
                await axios.get(`${mainURL}/zayas_shop/offersItems/`).then((response)=>{
                    // console.log(JSON.stringify(response.data, null, 2));
                    setOffersItems(response.data)
                });

            } catch (error) {
                console.log(error)
            }
        }

        getOfferItems();
    },[]);

    const DATA = offersItems.map((item) => ({
        coverImageUri: `${mainURL}${item.offer_image}`,
        cornerLabelColor: '#0080ff',
        cornerLabelText: item.offer_description,
      }));

    useEffect(()=>{
        async function getAllProducts(){
            try {
                await axios.get(`${mainURL}/zayas_shop/getAllItems`).then((response)=>{
                    setAllProducts(response.data);
                });

            } catch (error) {
                console.log(error)
            }
        }

        getAllProducts();
    },[]);

    useEffect(()=>{
        async function getAllCategories(){
            try {
                await axios.get(`${mainURL}/zayas_shop/getAllCategories`).then((response)=>{
                    setAllCategories(response.data);
                });

            } catch (error) {
                console.log(error)
            }
        }

        getAllCategories();
    },[]);

    async function filterHandler(category_id){
        try {
            await axios.get(`${mainURL}/zayas_shop/fetchItem/${category_id}`).then((response)=>{
                setAllProducts(response.data)
            });

        } catch (error) {
            console.log(error)
        }

    }

    const renderItem = data => (
        <View
            key={data.coverImageUri}
            style={styles.cardContainer}
            >
            <View
                style={styles.cardWrapper}
            >
                <Image
                style={styles.card}
                source={{ uri: data.coverImageUri }}
                />
                <View
                style={[
                    styles.cornerLabel,
                    { backgroundColor: data.cornerLabelColor },
                ]}
                >
                <Text style={styles.cornerLabelText}>
                    { data.cornerLabelText }
                </Text>
                </View>
            </View>
        </View>
      );

    return(
        <>  
            <ScrollView stickyHeaderIndices={[1]}>
                <Carousel
                    pagination={PaginationLight}
                    renderItem={renderItem}
                    data={DATA}
                    loop
                    autoplay
                />
                <View style={{ position: 'sticky', top: 0, zIndex: 1, backgroundColor:'white'}}>
                    <ScrollView horizontal={true}>
                        <HStack space={4} justifyContent='center' padding={5}>
                            {allCategories.map((data, key)=>(
                                <ChipButton key={key} onPress={()=>filterHandler(data.id)}>{data.category_name}</ChipButton>
                            ))}
                        </HStack>
                    </ScrollView>
                </View>
                <View style={{flexDirection:'row', flexWrap:'wrap', justifyContent:'center'}}>
                    {allProducts.map((product,index)=>(
                        <ProductItem product={product} key={index}/>
                    ))}
                </View>
            </ScrollView>
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center'
    },
    cardContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        width
    },
    cardWrapper: {
        borderRadius: 8,
        overflow: 'hidden'
    },
    card: {
        width: width * 0.9,
        height: width * 0.5,
    },
    cornerLabel: {
        position: 'absolute',
        top: 0,
        right: 0,
        borderBottomLeftRadius: 8,
    },
    cornerLabelText: {
        fontSize: 12,
        color: '#fff',
        fontWeight: '600',
        paddingLeft: 5,
        paddingRight: 5,
        paddingTop: 2,
        paddingBottom: 2,
    },
  });

export default AllProducts;