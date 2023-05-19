import React from 'react';
import { NavigationContainer, getFocusedRouteNameFromRoute } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { MaterialIcons } from '@expo/vector-icons';

import InventoryScreen from './src/InventoryScreen';
import AddProductScreen from './src/AddProductScreen';
import MonthlyProfitScreen from './src/MonthlyProfitScreen';
import SellProductScreen from './src/SellProductScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const App = () => {

  const getActiveRouteState = (route) => {
    const routeName = getFocusedRouteNameFromRoute(route) ?? 'Inventory';

    const screenOptions = {
      tabBarActiveTintColor: 'blue',
      tabBarInactiveTintColor: 'gray',
      tabBarStyle: [
        {
          display: 'flex',
        },
        null,
      ],
    };

    return {
      screenOptions,
      routeName,
    };
  };

  const TabBar = ({ navigation, route }) => {
    const { screenOptions } = getActiveRouteState(route);

    return (
      <Tab.Navigator screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === 'Inventory') {
            iconName = 'inventory';
          } else if (route.name === 'Add Product') {
            iconName = 'add';
          } else if (route.name === 'Monthly Profit') {
            iconName = 'attach-money';
          }

          return <MaterialIcons name={iconName} size={size} color={color} />;
        },
      })}>
        <Tab.Screen name="Inventory" component={InventoryScreen} options={{ headerShown: false }} />
        <Tab.Screen name="Add Product" component={AddProductScreen} options={{ headerShown: false }} />
        <Tab.Screen name="Monthly Profit" component={MonthlyProfitScreen} options={{ headerShown: false }} />
      </Tab.Navigator>
    );
  };

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Main"
          component={TabBar}
          options={{
            headerTitle: 'Inventory Management',
            headerTitleStyle: {
              textAlign: 'center',
              fontWeight: 'bold',
            },
          }}
        />
        <Stack.Screen name="SellProduct" component={SellProductScreen} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
