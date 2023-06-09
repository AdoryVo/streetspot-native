import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { useFonts } from 'expo-font'
import * as SplashScreen from 'expo-splash-screen'

import MainTabs from './screens/main-tabs'
import ViewReportModal from './screens/modals/create-report-modal'
import { colors } from './theme/colors'

SplashScreen.preventAutoHideAsync()

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
          component={ViewReportModal}
          options={{ title: 'Create a Report' }}
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
