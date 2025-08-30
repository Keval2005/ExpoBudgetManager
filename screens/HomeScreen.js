import {StyleSheet, Text, View, SafeAreaView, Pressable} from 'react-native';
import React, {useState} from 'react';
import Ionicons from '@react-native-vector-icons/ionicons';
import MaterialDesignIcons from '@react-native-vector-icons/material-design-icons';
import moment from 'moment';
import { useNavigation } from '@react-navigation/native';

const HomeScreen = () => {
  const [option, setOption] = useState('Daily');
  const navigation = useNavigation()
  const [currentDate, setCurrentDate] = useState(moment());

  const handlePrevMonth = () => {
    setCurrentDate(prevDate => moment(prevDate).subtract(1, 'month'));
  };

  const handleNextMonth = () => {
    setCurrentDate(prevDate => moment(prevDate).add(1, 'month'));
  };

  return (
    <>
      <SafeAreaView style={{flex: 1, backgroundColor: '#F8F8F8'}}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginHorizontal: 12,
            marginTop: 5,
            backgroundColor: 'white',
          }}>
          <Ionicons name="search-outline" size={32} color={'black'} />
          <Text>Money Manager</Text>
          <Ionicons name="filter-outline" size={32} color={'black'} />
        </View>

        <View
          style={{
            paddingTop: 15,
            marginHorizontal: 10,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: 'white',
          }}>
          <MaterialDesignIcons
            name="chevron-left"
            onPress={handlePrevMonth}
            size={30}
            color="black"
          />
          <Text>{currentDate.format('MMM YYYY')}</Text>

          <MaterialDesignIcons
            name="chevron-right"
            onPress={handleNextMonth}
            size={30}
            color="black"
          />
        </View>

        <View
          style={{
            paddingTop: 15,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 12,
            justifyContent: 'space-between',
            marginHorizontal: 10,
            backgroundColor: 'white',
          }}>
          <Pressable onPress={() => setOption('Daily')}>
            <Text
              style={{
                color: option == 'Daily' ? 'black' : 'gray',
                fontSize: 14,
                fontWeight: '500',
              }}>
              Daily
            </Text>
          </Pressable>
          <Pressable onPress={() => setOption('Calender')}>
            <Text
              style={{
                color: option == 'Calender' ? 'black' : 'gray',
                fontSize: 14,
                fontWeight: '500',
              }}>
              Calender
            </Text>
          </Pressable>
          <Pressable onPress={() => setOption('Monthly')}>
            <Text
              style={{
                color: option == 'Monthly' ? 'black' : 'gray',
                fontSize: 14,
                fontWeight: '500',
              }}>
              Monthly
            </Text>
          </Pressable>
          <Pressable onPress={() => setOption('Summary')}>
            <Text
              style={{
                color: option == 'Summary' ? 'black' : 'gray',
                fontSize: 14,
                fontWeight: '500',
              }}>
              Summary
            </Text>
          </Pressable>
          <Pressable onPress={() => setOption('Description')}>
            <Text
              style={{
                color: option == 'Description' ? 'black' : 'gray',
                fontSize: 14,
                fontWeight: '500',
              }}>
              Description
            </Text>
          </Pressable>
        </View>
      </SafeAreaView>

      <View
        style={{
          backgroundColor: '#FF7F50',
          width: 46,
          height: 46,
          borderRadius: 23,
          justifyContent: 'center',
          alignItems: 'center',
          position: 'absolute',
          right: 15,
          bottom: 20,
        }}>
        <Pressable onPress={() => navigation.navigate("Create")}>
          <Ionicons name="add-outline" size={32} color="white" />
        </Pressable>
      </View>
    </>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({});
