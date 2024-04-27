import 'react-native-gesture-handler';
import { useState, useEffect } from "react";
import { View, Text, StatusBar, Image } from 'react-native';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createDrawerNavigator,DrawerContentScrollView, DrawerItem, DrawerItemList } from '@react-navigation/drawer';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { IconButton, NativeBaseProvider, VStack ,Button, Box, Popover, HStack, Checkbox, Circle, Icon, Square, View as NativeView, Heading} from 'native-base';
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
import { LinearGradient } from 'expo-linear-gradient';
import Account from './components/Screens/Account';
import Settings from './components/Screens/Settings';
import LoginScreen from './components/Screens/Login';

var TOKEN=null, USERNAME=null;
function HomeScreen() {
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
  const token = useSelector((state) => state.token.value);
  const username = useSelector((state) => state.username.value);
  TOKEN=token, USERNAME=username;
  
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
    <Settings />
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


function MyAccount(){
  return(
    <Account />
  )
}
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

  const config = {
    dependencies: {
      'linear-gradient': LinearGradient
    }
  };

  function CustomDrawerContent(props) {
    const navigation = useNavigation();
    
    
    return (
      <DrawerContentScrollView {...props}>
        <View style={{ height: 150, backgroundColor: '#00284D', alignItems: 'center', justifyContent: 'center' }}>
          <Circle size="50px" bg="darkBlue.100">
            <Box _text={{
              fontWeight: "bold",
              fontSize: "lg",
              color: "violet.900"}}>{getFirstLetter()}</Box>
          </Circle>
          <Heading size="xs" color={"white"} marginTop={2}>{USERNAME}</Heading>
        </View>
          
        <DrawerItemList {...props} />
      </DrawerContentScrollView>
    );
  }

  
  const getFirstLetter = () => {
    if (USERNAME) {
      return USERNAME.charAt(0).toUpperCase();
    } else {
      return '👤';
    }
  };

  return (
    <FavProvider>
      <UserProvider>
        <Provider store={store} >
          <NativeBaseProvider config={config}>
            <StatusBar animated={true} />
            <NavigationContainer>
              <Drawer.Navigator initialRouteName="Home" drawerContent={props => <CustomDrawerContent {...props} />}>
                <Drawer.Screen name="Home" component={MyTabs} options={{
                  drawerIcon: ({ focused, color, size }) => (
                    <Ionicons name={focused ? 'home' : 'home-outline'} size={size} color={color} />
                  ),
                  headerRight: ({ color, size }) => (
                    <Circle size="40px" bg="darkBlue.100" marginRight={2}>
                      <Box _text={{
                        fontWeight: "bold",
                        fontSize: "lg",
                        color: "violet.900"}}>{getFirstLetter()}</Box>
                    </Circle>
                  )
                }}/>
                <Drawer.Screen name="MyCartStack" component={MyCartStack}  options={{
                  drawerIcon: ({ focused, color, size }) => (
                    <Ionicons name={focused ? 'cart' : 'cart-outline'} size={size} color={color} />
                  ),
                }}/>
                <Drawer.Screen name="Account" component={MyAccount} options={{
                  drawerIcon: ({ focused, color, size }) => (
                    <Ionicons name={focused ? 'person' : 'person-outline'} size={size} color={color} />
                  ),
                }}/>
                <Drawer.Screen name="LoginScreen" component={LoginScreen} options={{
                  drawerItemStyle:({display:'none'})
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
