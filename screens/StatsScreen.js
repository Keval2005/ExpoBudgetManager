// import { StyleSheet, Text, View, SafeAreaView, Pressable } from "react-native";
// import React, { useState, useEffect } from "react";
// import moment from "moment";
// import MaterialDesignIcons from "@react-native-vector-icons/material-design-icons";
// import { TabBar, TabView } from "react-native-tab-view";
// import axios from "axios";
// //import {PieChart} from 'react-native-svg-charts';
// import { PieChart } from "react-native-chart-kit";
// import { Dimensions } from "react-native";

// const StatsScreen = () => {
//   const [currentDate, setCurrentDate] = useState(moment());
//   const [index, setIndex] = useState(0);
//   const [option, setOption] = useState("Stats");
//   const [expenses, setExpenses] = useState([]);
//   const date = currentDate.format("MMMM YYYY");

//   const handlePrevMonth = () => {
//     setCurrentDate((prevDate) => moment(prevDate).subtract(1, "month"));
//   };

//   const handleNextMonth = () => {
//     setCurrentDate((prevDate) => moment(prevDate).add(1, "month"));
//   };

//   useEffect(() => {
//     fetchExpenses();
//   }, [currentDate]);

//   const screenWidth = Dimensions.get("window").width;

//   const fetchExpenses = async () => {
//     try {
//       const response = await axios.get(
//         "https://expobudgetmanager.onrender.com/expenses",
//         {
//           params: { date },
//         }
//       );
//       setExpenses(response.data);
//     } catch (error) {
//       console.log("Error", error);
//     }
//   };

//   const totalExpense = expenses
//     .filter((expense) => expense.type == "Expense")
//     .reduce((total, expense) => total + parseFloat(expense.amount), 0);

//   const totalIncome = expenses
//     .filter((expense) => expense.type == "Income")
//     .reduce((total, expense) => total + parseFloat(expense.amount), 0);

//   const [routes, setRoutes] = useState([
//     { key: "edit", title: `Income` },
//     { key: "view", title: "Expense" },
//   ]);

//   const renderScene = ({ route }) => {
//     switch (route.key) {
//       case "edit":
//         return <Income />;
//       case "view":
//         return <Expense />;
//     }
//   };

//   const RenderPieChart = () => {
//     const screenWidth = Dimensions.get("window").width;
//     // const data = [
//     //   50, 10, 40, 95, -4, -24, 85, 91, 35, 53, -53, 24, 50, -20, -80,
//     // ];

//     const randomColor = () =>
//       ("#" + ((Math.random() * 0xffffff) << 0).toString(16) + "000000").slice(
//         0,
//         7
//       );

//     const pieData = expenses
//       .filter((expense) => expense.type === "Income")
//       .map((expense, index) => ({
//         name: expense.category,
//         population: parseFloat(expense.amount),
//         color: "#" + (((1 << 24) * Math.random()) | 0).toString(16), // random color
//         legendFontColor: "#7F7F7F",
//         legendFontSize: 13,
//       }));
//     // const pieData = expenses
//     //   .filter((expense) => expense.type === "Income") // Filter expenses of type "EXPENSE"
//     //   .map((expense, index) => ({
//     //     value: parseFloat(expense.amount), // Use the numerical amount as the value
//     //     svg: {
//     //       fill: randomColor(),
//     //       onPress: () => console.log("press", index),
//     //     },
//     //     key: `pie-${index}`,
//     //     category: expense.category,
//     //     price: expense.amount,
//     //   }));
//     return (
//       <View>
//         {/* <PieChart style={{height: 200}} data={pieData} /> */}
//         <PieChart
//           data={pieData}
//           width={screenWidth - 20}
//           height={220}
//           accessor="population"
//           backgroundColor="transparent"
//           paddingLeft="10"
//           absolute
//           chartConfig={{
//             color: () => `rgba(0, 0, 0, 1)`,
//           }}
//         />
//         {pieData.map((data, index) => (
//           // <View
//           //   key={data.key}
//           //   style={{
//           //     padding: 12,
//           //   }}
//           // >
//           //   <View
//           //     style={{
//           //       flexDirection: "row",
//           //       alignItems: "center",
//           //       justifyContent: "space-between",
//           //     }}
//           //   >
//           //     <View
//           //       style={{ flexDirection: "row", alignItems: "center", gap: 7 }}
//           //     >
//           //       <View
//           //         style={{
//           //           backgroundColor: data?.svg?.fill,
//           //           alignSelf: "flex-start",
//           //           paddingVertical: 4,
//           //           paddingHorizontal: 8,
//           //           width: 70,
//           //           borderRadius: 5,
//           //         }}
//           //       >
//           //         <Text
//           //           style={{
//           //             fontSize: 13,
//           //             textAlign: "center",
//           //             color: "white",
//           //             fontWeight: "500",
//           //           }}
//           //         >
//           //           {Math.round((data.value / totalIncome) * 100)}%
//           //         </Text>
//           //       </View>
//           //       <Text style={{ fontSize: 15, textAlign: "center" }}>
//           //         {data?.category}
//           //       </Text>
//           //     </View>
//           //     <View>
//           //       <Text>{Number(data?.price).toFixed(2)}</Text>
//           //     </View>
//           //   </View>
//           // </View>

