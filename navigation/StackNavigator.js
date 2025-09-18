import React, { useState, useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Ionicons from "react-native-vector-icons/Ionicons";

import HomeScreen from "../screens/HomeScreen";
import StatsScreen from "../screens/StatsScreen";
import ProfileScreen from "../screens/ProfileScreen";
import CreateExpense from "../screens/CreateExpense";
import LoginScreen from "../screens/LoginScreen";

const StackNavigator = () => {
  const Stack = createNativeStackNavigator();
  const Tab = createBottomTabNavigator();

  const [loading, setLoading] = useState(true);
  const [userLoggedIn, setUserLoggedIn] = useState(false);

  useEffect(() => {
    const checkUser = async () => {
      const userId = await AsyncStorage.getItem("userId");
      setUserLoggedIn(!!userId);
      setLoading(false);
    };
    checkUser();
  }, []);

  function BottomTabs() {
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

  function MainStack() {
    return (
      <Stack.Navigator>
        {!userLoggedIn ? (
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{ headerShown: false }}
          />
        ) : null}

        <Stack.Screen
          name="Main"
          component={BottomTabs}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="Create"
          component={CreateExpense}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    );
  }

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#E97451" />
      </View>
    );
  }

  return <MainStack />; // do NOT wrap with NavigationContainer here
};

export default StackNavigator;
