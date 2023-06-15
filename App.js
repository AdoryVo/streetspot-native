import { GOOGLE_API_KEY } from '@env'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { useFonts } from 'expo-font'
import * as SplashScreen from 'expo-splash-screen'
import { getApps, initializeApp } from 'firebase/app'

import { CreateReportModal, MainTabs } from './screens'
import { colors } from './theme'

const DEV_INITIAL_SCREEN = 'Main'
const firebaseConfig = {
  apiKey: GOOGLE_API_KEY || 'AIzaSyDKONPXXmii6ukk84Uioc-B5h1dEzO39YM',
  authDomain: 'streetspot-51164.firebaseapp.com',
  databaseURL: 'https://streetspot-51164-default-rtdb.firebaseio.com/',
  projectId: 'streetspot-51164',
  storageBucket: 'streetspot-51164.appspot.com',
  messagingSenderId: '728748622177',
  appId: '1:728748622177:web:004b25e63a2febe5124520',
  measurementId: 'G-C2M0SNTY49',
}

SplashScreen.preventAutoHideAsync()

if (!getApps().length) {
  initializeApp(firebaseConfig)
}

const RootStack = createNativeStackNavigator()

export default function App() {
  const [fontsLoaded] = useFonts({
    'Inter-Black': require('./assets/fonts/Inter-Black.otf'),
    'SF Pro': require('./assets/fonts/SF-Pro-Display-Medium.otf'),
  })

  if (!fontsLoaded) {
    return null
  }

  return (
    <NavigationContainer
      documentTitle={{
        formatter: (options, route) =>
          `${options?.title ?? route?.name} - Streetspot`,
      }}
    >
      <RootStack.Navigator
        initialRouteName={
          process.env.NODE_ENV === 'development' ? DEV_INITIAL_SCREEN : 'Main'
        }
        screenOptions={{
          contentStyle: {
            overflow: 'hidden',
          },
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.text,
          headerTitleStyle: { color: colors.text, fontFamily: 'SF Pro' },
        }}
      >
        <RootStack.Group>
          <RootStack.Screen
            name="Main"
            component={MainTabs}
            options={{ headerShown: false }}
          />
        </RootStack.Group>
        <RootStack.Group screenOptions={{ presentation: 'modal' }}>
          <RootStack.Screen
            name="Create Report Modal"
            component={CreateReportModal}
            options={{ title: 'Create a Report' }}
            initialParams={{ lat: 32.8801, lng: -117.234 }}
          />
        </RootStack.Group>
      </RootStack.Navigator>
    </NavigationContainer>
  )
}
