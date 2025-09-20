import {
  Text,
  View,
  SafeAreaView,
  Pressable,
  ScrollView,
  Dimensions,
  Alert,
} from "react-native";
import React, { useState, useEffect, useCallback } from "react";
import Ionicons from "@react-native-vector-icons/ionicons";
import MaterialDesignIcons from "@react-native-vector-icons/material-design-icons";
import moment from "moment";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import axios from "axios";
import Modal from "react-native-modal";
import AsyncStorage from "@react-native-async-storage/async-storage";

const HomeScreen = () => {
  const [option, setOption] = useState("Daily");
  const navigation = useNavigation();
  const [currentDate, setCurrentDate] = useState(moment());
  const [expenses, setExpenses] = useState([]);
  const [userId, setUserId] = useState(null);
  const date = currentDate.format("MMMM YYYY");

  const [modalVisible, setModalVisible] = useState(false);
  const [currentData, setCurrentData] = useState(null);
  const [selectedDate, setSelectedDate] = useState(moment());
  const [calendarModalVisible, setCalendarModalVisible] = useState(false);
  const [allExpenses, setAllExpenses] = useState([]);

  const day = moment(currentData?.item?.date).format("DD");
  const monthYear = moment(currentData?.item?.date).format("MM YYYY");
  const dayName = moment(currentData?.item?.date).format("ddd");

  const setOpenModal = (item, dayExpenses, totalIncome, totalExpense) => {
    setCurrentData({ item, dayExpenses, totalIncome, totalExpense });
    setModalVisible(!modalVisible);
  };

  useEffect(() => {
    getUserId();
  }, []);

  useEffect(() => {
    if (userId) {
      fetchExpenses();
    }
  }, [currentDate, userId]);

  const getUserId = async () => {
    try {
      const storedUserId = await AsyncStorage.getItem("userId");
      setUserId(storedUserId);
    } catch (error) {
      console.error("Error getting userId:", error);
    }
  };

  const fetchExpenses = async () => {
    try {
      if (!userId) {
        console.log("No userId available");
        return;
      }

      console.log("Fetching expenses for userId:", userId, "date:", date);
      
      const response = await axios.get(
        "https://expobudgetmanager.onrender.com/expenses",
        {
          params: { 
            userId: userId,
          },
        }
      );
      
      console.log("Fetched expenses:", response.data);
      setExpenses(response.data);
    } catch (error) {
      console.log("Error fetching expenses:", error);
    }
  };

  const fetchAllExpenses = async () => {
    try {
      if (!userId) {
        console.log("No userId available");
        return;
      }

      const response = await axios.get(
        "https://expobudgetmanager.onrender.com/expenses",
        {
          params: { 
            userId: userId
          },
        }
      );
      
      setAllExpenses(response.data);
    } catch (error) {
      console.log("Error fetching all expenses:", error);
    }
  };

  const getFilteredExpenses = () => {
    if (option === "Daily") {
      
      return expenses.filter(expense => 
        expense.date === selectedDate.format("DD MMMM YYYY ddd")
      );
    }
    return expenses; 
  };

  const filteredExpenses = getFilteredExpenses();

  const groupedExpenses = filteredExpenses.reduce((acc, expense) => {
    const day = expense.date.split(' ')[0] + ' ' + expense.date.split(' ')[3]; 
  if (!acc[day]) {
    acc[day] = [];
  }
  acc[day].push(expense);
  return acc;
}, {});

  const handlePrevMonth = () => {
    const newDate = moment(currentDate).subtract(1, "month");
    setCurrentDate(newDate);
    if (!selectedDate.isSame(newDate, "month")) {
      setSelectedDate(newDate.clone().startOf("month"));
    }
  };

  const handleNextMonth = () => {
    const newDate = moment(currentDate).add(1, "month");
    setCurrentDate(newDate);
    if (!selectedDate.isSame(newDate, "month")) {
      setSelectedDate(newDate.clone().startOf("month"));
    }
  };

  const totalIncome = filteredExpenses
    ?.filter((expense) => expense.type == "Income")
    .reduce((total, expense) => total + parseFloat(expense.amount), 0);

  const totalExpense = filteredExpenses
    .filter((expense) => expense.type == "Expense")
    .reduce((total, expense) => total + parseFloat(expense.amount), 0);

  useFocusEffect(
    useCallback(() => {
      fetchExpenses();
    }, [navigation])
  );

  const screenWidth = Dimensions.get("window").width;
  const boxWidth = (screenWidth - 140) / 7;

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

  const renderDay = ({ item }) => {
    const isSunday = item?.date.day() === 0;
    const isSaturday = item?.date.day() === 6;
    const isToday = item?.date.isSame(moment(), "day");
    const isSelected = item?.date.isSame(selectedDate, "day");
    
    const dayExpenses = allExpenses.filter(expense => 
      expense.date === item?.date.format("DD MMMM YYYY ddd")
    );
    
    const dayTotalIncome = dayExpenses
      .filter((expense) => expense.type === "Income")
      .reduce((sum, expense) => sum + parseFloat(expense.amount), 0);
    const dayTotalExpense = dayExpenses
      .filter((expense) => expense.type === "Expense")
      .reduce((sum, expense) => sum + parseFloat(expense.amount), 0);
    const dayTotalSavings = dayTotalIncome - dayTotalExpense;

    return (
      <Pressable
        onPress={() => {
          setSelectedDate(item?.date);
          if (calendarModalVisible) {
            setCalendarModalVisible(false);
          } else {
            setOpenModal(item, [], 0, 0);
          }
        }}
        style={{ width: boxWidth, height: boxWidth }}
        className={`items-center justify-center rounded-xl m-1 ${
          isSelected ? 'bg-blue-500' : isToday ? 'bg-green-500' : 'bg-white'
        } ${!item?.isCurrentMonth ? 'opacity-30' : ''}`}
      >
        <Text
          className={`text-xs font-semibold ${
            isSelected
              ? 'text-white'
              : isToday
              ? 'text-white'
              : isSunday
              ? 'text-orange-500'
              : isSaturday
              ? 'text-blue-500'
              : 'text-gray-800'
          }`}
        >
          {item?.date.format("D")}
        </Text>

      </Pressable>
    );
  };

  const days = generateDaysForMonth(currentDate);

  return (
    <SafeAreaView className="bg-primary h-full my-5">
    <ScrollView showsVerticalScrollIndicator={false}>
      <SafeAreaView className="flex-1 mt-10 bg-primary">
        
        <View className="flex-row items-center justify-between mx-4 mt-2 bg-white py-4 px-5 rounded-2xl shadow-sm">
          <Pressable 
            className="p-2 bg-gray-100 rounded-xl"
            onPress={() => {
              setCalendarModalVisible(true);
              fetchAllExpenses();
            }}
          >
            <Ionicons name="calendar-outline" size={24} color="#6C757D" />
          </Pressable>
          <View className="items-center">
            <Text className="text-xl font-bold text-gray-800">Budget Manager</Text>
            <Text className="text-xs text-gray-500 mt-0.5">Track your finances</Text>
          </View>
          <Pressable
            className="p-2 bg-gray-100 rounded-xl"
            onPress={() => navigation.navigate("Create")}
          >
            <Ionicons name="add-outline" size={24} color="#6C757D" />
          </Pressable>
        </View>

        
        <View className="mx-4 mt-4 bg-white py-4 px-6 rounded-2xl shadow-sm">
          <View className="flex-row items-center justify-between">
            <View className="flex-1">
              <Text className="text-lg font-bold text-gray-800">
                {selectedDate.format("DD")} {selectedDate.format("MMMM YYYY")}
              </Text>
              <Text className="text-sm text-gray-500 mt-0.5">
                {selectedDate.format("dddd")}
              </Text>
            </View>
            <Pressable
              onPress={() => {
                setCalendarModalVisible(true);
                fetchAllExpenses();
              }}
              className="flex-row items-center bg-blue-50 py-2 px-4 rounded-xl"
            >
              <Ionicons name="calendar-outline" size={20} color="#2196F3" />
              <Text className="text-blue-600 font-semibold ml-2">Choose Date</Text>
            </Pressable>
          </View>
        </View>

        <View className="mx-4 mt-4 bg-white py-6 px-5 rounded-2xl shadow-sm">
          <Text className="text-lg font-bold text-gray-800 text-center mb-5">
            Financial Overview
          </Text>
          
          <View className="flex-row justify-between">
            
            <View className="flex-1 items-center bg-green-50 py-4 px-3 rounded-xl mx-1">
              <View className="w-10 h-10 bg-green-500 rounded-full items-center justify-center mb-2">
                <Ionicons name="trending-up" size={20} color="white" />
              </View>
              <Text className="text-xs font-semibold text-green-800 mb-1">
                Income
              </Text>
              <Text className="text-base font-bold text-green-500">
                ₹{totalIncome.toFixed(2)}
              </Text>
            </View>

            
            <View className="flex-1 items-center bg-red-50 py-4 px-3 rounded-xl mx-1">
              <View className="w-10 h-10 bg-red-500 rounded-full items-center justify-center mb-2">
                <Ionicons name="trending-down" size={20} color="white" />
              </View>
              <Text className="text-xs font-semibold text-red-800 mb-1">
                Expense
              </Text>
              <Text className="text-base font-bold text-red-500">
                ₹{totalExpense.toFixed(2)}
              </Text>
            </View>

            
            <View className={`flex-1 items-center py-4 px-3 rounded-xl mx-1 ${
              totalIncome - totalExpense >= 0 ? 'bg-blue-50' : 'bg-orange-50'
            }`}>
              <View className={`w-10 h-10 rounded-full items-center justify-center mb-2 ${
                totalIncome - totalExpense >= 0 ? 'bg-blue-500' : 'bg-orange-500'
              }`}>
                <Ionicons 
                  name={totalIncome - totalExpense >= 0 ? "wallet" : "warning"} 
                  size={20} 
                  color="white" 
                />
              </View>
              <Text className={`text-xs font-semibold mb-1 ${
                totalIncome - totalExpense >= 0 ? 'text-blue-800' : 'text-orange-800'
              }`}>
                Balance
              </Text>
              <Text className={`text-base font-bold ${
                totalIncome - totalExpense >= 0 ? 'text-blue-500' : 'text-orange-500'
              }`}>
                ₹{(totalIncome - totalExpense).toFixed(2)}
              </Text>
            </View>
          </View>
        </View>

        <View className="flex-1 mx-4 mt-4">
          {option == "Daily" && (
            <>
              {Object.keys(groupedExpenses).length === 0 ? (
                <View className="bg-white py-10 px-5 rounded-2xl items-center shadow-sm">
                  <View className="w-20 h-20 bg-gray-50 rounded-full items-center justify-center mb-4">
                    <Ionicons name="receipt-outline" size={40} color="#6C757D" />
                  </View>
                  <Text className="text-lg font-bold text-gray-800 mb-2">
                    No transactions yet
                  </Text>
                  <Text className="text-sm text-gray-500 text-center mb-6">
                    Start tracking your expenses and income for this month
                  </Text>
                  <Pressable
                    onPress={() => navigation.navigate("Create")}
                    className="bg-green-500 py-3 px-6 rounded-xl"
                  >
                    <Text className="text-white text-base font-semibold">
                      Add Transaction
                    </Text>
                  </Pressable>
                </View>
              ) : (
                Object.keys(groupedExpenses).map((item, index) => {
                  const totalExpense = groupedExpenses[item]
                    .filter((expense) => expense.type == "Expense")
                    .reduce(
                      (sum, expense) => sum + parseFloat(expense.amount),
                      0
                    );

                  const totalIncome = groupedExpenses[item]
                    .filter((expense) => expense.type == "Income")
                    .reduce(
                      (sum, expense) => sum + parseFloat(expense.amount),
                      0
                    );

                  return (
                    <Pressable
                      key={index}
                      className="bg-white rounded-2xl mb-3 shadow-sm overflow-hidden"
                    >
                      
                      <View className="bg-green-500 py-4 px-5">
                        <View className="flex-row items-center justify-between">
                          <View className="flex-row items-center">
                            <Text className="text-lg font-bold text-white">
                              {item?.split(" ")[0]}
                            </Text>
                            <View className="bg-white/20 px-2 py-1 rounded-full ml-2">
                              <Text className="text-xs font-semibold text-white">
                                {item?.split(" ")[1]}
                              </Text>
                            </View>
                          </View>

                          <View className="flex-row items-center">
                            {totalIncome > 0 && (
                              <View className="items-end mr-4">
                                <Text className="text-xs text-green-100 font-medium">
                                  Income
                                </Text>
                                <Text className="text-base font-bold text-white">
                                  ₹{totalIncome.toFixed(2)}
                                </Text>
                              </View>
                            )}
                            {totalExpense > 0 && (
                              <View className="items-end">
                                <Text className="text-xs text-red-100 font-medium">
                                  Expense
                                </Text>
                                <Text className="text-base font-bold text-white">
                                  ₹{totalExpense.toFixed(2)}
                                </Text>
                              </View>
                            )}
                          </View>
                        </View>
                      </View>

                      <View className="p-5">
                        {groupedExpenses[item].map((transaction, idx) => (
                          <View
                            key={idx}
                            className={`flex-row items-center py-3 ${
                              idx === groupedExpenses[item].length - 1 ? '' : 'border-b border-gray-100'
                            }`}
                          >
                            <View className={`w-3 h-3 rounded-full mr-4 ${
                              transaction.type === "Income" ? 'bg-green-500' : 'bg-red-500'
                            }`} />
                            
                            <View className="flex-1">
                              <Text className="text-base font-semibold text-gray-800 mb-0.5">
                                {transaction.category}
                              </Text>
                              <Text className="text-sm text-gray-500">
                                {transaction.account}
                              </Text>
                              {transaction.note && (
                                <Text className="text-xs text-gray-400 mt-0.5">
                                  {transaction.note}
                                </Text>
                              )}
                            </View>

                            <View className="items-end">
                              <Text className={`text-base font-bold ${
                                transaction.type === "Income" ? 'text-green-500' : 'text-red-500'
                              }`}>
                                {transaction.type === "Income" ? "+" : "-"}₹{Number(transaction.amount).toFixed(2)}
                              </Text>
                              {transaction.timeStamp && (
                                <Text className="text-xs text-gray-400 mt-0.5">
                                  {moment(transaction.timeStamp).format("HH:mm")}
                                </Text>
                              )}
                            </View>
                          </View>
                        ))}
                      </View>
                    </Pressable>
                  );
                })
              )}
            </>
          )}

          
        </View>
      </SafeAreaView>

      <Modal
        isVisible={modalVisible}
        onBackdropPress={() => setModalVisible(false)}
        style={{ margin: 0, justifyContent: "flex-end" }}
        animationIn="slideInUp"
        animationOut="slideOutDown"
      >
        <View className="bg-white rounded-t-3xl pt-3 pb-5 px-6 max-h-3/5">
          <View className="items-center mb-5">
            <View className="w-10 h-1 bg-gray-300 rounded-full mb-4" />
            <Text className="text-2xl font-bold text-gray-800">
              {day} {monthYear}
            </Text>
            <Text className="text-base text-gray-500 mt-1">
              {dayName}
            </Text>
          </View>

          {currentData?.dayExpenses?.map((expense, index) => (
            <View
              key={index}
              className={`flex-row items-center justify-between py-4 ${
                index === currentData.dayExpenses.length - 1 ? '' : 'border-b border-gray-100'
              }`}
            >
              <View className="flex-row items-center">
                <View className={`w-3 h-3 rounded-full mr-3 ${
                  expense.type === "Income" ? 'bg-green-500' : 'bg-red-500'
                }`} />
                <View>
                  <Text className="text-base font-semibold text-gray-800">
                    {expense.category}
                  </Text>
                  <Text className="text-sm text-gray-500">
                    {expense.account}
                  </Text>
                </View>
              </View>
              <Text className={`text-base font-bold ${
                expense.type === "Income" ? 'text-green-500' : 'text-red-500'
              }`}>
                {expense.type === "Income" ? "+" : "-"}₹{Number(expense.amount).toFixed(2)}
              </Text>
            </View>
          ))}

          <View className="mt-6 pt-5 border-t border-gray-200">
            <View className="flex-row justify-between mb-3">
              <Text className="text-lg font-bold text-gray-800">
                Total Income
              </Text>
              <Text className="text-lg font-bold text-green-500">
                ₹{currentData?.totalIncome?.toFixed(2) || "0.00"}
              </Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-lg font-bold text-gray-800">
                Total Expense
              </Text>
              <Text className="text-lg font-bold text-red-500">
                ₹{currentData?.totalExpense?.toFixed(2) || "0.00"}
              </Text>
            </View>
          </View>
        </View>
      </Modal>

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

          <View className="bg-gray-50 rounded-2xl p-4 mb-4">
            
            <View className="flex-row items-center justify-between mb-4">
              <Pressable
                onPress={handlePrevMonth}
                className="p-2 bg-white rounded-xl"
              >
                <MaterialDesignIcons name="chevron-left" size={20} color="#6C757D" />
              </Pressable>
              <Text className="text-lg font-bold text-gray-800">
                {currentDate.format("MMMM YYYY")}
              </Text>
              <Pressable
                onPress={handleNextMonth}
                className="p-2 bg-white rounded-xl"
              >
                <MaterialDesignIcons name="chevron-right" size={20} color="#6C757D" />
              </Pressable>
            </View>

            <View className="bg-white flex-row justify-between py-2 px-1 rounded-xl mb-2">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                (day, index) => (
                  <Text
                    key={index}
                    className={`text-xs font-semibold text-center flex-1 py-2 ${
                      day === "Sun" ? "text-orange-500" : 
                      day === "Sat" ? "text-blue-500" : "text-gray-500"
                    }`}
                  >
                    {day}
                  </Text>
                )
              )}
            </View>

            <View className="bg-white rounded-xl p-1">
              {Array.from({ length: Math.ceil(days.length / 7) }, (_, weekIndex) => (
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
                            marginHorizontal: 1
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
              ))}
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;