import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import StatsScreen from '../screens/StatsScreen';
import AccountsScreen from '../screens/AccountsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import {NavigationContainer} from '@react-navigation/native';
import Ionicons from '@react-native-vector-icons/ionicons';
import HomeScreen from '../screens/HomeScreen';
import CreateExpense from '../screens/CreateExpense';

const StackNavigator = () => {
  const Stack = createNativeStackNavigator();
  const Tab = createBottomTabNavigator();
  function BottomTabs() {
    return (
      <Tab.Navigator
        screenOptions={() => ({
          tabBarShowLabel: false,
          tabBarStyle: {height: 60},
        })}>
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{
            headerShown: false,
            tabBarIcon: ({focused}) =>
              focused ? (
                <Ionicons
                  style={{paddingTop: 3}}
                  name="shuffle-outline"
                  size={30}
                  color={'#E97451'}
                />
              ) : (
                <Ionicons
                  style={{paddingTop: 3}}
                  name="shuffle-outline"
                  size={30}
                  color={'#A0A0A0'}
                />
              ),
          }}
        />

        <Tab.Screen
          name="Stats"
          component={StatsScreen}
          options={{
            headerShown: false,
            tabBarIcon: ({focused}) =>
              focused ? (
                <Ionicons
                  name="bar-chart-outline"
                  style={{paddingTop: 3}}
                  size={30}
                  color={'#E97451'}
                />
              ) : (
                <Ionicons
                  name="bar-chart-outline"
                  style={{paddingTop: 3}}
                  size={30}
                  color={'#A0A0A0'}
                />
              ),
          }}
        />

        {/* <Tab.Screen
          name="Accounts"
          component={AccountsScreen}
          options={{
            headerShown: false,
            tabBarIcon: ({focused}) =>
              focused ? (
                <Ionicons
                  name="card-outline"
                  style={{paddingTop: 3}}
                  size={30}
                  color={'#E97451'}
                />
              ) : (
                <Ionicons
                  name="card-outline"
                  style={{paddingTop: 3}}
                  size={30}
                  color={'#A0A0A0'}
                />
              ),
          }}
        /> */}

        <Tab.Screen
          name="Profile"
          component={ProfileScreen}
          options={{
            headerShown: false,
            tabBarIcon: ({focused}) =>
              focused ? (
                <Ionicons
                  name="person-circle-outline"
                  style={{paddingTop: 3}}
                  size={30}
                  color={'#E97451'}
                />
              ) : (
                <Ionicons
                  name="person-circle-outline"
                  style={{paddingTop: 3}}
                  size={30}
                  color={'#A0A0A0'}
                />
              ),
          }}
        />
      </Tab.Navigator>
    );
  }

  function MainStack() {
    return (
      <Stack.Navigator>
        <Stack.Screen
          name="Main"
          component={BottomTabs}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Create"
          component={CreateExpense}
          options={{headerShown: false}}
        />
      </Stack.Navigator>
    );
  }

  return (
    //<NavigationContainer>
      <MainStack />
    //</NavigationContainer>
  );
};

export default StackNavigator;

const styles = StyleSheet.create({});
