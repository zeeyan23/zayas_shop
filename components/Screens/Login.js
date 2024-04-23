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
import { useDispatch } from 'react-redux';
import { updateToken } from '../../src/redux/reducers/tokenreducer';
import { updateUsername } from '../../src/redux/reducers/userReducer';
import { useSelector } from 'react-redux';

function LoginScreen(){

    const navigation = useNavigation();
    const [formData, setData] = useState({});
    const dispatch = useDispatch();

    // const token = useSelector((state) => state.token.value);

    const handleSignUpClick = () => {
        navigation.navigate('Account'); 
    };
    
    function changeEmailHandler(enteredValue){
        setData({ ...formData, email_address: enteredValue });
    }

    function changePasswordHandler(enteredValue){
        setData({ ...formData, password: enteredValue });
    }

    const validate = () => {
        if (formData.email_address === undefined) {
          setErrors({ ...errors,
            email_address: 'email_address is required'
          });
          return false;
        } else if (formData.password.length < 3) {
          setErrors({ ...errors,
            password: 'password is too short'
          });
          return false;
        }
    
        return true;
    };

    async function SignInHandler(){
        const requiredFields = ['email_address', 'password'];
        const emptyFields = requiredFields.filter(field => !formData[field]);
        try {
            const response = await axios.post(`${mainURL}/zayas_shop/auth_login/`, 
              formData,
              {
                  headers: {
                      'Content-Type': 'application/json',
                  }
              }
          );
          
          if (validate()) {
            dispatch(updateToken(response.data.token)); 
            dispatch(updateUsername(response.data.username));
            navigation.navigate('Feed'); 
          } else {
              console.log('Validation Failed');
          }
        } catch (error) {
            if (error.response) {
                console.log('Status Code:', error.response.status);
                console.log('Data:', error.response.data);
                
            } else if (error.request) {
                console.log('Request:', error.request);
            } else {
                console.log('Error:', error.message);
            }
        }
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
                                <Center w="100%">
                                    <Box safeArea w="90%">
                                        <View style={{alignItems:'center'}}>
                                            <Heading size="3xl" fontWeight="600" color="coolGray.800" _dark={{
                                            color: "warmGray.50"
                                        }}>
                                            Welcome
                                            </Heading>
                                            <Heading mt="1" _dark={{
                                            color: "warmGray.200"
                                        }} color="coolGray.600" fontWeight="medium" size="md">
                                            Sign in to continue!
                                            </Heading>
                                        </View>
                                        

                                        <VStack space={3} mt="5">
                                        <FormControl>
                                            <FormControl.Label>Email ID</FormControl.Label>
                                            <Input onChangeText={changeEmailHandler} />
                                        </FormControl>
                                        <FormControl>
                                            <FormControl.Label>Password</FormControl.Label>
                                            <Input type="password" onChangeText={changePasswordHandler}/>
                                            <Link _text={{
                                            fontSize: "xs",
                                            fontWeight: "500",
                                            color: "indigo.500"
                                        }} alignSelf="flex-end" mt="1">
                                            Forget Password?
                                            </Link>
                                        </FormControl>
                                        <Button mt="2" colorScheme="indigo" onPress={SignInHandler}>
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
                                        }} onPress={handleSignUpClick}>
                                            Sign Up
                                            </Link>
                                        </HStack>
                                        </VStack>
                                    </Box>
                                    </Center>
                            </VStack>
                        </View>
                    </ScrollView>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </>
    )
}

export default LoginScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
      },
      inner: {
        flex: 1,
        justifyContent: 'space-evenly',
        backgroundColor:'white'
      },
      header: {
        fontSize: 36,
      }
  });