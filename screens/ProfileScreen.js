// ProfileScreen.js
import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, Image, TouchableOpacity } from "react-native";
import axios from "axios";

const ProfileScreen = () => {
  const [user, setUser] = useState({
    name: "John Doe",
    email: "johndoe@example.com",
    profilePic: "https://i.pravatar.cc/150?img=12", // placeholder
  });
  const [stats, setStats] = useState({ income: 0, expenses: 0 });

  useEffect(() => {
    fetchUserStats();
  }, []);

  const fetchUserStats = async () => {
    try {
      const response = await axios.get("https://expobudgetmanager.onrender.com/users");
      // assuming API returns { income: 5000, expenses: 2350 }
      setStats(response.data);
    } catch (error) {
      console.log("Error fetching stats:", error);
    }
  };

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 20, backgroundColor: "#f9f9f9" }}>
      {/* Profile Header */}
      <View
        style={{
          alignItems: "center",
          marginBottom: 30,
          padding: 20,
          backgroundColor: "#fff",
          borderRadius: 15,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 3 },
          shadowOpacity: 0.1,
          shadowRadius: 5,
          elevation: 3,
        }}
      >
        <Image
          source={{ uri: user.profilePic }}
          style={{
            width: 100,
            height: 100,
            borderRadius: 50,
            marginBottom: 15,
            borderWidth: 2,
            borderColor: "#4CAF50",
          }}
        />
        <Text style={{ fontSize: 22, fontWeight: "bold", marginBottom: 5 }}>{user.name}</Text>
        <Text style={{ fontSize: 16, color: "#666" }}>{user.email}</Text>
      </View>

      {/* Stats Cards */}
      <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 30 }}>
        <View
          style={{
            flex: 1,
            backgroundColor: "#4CAF50",
            marginRight: 10,
            padding: 20,
            borderRadius: 15,
            alignItems: "center",
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 3 },
            shadowOpacity: 0.1,
            shadowRadius: 5,
            elevation: 3,
          }}
        >
          <Text style={{ color: "#fff", fontSize: 16, marginBottom: 10 }}>Total Income</Text>
          <Text style={{ color: "#fff", fontSize: 20, fontWeight: "bold" }}>₹{stats.income}</Text>
        </View>

        <View
          style={{
            flex: 1,
            backgroundColor: "#FF5722",
            marginLeft: 10,
            padding: 20,
            borderRadius: 15,
            alignItems: "center",
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 3 },
            shadowOpacity: 0.1,
            shadowRadius: 5,
            elevation: 3,
          }}
        >
          <Text style={{ color: "#fff", fontSize: 16, marginBottom: 10 }}>Total Expenses</Text>
          <Text style={{ color: "#fff", fontSize: 20, fontWeight: "bold" }}>₹{stats.expenses}</Text>
        </View>
      </View>

      {/* Edit Profile Button */}
      <TouchableOpacity
        style={{
          backgroundColor: "#2196F3",
          padding: 15,
          borderRadius: 15,
          alignItems: "center",
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 3 },
          shadowOpacity: 0.1,
          shadowRadius: 5,
          elevation: 3,
        }}
        onPress={() => alert("Edit Profile Pressed")}
      >
        <Text style={{ color: "#fff", fontSize: 16, fontWeight: "bold" }}>Edit Profile</Text>
      </TouchableOpacity>

      {/* Optional: Additional Info */}
      <View
        style={{
          marginTop: 30,
          padding: 20,
          backgroundColor: "#fff",
          borderRadius: 15,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 3 },
          shadowOpacity: 0.1,
          shadowRadius: 5,
          elevation: 3,
        }}
      >
        <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}>About Me</Text>
        <Text style={{ color: "#666", lineHeight: 22 }}>
          Text
        </Text>
      </View>
    </ScrollView>
  );
};

export default ProfileScreen;