//           <View
//             key={index}
//             style={{
//               padding: 12,
//             }}
//           >
//             <View
//               style={{
//                 flexDirection: "row",
//                 alignItems: "center",
//                 justifyContent: "space-between",
//               }}
//             >
//               <View
//                 style={{ flexDirection: "row", alignItems: "center", gap: 7 }}
//               >
//                 <View
//                   style={{
//                     backgroundColor: data.color, // ✅ chart-kit uses `color`
//                     alignSelf: "flex-start",
//                     paddingVertical: 4,
//                     paddingHorizontal: 8,
//                     width: 70,
//                     borderRadius: 5,
//                   }}
//                 >
//                   <Text
//                     style={{
//                       fontSize: 13,
//                       textAlign: "center",
//                       color: "white",
//                       fontWeight: "500",
//                     }}
//                   >
//                     {Math.round((data.population / totalIncome) * 100)}%{" "}
//                     {/* ✅ chart-kit uses `population` */}
//                   </Text>
//                 </View>
//                 <Text style={{ fontSize: 15, textAlign: "center" }}>
//                   {data.name} {/* ✅ category name */}
//                 </Text>
//               </View>
//               <View>
//                 <Text>{Number(data.population).toFixed(2)}</Text>{" "}
//                 {/* ✅ raw value */}
//               </View>
//             </View>
//           </View>
//         ))}
//       </View>
//     );
//   };

//   const RenderPieChartExpense = () => {
//     // const data = [
//     //   50, 10, 40, 95, -4, -24, 85, 91, 35, 53, -53, 24, 50, -20, -80,
//     // ];

//     const randomColor = () =>
//       ("#" + ((Math.random() * 0xffffff) << 0).toString(16) + "000000").slice(
//         0,
//         7
//       );

//     const pieData = expenses
//       .filter((expense) => expense.type === "Expense")
//       .map((expense, index) => ({
//         name: expense.category,
//         population: parseFloat(expense.amount),
//         color: "#" + (((1 << 24) * Math.random()) | 0).toString(16),
//         legendFontColor: "#7F7F7F",
//         legendFontSize: 12,
//       }));

//     return (
//       <View style={{ marginTop: 20 }}>
//         <PieChart
//           data={pieData}
//           width={screenWidth - 20}
//           height={200}
//           accessor="population" // chart-kit uses "population" for values
//           backgroundColor="transparent"
//           paddingLeft="10"
//           chartConfig={{
//             color: () => `rgba(0, 0, 0, 1)`,
//           }}
//           hasLegend={false} // ✅ we’ll build a custom legend below
//         />

//         {pieData?.map((data, index) => (
//           <View key={index} style={{ padding: 12 }}>
//             <View
//               style={{
//                 flexDirection: "row",
//                 alignItems: "center",
//                 justifyContent: "space-between",
//               }}
//             >
//               <View
//                 style={{ flexDirection: "row", alignItems: "center", gap: 7 }}
//               >
//                 <View
//                   style={{
//                     backgroundColor: data.color, // ✅ chart-kit uses "color"
//                     alignSelf: "flex-start",
//                     paddingVertical: 4,
//                     paddingHorizontal: 8,
//                     width: 50,
//                     borderRadius: 5,
//                   }}
//                 >
//                   <Text
//                     style={{
//                       fontSize: 13,
//                       textAlign: "center",
//                       color: "white",
//                       fontWeight: "500",
//                     }}
//                   >
//                     {Math.round((data.population / totalExpense) * 100)}%
//                     {/* ✅ use "population" instead of "value" */}
//                   </Text>
//                 </View>

