import FontAwesome from '@expo/vector-icons/FontAwesome'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { colors } from '../theme/colors'
import Home from './home'
import Map from './map'
import Reports from './reports'

const MainTab = createBottomTabNavigator()

export default function MainTabs() {
  return (
    <MainTab.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.background },
        headerTintColor: colors.text,
        headerTitleStyle: { color: colors.text, fontFamily: 'SF Pro' },
        tabBarStyle: { backgroundColor: colors.background },
        tabBarInactiveTintColor: colors.text,
        tabBarActiveTintColor: colors.palette.neutral200,
        tabBarLabelStyle: { fontFamily: 'SF Pro' },
      }}
    >
      <MainTab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="home" color={color} size={size} />
          ),
        }}
      />
      <MainTab.Screen
        name="Map"
        component={Map}
        options={{
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="map-marker" color={color} size={size} />
          ),
        }}
      />
      <MainTab.Screen
        name="Reports"
        component={Reports}
        options={{
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="map-pin" color={color} size={size} />
          ),
        }}
      />
    </MainTab.Navigator>
  )
}
