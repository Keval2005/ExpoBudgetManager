import { Text, View, ScrollView, Image, Alert } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import images from "../constants/images";
import AsyncStorage from "@react-native-async-storage/async-storage";
import FormField from "../components/FormField";
import { useState } from "react";
import "../global.css";
import { Picker } from "@react-native-picker/picker";
import axios from "axios";

import CustomButton from "../components/CustomButton";

const RegisterScreen = ({ navigation }) => {

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    currencyCode: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreateUser = async () => {
    try {
      
      if (!form.username || !form.email || !form.password || !form.currencyCode) {
        Alert.alert("Error", "All fields are required");
        return;
      }

      setIsSubmitting(true);

      
      const users = {
        username: form.username,
        email: form.email,
        password: form.password,
        currencyCode: form.currencyCode,
      };

      console.log("Sending request to create user:", users);
      const response = await axios.post(
        "https://expobudgetmanager.onrender.com/users",
        users,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("User created:", response.data);
      
      await AsyncStorage.setItem("userId", response.data.user._id);
      
      setForm({
        username: "",
        email: "",
        password: "",
        currencyCode: "",
      });

      //navigation.replace("Main");

    } catch (error) {
      setIsSubmitting(false);
      const errorMessage = error.response?.data?.message || error.message || "Failed to create user";
      Alert.alert("Error", errorMessage);
      console.error("Error:", errorMessage);
      console.error("Error Details:", JSON.stringify(error, null, 2));
      if (error.response?.status === 404) {
        Alert.alert(
          "Server Error",
          "User creation endpoint not found. Please ensure the backend is correctly configured."
        );
      }
    }
  };

  return (
    <SafeAreaView className="bg-primary h-full justify-center">
      <ScrollView>
        <View className="justify-center w-full min-h-[83vh] px-5 my-6">
          
          <Text className="text-3xl py-1 text-emerald-500 text-bold mt-10 font-psemibold">
            Sign Up to Budget Manager
          </Text>

          <FormField
            title="Username"
            value={form.username}
            handleChangeText={(e) => setForm({ ...form, username: e })}
            otherStyles="mt-10"
          />

          <FormField
            title="Email"
            value={form.email}
            handleChangeText={(e) => setForm({ ...form, email: e })}
            otherStyles="mt-7"
            keyBoardType="email-address"
          />
          <FormField
            title="Password"
            value={form.password}
            handleChangeText={(e) => setForm({ ...form, password: e })}
            otherStyles="mt-7"
            isPassword={true}
          />

          <View className="mt-7">
            <Text className="text-base text-slate-700 font-pmedium mb-1.5">
              Preferred Currency
            </Text>
            <View className="w-full h-16 rounded-2xl border-2 border-blue-500">
              <Picker
                selectedValue={form.role}
                onValueChange={(value) => setForm({ ...form, currencyCode: value })}
                style={{ color: "#111827" }}
                dropdownIconColor="#808080"
              >
                <Picker.Item label="Rupees" value="₹" />
                <Picker.Item label="Dollor" value="$" />
              </Picker>
            </View>
          </View>

          <CustomButton
            title="Sign Up"
            handlePress={handleCreateUser}
            containerStyles="mt-7"
            isLoading={isSubmitting}
          />

          <View className="flex-row justify-center pt-5 gap-2">
            <Text className="text-lg font-pregular text-emerald-500">
              Have an account already?
            </Text>
            <Text
              style={{ fontSize: 15, paddingTop:3 ,color: "#60A5FA", fontWeight: "bold" }}
              onPress={() => navigation.navigate("Login")}
            >
              Login
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default RegisterScreen;
