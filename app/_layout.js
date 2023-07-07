import FontAwesome from '@expo/vector-icons/FontAwesome'
import { useFonts } from 'expo-font'
import { SplashScreen, Stack } from 'expo-router'
import { getApps, initializeApp } from 'firebase/app'
import { useEffect } from 'react'
import { Provider } from 'react-wrap-balancer'

import { MapsProvider } from '../components/maps-context'
import { colors } from '../theme'

export { ErrorBoundary } from 'expo-router'

export const unstable_settings = {
  // Ensure that reloading on `/create-report-modal` keeps a back button present.
  initialRouteName: '(tabs)',
}

const DEV_INITIAL_SCREEN = '(tabs)'
const firebaseConfig = {
  apiKey:
    process.env.EXPO_PUBLIC_GOOGLE_API_KEY ||
    'AIzaSyDKONPXXmii6ukk84Uioc-B5h1dEzO39YM',
  authDomain: 'streetspot-51164.firebaseapp.com',
  databaseURL: 'https://streetspot-51164-default-rtdb.firebaseio.com/',
  projectId: 'streetspot-51164',
  storageBucket: 'streetspot-51164.appspot.com',
  messagingSenderId: '728748622177',
  appId: '1:728748622177:web:004b25e63a2febe5124520',
  measurementId: 'G-C2M0SNTY49',
}

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync()

if (!getApps().length) {
  initializeApp(firebaseConfig)
}

export default function RootLayout() {
  const [loaded, error] = useFonts({
    'Inter-Black': require('../assets/fonts/Inter-Black.otf'),
    'SF Pro': require('../assets/fonts/SF-Pro-Display-Medium.otf'),
    ...FontAwesome.font,
  })

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error
  }, [error])

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync()
    }
  }, [loaded])

  if (!loaded) {
    return null
  }

  return <RootLayoutNav />
}

function RootLayoutNav() {
  return (
    <>
      <MapsProvider>
        <Provider>
          <Stack
            initialRouteName={
              process.env.NODE_ENV === 'development'
                ? DEV_INITIAL_SCREEN
                : '(tabs)'
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
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen
              name="create-report-modal"
              options={{ presentation: 'modal', title: 'Create a Report' }}
            />
          </Stack>
        </Provider>
      </MapsProvider>
    </>
  )
}
