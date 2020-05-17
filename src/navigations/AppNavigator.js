import React,{ useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { isAuthenticated } from '@okta/okta-react-native';

import Home from '../pages/Home';
import Detail from '../pages/Detail';
import Settings from '../pages/Settings';
//import Profile from '../pages/Profile';

import Movies from '../pages/Movies';
import Showtimes from '../pages/Showtimes';
import Bookings from '../pages/Bookings';
import BookingTickets from '../pages/BookingTickets';
import Signin from '../pages/Signin.js';
import Signup from '../pages/Signup.js';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function getHeaderTitle(route) {
  const routeName = route.state
    ? route.state.routes[route.state.index].name
    : route.params?.screen || 'Home'

  switch (routeName) {
    case 'Home':
      return 'Home'
    case 'Movies':
      return 'Movies'
    case 'Showtimes':
      return 'Showtimes'
    case 'Bookings':
      return 'Bookings'
    case 'BookingTickets':
      return 'BookingTickets'
    case 'Signin':
      return 'Signin'
  }
}

function MainTabNavigator() {
  return (
    <Tab.Navigator
      tabBarOptions={{
        activeTintColor: '#101010',
        style: {
          backgroundColor: '#ffd700'
        }
      }}
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName
          if (route.name == 'Home') {
            iconName = 'ios-home'
          } else if (route.name == 'Movies') {
            iconName = 'ios-videocam'
          } else if (route.name == 'Showtimes') {
            iconName = 'logo-youtube'
          } else if (route.name == 'Signin') {
            iconName = 'ios-log-in'
          }

          return <Ionicons name={iconName} color={color} size={size} />
        }
      })}>
      <Tab.Screen name='Home' component={Home} />
      <Tab.Screen name='Movies' component={Movies} />
      <Tab.Screen name='Showtimes' component={Showtimes} />
      <Tab.Screen name='Signin' component={Signin} />
    </Tab.Navigator>
  )
}

function MainStackNavigator() {
  const [progress, setProgress] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuthStatus = async () => {
      const { authenticated } = await isAuthenticated();
      console.log(authenticated);
      setAuthenticated(authenticated);
      setProgress(false);
    }

    setProgress(true);
    checkAuthStatus();
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName='Home'
        screenOptions={{
          gestureEnabled: true,
          headerStyle: {
            backgroundColor: '#101010'
          },
          headerTitleStyle: {
            fontWeight: 'bold'
          },
          headerTintColor: '#ffd700',
          headerBackTitleVisible: false
        }}
        headerMode='float'>
        <Stack.Screen
          name='Home'
          component={MainTabNavigator}
          options={({ route }) => ({
            headerTitle: getHeaderTitle(route)
          })}
        />
        <Stack.Screen
          name='Detail'
          component={Detail}
          options={({ route }) => ({
            title: route.params.item.name
          })}
        />
        <Stack.Screen
          name='Bookings'
          component={Bookings}
          options={({ route }) => ({
            title: route.params.item.name
          })}
        />
        <Stack.Screen
          name='BookingTickets'
          component={BookingTickets}
          options={({ route }) => ({
            title: route.params.item.name
          })}
        />
        <Stack.Screen
          name='Settings'
          component={Settings}
          options={{ title: 'Settings' }}
        />

        <Stack.Screen
          name="Signin"
          component={Signin}
          options={({ route }) => ({
            headerTitle: getHeaderTitle(route)
          })}
        />
        <Stack.Screen
          name='Signup'
          component={Signup}
          options={{ title: 'Signup' }}
        />

      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default MainStackNavigator;
