import FontAwesome from '@expo/vector-icons/FontAwesome'
import { inject } from '@vercel/analytics'
import { useFonts } from 'expo-font'
import { SplashScreen, Stack, usePathname } from 'expo-router'
import Head from 'expo-router/head'
import { getApps, initializeApp } from 'firebase/app'
import { useEffect } from 'react'
import { Provider } from 'react-wrap-balancer'

import { MapsProvider } from '../components/maps-context'
import { PATHNAME_DESC_MAP, PATHNAME_TITLE_MAP } from '../constants'
import { colors } from '../constants/theme'

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

// Initialize Firebase config if not initialized
if (!getApps().length) {
  initializeApp(firebaseConfig)
}

// Inject Vercel Analytics
inject()

export default function RootLayout() {
  const [loaded, error] = useFonts({
    'Inter-Black': require('../assets/fonts/Inter-Black.otf'),
    'SF Pro': require('../assets/fonts/SF-Pro-Display-Medium.otf'),
    ...FontAwesome.font,
  })

  const pathname = usePathname()

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

  return (
    <>
      <Head>
        <title>
          {PATHNAME_TITLE_MAP[pathname] ?? PATHNAME_TITLE_MAP['/404']}
        </title>
        <meta
          name="description"
          content={PATHNAME_DESC_MAP[pathname] ?? PATHNAME_DESC_MAP['/default']}
        />
        <meta property="og:url" content="https://streetspot.netlify.app" />
        <meta
          property="og:title"
          content={PATHNAME_TITLE_MAP[pathname] ?? PATHNAME_TITLE_MAP['/404']}
        />
        <meta
          property="og:description"
          content={PATHNAME_DESC_MAP[pathname] ?? PATHNAME_DESC_MAP['/default']}
        />
        <meta property="og:type" content="website" />
        <meta
          property="og:image"
          content="https://streetspot.netlify.app/screenshot-home.png"
        />
      </Head>
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
