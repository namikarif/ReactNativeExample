import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Image} from 'react-native';
import Login from '../Auth/Screens/Login';
import Questions from '../Main/Screens/Questions';
import Register from "../Auth/Screens/Register";
import {colors} from "../../constants/colors";
import ProfilePage from "../Main/Screens/Profile";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function Dashboard() {
    return (<Stack.Navigator screenOptions={({route}) => ({
            animation: 'slide_from_right',
            headerShown: false,
        })}>
            <Stack.Screen name="Questions"
                          component={Questions}/>

        </Stack.Navigator>
    );
}

function Profile() {
    return (<Stack.Navigator screenOptions={({route}) => ({
            animation: 'slide_from_right',
            headerShown: false,
        })}>
            <Stack.Screen name="Profile"
                          component={ProfilePage}/>

        </Stack.Navigator>
    );
}


function MainTabs() {
    return (<Tab.Navigator
        screenOptions={({route, navigation}) => ({
            tabBarIcon: ({focused, color, size}) => {
                let tabIcon;
                if (route.name === 'Dashboard') {
                    tabIcon = focused ? require('../../assets/icons/tab/dashboard-active.png') : require('../../assets/icons/tab/dashboard.png');
                } else if (route.name === 'Profile') {
                    tabIcon = focused ? require('../../assets/icons/tab/profile-active.png') : require('../../assets/icons/tab/profile.png');
                }
                return <Image source={tabIcon} style={{height: 24, width: 24}}/>;
            },
            tabBarActiveTintColor: colors.main,
            tabBarInactiveTintColor: '#646464',
            headerShown: false
        })}
        tabBarOptions={{
            keyboardHidesTabBar: true,
            style: {
                position: 'absolute',
            },
            // showLabel: false
        }}>
        <Tab.Screen name="Dashboard"
                    component={Dashboard}
                    options={{tabBarLabel: 'Questions'}}/>
        <Tab.Screen name="Profile"
                    component={Profile}/>
    </Tab.Navigator>);
}

export default () => (<NavigationContainer>
    <Stack.Navigator screenOptions={({route}) => ({headerShown: false})}>
        <Stack.Screen name="Login"
                      component={Login}
                      screenOptions={({route}) => ({animation: 'slide_from_right'})}/>
        <Stack.Screen name="MainTabs"
                      component={MainTabs}
                      screenOptions={({route}) => ({animation: 'slide_from_right'})}/>
        <Stack.Screen name="Register"
                      component={Register}
                      screenOptions={({route}) => ({animation: 'slide_from_right'})}/>
    </Stack.Navigator>
</NavigationContainer>);
