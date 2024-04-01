import React, { useEffect, useState } from 'react';
import {
  View,
  KeyboardAvoidingView,
  TextInput,
  StyleSheet,
  Text,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import axios from "axios";
import { mainURL } from "../../utils/Urls";
import { Box, FormControl, HStack, Icon, Input, Pressable, Stack, TextArea,Button, Center, Heading, VStack, Link } from 'native-base';
import { Dropdown } from 'react-native-element-dropdown';
import { AntDesign } from "@expo/vector-icons";
function Account(){

    const [show, setShow] = useState(false);
    const [country, setCountry] = useState(null);
    const [state, setState] = useState(null);
    const [city, setCity] = useState(null);
    const [name, setName]=useState();
    const [email, setEmail]=useState();
    const [password, setPassword]=useState();
    const [address, setAddress]=useState();

    const [isFocus, setIsFocus] = useState(false);
    let i;
    const [countryList, setCountryList]=useState([]);
    const [stateList, setStateList]=useState([]);
    const [cityList, setCityList]=useState([]);

    const data = [
        { label: 'Item 1', value: '1' },
        { label: 'Item 2', value: '2' },
        { label: 'Item 3', value: '3' },
        { label: 'Item 4', value: '4' },
        { label: 'Item 5', value: '5' },
        { label: 'Item 6', value: '6' },
        { label: 'Item 7', value: '7' },
        { label: 'Item 8', value: '8' },
      ];

    //   const renderLabel = () => {
    //     if (country || state || city || isFocus) {
    //       return (
    //         <Text style={[styles.label, isFocus && { color: 'blue' }]}>
    //           Dropdown label
    //         </Text>
    //       );
    //     }
    //     return null;
    //   };

    useEffect(()=>{
        async function getAllCountries(){
            try {
                await axios.get(`${mainURL}/zayas_shop/getCountryList/`).then((response)=>{
                    const countries = response.data.map(country => ({
                        label: country.country_name,
                        value: country.country_code
                    }));
                    setCountryList(countries);
        
                });
                
    
            } catch (error) {
                console.log(error)
            }
        }
    
        getAllCountries();
    },[]);

    async function stateHandler(countryCode){
        try {
            await axios.get(`${mainURL}/zayas_shop/getStateList/${countryCode}/`).then((response)=>{
                const states = response.data.map(state => ({
                    label: state.state_name,
                    value: state.state_code
                }));
                setStateList(states);
    
            });
        } catch (error) {
            console.log(error)
        }
    }

    async function cityHandler(countryCode, stateCode){
        try {
            await axios.get(`${mainURL}/zayas_shop/getCityList/${countryCode}/${stateCode}/`).then((response)=>{
                const states = response.data.map(city => ({
                    label: city.city_name,
                    value: city.id
                }));
                setCityList(states);
    
            });
        } catch (error) {
            console.log(error)
        }
    }

    function changeTextHandler(enteredValue){
        setName(enteredValue);
    }

    function changeEmailHandler(enteredValue){
        setEmail(enteredValue);
    }

    function changePasswordHandler(enteredValue){
        setPassword(enteredValue);
    }

    function changeAddressHandler(enteredValue){
        setAddress(enteredValue);
    }
    function createAccount(){
        console.log("test")
        const object={
            username: name,
            email_address: email,
            password: password,
            country:country,
            state:state,
            city:city,
            address: address
        }

        console.log(object);
    }
    return(
        <>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.container}>
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View style={styles.inner}>
                        {/* <Center w="100%">
                            <Box safeArea p="2" py="8" w="90%" maxW="290">
                                <Heading size="lg" fontWeight="600" color="coolGray.800" _dark={{
                                color: "warmGray.50"
                            }}>
                                Welcome
                                </Heading>
                                <Heading mt="1" _dark={{
                                color: "warmGray.200"
                            }} color="coolGray.600" fontWeight="medium" size="xs">
                                Sign in to continue!
                                </Heading>

                                <VStack space={3} mt="5">
                                <FormControl isRequired>
                                    <FormControl.Label>Username</FormControl.Label>
                                    <Input />
                                </FormControl>
                                <FormControl isRequired>
                                    <FormControl.Label>Email ID</FormControl.Label>
                                    <Input />
                                </FormControl>
                                <FormControl>
                                    <FormControl.Label>Password</FormControl.Label>
                                    <Input type="password" />
                                    <Link _text={{
                                    fontSize: "xs",
                                    fontWeight: "500",
                                    color: "indigo.500"
                                }} alignSelf="flex-end" mt="1">
                                    Forget Password?
                                    </Link>
                                </FormControl>
                                <HStack space={10} style={{marginVertical:10}}>
                                        <Dropdown    
                                            style={[styles.dropdown, isFocus && { borderColor: 'blue' }]}
                                            placeholderStyle={styles.placeholderStyle}
                                            selectedTextStyle={styles.selectedTextStyle}
                                            inputSearchStyle={styles.inputSearchStyle}
                                            iconStyle={styles.iconStyle}
                                            data={countryList}
                                            search
                                            maxHeight={300}
                                            labelField="label"
                                            valueField="value"
                                            placeholder={!isFocus ? 'Select country' : '...'}
                                            searchPlaceholder="Search..."
                                            value={country}
                                            onFocus={() => setIsFocus(true)}
                                            onBlur={() => setIsFocus(false)}
                                            onChange={item => {
                                                setCountry(item.value);
                                                stateHandler(item.value)
                                                setIsFocus(false);
                                            }}
                                            renderLeftIcon={() => (
                                                <AntDesign
                                                style={styles.icon}
                                                color={isFocus ? 'blue' : 'black'}
                                                name="Safety"
                                                size={20}
                                                />
                                        )}/>
                                        <Dropdown
                                            style={[styles.dropdown, isFocus && { borderColor: 'blue' }]}
                                            placeholderStyle={styles.placeholderStyle}
                                            selectedTextStyle={styles.selectedTextStyle}
                                            inputSearchStyle={styles.inputSearchStyle}
                                            iconStyle={styles.iconStyle}
                                            data={stateList}
                                            search
                                            maxHeight={300}
                                            labelField="label"
                                            valueField="value"
                                            placeholder={!isFocus ? 'Select state' : '...'}
                                            searchPlaceholder="Search..."
                                            value={state}
                                            onFocus={() => setIsFocus(true)}
                                            onBlur={() => setIsFocus(false)}
                                            onChange={item => {
                                                setState(item.value);
                                                setIsFocus(false);
                                                cityHandler(country ,item.value)
                                            }}
                                            renderLeftIcon={() => (
                                                <AntDesign
                                                style={styles.icon}
                                                color={isFocus ? 'blue' : 'black'}
                                                name="Safety"
                                                size={20}
                                                />
                                        )}/>
                                    </HStack>
                                    <HStack style={{marginBottom:10}}>
                                        <Dropdown
                                            style={[styles.dropdown, isFocus && { borderColor: 'blue' }]}
                                            placeholderStyle={styles.placeholderStyle}
                                            selectedTextStyle={styles.selectedTextStyle}
                                            inputSearchStyle={styles.inputSearchStyle}
                                            iconStyle={styles.iconStyle}
                                            data={cityList}
                                            search
                                            maxHeight={300}
                                            labelField="label"
                                            valueField="value"
                                            placeholder={!isFocus ? 'Select city' : '...'}
                                            searchPlaceholder="Search..."
                                            value={city}
                                            onFocus={() => setIsFocus(true)}
                                            onBlur={() => setIsFocus(false)}
                                            onChange={item => {
                                                setCity(item.value);
                                                setIsFocus(false);
                                            }}
                                            renderLeftIcon={() => (
                                                <AntDesign
                                                style={styles.icon}
                                                color={isFocus ? 'blue' : 'black'}
                                                name="Safety"
                                                size={20}
                                                />
                                        )}/>
                                    </HStack>
                                <FormControl isRequired>
                                    <FormControl.Label>Address</FormControl.Label>
                                    <TextArea />
                                </FormControl>
                                <Button mt="2" colorScheme="indigo">
                                    Sign in
                                </Button>
                                <HStack mt="6" justifyContent="center">
                                    <Text fontSize="sm" color="coolGray.600" _dark={{
                                    color: "warmGray.200"
                                }}>
                                    I'm a new user.{" "}
                                    </Text>
                                    <Link _text={{
                                    color: "indigo.500",
                                    fontWeight: "medium",
                                    fontSize: "sm"
                                }} href="#">
                                    Sign Up
                                    </Link>
                                </HStack>
                                </VStack>
                            </Box>
                        </Center> */}
                        <VStack alignItems={"center"} paddingTop={50} paddingBottom={50}>
                            <Text style={styles.header}>Let's get started</Text>
                        </VStack>
                        <FormControl isRequired padding={5} borderTopLeftRadius={15} borderTopRightRadius={15}>       
                                <Stack mx="5">
                                    <FormControl.Label>Username</FormControl.Label>
                                    <Input onChangeText={changeTextHandler} type="text" placeholder="Username" fontSize={"md"} />
                                    <FormControl.Label>Email address</FormControl.Label>
                                    <Input onChangeText={changeEmailHandler} type="text" placeholder="Email address" fontSize={"md"} />
                                    <FormControl.Label>Password</FormControl.Label>
                                    <Input onChangeText={changePasswordHandler} type={show ? "text" : "password"} placeholder="Password" fontSize={"md"} InputRightElement={<Pressable onPress={() => setShow(!show)}>
                                        <Icon as={<MaterialIcons name={show ? "visibility" : "visibility-off"} />} size={5} mr="2" color="muted.400" />
                                    </Pressable>} />
                                    <FormControl.HelperText>
                                    Must be atleast 6 characters.
                                    </FormControl.HelperText>
                                    <HStack space={5} style={{marginVertical:10}}>
                                        <Dropdown    
                                            style={[styles.dropdown, isFocus && { borderColor: 'blue' }]}
                                            placeholderStyle={styles.placeholderStyle}
                                            selectedTextStyle={styles.selectedTextStyle}
                                            inputSearchStyle={styles.inputSearchStyle}
                                            iconStyle={styles.iconStyle}
                                            data={countryList}
                                            search
                                            maxHeight={300}
                                            labelField="label"
                                            valueField="value"
                                            placeholder={!isFocus ? 'Select country' : '...'}
                                            searchPlaceholder="Search..."
                                            value={country}
                                            onFocus={() => setIsFocus(true)}
                                            onBlur={() => setIsFocus(false)}
                                            onChange={item => {
                                                setCountry(item.value);
                                                stateHandler(item.value)
                                                setIsFocus(false);
                                            }}
                                            renderLeftIcon={() => (
                                                <AntDesign
                                                style={styles.icon}
                                                color={isFocus ? 'blue' : 'black'}
                                                name="Safety"
                                                size={20}
                                                />
                                        )}/>
                                        <Dropdown
                                            style={[styles.dropdown, isFocus && { borderColor: 'blue' }]}
                                            placeholderStyle={styles.placeholderStyle}
                                            selectedTextStyle={styles.selectedTextStyle}
                                            inputSearchStyle={styles.inputSearchStyle}
                                            iconStyle={styles.iconStyle}
                                            data={stateList}
                                            search
                                            maxHeight={300}
                                            labelField="label"
                                            valueField="value"
                                            placeholder={!isFocus ? 'Select state' : '...'}
                                            searchPlaceholder="Search..."
                                            value={state}
                                            onFocus={() => setIsFocus(true)}
                                            onBlur={() => setIsFocus(false)}
                                            onChange={item => {
                                                setState(item.value);
                                                setIsFocus(false);
                                                cityHandler(country ,item.value)
                                            }}
                                            renderLeftIcon={() => (
                                                <AntDesign
                                                style={styles.icon}
                                                color={isFocus ? 'blue' : 'black'}
                                                name="Safety"
                                                size={20}
                                                />
                                        )}/>
                                    </HStack>
                                    <HStack style={{marginBottom:20}}>
                                        <Dropdown
                                            style={[styles.dropdown, isFocus && { borderColor: 'blue' }]}
                                            placeholderStyle={styles.placeholderStyle}
                                            selectedTextStyle={styles.selectedTextStyle}
                                            inputSearchStyle={styles.inputSearchStyle}
                                            iconStyle={styles.iconStyle}
                                            data={cityList}
                                            search
                                            maxHeight={300}
                                            labelField="label"
                                            valueField="value"
                                            placeholder={!isFocus ? 'Select city' : '...'}
                                            searchPlaceholder="Search..."
                                            value={city}
                                            onFocus={() => setIsFocus(true)}
                                            onBlur={() => setIsFocus(false)}
                                            onChange={item => {
                                                setCity(item.value);
                                                setIsFocus(false);
                                            }}
                                            renderLeftIcon={() => (
                                                <AntDesign
                                                style={styles.icon}
                                                color={isFocus ? 'blue' : 'black'}
                                                name="Safety"
                                                size={20}
                                                />
                                        )}/>
                                    </HStack>
                                    <TextArea onChangeText={changeAddressHandler} h={20} placeholder="Enter your address" fontSize={"md"} />
                                    <Box paddingTop={5}>
                                        <Button onPress={createAccount}>Create account</Button>
                                    </Box>  
                                </Stack>
                            </FormControl>
                    </View>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </>
    )
}

export default Account;

const styles = StyleSheet.create({
    container: {
        flex: 1,
      },
    dropdown: {
        height: 50,
        width:"47.2%",
        borderColor: 'gray',
        borderWidth: 0.5,
        borderRadius: 8,
        paddingHorizontal: 8,
      },
      icon: {
        marginRight: 5,
      },
    //   label: {
    //     position: 'absolute',
    //     backgroundColor: 'white',
    //     left: 22,
    //     top: 8,
    //     zIndex: 999,
    //     paddingHorizontal: 8,
    //     fontSize: 14,
    //   },
      placeholderStyle: {
        fontSize: 16,
        color:'#171717'
      },
      selectedTextStyle: {
        fontSize: 16,
      },
      iconStyle: {
        width: 20,
        height: 20,
      },
      inputSearchStyle: {
        height: 40,
        fontSize: 16,
      },
    
      inner: {
        flex: 1,
        justifyContent: 'space-evenly',
        backgroundColor:'white'
      },
      header: {
        fontSize: 36,
      },
      btnContainer: {
        backgroundColor: 'white',
        marginTop: 12,
      },
  });