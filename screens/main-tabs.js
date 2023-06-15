import { GOOGLE_API_KEY } from '@env'
import FontAwesome from '@expo/vector-icons/FontAwesome'
import { useJsApiLoader } from '@react-google-maps/api'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { memo } from 'react'

import { colors } from '../theme'
import Home from './home'
import Map from './map'
import Reports from './reports'

const MainTab = createBottomTabNavigator()

const HomeScreen = memo(Home)
const MapScreen = memo(Map)

const libraries = ['places']
const DEV_INITIAL_SCREEN = 'Home'

export default function MainTabs() {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey:
      GOOGLE_API_KEY ?? 'AIzaSyDKONPXXmii6ukk84Uioc-B5h1dEzO39YM',
    libraries,
  })

  return (
    <MainTab.Navigator
      initialRouteName={
        process.env.NODE_ENV === 'development' ? DEV_INITIAL_SCREEN : 'Home'
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
      <MainTab.Screen
        name="Home"
        options={{
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="home" color={color} size={size} />
          ),
        }}
      >
        {(props) => <HomeScreen {...props} isLoaded={isLoaded} />}
      </MainTab.Screen>
      <MainTab.Screen
        name="Map"
        initialParams={{ lat: 32.8801, lng: -117.234 }}
        options={{
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="map" color={color} size={18} />
          ),
        }}
      >
        {(props) => <MapScreen {...props} isLoaded={isLoaded} />}
      </MainTab.Screen>
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
