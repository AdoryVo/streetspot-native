import { GOOGLE_MAPS_API_KEY } from '@env'
import FontAwesome from '@expo/vector-icons/FontAwesome'
import { Loader } from '@googlemaps/js-api-loader'
import * as Location from 'expo-location'
import { StatusBar } from 'expo-status-bar'
import { useEffect, useRef, useState } from 'react'
import { Image, StyleSheet, Text, TextInput, View } from 'react-native'
import Balancer from 'react-wrap-balancer'

import { colors, components } from '../theme'

const loader = new Loader({
  apiKey: process.env.GOOGLE_MAPS_API_KEY || GOOGLE_MAPS_API_KEY,
  version: 'weekly',
  libraries: ['places'],
})

export default function Home({ navigation }) {
  const [autocomplete, setAutocomplete] = useState(null)
  const autocompleteRef = useRef(null)

  function handleSearch() {
    const place = autocomplete.getPlace()

    navigation.navigate('Map', place.geometry.location.toJSON())
  }

  async function handleUseCurrentLocation() {
    const location = await Location.getCurrentPositionAsync({})
    navigation.navigate('Map', {
      lat: location.coords.latitude,
      lng: location.coords.longitude,
    })
  }

  useEffect(() => {
    loader.importLibrary('places').then((Places) => {
      const autocomplete = new Places.Autocomplete(autocompleteRef.current)
      autocomplete.setFields(['geometry'])
      setAutocomplete(autocomplete)
    })
  }, [])

  return (
    <View style={components.container}>
      <View style={{ marginBottom: '1em', textAlign: 'center' }}>
        <Image
          style={{
            width: '5em',
            height: '5em',
            marginHorizontal: 'auto',
            marginBottom: '0.5em',
          }}
          source={require('../assets/adaptive-icon.png')}
        />
        <Text style={styles.title}>
          <h1 style={{ margin: 0 }}>STREETSPOT</h1>
        </Text>

        <Text>
          <h2 style={{ fontFamily: 'SF Pro', fontWeight: 'normal', margin: 0 }}>
            <Balancer>
              Spot and report local infrastructure issues in your area to
              improve your city!
            </Balancer>
          </h2>
        </Text>
      </View>

      <View style={{ marginTop: '1em', width: '75%', maxWidth: '300px' }}>
        {/* Search input */}
        <TextInput
          placeholder="Search for a location"
          placeholderTextColor="gray"
          style={{ ...components.input, marginBottom: '0.5em', width: '100%' }}
          ref={autocompleteRef}
        />
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
            onPress={() => navigation.navigate('Reports')}
          >
            List of Local Reports
          </FontAwesome.Button>

          <Text style={styles.text}>
            Made with 💖 from San Diego
            <br />
            <a
              href="https://github.com/AdoryVo/streetspot-2021"
              target="_blank"
            >
              Source Code
            </a>
          </Text>
        </View>
      </View>
      <StatusBar style="auto" />
    </View>
  )
}

const styles = StyleSheet.create({
  title: {
    color: colors.background,
    fontFamily: 'Inter-Black',
    fontSize: '1.5em',
  },
  text: {
    textAlign: 'center',
    marginVertical: '0.5em',
    fontFamily: 'SF Pro',
  },
})
