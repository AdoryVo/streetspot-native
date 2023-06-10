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
  map: {
    width: '100%',
    height: '100%',
  },
})
