import StackNavigator from "./navigation/StackNavigator";
import { NavigationContainer } from "@react-navigation/native";
import { LogBox } from "react-native";
import 'react-native-reanimated';
//import { ModalPortal } from 'react-native-modal';

LogBox.ignoreLogs(['Each child in a list should have a unique "key" prop']);
export default function App() {
  return (
    <NavigationContainer>
        <StackNavigator />
        {/* <ModalPortal /> */}
    </NavigationContainer>
  );
}
