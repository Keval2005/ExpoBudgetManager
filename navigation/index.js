import React, { useState, useEffect } from "react";
import { View, ActivityIndicator } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Stack, Tabs, router, useRootNavigationState } from "expo-router";
import Ionicons from "react-native-vector-icons/Ionicons";

import HomeScreen from "../screens/HomeScreen";
import StatsScreen from "../screens/StatsScreen";
import ProfileScreen from "../screens/ProfileScreen";
import CreateExpense from "../screens/CreateExpense";
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";

export default function RootLayout() {
  const [loading, setLoading] = useState(true);
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const navigationState = useRootNavigationState();

  useEffect(() => {
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
    checkUser();
  }, []);

  useEffect(() => {
    if (!navigationState?.key || loading) return;
    if (userLoggedIn) {
      router.push("/home");
    } else {
      router.push("/login");
    }
  }, [userLoggedIn, loading, navigationState?.key]);

  if (loading || !navigationState?.key) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#E97451" />
      </View>
    );
  }

  return userLoggedIn ? (
    <>
      <Tabs
        screenOptions={{
          tabBarShowLabel: false,
          tabBarStyle: { height: 60 },
        }}
      >
        <Tabs.Screen
          name="home"
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
            href: "/home",
          }}
        >
          {() => <HomeScreen />}
        </Tabs.Screen>
        <Tabs.Screen
          name="stats"
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
            href: "/stats",
          }}
        >
          {() => <StatsScreen />}
        </Tabs.Screen>
        <Tabs.Screen
          name="profile"
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
            href: "/profile",
          }}
        >
          {() => <ProfileScreen />}
        </Tabs.Screen>
      </Tabs>
      <Stack>
        <Stack.Screen
          name="create"
          options={{ headerShown: false }}
          component={CreateExpense}
        />
      </Stack>
    </>
  ) : (
    <Stack>
      <Stack.Screen
        name="login"
        options={{ headerShown: false }}
        component={LoginScreen}
      />
      <Stack.Screen
        name="register"
        options={{ headerShown: false }}
        component={RegisterScreen}
      />
    </Stack>
  );
}