//                 <Text style={{ fontSize: 15, textAlign: "center" }}>
//                   {data.name} {/* ✅ use "name" instead of "category" */}
//                 </Text>
//               </View>
//               <View>
//                 <Text>{Number(data.population).toFixed(2)}</Text>
//                 {/* ✅ show raw number */}
//               </View>
//             </View>
//           </View>
//         ))}
//       </View>

//       //   <VictoryPie
//       //     data={pieData}
//       //     x="category"
//       //     y="value"
//       //     colorScale={pieData.map((d) => d.svg.fill)}
//       //     height={200}
//       //   />

//       //   {pieData?.map((data, index) => (
//       //     <View style={{ padding: 12 }}>
//       //       <View
//       //         style={{
//       //           flexDirection: "row",
//       //           alignItems: "center",
//       //           justifyContent: "space-between",
//       //         }}
//       //       >
//       //         <View
//       //           style={{ flexDirection: "row", alignItems: "center", gap: 7 }}
//       //         >
//       //           <View
//       //             style={{
//       //               backgroundColor: data?.svg?.fill,
//       //               alignSelf: "flex-start",
//       //               paddingVertical: 4,
//       //               paddingHorizontal: 8,
//       //               width: 50,
//       //               borderRadius: 5,
//       //             }}
//       //           >
//       //             <Text
//       //               style={{
//       //                 fontSize: 13,
//       //                 textAlign: "center",
//       //                 color: "white",
//       //                 fontWeight: "500",
//       //               }}
//       //             >
//       //               {Math.round((data.value / totalExpense) * 100)}%
//       //             </Text>
//       //           </View>

//       //           <Text style={{ fontSize: 15, textAlign: "center" }}>
//       //             {data?.category}
//       //           </Text>
//       //         </View>
//       //         <View>
//       //           <Text>{Number(data?.price).toFixed(2)}</Text>
//       //         </View>
//       //       </View>
//       //     </View>
//       //   ))}
//       // </View>
//     );
//   };

//   const Income = () => (
//     <View style={{ backgroundColor: "white" }}>
//       <View>
//         {option == "Budget" && (
//           <View>
//             <View
//               style={{
//                 flexDirection: "row",
//                 alignItems: "center",
//                 justifyContent: "space-between",
//                 padding: 12,
//               }}
//             >
//               <View>
//                 <Text style={{ color: "gray", fontSize: 15 }}>
//                   Remaining (Monthly)
//                 </Text>

//                 <Text
//                   style={{
//                     marginTop: 8,
//                     fontSize: 19,
//                     fontWeight: "500",
//                     letterSpacing: 0.5,
//                   }}
//                 >
//                   1000.00
//                 </Text>
//               </View>

//               <View
//                 style={{
//                   padding: 10,
//                   backgroundColor: "#E0E0E0",
//                   borderRadius: 8,
//                   alignSelf: "flex-start",
//                 }}
//               >
//                 <Text>Budget Setting</Text>
//               </View>
//             </View>

//             {expenses
//               ?.filter((item) => item.type === "Income")
//               .map((item, index) => (
//                 <Pressable
//                   style={{
//                     backgroundColor: "white",
//                     borderTopColor: "#E0E0E0",
//                     borderTopWidth: 0.6,
//                     padding: 14,
//                   }}
//                 >
//                   <View
//                     style={{
//                       flexDirection: "row",
//                       alignItems: "center",
//                       justifyContent: "space-between",
//                     }}
//                   >
//                     <Text style={{ fontWeight: "500" }}>{item?.category}</Text>
//                     <Text>{Number(item?.amount).toFixed(2)}</Text>
//                   </View>
//                 </Pressable>
//               ))}
//           </View>
//         )}

//         {option == "Stats" && (
//           <View style={{ marginVertical: 10 }}>
//             <RenderPieChart />
//           </View>
//         )}
//       </View>
//     </View>
//   );

//   const Expense = () => (
//     <View style={{ backgroundColor: "white" }}>
//       <View>
//         {option == "Budget" && (
//           <View>
//             <View
//               style={{
//                 flexDirection: "row",
//                 alignItems: "center",
//                 justifyContent: "space-between",
//                 padding: 12,
//               }}
//             >
//               <View>
//                 <Text style={{ color: "gray", fontSize: 15 }}>
//                   Remaining (Monthly)
//                 </Text>

//                 <Text
//                   style={{
//                     marginTop: 8,
//                     fontSize: 19,
//                     fontWeight: "500",
//                     letterSpacing: 0.5,
//                   }}
//                 >
//                   1000.00
//                 </Text>
//               </View>

