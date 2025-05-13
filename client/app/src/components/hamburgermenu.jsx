import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';

// first import the screens
import HomeScreen from '../../screens/homescreen/homescreen';
import Profile from '../../screens/profile/profile_page';
import Login from '../../screens/login/login';
import RidesHome from '../../screens/rides/ridesHome';
import RideDetails from '../../screens/rides/allRidesList';
import RidesSignUp from '../../screens/rides/ridesSignUp';
import Chat from '../../screens/chat/chat';

const Drawer = createDrawerNavigator();

// then add it to the array
const screens = [
  { name: 'Home', component: HomeScreen, icon: 'home' },
  { name: 'Profile', component: Profile, icon: 'person'},
  { name: 'Login', component: Login, icon: 'person'},
  { name: 'Rides', component: RidesHome, icon: 'car'},
  { name: 'Ride Details', component: RideDetails, icon: 'car-sport'},
  { name: 'Rides SignUp', component: RidesSignUp, icon: 'car-sport'},
  { name: 'Chat', component: Chat, icon: 'chatbubbles'}
];

// creates the navigation
const DrawerNavigator = () => {
  return (
    <Drawer.Navigator initialRouteName="Home">
      {screens.map((screen) => (
        <Drawer.Screen
          key={screen.name}
          name={screen.name}
          component={screen.component}
          options={{
            drawerIcon: ({ color }) => (
              <Ionicons name={screen.icon} size={22} color={color} />
            ),
          }}
        />
      ))}
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;