import { StatusBar } from 'expo-status-bar'
import { Button, View } from 'react-native'
import { components } from '../theme'

export default function Reports({ navigation }) {
  return (
    <View style={components.container}>
      <Button
        title="View Report Modal"
        onPress={() => navigation.navigate('View Report Modal')}
      />
      <StatusBar style="auto" />
    </View>
  )
}
