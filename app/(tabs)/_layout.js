import FontAwesome from '@expo/vector-icons/FontAwesome'
import { Tabs } from 'expo-router'

import { colors } from '../../theme'

const DEV_INITIAL_SCREEN = 'index'

export default function TabLayout() {
  return (
    <Tabs
      initialRouteName={
        process.env.NODE_ENV === 'development' ? DEV_INITIAL_SCREEN : 'index'
      }
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
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="home" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="map"
        initialParams={{ lat: 32.8801, lng: -117.234 }}
        options={{
          title: 'Map',
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="map" color={color} size={18} />
          ),
        }}
      />
      <Tabs.Screen
        name="reports"
        options={{
          title: 'Reports',
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="map-pin" color={color} size={size} />
          ),
        }}
      />
    </Tabs>
  )
}
