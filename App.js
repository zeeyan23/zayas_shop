import 'react-native-gesture-handler';
import { useState, useEffect } from "react";
import { View, Text } from 'react-native';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { IconButton, NativeBaseProvider, VStack ,Button} from 'native-base';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { createStackNavigator } from '@react-navigation/stack';
import MyCart from './components/Screens/MyCart';
import AllProducts from './components/AllProducts';
import Badge from './utils/Badge';
import { Provider, useSelector } from 'react-redux';
// import store from './src/redux/store';
import { UserProvider } from './src/Context/CartContext';
import initializeStore from './src/redux/store';
import AllFavorites from './components/AllFavorites';

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


  return (
    <UserProvider>
    <Provider store={store}>
      <NativeBaseProvider>
        <NavigationContainer>
          <Drawer.Navigator initialRouteName="Home">
            <Drawer.Screen name="Home" component={MyTabs} />
            <Drawer.Screen name="NotificationsDrawer" component={NotificationsScreen} />
            <Drawer.Screen name="MyCartStack" component={MyCartStack} />
          </Drawer.Navigator>
        </NavigationContainer>
      </NativeBaseProvider>
    </Provider>
    </UserProvider>
  );
}

function MyCartStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Your Cart Items" component={MyCart}/>
    </Stack.Navigator>
  );
}
