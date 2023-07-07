import FontAwesome from '@expo/vector-icons/FontAwesome'
import { Autocomplete } from '@react-google-maps/api'
import * as Location from 'expo-location'
import { router } from 'expo-router'
import { useRef, useState } from 'react'
import { Image, StyleSheet, Text, TextInput, View } from 'react-native'
import Balancer from 'react-wrap-balancer'

import { useMaps } from '../../components/maps-context'
import { colors, components } from '../../constants/theme'

export default function HomeScreen() {
  const [autocomplete, setAutocomplete] = useState(null)
  const autocompleteRef = useRef(null)
  const { isLoaded } = useMaps()

  function handleSearch() {
    const place = autocomplete.getPlace()

    router.replace({
      pathname: 'map',
      params: place.geometry.location.toJSON(),
    })
  }

  async function handleUseCurrentLocation() {
    const location = await Location.getCurrentPositionAsync({})
    router.replace({
      pathname: 'map',
      params: {
        lat: location.coords.latitude,
        lng: location.coords.longitude,
      },
    })
  }

  function onAutocompleteLoad(autocomplete) {
    autocomplete.setFields(['geometry'])
    setAutocomplete(autocomplete)
  }

  return (
    <View style={components.container}>
      <View style={{ marginBottom: '1em' }}>
        <Image
          style={{
            width: '5em',
            height: '5em',
            marginHorizontal: 'auto',
            marginBottom: '0.5em',
          }}
          source={require('../../assets/images/adaptive-icon.png')}
        />
        <Text style={{ ...styles.title, textAlign: 'center' }}>
          <h1 style={{ margin: 0, textTransform: 'uppercase' }}>Streetspot</h1>
        </Text>

        <Text>
          <h2 style={{ fontFamily: 'SF Pro', fontWeight: 'normal', margin: 0 }}>
            <Balancer>
              Report local infrastructure issues you spot in your area to
              improve your city!
            </Balancer>
          </h2>
        </Text>
      </View>

      <View style={{ marginTop: '1em', width: '75%', maxWidth: '300px' }}>
        {/* Search input */}
        {isLoaded && (
          <Autocomplete onLoad={onAutocompleteLoad}>
            <TextInput
              placeholder="Search for a location"
              placeholderTextColor="gray"
              style={{
                ...components.input,
                marginBottom: '0.5em',
                width: '100%',
              }}
              ref={autocompleteRef}
            />
          </Autocomplete>
        )}
        <FontAwesome.Button
          name="search"
          backgroundColor={colors.background}
          onPress={handleSearch}
        >
          Search
        </FontAwesome.Button>

        {/* Use current location */}
        <View style={{ width: 'fit-content', marginHorizontal: 'auto' }}>
          <Text style={styles.text}>or</Text>

          <FontAwesome.Button
            name="map-marker"
            backgroundColor={colors.palette.neutral400}
            onPress={handleUseCurrentLocation}
          >
            Use Current Location
          </FontAwesome.Button>
        </View>

        <View
          style={{
            borderBottomColor: 'lightgray',
            borderBottomWidth: StyleSheet.hairlineWidth,
            marginVertical: '1em',
          }}
        />

        {/* Reports link */}
        <View style={{ width: 'fit-content', marginHorizontal: 'auto' }}>
          <FontAwesome.Button
            name="list"
            backgroundColor={colors.background}
            onPress={() => router.replace('reports')}
          >
            List of Local Reports
          </FontAwesome.Button>

          <Text style={styles.text}>
            Made with 💖 from San Diego
            <br />
            <a
              href="https://github.com/AdoryVo/streetspot-native"
              target="_blank"
            >
              Source Code
            </a>
          </Text>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  title: {
    color: colors.background,
    textFillColor: 'transparent',
    fontFamily: 'Inter-Black',
    fontSize: '1.5em',
  },
  text: {
    textAlign: 'center',
    marginVertical: '0.5em',
    fontFamily: 'SF Pro',
  },
})
