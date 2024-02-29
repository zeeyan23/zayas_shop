import 'react-native-gesture-handler';
import { useState, useEffect } from "react";
import { View, Text, StatusBar, Image } from 'react-native';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createDrawerNavigator,DrawerContentScrollView, DrawerItem, DrawerItemList } from '@react-navigation/drawer';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { IconButton, NativeBaseProvider, VStack ,Button, Box, Popover} from 'native-base';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { createStackNavigator } from '@react-navigation/stack';
import MyCart from './components/Screens/MyCart';
import AllProducts from './components/AllProducts';
import Badge from './utils/Badge';
import { Provider, useSelector } from 'react-redux';
// import store from './src/redux/store';
import { Ionicons } from "@expo/vector-icons";
import { UserProvider } from './src/Context/CartContext';
import initializeStore from './src/redux/store';
import AllFavorites from './components/AllFavorites';
import { FavProvider } from './src/Context/FavoritesContext';

function HomeScreen({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Button
        onPress={() => navigation.navigate('Notifications')}
        title="Go to notifications"
      />
    </View>
  );
}

function NotificationsScreen({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Button onPress={() => navigation.goBack()} title="Go back home" />
    </View>
  );
}

function Feed() {
  const navigation = useNavigation();
  const totalCount = useSelector((state) => state.count.value);

  const MyCart = () => {
    // Navigate to the MyCartStack
    navigation.navigate('MyCartStack');
  };

  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      <AllProducts />
      {totalCount > 0 && <Badge count={totalCount} />}
      <IconButton
        size={60}
        borderRadius={'full'}
        position='absolute'
        right={3}
        bottom={3}
        shadow={'9'}
        backgroundColor={'white'}
        variant={'outline'}
        colorScheme={'darkBlue'}
        _icon={{
          as: MaterialIcons,
          size: '2xl',
          name: 'add-shopping-cart',
        }}

        onPress={MyCart}
      />
    </View>
  );
}

function Profile() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Profile!</Text>
    </View>
  );
}

function Notifications() {
  return (
    <AllFavorites />
  );
}

const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

function MyTabs() {
  return (
    <Tab.Navigator
      initialRouteName="Feed"
      screenOptions={{
        tabBarActiveTintColor: '#005db4',
        tabBarLabelStyle:{fontWeight:'bold'},
      }}
    >
      <Tab.Screen
        name="Feed"
        component={Feed}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="home" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Favorite Items"
        component={Notifications}
        options={{
          tabBarLabel: 'Favorites',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="heart" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="App Settings"
        component={Profile}
        options={{
          tabBarLabel: 'Settings',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="settings" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  const [store, setStore] = useState(null);

  useEffect(() => {
    initializeStore.then((configuredStore) => {
      setStore(configuredStore);
    });
  }, []);

  if (!store) {
    // Handle loading state
    return null;
  }

  function CustomDrawerContent(props) {
    const { navigation } = props;
    return (
      <DrawerContentScrollView {...props}>
        <View style={{ height: 150, backgroundColor: 'grey', alignItems: 'center', justifyContent: 'center' }}>
          <Image
            source={require('./assets/adaptive-icon.png')}
            style={{ width: 120, height: 120, borderRadius: 60 }}
          />
        </View>
        <DrawerItemList {...props} />
      </DrawerContentScrollView>
    );
  }

  

  return (
    <FavProvider>
      <UserProvider>
        <Provider store={store}>
          <NativeBaseProvider>
            <StatusBar animated={true} />
            <NavigationContainer>
              <Drawer.Navigator initialRouteName="Home" drawerContent={props => <CustomDrawerContent {...props} />}>
                <Drawer.Screen name="Home" component={MyTabs} options={{
                  drawerIcon: ({ focused, color, size }) => (
                    <Ionicons name={focused ? 'home' : 'home-outline'} size={size} color={color} />
                  ),
                  headerRight: () => (
                    <Box h="60%" alignItems="center">
                      <Popover trigger={triggerProps => {
                      return <IconButton
                        size={10}
                        {...triggerProps}
                        icon={<MaterialCommunityIcons name="account" size={20} color="#005db4" />}
                        borderColor={"#005db4"}
                        borderWidth={1}
                        borderRadius={"full"}
                        right={4}
                      />
                    }}>
                        <Popover.Content accessibilityLabel="Delete Customerd" w="56" shadow={5}>
                          <Popover.Arrow />
                          <Popover.Header flexDirection={"row"} justifyContent={"center"}>
                            Sign up <Ionicons name='person-add' size={20} color={"#005db4"}/> / Login In <Ionicons name='log-in' size={25} color={"#005db4"}/>
                          </Popover.Header>
                          
                          <Popover.Footer justifyContent="space-around">
                            <Button.Group space={10}>
                              <Button colorScheme="darkBlue" variant="solid">
                                Sign Up
                              </Button>
                              <Button colorScheme="darkBlue" variant="outline">Login</Button>
                            </Button.Group>
                          </Popover.Footer>
                        </Popover.Content>
                      </Popover>
                    </Box>
                  ),
                }} />
                <Drawer.Screen name="NotificationsDrawer" component={NotificationsScreen} />
                <Drawer.Screen name="Cart Items" component={MyCartStack}  options={{
                  drawerIcon: ({ focused, color, size }) => (
                    <Ionicons name={focused ? 'cart' : 'cart-outline'} size={size} color={color} />
                  ),
                }}/>
              </Drawer.Navigator>
            </NavigationContainer>
          </NativeBaseProvider>
        </Provider>
      </UserProvider>
    </FavProvider>
  );
}

function MyCartStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Your Cart Items" component={MyCart}/>
    </Stack.Navigator>
  );
}
