import { StatusBar } from 'expo-status-bar'
import { StyleSheet, Text, View } from 'react-native'
import { components } from '../theme'

export default function Map({ route }) {
  const { lat, lng } = route.params

  return (
    <View style={components.container}>
      <Text>
        Latitude: {lat}
        <br />
        Longitude: {lng}
      </Text>
      <StatusBar style="auto" />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
})
