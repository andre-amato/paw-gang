import { View, Image, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import Constants from 'expo-constants';
import SearchScreen from './SearchScreen';
import PlanScreen from './PlanScreen';
import ParkSchedule from './ParkSchedule';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function SearchStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Back"
        component={SearchScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="ParkSchedule" component={ParkSchedule} />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <View style={styles.logoDiv}>
        <Image source={require('./assets/logo.jpg')} style={styles.logo} />
      </View>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'SearchTab') {
              iconName = focused ? 'search' : 'search-outline';
            } else if (route.name === 'MyPlansTab') {
              iconName = focused ? 'list' : 'list-outline';
            }

            return (
              <Icon
                name={iconName || 'list-outline'}
                size={size}
                color={color}
              />
            );
          },
          tabBarActiveTintColor: '#008CBA',
          tabBarInactiveTintColor: 'gray',
          headerShown: false,
        })}
      >
        <Tab.Screen
          name="SearchTab"
          component={SearchStack}
          options={{ title: 'Search' }}
        />
        <Tab.Screen
          name="MyPlansTab"
          component={PlanScreen}
          options={{ title: 'My Plans' }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#333',
    flex: 1,
  },
  logo: {
    height: 75,
    resizeMode: 'contain',
    width: 150,
  },
  logoDiv: {
    alignItems: 'center',
    backgroundColor: '#cfcec9',
    padding: 10,
    paddingTop: Constants.statusBarHeight,
    width: '100%',
  },
});
