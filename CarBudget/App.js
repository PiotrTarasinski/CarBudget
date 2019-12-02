import React from 'react';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { createStackNavigator } from 'react-navigation-stack';
import Icon from 'react-native-ionicons';
import firebase from 'firebase';

import LoadingScreen from './src/screens/LoadingScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import LoginScreen from './src/screens/LoginScreen';
import CarInfoScreen from './src/screens/CarInfoScreen';
import NotificationsScreen from './src/screens/NotificationsScreen';
import AddExpenseScreen from './src/screens/AddExpenseScreen';
import BudgetScreen from './src/screens/BudgetScreen';
import PerformanceScreen from './src/screens/PerformanceScreen';

const firebaseConfig = {
  apiKey: 'AIzaSyC7uRnd1sb1iHNambzCRM_NmKOnXJBOcHw',
  authDomain: 'carbudget-586ed.firebaseapp.com',
  databaseURL: 'https://carbudget-586ed.firebaseio.com',
  projectId: 'carbudget-586ed',
  storageBucket: 'carbudget-586ed.appspot.com',
  messagingSenderId: '97343240859',
  appId: '1:97343240859:web:c106018b83d4b0a4c5e43e',
  measurementId: 'G-331JDXTXMC',
};

firebase.initializeApp(firebaseConfig);

const AppContainer = createStackNavigator(
  {
    default: createBottomTabNavigator(
      {
        CarInfo: {
          screen: CarInfoScreen,
          navigationOptions: {
            tabBarIcon: ({ tintColor }) => (
              <Icon name="logo-model-s" size={28} color={tintColor} />
            ),
          },
        },
        Notifications: {
          screen: NotificationsScreen,
          navigationOptions: {
            tabBarIcon: ({ tintColor }) => (
              <Icon name="alert" size={28} color={tintColor} />
            ),
          },
        },
        AddExpense: {
          screen: AddExpenseScreen,
          navigationOptions: {
            tabBarIcon: ({ tintColor }) => (
              <Icon
                name="add-circle"
                size={42}
                color={'#E9446A'}
                style={{
                  shadowColor: '#E9446A',
                  shadowOffset: { width: 0, height: 0 },
                  shadowRadius: 10,
                  shadowOpacity: 0.3,
                }}
              />
            ),
          },
        },
        Budget: {
          screen: BudgetScreen,
          navigationOptions: {
            tabBarIcon: ({ tintColor }) => (
              <Icon name="wallet" size={28} color={tintColor} />
            ),
          },
        },
        Performance: {
          screen: PerformanceScreen,
          navigationOptions: {
            tabBarIcon: ({ tintColor }) => (
              <Icon name="speedometer" size={28} color={tintColor} />
            ),
          },
        },
      },
      {
        defaultNavigationOptions: {
          tabBarOnPress: ({ navigation, defaultHandler }) => {
            if (navigation.state.key === 'AddExpense') {
              navigation.navigate('addExpenseModal');
            } else {
              defaultHandler();
            }
          },
        },
        tabBarOptions: {
          activeTintColor: '#161F3D',
          inactiveTintColor: '#B8BBC4',
          showLabel: false,
        },
      },
    ),
    addExpenseModal: {
      screen: AddExpenseScreen,
    },
  },
  {
    mode: 'modal',
    headerMode: 'none',
    // initialRouteName: "postModal"
  },
);

const AuthStack = createStackNavigator({
  Login: LoginScreen,
  Register: RegisterScreen,
});

export default createAppContainer(
  createSwitchNavigator(
    {
      Loading: LoadingScreen,
      App: AppContainer,
      Auth: AuthStack,
    },
    {
      initialRouteName: 'Loading',
    },
  ),
);
