import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';

// Import screens
import Profile from '../../screens/profile/profile_page';
import Login from '../../screens/login/login';
import PhoneVerification from '../../screens/login/phoneVerification';
import RidesHome from '../../screens/rides/ridesHome';
import RideDetails from '../../screens/rides/allRidesList';
import RidesSignUp from '../../screens/rides/ridesSignUp';
import DriverHome from '../../screens/rides/driverHome';
import PassengerHome from '../../screens/rides/passengerHome';
import Chat from '../../screens/chat/chat';
import AdminHome from '../../screens/admin/adminhome';
import RidesNotReleased from '../../screens/rides/ridesNotReleased';

const Drawer = createDrawerNavigator();

// define all screens
const allScreens = [
  { name: 'Login', component: Login, icon: 'person' },
  { name: 'Phone Verification', component: PhoneVerification, icon: 'call' },
  { name: 'Profile', component: Profile, icon: 'person' },
  { name: 'Rides', component: RidesHome, icon: 'car' },
  { name: 'Ride Details', component: RideDetails, icon: 'car-sport' },
  { name: 'Rides SignUp', component: RidesSignUp, icon: 'car-sport' },
  { name: 'Driver Home', component: DriverHome, icon: 'car-sport' },
  { name: 'Passenger Home', component: PassengerHome, icon: 'car-sport' },
  { name: 'Chat', component: Chat, icon: 'chatbubbles' },
  { name: 'Admin Home', component: AdminHome, icon: 'home' },
  { name: 'Rides Not Released', component: RidesNotReleased, icon: 'home' },
];

// visible screens
const visibleScreenNames = ['Rides', 'Admin Home'];
const hideDrawerScreens = ['Login', 'Phone Verification'];

// navigator
const DrawerNavigator = () => {
  return (
    <Drawer.Navigator initialRouteName="Login">
      {allScreens.map((screen) => (
        <Drawer.Screen
          key={screen.name}
          name={screen.name}
          component={screen.component}
          options={{
            drawerIcon: ({ color }) => (
              <Ionicons name={screen.icon} size={22} color={color} />
            ),
            // hide drawer completely for login screens
            swipeEnabled: !hideDrawerScreens.includes(screen.name), 
            headerShown: !hideDrawerScreens.includes(screen.name),
            // Hide screen if not in the visible list
            drawerItemStyle: visibleScreenNames.includes(screen.name)
              ? undefined
              : { display: 'none' },
          }}
        />
      ))}
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;
