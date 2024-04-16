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
  Animated,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Modal } from "native-base";
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
    const navigation = useNavigation();

    const [isFocus, setIsFocus] = useState(false);
    let i;
    const [countryList, setCountryList]=useState([]);
    const [stateList, setStateList]=useState([]);
    const [cityList, setCityList]=useState([]);

    const [formData, setData] = useState({});
    const [formKey, setFormKey] = useState(0);
    const [errors, setErrors] = useState({});

    const [placement, setPlacement] = useState(undefined);
    const [open, setOpen] = useState(false);
    const [accCreated, setAccCreated] = useState(false);
    const [emptyForm, setEmptyForm] = useState(false);
    const bounceValue = new Animated.Value(0);
  
    const openModal = placement => {
      setOpen(true);
      setPlacement(placement);
    };

    const openAccountModal = placement => {
        setAccCreated(true);
        setPlacement(placement);
      };

      const openEmptyFormModal = placement => {
        setEmptyForm(true);
        setPlacement(placement);
      };

    useEffect(() => {
        if (open || accCreated || emptyForm) {
            // Animate the modal when it opens
            Animated.spring(bounceValue, {
                toValue: 1,
                bounciness :true,
                speed:5,
                useNativeDriver: true,
            }).start();
        } else {
            // Reset the animation when the modal closes
            bounceValue.setValue(0);
        }
    }, [open, accCreated]);

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

    useEffect(() => {
        return () => {
            // Reset the form when component unmounts
            setFormKey(prevKey => prevKey + 1);
        };
    }, [formKey]);
    

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
        setData({ ...formData, username: enteredValue });
    }

    function changeEmailHandler(enteredValue){
        setData({ ...formData, email_address: enteredValue });
    }

    function changePasswordHandler(enteredValue){
        setData({ ...formData, password: enteredValue });
    }

    function changeAddressHandler(enteredValue){
        setData({ ...formData, address: enteredValue });
    }

    function countryInput(enteredValue){
        setData({ ...formData, country: enteredValue.label });
        setCountry(enteredValue.value);
    }

    function stateInput(enteredValue){
        setData({ ...formData, state: enteredValue.label });
        setState(enteredValue.value);
    }

    function cityInput(enteredValue){
        setData({ ...formData, city: enteredValue.label });
        setCity(enteredValue.value);
    }
    const validate = () => {
        if (formData.username === undefined) {
          setErrors({ ...errors,
            username: 'Name is required'
          });
          return false;
        } else if (formData.username.length < 3) {
          setErrors({ ...errors,
            username: 'Name is too short'
          });
          return false;
        }
    
        return true;
    };
    
   
    function resetForm() {
        // Increment the form key to remount the component
        setFormKey(prevKey => prevKey + 1);
    }
    
    async function createAccount(){
        const requiredFields = ['address', 'email_address', 'password', 'username'];
        const emptyFields = requiredFields.filter(field => !formData[field]);

        if (emptyFields.length > 0) {
            openEmptyFormModal("center")
            return; 
        }
        try {
            const response = await axios.post(`${mainURL}/zayas_shop/save_user_account/`, 
              formData,
              {
                  headers: {
                      'Content-Type': 'application/json',
                  }
              }
          );
          setData({});
          // Optionally, you can also reset any other state variables related to the form fields
          // resetStateVariables();
          if (validate()) {
              openAccountModal("center");
              resetForm();
          } else {
              console.log('Validation Failed');
          }
        } catch (error) {
            if (error.response) {
                openModal("center")
                console.log('Status Code:', error.response.status);
                console.log('Data:', error.response.data);
                
            } else if (error.request) {
                console.log('Request:', error.request);
            } else {
                console.log('Error:', error.message);
            }
        }
    }

    const LoginScreen = async () => {
        const navigation = useNavigation();
        navigation.navigate('MyCartStack');
    }
    return(
        <>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.container}>
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <ScrollView contentContainerStyle={styles.inner} keyboardShouldPersistTaps="handled">
                        <View style={styles.inner}>
                            <VStack alignItems={"center"} paddingTop={50} paddingBottom={50}>
                                <Text style={styles.header}>Let's get started</Text>
                                {/* Add more content here */}
                                <FormControl key={formKey}  isRequired isInvalid={'username' in errors} padding={5} borderTopLeftRadius={15} borderTopRightRadius={15}>       
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
                                                countryInput(item)
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
                                                stateInput(item)
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
                                                cityInput(item);
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
                            </VStack>
                        </View>
                    </ScrollView>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
            {/* <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.container}>
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View style={styles.inner}>
                        <VStack alignItems={"center"} paddingTop={50} paddingBottom={50}>
                            <Text style={styles.header}>Let's get started</Text>
                        </VStack>
                        
                    </View>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView> */}
            <Modal isOpen={open} onClose={() => setOpen(false)} safeAreaTop={true}>
                <Modal.Content maxWidth="350" {...styles[placement]}>
                <Modal.Header >Account already exists!</Modal.Header>
                <Modal.Body>
                    Given Email id already exists in the record
                </Modal.Body>
                <Modal.Footer>
                    <Button onPress={LoginScreen}>Login</Button>
                </Modal.Footer>
                </Modal.Content>
            </Modal>
            <Modal isOpen={accCreated} onClose={() => setAccCreated(false)} safeAreaTop={true}>
                <Modal.Content maxWidth="350" {...styles[placement]}>
                <Modal.Header >Account Created!</Modal.Header>
                <Modal.Body>
                    LogIn to your account, for personalized experince
                </Modal.Body>
                <Modal.Footer>

                </Modal.Footer>
                </Modal.Content>
            </Modal>
            <Modal isOpen={emptyForm} onClose={() => setEmptyForm(false)} safeAreaTop={true}>
                <Modal.Content maxWidth="350" {...styles[placement]}>
                <Modal.Header >Invalid Form Submission</Modal.Header>
                <Modal.Body>
                    Please Enter require fields
                </Modal.Body>
                <Modal.Footer>

                </Modal.Footer>
                </Modal.Content>
            </Modal>
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