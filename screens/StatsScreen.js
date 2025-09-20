import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  Animated,
} from "react-native";
import { PieChart } from "react-native-chart-kit";
import axios from "axios";
import moment from "moment";
import MaterialDesignIcons from "react-native-vector-icons/MaterialCommunityIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";

const screenWidth = Dimensions.get("window").width;

const StatsScreen = () => {
  const [incomeData, setIncomeData] = useState([]);
  const [expenseData, setExpenseData] = useState([]);
  const [activePage, setActivePage] = useState("Income");
  const [currentDate, setCurrentDate] = useState(moment());
  const [userId, setUserId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [monthlyData, setMonthlyData] = useState({
    totalIncome: 0,
    totalExpense: 0,
    netBalance: 0,
    transactionCount: 0
  });

  const slideAnim = useRef(new Animated.Value(0)).current;

  const getRandomColor = () => {
    const colors = [
      "#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEAA7",
      "#DDA0DD", "#98D8C8", "#F7DC6F", "#BB8FCE", "#85C1E9"
    ];
    return colors[Math.floor(Math.random() * colors.length)];
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
      setIsLoading(false);
    } catch (error) {
      console.error("Error getting userId:", error);
      setIsLoading(false);
    }
  };

  const fetchExpenses = async () => {
    try {
      if (!userId) {
        console.log("No userId available - skipping stats fetch");
        return;
      }

      
      const response = await axios.get(
        "https://expobudgetmanager.onrender.com/expenses",
        { 
          params: { 
            userId: userId
          } 
        }
      );

      console.log("Fetched stats data:", response.data);
      const allData = response.data || [];

      const monthString = currentDate.format("MMMM YYYY");
      console.log("Filtering for month:", monthString);

      const data = allData.filter(item => {
        
        const itemMonthYear = item.date.split(' ').slice(1, 3).join(' ');
        console.log("Item date:", item.date, "Extracted:", itemMonthYear, "Matches:", itemMonthYear === monthString);
        return itemMonthYear === monthString;
      });

      const incomeItems = data.filter((item) => item.type === "Income");
      const expenseItems = data.filter((item) => item.type === "Expense");

      
      const totalIncome = incomeItems.reduce((sum, item) => sum + parseFloat(item.amount || 0), 0);
      const totalExpense = expenseItems.reduce((sum, item) => sum + parseFloat(item.amount || 0), 0);
      const netBalance = totalIncome - totalExpense;

      setMonthlyData({
        totalIncome,
        totalExpense,
        netBalance,
        transactionCount: data.length
      });

      const incomeCategories = {};
      incomeItems.forEach((item) => {
        if (incomeCategories[item.category]) {
          incomeCategories[item.category] += parseFloat(item.amount || 0);
        } else {
          incomeCategories[item.category] = parseFloat(item.amount || 0);
        }
      });

      const incomeChartData = Object.entries(incomeCategories).map(
        ([category, amount], index) => ({
          name: category,
          population: amount,
          color: getRandomColor(),
          legendFontColor: "#7F7F7F",
          legendFontSize: 15,
        })
      );

      const expenseCategories = {};
      expenseItems.forEach((item) => {
        if (expenseCategories[item.category]) {
          expenseCategories[item.category] += parseFloat(item.amount || 0);
        } else {
          expenseCategories[item.category] = parseFloat(item.amount || 0);
        }
      });

      const expenseChartData = Object.entries(expenseCategories).map(
        ([category, amount], index) => ({
          name: category,
          population: amount,
          color: getRandomColor(),
          legendFontColor: "#7F7F7F",
          legendFontSize: 15,
        })
      );

      setIncomeData(incomeChartData);
      setExpenseData(expenseChartData);
    } catch (error) {
      console.log("Error fetching stats:", error);
    }
  };

  const handlePrevMonth = () => {
    setCurrentDate((prev) => moment(prev).subtract(1, "month"));
  };

  const handleNextMonth = () => {
    setCurrentDate((prev) => moment(prev).add(1, "month"));
  };

  const handleToggle = (page) => {
    setActivePage(page);
    Animated.timing(slideAnim, {
      toValue: page === "Income" ? 0 : page === "Expense" ? 1 : 2,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const renderPieChart = (data, title) => {
    if (!data || data.length === 0) {
      return (
        <View style={{ width: screenWidth, paddingHorizontal: 20, alignItems: 'center' }}>
          <Text className="text-lg font-bold my-2.5">
            {title}
          </Text>
          <View className="bg-gray-50 p-5 rounded-xl items-center border border-dashed border-gray-300">
            <MaterialDesignIcons 
              name="chart-pie" 
              size={48} 
              color="#adb5bd" 
              style={{ marginBottom: 10 }}
            />
            <Text className="text-center text-gray-500 text-base font-medium">
              No {title.toLowerCase()} data for this month
            </Text>
          </View>
        </View>
      );
    }

    const totalAmount = data.reduce((sum, item) => sum + item.population, 0);

    return (
      <View style={{ width: screenWidth, paddingHorizontal: 20 }}>
        
        <View className="flex-row justify-between items-center my-2.5 px-1">
          <Text className="text-xl font-bold text-gray-800">
            {title}
          </Text>
          <View className={`px-3 py-1.5 rounded-full border ${
            title === 'Income' 
              ? 'bg-green-100 border-green-200' 
              : 'bg-red-100 border-red-200'
          }`}>
            <Text className={`text-base font-semibold ${
              title === 'Income' ? 'text-green-800' : 'text-red-800'
            }`}>
              ₹{totalAmount.toFixed(2)}
            </Text>
          </View>
        </View>

        <PieChart
          data={data}
          width={screenWidth - 40}
          height={220}
          accessor="population"
          backgroundColor="transparent"
          paddingLeft="15"
          chartConfig={{
            color: (opacity = 1) => `rgba(0,0,0,${opacity})`,
          }}
          absolute
        />

        <View className="mt-5">
          <Text className="text-base font-semibold text-gray-600 mb-4 text-center">
            Category Breakdown
          </Text>
          
          {data.map((item, index) => {
            const percentage = ((item.population / totalAmount) * 100).toFixed(1);
            
            return (
              <View
                key={index}
                className="flex-row items-center my-2 p-4 bg-white rounded-xl shadow-sm border-l-4"
                style={{
                  shadowColor: "#000",
                  shadowOffset: {
                    width: 0,
                    height: 2,
                  },
                  shadowOpacity: 0.1,
                  shadowRadius: 3.84,
                  elevation: 5,
                  borderLeftColor: item.color,
                }}
              >
            
                <View 
                  className="w-3 h-3 rounded-full mr-3"
                  style={{ backgroundColor: item.color }}
                />
                
                
                <View className="flex-1">
                  <Text className="text-base font-semibold text-gray-800 mb-0.5">
                    {item.name}
                  </Text>
                  <Text className="text-xs text-gray-500 font-medium">
                    {percentage}% of total
                  </Text>
                </View>
                
                <View className="items-end">
                  <Text className="text-base font-bold text-gray-800">
                    ₹{item.population.toFixed(2)}
                  </Text>
                  <Text className="text-xs text-gray-500 font-medium">
                    {percentage}%
                  </Text>
                </View>
              </View>
            );
          })}
        </View>

        <View className="bg-gray-50 rounded-xl p-4 mt-5 border border-gray-200">
          <View className="flex-row justify-between items-center">
            <View>
              <Text className="text-sm text-gray-500 font-medium">
                Total {title.toLowerCase()} categories
              </Text>
              <Text className="text-xl font-bold text-gray-800 mt-0.5">
                {data.length}
              </Text>
            </View>
            <View className={`px-3 py-2 rounded-lg border ${
              title === 'Income' 
                ? 'bg-green-100 border-green-200' 
                : 'bg-red-100 border-red-200'
            }`}>
              <Text className={`text-xs font-semibold ${
                title === 'Income' ? 'text-green-800' : 'text-red-800'
              }`}>
                {title === 'Income' ? 'EARNINGS' : 'SPENDING'}
              </Text>
            </View>
          </View>
        </View>
      </View>
    );
  };

  const renderTotalSummary = () => {
    return (
      <View style={{ width: screenWidth, paddingHorizontal: 20 }}>
        <Text className="text-xl font-bold text-gray-800 my-2.5 px-1">
          Monthly Summary
        </Text>

        <View className="space-y-4 mb-6">
          
          <View className="bg-green-50 rounded-xl p-5 border border-green-200 mt-2">
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center">
                <View className="w-12 h-12 bg-green-500 rounded-full items-center justify-center mr-4">
                  <MaterialDesignIcons name="trending-up" size={24} color="white" />
                </View>
                <View>
                  <Text className="text-sm text-green-600 font-medium">Total Income</Text>
                  <Text className="text-2xl font-bold text-green-800">
                    ₹{monthlyData.totalIncome.toFixed(2)}
                  </Text>
                </View>
              </View>
              
              <View className="bg-green-100 px-3 py-1 rounded-full">
                <Text className="text-xs font-semibold text-green-800">
                  EARNINGS
                </Text>
              </View>
            </View>
          </View>

          
          <View className="bg-red-50 rounded-xl p-5 border border-red-200 mt-3">
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center">
                <View className="w-12 h-12 bg-red-500 rounded-full items-center justify-center mr-4">
                  <MaterialDesignIcons name="trending-down" size={24} color="white" />
                </View>
                <View>
                  <Text className="text-sm text-red-600 font-medium">Total Expenses</Text>
                  <Text className="text-2xl font-bold text-red-800">
                    ₹{monthlyData.totalExpense.toFixed(2)}
                  </Text>
                </View>
              </View>
              <View className="bg-red-100 px-3 py-1 rounded-full">
                <Text className="text-xs font-semibold text-red-800">
                  SPENDING
                </Text>
              </View>
            </View>
          </View>

          
          <View className={`rounded-xl mt-3 p-5 border ${
            monthlyData.netBalance >= 0 
              ? 'bg-blue-50 border-blue-200' 
              : 'bg-orange-50 border-orange-200'
          }`}>
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center">
                <View className={`w-12 h-12 rounded-full items-center justify-center mr-4 ${
                  monthlyData.netBalance >= 0 ? 'bg-blue-500' : 'bg-orange-500'
                }`}>
                  <MaterialDesignIcons 
                    name={monthlyData.netBalance >= 0 ? "wallet" : "alert-circle"} 
                    size={24} 
                    color="white" 
                  />
                </View>
                <View>
                  <Text className={`text-sm font-medium ${
                    monthlyData.netBalance >= 0 ? 'text-blue-600' : 'text-orange-600'
                  }`}>
                    Net Balance
                  </Text>
                  <Text className={`text-2xl font-bold ${
                    monthlyData.netBalance >= 0 ? 'text-blue-800' : 'text-orange-800'
                  }`}>
                    ₹{monthlyData.netBalance.toFixed(2)}
                  </Text>
                </View>
              </View>
              <View className={`px-3 py-1 rounded-full ${
                monthlyData.netBalance >= 0 ? 'bg-blue-100' : 'bg-orange-100'
              }`}>
                <Text className={`text-xs font-semibold ${
                  monthlyData.netBalance >= 0 ? 'text-blue-800' : 'text-orange-800'
                }`}>
                  {monthlyData.netBalance >= 0 ? 'PROFIT' : 'DEFICIT'}
                </Text>
              </View>
            </View>
          </View>
        </View>

        
        <View className="grid grid-cols-2 gap-4">
          
          <View className="bg-gray-50 rounded-xl p-4 border border-gray-200">
            <View className="items-center">
              <MaterialDesignIcons name="receipt" size={32} color="#6B7280" />
              <Text className="text-sm text-gray-600 font-medium mt-2">Transactions</Text>
              <Text className="text-xl font-bold text-gray-800">
                {monthlyData.transactionCount}
              </Text>
            </View>
          </View>

          
          <View className="bg-gray-50 rounded-xl p-4 border border-gray-200">
            <View className="items-center">
              <MaterialDesignIcons name="calculator" size={32} color="#6B7280" />
              <Text className="text-sm text-gray-600 font-medium mt-2">Avg Transaction</Text>
              <Text className="text-xl font-bold text-gray-800">
                ₹{monthlyData.transactionCount > 0 
                  ? (monthlyData.totalIncome + monthlyData.totalExpense / monthlyData.transactionCount).toFixed(2)
                  : '0.00'
                }
              </Text>
            </View>
          </View>
        </View>

        
        <View className="bg-gradient-to-r from-green-50 to-green-50 rounded-xl p-5 mt-3 border border-green-200">
          <View className="items-center">
            <MaterialDesignIcons name="percent" size={32} color="#059669" />
            <Text className="text-sm text-green-600 font-medium mt-2">Savings Rate</Text>
            <Text className="text-2xl font-bold text-green-800">
              {monthlyData.totalIncome > 0 
                ? ((monthlyData.netBalance / monthlyData.totalIncome) * 100).toFixed(1)
                : '0.0'
              }%
            </Text>
            <Text className="text-xs text-green-600 text-center mt-1">
              {monthlyData.netBalance >= 0 
                ? 'Great job saving money!' 
                : 'Consider reducing expenses'
              }
            </Text>
          </View>
        </View>
      </View>
    );
  };

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-lg text-gray-500">Loading statistics...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      contentContainerStyle={{
        flexGrow: 1,
        paddingVertical: 20,
        marginTop: 38,
      }}
    >
      
      <View className="flex-row justify-between items-center mx-5 mb-5">
        <Text className="text-2xl font-bold">Statistics</Text>
        <View className="flex-row items-center">
          <TouchableOpacity onPress={handlePrevMonth}>
            <MaterialDesignIcons name="chevron-left" size={24} color="#666" />
          </TouchableOpacity>
          <Text className="mx-4 text-base">
            {currentDate.format("MMMM YYYY")}
          </Text>
          <TouchableOpacity onPress={handleNextMonth}>
            <MaterialDesignIcons name="chevron-right" size={24} color="#666" />
          </TouchableOpacity>
        </View>
      </View>

      
      <View className="flex-row mx-5 mb-5 bg-gray-100 rounded-lg p-1">
        <TouchableOpacity
          onPress={() => handleToggle("Income")}
          className={`flex-1 py-3 items-center rounded-lg ${
            activePage === "Income" ? "bg-green-500" : "bg-transparent"
          }`}
        >
          <Text className={`font-semibold ${
            activePage === "Income" ? "text-white" : "text-gray-500"
          }`}>
            Income
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleToggle("Expense")}
          className={`flex-1 py-3 items-center rounded-lg ${
            activePage === "Expense" ? "bg-red-500" : "bg-transparent"
          }`}
        >
          <Text className={`font-semibold ${
            activePage === "Expense" ? "text-white" : "text-gray-500"
          }`}>
            Expense
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleToggle("Total")}
          className={`flex-1 py-3 items-center rounded-lg ${
            activePage === "Total" ? "bg-blue-500" : "bg-transparent"
          }`}
        >
          <Text className={`font-semibold ${
            activePage === "Total" ? "text-white" : "text-gray-500"
          }`}>
            Total
          </Text>
        </TouchableOpacity>
      </View>

      
      <Animated.View
        style={{
          flexDirection: "row",
          transform: [{
            translateX: slideAnim.interpolate({
              inputRange: [0, 1, 2],
              outputRange: [0, -screenWidth, -screenWidth * 2],
            })
          }]
        }}
      >
        {renderPieChart(incomeData, "Income")}
        {renderPieChart(expenseData, "Expense")}
        {renderTotalSummary()}
      </Animated.View>
    </ScrollView>
  );
};

export default StatsScreen;