//               <View
//                 style={{
//                   padding: 10,
//                   backgroundColor: "#E0E0E0",
//                   borderRadius: 8,
//                   alignSelf: "flex-start",
//                 }}
//               >
//                 <Text>Budget Setting</Text>
//               </View>
//             </View>

//             {expenses
//               ?.filter((item) => item.type === "Expense")
//               .map((item, index) => (
//                 <Pressable
//                   style={{
//                     backgroundColor: "white",
//                     borderTopColor: "#E0E0E0",
//                     borderTopWidth: 0.6,
//                     padding: 14,
//                   }}
//                 >
//                   <View
//                     style={{
//                       flexDirection: "row",
//                       alignItems: "center",
//                       justifyContent: "space-between",
//                     }}
//                   >
//                     <Text style={{ fontWeight: "500" }}>{item?.category}</Text>
//                     <Text>{Number(item?.amount).toFixed(2)}</Text>
//                   </View>
//                 </Pressable>
//               ))}
//           </View>
//         )}

//         {option == "Stats" && (
//           <View>
//             <RenderPieChartExpense />
//           </View>
//         )}
//       </View>
//     </View>
//   );
//   return (
//     <SafeAreaView style={{ flex: 1, marginTop: 38 }}>
//       <View style={{ padding: 12 }}>
//         <View
//           style={{
//             backgroundColor: "#E0E0E0",
//             flexDirection: "row",
//             alignItems: "center",
//             gap: 20,
//             borderRadius: 12,
//           }}
//         >
//           <Pressable
//             onPress={() => setOption("Stats")}
//             style={{
//               backgroundColor: option == "Stats" ? "white" : "#E0E0E0",
//               padding: 12,
//               flex: 1,
//               borderRadius: 12,
//             }}
//           >
//             <Text
//               style={{
//                 textAlign: "center",
//                 color: option == "Stats" ? "orange" : "#606060",
//               }}
//             >
//               Stats
//             </Text>
//           </Pressable>

//           <Pressable
//             onPress={() => setOption("Budget")}
//             style={{
//               backgroundColor: option == "Budget" ? "white" : "#E0E0E0",
//               padding: 12,
//               flex: 1,
//               borderRadius: 12,
//             }}
//           >
//             <Text
//               style={{
//                 textAlign: "center",
//                 color: option == "Budget" ? "orange" : "#606060",
//               }}
//             >
//               Budget
//             </Text>
//           </Pressable>

//           <Pressable
//             onPress={() => setOption("Note")}
//             style={{
//               backgroundColor: option == "Note" ? "white" : "#E0E0E0",
//               padding: 12,
//               flex: 1,
//               borderRadius: 12,
//             }}
//           >
//             <Text
//               style={{
//                 textAlign: "center",
//                 color: option == "Note" ? "orange" : "#606060",
//               }}
//             >
//               Note
//             </Text>
//           </Pressable>
//         </View>

//         {option == "Budget" && (
//           <View>
//             <View
//               style={{
//                 paddingTop: 15,
//                 marginHorizontal: 10,
//                 flexDirection: "row",
//                 alignItems: "center",
//                 justifyContent: "space-between",
//               }}
//             >
//               <MaterialDesignIcons
//                 onPress={handlePrevMonth}
//                 name="chevron-left"
//                 size={23}
//                 color="black"
//               />

//               <Text style={{ fontSize: 16, fontWeight: "400", color: "black" }}>
//                 {currentDate.format("MMM YYYY")}
//               </Text>

//               <MaterialDesignIcons
//                 onPress={handleNextMonth}
//                 name="chevron-right"
//                 size={23}
//                 color="black"
//               />
//             </View>
//           </View>
//         )}
//       </View>

//       <TabView
//         navigationState={{ index, routes }}
//         renderScene={renderScene}
//         onIndexChange={setIndex}
//         initialLayout={{ width: "100%" }}
//         renderTabBar={(props) => (
//           <TabBar
//             {...props}
//             indicatorStyle={{ backgroundColor: "black" }}
//             style={{ backgroundColor: "white" }}
//             labelStyle={{ fontWeight: "bold" }}
//             activeColor="black"
//             inactiveColor="gray"
//           />
//         )}
//       />
//     </SafeAreaView>
//   );
// };

// export default StatsScreen;

// const styles = StyleSheet.create({});
// StatsScreen.js
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
