import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  Pressable,
  TextInput,
  TouchableOpacity,
  Dimensions,
  Alert,
} from "react-native";
import Ionicons from "@react-native-vector-icons/ionicons";
import MaterialDesignIcons from "@react-native-vector-icons/material-design-icons";
import moment from "moment";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CustomButton from "../components/CustomButton";
import "../global.css";
import Modal from "react-native-modal";

const CreateExpense = () => {
  const navigation = useNavigation();
  const [option, setOption] = useState("Income");
  const [currentDate, setCurrentDate] = useState(moment());
  const [formattedDate, setFormattedDate] = useState(currentDate.format("DD/MM/YY (ddd)"));
  const [selectedDate, setSelectedDate] = useState(moment());
  const [note, setNote] = useState("");
  const [category, setCategory] = useState("");
  const [account, setAccount] = useState("");
  const [showCalculator, setShowCalculator] = useState(false);
  const [showCategory, setShowCategory] = useState(false);
  const [showAccount, setShowAccount] = useState(false);
  const [amount, setAmount] = useState("");
  const [input, setInput] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userId, setUserId] = useState(null);
  const [calendarModalVisible, setCalendarModalVisible] = useState(false);

  useEffect(() => {
    getUserId();
  }, []);

  const getUserId = async () => {
    try {
      const storedUserId = await AsyncStorage.getItem("userId");
      setUserId(storedUserId);
    } catch (error) {
      console.error("Error getting userId:", error);
    }
  };

  const items = [
    "Food",
    "Social Life",
    "Pets",
    "Transport",
    "Culture",
    "Household",
    "Apparel",
    "Beauty",
    "Health",
    "Education",
    "Gift",
    "Other",
    "Leisure",
    "Bills",
  ];

  const newItems = [
    "Allowance",
    "Salary",
    "Petty Cash",
    "Bonus",
    "Other",
    "Add",
  ];

  const displayedItems = option === "Income" ? newItems : items;

  const setShowCalculatorStatus = () => {
    setShowAccount(false);
    setShowCategory(false);
    setShowCalculator(!showCalculator);
  };

  const setCategoryStatus = () => {
    setShowAccount(false);
    setShowCalculator(false);
    setShowCategory(true);
  };

  const selectCategory = (option) => {
    setCategory(option);
    setShowCategory(false);
  };

  const setAccountStatus = () => {
    setShowCalculator(false);
    setShowCategory(false);
    setShowAccount(true);
  };

  const selectAccount = (option) => {
    setAccount(option);
    setShowAccount(false);
  };

  const accounts = ["Cash", "Bank Accounts", "Card"];

  const handlePress = (value) => {
    if (value == "OK") {
      setShowCalculator(false);
      return;
    }
    if (value == "=") {
      try {
        setInput(eval(input).toString());
      } catch (error) {
        console.log("err", error);
      }
    } else if (value == "C") {
      setInput("");
    } else {
      setInput(input + value);
    }
  };

  const handlePrevMonth = () => {
    const newDate = moment(currentDate).subtract(1, "month");
    setCurrentDate(newDate);
    if (!selectedDate.isSame(newDate, "month")) {
      setSelectedDate(newDate.clone().startOf("month"));
    }
  };

  const generateDaysForMonth = (month) => {
    const startOfMonth = month.clone().startOf("month");
    const endOfMonth = month.clone().endOf("month");
    const startDate = startOfMonth.clone().startOf("week");
    const endDate = endOfMonth.clone().endOf("week");

    const days = [];
    let date = startDate.clone();

    while (date.isBefore(endDate, "day")) {
      days.push({
        date: date.clone(),
        isCurrentMonth: date.month() === month.month(),
      });
      date.add(1, "day");
    }

    return days;
  };

  const days = generateDaysForMonth(currentDate);
    
  const renderDay = ({ item }) => {
    return (
      <Pressable
        onPress={() => {
          // Set the current date to selected day
          setCurrentDate(item.date);
          // Update formattedDate
          setFormattedDate(item.date.format("DD/MM/YY (ddd)"));
          // Close calendar modal
          setCalendarModalVisible(false);
        }}
        style={{ width: boxWidth, height: boxWidth }}
        className="items-center justify-center m-1 rounded-xl bg-white"
      >
        <Text className="text-gray-800 text-center">{item.date.format("D")}</Text>
      </Pressable>
    );
  };

  const screenWidth = Dimensions.get("window").width;
  const boxWidth = (screenWidth - 140) / 7;

  const handleNextMonth = () => {
    const newDate = moment(currentDate).add(1, "month");
    setCurrentDate(newDate);
    if (!selectedDate.isSame(newDate, "month")) {
      setSelectedDate(newDate.clone().startOf("month"));
    }
  };

  const handleCreateExpense = async () => {
    try {
      
      if (!input || !category || !account || !note) {
        Alert.alert("Error", "Please fill in all required fields");
        return;
      }

      if (!userId) {
        Alert.alert("Error", "User not authenticated. Please login again.");
        return;
      }

      setIsSubmitting(true);

      const expense = {
        userId: userId,
        type: option,
        description: description,
        account: account,
        category: category,
        amount: parseFloat(input),
        date: currentDate.format("DD MMMM YYYY ddd"),
        note: note,
      };

      console.log("Creating expense:", expense);

      const response = await axios.post(
        "https://expobudgetmanager.onrender.com/expenses",
        expense,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Expense created:", response.data);

      
      setOption("Income");
      setDescription("");
      setAccount("");
      setCategory("");
      setInput("");
      setNote("");
      setAmount("");

      setIsSubmitting(false);
      Alert.alert("Success", "Transaction saved successfully!", [
        {
          text: "OK",
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (error) {
      setIsSubmitting(false);
      console.error("Error creating expense:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to save transaction";
      Alert.alert("Error", errorMessage);
    }
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView className="flex-1 mt-10">
        <View className="px-5 py-6">
          
          <View className="flex-row items-center justify-between mb-6">
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back" size={24} color="#10B981" />
            </TouchableOpacity>
            <Text className="text-2xl font-psemibold text-emerald-500">
              Add Transaction
            </Text>
            <View style={{ width: 24 }} />
          </View>

          {/* Transaction Type Selector */}
          <View className="bg-white rounded-2xl p-4 mb-4 shadow-lg">
            <Text className="text-lg font-psemibold text-gray-800 mb-4">
              Transaction Type
            </Text>
            <View className="flex-row justify-between">
              {["Income", "Expense"].map((type) => (
                <TouchableOpacity
                  key={type}
                  onPress={() => setOption(type)}
                  className={`flex-1 mx-1 py-3 px-4 rounded-xl ${
                    option === type
                      ? type === "Income"
                        ? "bg-emerald-500"
                        : type === "Expense"
                          ? "bg-red-500"
                          : "bg-blue-500"
                      : "bg-gray-100"
                  }`}
                >
                  <Text
                    className={`text-center font-psemibold ${
                      option === type ? "text-white" : "text-gray-600"
                    }`}
                  >
                    {type}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          
          <View className="space-y-2">
            <Pressable
              onPress={() => setCalendarModalVisible(true)}
              className="bg-white rounded-2xl p-4 mt-3 shadow-lg"
            >
              <Text className="text-base font-pregular text-gray-700 mb-2">
                Date
              </Text>
              <View className="flex-row items-center justify-between">
                <Text className="text-lg font-pregular text-gray-800">
                {formattedDate}
                </Text>
                <Ionicons name="calendar-outline" size={20} color="#6B7280" />
              </View>
            </Pressable>
            {/* Date Field */}

            {/* Amount Field */}
            <Pressable
              onPress={setShowCalculatorStatus}
              className="bg-white rounded-2xl p-4 mt-3 shadow-lg"
            >
              <Text className="text-base font-pregular text-gray-700 mb-2">
                Amount *
              </Text>
              <View className="flex-row items-center justify-between">
                <Text className="text-lg font-pregular text-gray-800">
                  {input || "Tap to enter amount"}
                </Text>
                <Ionicons name="calculator-outline" size={20} color="#6B7280" />
              </View>
            </Pressable>

            {/* Category Field */}
            <Pressable
              onPress={setCategoryStatus}
              className="bg-white rounded-2xl p-4 mt-3 shadow-lg"
            >
              <Text className="text-base font-pregular text-gray-700 mb-2">
                Category *
              </Text>
              <View className="flex-row items-center justify-between">
                <Text className="text-lg font-pregular text-gray-800">
                  {category || "Select category"}
                </Text>
                <Ionicons name="chevron-down" size={20} color="#6B7280" />
              </View>
            </Pressable>

            {/* Account Field */}
            <Pressable
              onPress={setAccountStatus}
              className="bg-white rounded-2xl p-4 mt-3 shadow-lg"
            >
              <Text className="text-base font-pregular text-gray-700 mb-2">
                Account *
              </Text>
              <View className="flex-row items-center justify-between">
                <Text className="text-lg font-pregular text-gray-800">
                  {account || "Select account"}
                </Text>
                <Ionicons name="chevron-down" size={20} color="#6B7280" />
              </View>
            </Pressable>

            

            {/* Note Field */}
            <View className="bg-white rounded-2xl p-4 mt-3 shadow-lg">
              <Text className="text-base font-pregular text-gray-700 mb-2">
                Note *
              </Text>
              <TextInput
                value={note}
                onChangeText={setNote}
                placeholder="Add a note"
                className="text-lg font-pregular text-gray-800"
                placeholderTextColor="#9CA3AF"
                multiline
                numberOfLines={3}
              />
            </View>

{/* Description Field */}
            <View className="bg-white rounded-2xl p-4 mt-3 shadow-lg">
              <Text className="text-base font-pregular text-gray-700 mb-2">
                Description (Optional)
              </Text>
              <TextInput
                value={description}
                onChangeText={setDescription}
                placeholder="Enter description"
                className="text-lg font-pregular text-gray-800"
                placeholderTextColor="#9CA3AF"
              />
            </View>
          </View>

          {/* Save Button */}
          <CustomButton
            title="Save Transaction"
            handlePress={handleCreateExpense}
            containerStyles="mt-8 mb-6"
            isLoading={isSubmitting}
          />
        </View>
      </ScrollView>

      
      {showCalculator && (
        <View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 1000,
            elevation: 1000,
          }}
        >
          <View
            style={{
              flex: 1,
              backgroundColor: "rgba(0,0,0,0.1)",
              justifyContent: "flex-end",
            }}
          >
            <View
              style={{
                backgroundColor: "white",
                borderTopLeftRadius: 24,
                borderTopRightRadius: 24,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: -5 },
                shadowOpacity: 0.25,
                shadowRadius: 10,
                elevation: 20,
              }}
            >
              <View className="flex-row items-center justify-between p-4 border-b border-gray-200">
                <Text className="text-lg font-psemibold text-gray-800">
                  Calculator
                </Text>
                <TouchableOpacity onPress={() => setShowCalculator(false)}>
                  <Ionicons name="close" size={24} color="#6B7280" />
                </TouchableOpacity>
              </View>
              <View className="p-4">
                <Text className="text-2xl font-psemibold text-gray-800 text-center mb-4">
                  {input || "0"}
                </Text>
                <View className="flex-row flex-wrap justify-center">
                  {[
                    "+",
                    "-",
                    "*",
                    "/",
                    "7",
                    "8",
                    "9",
                    "=",
                    "4",
                    "5",
                    "6",
                    "C",
                    "1",
                    "2",
                    "3",
                    "0",
                    "0",
                    "OK",
                  ].map((item, index) => (
                    <TouchableOpacity
                      key={index}
                      onPress={() => handlePress(item)}
                      className={`w-1/4 h-16 border border-gray-200 justify-center items-center ${
                        item === "=" ? "bg-emerald-500" : "bg-white"
                      }`}
                    >
                      <Text
                        className={`text-lg font-psemibold ${
                          item === "=" ? "text-white" : "text-gray-800"
                        }`}
                      >
                        {item}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>
          </View>
        </View>
      )}

     
      {showCategory && (
        <View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 1000,
            elevation: 1000,
          }}
        >
          <View
            style={{
              flex: 1,
              backgroundColor: "rgba(0,0,0,0.1)",
              justifyContent: "flex-end",
            }}
          >
            <View
              style={{
                backgroundColor: "white",
                borderTopLeftRadius: 24,
                borderTopRightRadius: 24,
                maxHeight: "60%",
                shadowColor: "#000",
                shadowOffset: { width: 0, height: -5 },
                shadowOpacity: 0.25,
                shadowRadius: 10,
                elevation: 20,
              }}
            >
              <View className="flex-row items-center justify-between p-4 border-b border-gray-200">
                <Text className="text-lg font-psemibold text-gray-800">
                  Select Category
                </Text>
                <TouchableOpacity onPress={() => setShowCategory(false)}>
                  <Ionicons name="close" size={24} color="#6B7280" />
                </TouchableOpacity>
              </View>
              <ScrollView className="p-4">
                <View className="flex-row flex-wrap">
                  {displayedItems?.map((item, index) => (
                    <TouchableOpacity
                      key={index}
                      onPress={() => selectCategory(item)}
                      className="w-1/3 p-3 border border-gray-200 justify-center items-center"
                    >
                      <Text className="text-base font-pregular text-gray-800 text-center">
                        {item}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
            </View>
          </View>
        </View>
      )}

      
      {showAccount && (
        <View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 1000,
            elevation: 1000,
          }}
        >
          <View
            style={{
              flex: 1,
              backgroundColor: "rgba(0,0,0,0.1)",
              justifyContent: "flex-end",
            }}
          >
            <View
              style={{
                backgroundColor: "white",
                borderTopLeftRadius: 24,
                borderTopRightRadius: 24,
                maxHeight: "60%",
                shadowColor: "#000",
                shadowOffset: { width: 0, height: -5 },
                shadowOpacity: 0.25,
                shadowRadius: 10,
                elevation: 20,
              }}
            >
              <View className="flex-row items-center justify-between p-4 border-b border-gray-200">
                <Text className="text-lg font-psemibold text-gray-800">
                  Select Account
                </Text>
                <TouchableOpacity onPress={() => setShowAccount(false)}>
                  <Ionicons name="close" size={24} color="#6B7280" />
                </TouchableOpacity>
              </View>
              <ScrollView className="p-4">
                <View className="flex-row flex-wrap">
                  {accounts?.map((item, index) => (
                    <TouchableOpacity
                      key={index}
                      onPress={() => selectAccount(item)}
                      className="w-1/3 p-3 border border-gray-200 justify-center items-center"
                    >
                      <Text className="text-base font-pregular text-gray-800 text-center">
                        {item}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
            </View>
          </View>
        </View>
      )}

      {calendarModalVisible && (
        <Modal
          isVisible={calendarModalVisible}
          onBackdropPress={() => setCalendarModalVisible(false)}
          style={{ margin: 0, justifyContent: "flex-end" }}
          animationIn="slideInUp"
          animationOut="slideOutDown"
        >
          <View className="bg-white rounded-t-3xl pt-3 pb-5 px-6 max-h-4/5">
            <View className="items-center mb-5">
              <View className="w-10 h-1 bg-gray-300 rounded-full mb-4" />
              <Text className="text-2xl font-bold text-gray-800">
                Choose Date
              </Text>
              <Text className="text-sm text-gray-500 mt-1">
                Select a date to view transactions
              </Text>
            </View>

            {/* Calendar */}
            <View className="bg-gray-50 rounded-2xl p-4 mb-4">
              {/* Month Navigation */}
              <View className="flex-row items-center justify-between mb-4">
                <Pressable
                  onPress={handlePrevMonth}
                  className="p-2 bg-white rounded-xl"
                >
                  <MaterialDesignIcons
                    name="chevron-left"
                    size={20}
                    color="#6C757D"
                  />
                </Pressable>
                <Text className="text-lg font-bold text-gray-800">
                  {currentDate.format("MMMM YYYY")}
                </Text>
                <Pressable
                  onPress={handleNextMonth}
                  className="p-2 bg-white rounded-xl"
                >
                  <MaterialDesignIcons
                    name="chevron-right"
                    size={20}
                    color="#6C757D"
                  />
                </Pressable>
              </View>

              <View className="bg-white flex-row justify-between py-2 px-1 rounded-xl mb-2">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                  (day, index) => (
                    <Text
                      key={index}
                      className={`text-xs font-semibold text-center flex-1 py-2 ${
                        day === "Sun"
                          ? "text-orange-500"
                          : day === "Sat"
                            ? "text-blue-500"
                            : "text-gray-500"
                      }`}
                    >
                      {day}
                    </Text>
                  )
                )}
              </View>

              <View className="bg-white rounded-xl p-1">
                {Array.from(
                  { length: Math.ceil(days.length / 7) },
                  (_, weekIndex) => (
                    <View key={weekIndex} className="flex-row mb-1">
                      {Array.from({ length: 7 }, (_, dayIndex) => {
                        const dayItem = days[weekIndex * 7 + dayIndex];
                        if (!dayItem) {
                          return (
                            <View
                              key={dayIndex}
                              style={{
                                width: boxWidth,
                                height: boxWidth,
                                marginHorizontal: 1,
                              }}
                            />
                          );
                        }
                        return (
                          <View key={dayIndex} style={{ marginHorizontal: 1 }}>
                            {renderDay({ item: dayItem })}
                          </View>
                        );
                      })}
                    </View>
                  )
                )}
              </View>
            </View>
          </View>
        </Modal>
      )}
    </SafeAreaView>
  );
};

export default CreateExpense;

const styles = StyleSheet.create({});
