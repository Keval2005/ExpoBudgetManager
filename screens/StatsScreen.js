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

const screenWidth = Dimensions.get("window").width;

const StatsScreen = () => {
  const [incomeData, setIncomeData] = useState([]);
  const [expenseData, setExpenseData] = useState([]);
  const [activePage, setActivePage] = useState("Income");
  const [currentDate, setCurrentDate] = useState(moment());

  const slideAnim = useRef(new Animated.Value(0)).current;

  const getRandomColor = () => {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  useEffect(() => {
    fetchExpenses();
  }, [currentDate]);

  const fetchExpenses = async () => {
    try {
      const monthString = currentDate.format("MMMM YYYY"); // "August 2025"
      const response = await axios.get(
        "https://expobudgetmanager.onrender.com/expenses",
        { params: { date: monthString } }
      );

      const data = response.data;

      const incomeItems = data.filter((item) => item.type === "Income");
      const expenseItems = data.filter((item) => item.type === "Expense");

      const groupByCategory = (items, type) => {
        const map = {};
        items.forEach((item) => {
          map[item.category] = (map[item.category] || 0) + Number(item.amount);
        });
        return Object.keys(map).map((key, index) => ({
          name: key,
          amount: map[key],
          color: getRandomColor(),
          legendFontColor: "#333",
          legendFontSize: 14,
        }));
      };

      setIncomeData(groupByCategory(incomeItems, "Income"));
      setExpenseData(groupByCategory(expenseItems, "Expense"));
    } catch (error) {
      console.log("Error fetching data:", error);
      setIncomeData([]);
      setExpenseData([]);
    }
  };

  // Month navigation
  const handlePrevMonth = () => {
    setCurrentDate((prev) => moment(prev).subtract(1, "month"));
  };

  const handleNextMonth = () => {
    setCurrentDate((prev) => moment(prev).add(1, "month"));
  };

  const handleToggle = (page) => {
    setActivePage(page);
    Animated.timing(slideAnim, {
      toValue: page === "Income" ? 0 : -screenWidth,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const renderPieChart = (data, title) => (
    <View style={{ width: screenWidth, paddingHorizontal: 20 }}>
      <Text style={{ fontSize: 18, fontWeight: "bold", marginVertical: 10 }}>
        {title}
      </Text>
      {data.length > 0 ? (
        <>
          <PieChart
            data={data}
            width={screenWidth - 40}
            height={220}
            accessor="amount"
            backgroundColor="transparent"
            paddingLeft="15"
            chartConfig={{
              color: (opacity = 1) => `rgba(0,0,0,${opacity})`,
            }}
            absolute
          />
          <View style={{ marginTop: 15 }}>
            {data.map((item, index) => (
              <View
                key={index}
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginVertical: 5,
                  padding: 10,
                  backgroundColor: "#f5f5f5",
                  borderRadius: 8,
                }}
              >
                <Text style={{ fontSize: 16, fontWeight: "500" }}>
                  {item.name}
                </Text>
                <Text style={{ fontSize: 16 }}>₹{item.amount}</Text>
              </View>
            ))}
          </View>
        </>
      ) : (
        <Text style={{ textAlign: "center", marginVertical: 20 }}>
          No {title.toLowerCase()} data
        </Text>
      )}
    </View>
  );

  return (
    <ScrollView
      contentContainerStyle={{
        flexGrow: 1,
        paddingVertical: 20,
        marginTop: 38,
      }}
    >
      <Text
        style={{
          fontSize: 20,
          fontWeight: "bold",
          textAlign: "center",
          marginBottom: 20,
        }}
      >
        Income & Expenses Stats
      </Text>

      {/* Month Selector */}
      <View
        style={{
          paddingVertical: 10,
          marginHorizontal: 10,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          backgroundColor: "white",
        }}
      >
        <MaterialDesignIcons
          name="chevron-left"
          onPress={handlePrevMonth}
          size={30}
          color="black"
        />
        <Text style={{ fontSize: 16, fontWeight: "bold" }}>
          {currentDate.format("MMM YYYY")}
        </Text>
        <MaterialDesignIcons
          name="chevron-right"
          onPress={handleNextMonth}
          size={30}
          color="black"
        />
      </View>

      {/* Toggle Buttons */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          marginVertical: 20,
        }}
      >
        <TouchableOpacity
          onPress={() => handleToggle("Income")}
          style={{
            paddingVertical: 10,
            paddingHorizontal: 20,
            backgroundColor: activePage === "Income" ? "#4CAF50" : "#e0e0e0",
            borderRadius: 8,
            marginHorizontal: 5,
          }}
        >
          <Text
            style={{
              color: activePage === "Income" ? "#fff" : "#000",
              fontWeight: "bold",
            }}
          >
            Income
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => handleToggle("Expense")}
          style={{
            paddingVertical: 10,
            paddingHorizontal: 20,
            backgroundColor: activePage === "Expense" ? "#FF5722" : "#e0e0e0",
            borderRadius: 8,
            marginHorizontal: 5,
          }}
        >
          <Text
            style={{
              color: activePage === "Expense" ? "#fff" : "#000",
              fontWeight: "bold",
            }}
          >
            Expenses
          </Text>
        </TouchableOpacity>
      </View>

      {/* Animated Chart Container */}
      <Animated.View
        style={{
          flexDirection: "row",
          width: screenWidth * 2,
          transform: [{ translateX: slideAnim }],
        }}
      >
        {renderPieChart(incomeData, "Income")}
        {renderPieChart(expenseData, "Expenses")}
      </Animated.View>
    </ScrollView>
  );
};

export default StatsScreen;
