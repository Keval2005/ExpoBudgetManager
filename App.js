import 'react-native-reanimated';
import { LogBox } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import "./global.css"
import RootLayout from "./navigation";

LogBox.ignoreLogs(['Each child in a list should have a unique "key" prop']);

export default function App() {
  return (
    <NavigationContainer>
      <RootLayout />
    </NavigationContainer>
  );
}
