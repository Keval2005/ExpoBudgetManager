import React, { useState, useEffect } from "react";
import { View, ActivityIndicator, AppState } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "react-native-vector-icons/Ionicons";

import HomeScreen from "../screens/HomeScreen";
import StatsScreen from "../screens/StatsScreen";
import ProfileScreen from "../screens/ProfileScreen";
import CreateExpense from "../screens/CreateExpense";
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarShowLabel: false,
        tabBarStyle: { height: 60 },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <Ionicons
              style={{ paddingTop: 3 }}
              name="shuffle-outline"
              size={30}
              color={focused ? "#E97451" : "#A0A0A0"}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Stats"
        component={StatsScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <Ionicons
              style={{ paddingTop: 3 }}
              name="bar-chart-outline"
              size={30}
              color={focused ? "#E97451" : "#A0A0A0"}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <Ionicons
              style={{ paddingTop: 3 }}
              name="person-circle-outline"
              size={30}
              color={focused ? "#E97451" : "#A0A0A0"}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default function RootLayout() {
  const [loading, setLoading] = useState(true);
  const [userLoggedIn, setUserLoggedIn] = useState(false);

  const checkUser = async () => {
    try {
      const userId = await AsyncStorage.getItem("userId");
      setUserLoggedIn(!!userId);
      setLoading(false);
    } catch (error) {
      console.error("Error checking user:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    checkUser();
  }, []);

  // Listen for app state changes to re-check authentication
  useEffect(() => {
    const handleAppStateChange = (nextAppState) => {
      if (nextAppState === 'active') {
        checkUser();
      }
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);
    return () => subscription?.remove();
  }, []);

  // Also check periodically to catch logout from other screens
  useEffect(() => {
    const interval = setInterval(() => {
      checkUser();
    }, 2000); // Check every 2 seconds

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#E97451" />
      </View>
    );
  }

  return userLoggedIn ? (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MainTabs" component={TabNavigator} />
      <Stack.Screen name="Create" component={CreateExpense} />
    </Stack.Navigator>
  ) : (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  );
}