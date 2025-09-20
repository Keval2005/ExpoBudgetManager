import { Text, View, ScrollView, Image, Alert } from "react-native";
import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import images from "../constants/images";
import AsyncStorage from "@react-native-async-storage/async-storage";
import FormField from "../components/FormField";
import "../global.css";
import axios from "axios";
import CustomButton from "../components/CustomButton";

const LoginScreen = ({ navigation }) => {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    checkLoggedInUser();
  }, []);

  const checkLoggedInUser = async () => {
    try {
      const userId = await AsyncStorage.getItem("userId");
      if (userId) {
        // The RootLayout will automatically show MainTabs when userLoggedIn is true
      }
    } catch (error) {
      console.log("Error checking logged-in user:", error);
    }
  };

  const handleLogin = async () => {
    try {
      
      if (!form.email || !form.password) {
        Alert.alert("Error", "All fields are required");
        return;
      }

      setIsSubmitting(true);

      console.log("Attempting login with:", { email: form.email, password: form.password });

      const response = await axios.get(
        "https://expobudgetmanager.onrender.com/users",
        {
          params: { email: form.email, password: form.password },
        }
      );

      console.log("Login response:", response.data);

      if (!response.data || !response.data.userId) {
        setIsSubmitting(false);
        Alert.alert("Login Failed", "Invalid email or password");
        return;
      }

      const userId = response.data.userId;

      await AsyncStorage.setItem("userId", userId);

      setForm({
        email: "",
        password: "",
      });

      setIsSubmitting(false);
      
    } catch (error) {
      setIsSubmitting(false);
      console.error("Login error:", error);
      console.error("Error response:", error.response?.data);
      
      const errorMessage = error.response?.data?.message || error.message || "Failed to login";
      Alert.alert("Error", errorMessage);
    }
  };

  return (
    <SafeAreaView className="bg-primary h-full justify-center">
      <ScrollView>
        <View className="justify-center w-full min-h-[83vh] px-5 my-6">
          <Text className="text-3xl py-1 text-emerald-500 text-bold mt-10 font-psemibold">
            Welcome Back to Budget Manager
          </Text>

          <FormField
            title="Email"
            value={form.email}
            handleChangeText={(e) => setForm({ ...form, email: e })}
            otherStyles="mt-10"
            keyBoardType="email-address"
          />

          <FormField
            title="Password"
            value={form.password}
            handleChangeText={(e) => setForm({ ...form, password: e })}
            otherStyles="mt-7"
            isPassword={true}
          />

          <CustomButton
            title="Sign In"
            handlePress={handleLogin}
            containerStyles="mt-7"
            isLoading={isSubmitting}
          />

          <View className="flex-row justify-center pt-5 gap-2">
            <Text className="text-lg font-pregular text-emerald-500">
              Don't have an account?
            </Text>
            <Text
              style={{ fontSize: 15, paddingTop: 3, color: "#60A5FA", fontWeight: "bold" }}
              onPress={() => navigation.navigate("Register")}
            >
              Sign Up
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default LoginScreen;
