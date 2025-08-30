import StackNavigator from './navigation/StackNavigator';
import { NavigationContainer } from '@react-navigation/native';
import { LogBox } from 'react-native';

LogBox.ignoreLogs(['Each child in a list should have a unique "key" prop']);
export default function App() {
  return (
    <NavigationContainer>
      <StackNavigator/>
    </NavigationContainer>
  );
}