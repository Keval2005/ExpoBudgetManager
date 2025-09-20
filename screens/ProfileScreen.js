import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, Image, TouchableOpacity, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import axios from "axios";
import CustomButton from "../components/CustomButton";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import Ionicons from "react-native-vector-icons/Ionicons";
import "../global.css";

const ProfileScreen = () => {
  const [user, setUser] = useState({
    name: "John Doe",
    email: "johndoe@example.com",
    currencyCode: "₹",
  });
  const [stats, setStats] = useState({ income: 0, expenses: 0 });
  const [loading, setLoading] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const navigation = useNavigation();

  useEffect(() => {
    fetchUserData();
    fetchUserStats();
  }, []);

  const fetchUserData = async () => {
    try {
      const userId = await AsyncStorage.getItem("userId");
      if (userId) {
        const response = await axios.get(
          `https://expobudgetmanager.onrender.com/users/${userId}`
        );
        setUser(response.data);
      }
    } catch (error) {
      console.log("Error fetching user data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserStats = async () => {
    try {
      const userId = await AsyncStorage.getItem("userId");
      if (userId) {
        const response = await axios.get(
          `https://expobudgetmanager.onrender.com/expenses?userId=${userId}`
        );
        
        const expenses = response.data || [];
        const totalIncome = expenses
          .filter(expense => expense.type === 'Income')
          .reduce((sum, expense) => sum + (expense.amount || 0), 0);
        const totalExpenses = expenses
          .filter(expense => expense.type === 'Expense')
          .reduce((sum, expense) => sum + (expense.amount || 0), 0);
        
        setStats({ income: totalIncome, expenses: totalExpenses });
      }
    } catch (error) {
      console.log("Error fetching stats:", error);
    }
  };

  const handleLogout = async () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Logout",
          style: "destructive",
          onPress: async () => {
            try {
              setIsLoggingOut(true);
              await AsyncStorage.removeItem("userId");
              
              
            } catch (error) {
              setIsLoggingOut(false);
              console.error("Error logging out:", error);
              Alert.alert("Error", "Failed to log out. Please try again.");
            }
          }
        }
      ]
    );
  };

  if (loading) {
    return (
      <SafeAreaView className="bg-primary h-full justify-center">
        <View className="flex-1 justify-center items-center">
          <Text className="text-lg text-emerald-500 font-pregular">Loading profile...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const renderDay = ({ item }) => {
    return (
      <Pressable
        onPress={() => {
          
          setCurrentDate(item.date);
          
          setFormattedDate(item.date.format("DD/MM/YY (ddd)"));
          
          setCalendarModalVisible(false);
        }}
        style={{ width: boxWidth, height: boxWidth }}
        className="items-center justify-center m-1 rounded-xl bg-white"
      >
        <Text className="text-gray-800 text-center">{item.date.format("D")}</Text>
      </Pressable>
    );
  };
  

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView className="flex-1">
        <View className="px-5 py-6">
          
          <Text className="text-3xl py-1 text-emerald-500 text-bold mt-5 font-psemibold">
            Profile
          </Text>

          
          <View className="bg-white rounded-2xl p-6 mt-8 shadow-lg">
            <View className="items-center">
              <View className="w-24 h-24 bg-emerald-100 rounded-full items-center justify-center mb-4">
                <Ionicons name="person" size={40} color="#10B981" />
              </View>
              <Text className="text-2xl font-psemibold text-gray-800 mb-2">
                {user.name}
              </Text>
              <Text className="text-base text-gray-600 font-pregular">
                {user.email}
              </Text>
              <View className="flex-row items-center mt-2">
                <Ionicons name="cash-outline" size={16} color="#10B981" />
                <Text className="text-sm text-gray-600 ml-1 font-pregular">
                  Currency: {user.currencyCode || "₹"}
                </Text>
              </View>
            </View>
          </View>

          <View className="flex-row justify-between mt-6">
            <View className="flex-1 bg-emerald-500 rounded-2xl p-4 mr-2">
              <View className="items-center">
                <Ionicons name="trending-up" size={24} color="white" />
                <Text className="text-white text-sm font-pregular mt-2">
                  Total Income
                </Text>
                <Text className="text-white text-xl font-psemibold mt-1">
                  {user.currencyCode || "₹"}{stats.income.toLocaleString()}
                </Text>
              </View>
            </View>

            <View className="flex-1 bg-red-500 rounded-2xl p-4 ml-2">
              <View className="items-center">
                <Ionicons name="trending-down" size={24} color="white" />
                <Text className="text-white text-sm font-pregular mt-2">
                  Total Expenses
                </Text>
                <Text className="text-white text-xl font-psemibold mt-1">
                  {user.currencyCode || "₹"}{stats.expenses.toLocaleString()}
                </Text>
              </View>
            </View>
          </View>

          <View className="bg-blue-500 rounded-2xl p-6 mt-4">
            <View className="items-center">
              <Ionicons name="wallet" size={28} color="white" />
              <Text className="text-white text-lg font-pregular mt-2">
                Current Balance
              </Text>
              <Text className="text-white text-2xl font-psemibold mt-1">
                {user.currencyCode || "₹"}{(stats.income - stats.expenses).toLocaleString()}
              </Text>
            </View>
          </View>

          <View className="mt-6">
            <Text className="text-lg font-psemibold text-gray-800 mb-4">
              Quick Actions
            </Text>
            
            <View className="bg-white rounded-2xl p-4 shadow-lg">
              <TouchableOpacity className="flex-row items-center py-3 border-b border-gray-100">
                <Ionicons name="settings-outline" size={24} color="#6B7280" />
                <Text className="text-base font-pregular text-gray-700 ml-3">
                  Settings
                </Text>
                <Ionicons name="chevron-forward" size={20} color="#9CA3AF" className="ml-auto" />
              </TouchableOpacity>
              
              <TouchableOpacity className="flex-row items-center py-3 border-b border-gray-100">
                <Ionicons name="help-circle-outline" size={24} color="#6B7280" />
                <Text className="text-base font-pregular text-gray-700 ml-3">
                  Help & Support
                </Text>
                <Ionicons name="chevron-forward" size={20} color="#9CA3AF" className="ml-auto" />
              </TouchableOpacity>
              
              <TouchableOpacity className="flex-row items-center py-3">
                <Ionicons name="information-circle-outline" size={24} color="#6B7280" />
                <Text className="text-base font-pregular text-gray-700 ml-3">
                  About
                </Text>
                <Ionicons name="chevron-forward" size={20} color="#9CA3AF" className="ml-auto" />
              </TouchableOpacity>
            </View>
          </View>

          <CustomButton
            title="Logout"
            handlePress={handleLogout}
            containerStyles="mt-8 mb-6"
            isLoading={isLoggingOut}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfileScreen;
