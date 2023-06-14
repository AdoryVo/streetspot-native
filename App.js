import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { useFonts } from 'expo-font'
import * as SplashScreen from 'expo-splash-screen'

import { CreateReportModal, MainTabs, ViewReportModal } from './screens'
import { colors } from './theme'

SplashScreen.preventAutoHideAsync()

const RootStack = createNativeStackNavigator()

const DEV_INITIAL_SCREEN = 'Main'

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
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.text,
          headerTitleStyle: { color: colors.text, fontFamily: 'SF Pro' },
        }}
      >
        <RootStack.Screen
          name="Main"
          component={MainTabs}
          options={{ headerShown: false }}
        />
        <RootStack.Screen
          name="Create Report Modal"
          component={CreateReportModal}
          options={{ title: 'Create a Report' }}
          initialParams={{ lat: 32.8801, lng: -117.234 }}
        />
        <RootStack.Screen
          name="View Report Modal"
          component={ViewReportModal}
          options={{ title: 'Report Details' }}
        />
      </RootStack.Navigator>
    </NavigationContainer>
  )
}
