import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { colors } from '../theme/colors'
import Home from './home'
import Map from './map'
import Reports from './reports'

const MainStack = createNativeStackNavigator()

export default function Main() {
  return (
    <MainStack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.background },
        headerTintColor: colors.text,
        headerTitleStyle: { color: colors.text, fontFamily: 'SF Pro' },
      }}
    >
      <MainStack.Screen
        name="Home"
        component={Home}
        options={{ title: 'Streetspot' }}
      />
      <MainStack.Screen name="Map" component={Map} />
      <MainStack.Screen name="Reports" component={Reports} />
    </MainStack.Navigator>
  )
}
