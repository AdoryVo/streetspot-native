import FontAwesome from '@expo/vector-icons/FontAwesome'
import { GoogleMap, InfoWindow, Marker } from '@react-google-maps/api'
import * as Location from 'expo-location'
import { useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'

import { createRoot } from 'react-dom/client'
import { Balancer } from 'react-wrap-balancer'
import { colors, components } from '../theme'

const CREATE_MARKER_ID = 'createReport'

export default function Map({ navigation, route, isLoaded }) {
  const [coords, setCoords] = useState({
    lat: route.params.lat,
    lng: route.params.lng,
  })
  const [createMarker, setCreateMarker] = useState(null)
  const [activeMarker, setActiveMarker] = useState(CREATE_MARKER_ID)

  const LocationButtonDiv = () => (
    <View style={styles.locationButtonDiv}>
      <FontAwesome.Button
        name="map-marker"
        backgroundColor={colors.palette.neutral400}
        onPress={handleUseCurrentLocation}
      >
        Use Current Location
      </FontAwesome.Button>
    </View>
  )

  async function handleUseCurrentLocation() {
    const location = await Location.getCurrentPositionAsync({})
    setCoords({
      lat: location.coords.latitude,
      lng: location.coords.longitude,
    })
  }

  function onLoadMap(map) {
    // Add Current Location button
    const locationButtonDiv = document.createElement('div')
    createRoot(locationButtonDiv).render(<LocationButtonDiv />)
    map.controls[google.maps.ControlPosition.BOTTOM_CENTER].push(
      locationButtonDiv
    )
  }

  function onLoadMarker(marker) {
    setCreateMarker(marker)
  }

  return (
    <View style={components.container}>
      {isLoaded ? (
        <GoogleMap
          center={coords}
          zoom={18}
          onLoad={onLoadMap}
          mapContainerStyle={styles.map}
        >
          {/* Create Report Marker */}
          <Marker
            draggable={true}
            position={coords}
            label={{
              color: 'white',
              text: '+',
            }}
            onClick={() => setActiveMarker(CREATE_MARKER_ID)}
            onLoad={onLoadMarker}
          >
            {activeMarker === CREATE_MARKER_ID && (
              <InfoWindow
                onCloseClick={() => setActiveMarker(null)}
                visible={activeMarker === CREATE_MARKER_ID}
              >
                <View>
                  <Text style={{ textAlign: 'center' }}>
                    <Balancer>
                      Drag the marker to report a specific location!
                    </Balancer>
                  </Text>
                  <View
                    style={{ width: 'fit-content', marginHorizontal: 'auto' }}
                  >
                    <FontAwesome.Button
                      name="binoculars"
                      backgroundColor="white"
                      color={colors.palette.neutral300}
                      style={{
                        borderColor: colors.palette.neutral300,
                        borderWidth: '1px',
                        margin: '0.25em',
                      }}
                      onPress={() =>
                        navigation.navigate(
                          'Create Report Modal',
                          createMarker.getPosition().toJSON()
                        )
                      }
                    >
                      Make a report
                    </FontAwesome.Button>
                  </View>
                </View>
              </InfoWindow>
            )}
          </Marker>
        </GoogleMap>
      ) : (
        <Text>Loading...</Text>
      )}
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
  locationButtonDiv: {
    width: 'fit-content',
    marginHorizontal: 'auto',
    marginBottom: '1.5em',
  },
})
