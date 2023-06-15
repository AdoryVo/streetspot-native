import FontAwesome from '@expo/vector-icons/FontAwesome'
import { GoogleMap, InfoWindowF, MarkerF } from '@react-google-maps/api'
import * as Location from 'expo-location'
import { getDatabase, onValue, ref } from 'firebase/database'
import { useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { Image, StyleSheet, Text, View } from 'react-native'
import { Balancer } from 'react-wrap-balancer'

import { DATABASE_PATH } from '../constants'
import { colors, components } from '../theme'

const CREATE_MARKER_ID = 'createReport'

export default function Map({ navigation, route, isLoaded }) {
  const [coords, setCoords] = useState({
    lat: route.params.lat,
    lng: route.params.lng,
  })
  const [createMarker, setCreateMarker] = useState(null)
  const [activeMarker, setActiveMarker] = useState(
    route.params.id ?? CREATE_MARKER_ID
  )
  const [reports, setReports] = useState({})

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
    setActiveMarker(CREATE_MARKER_ID)
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

  useEffect(() => {
    setCoords({
      lat: route.params.lat,
      lng: route.params.lng,
    })
  }, [route])

  useEffect(() => {
    const db = getDatabase()
    const reportsRef = ref(db, DATABASE_PATH)
    onValue(reportsRef, (snapshot) => {
      const data = snapshot.val()
      setReports(data)
    })
  }, [])

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
          <MarkerF
            draggable={true}
            position={coords}
            label={{
              color: 'white',
              text: '+',
            }}
            onClick={() => setActiveMarker(CREATE_MARKER_ID)}
            onLoad={onLoadMarker}
            zIndex={100}
          >
            {activeMarker === CREATE_MARKER_ID && (
              <InfoWindowF
                position={coords}
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
              </InfoWindowF>
            )}
          </MarkerF>

          {Object.entries(reports).map(([id, report]) => (
            <MarkerF
              key={id}
              position={{
                lat: report.lat,
                lng: report.lng,
              }}
              onClick={() => setActiveMarker(id)}
            >
              {activeMarker === id && (
                <InfoWindowF
                  position={{
                    lat: report.lat,
                    lng: report.lng,
                  }}
                  onCloseClick={() => setActiveMarker(null)}
                  visible={activeMarker === id}
                >
                  <View style={{ marginTop: '0.5em' }}>
                    <Image
                      source={{ uri: report.image }}
                      style={{
                        width: '100%',
                        height: '300px',
                        resizeMode: 'contain',
                        border: '2px solid #cccccc',
                        backgroundColor: '#eeeeee',
                        borderRadius: '5px',
                        marginBottom: '0.5em',
                      }}
                    />

                    <Text style={styles.text}>
                      <h3 style={{ margin: 0, textTransform: 'capitalize' }}>
                        {report.title}
                      </h3>
                    </Text>

                    <View style={{ flex: 1, flexDirection: 'row' }}>
                      <Text style={{ ...styles.text, ...styles.badge }}>
                        {report.category}
                      </Text>
                      <Text style={{ ...styles.text, ...styles.badge }}>
                        <FontAwesome name="thumbs-up" /> {report.likes}
                      </Text>
                      <Text style={{ ...styles.text, ...styles.badge }}>
                        <FontAwesome name="thumbs-down" /> {report.dislikes}
                      </Text>
                    </View>

                    <Text style={{ ...styles.text, marginVertical: '0.75em' }}>
                      {report.description}
                    </Text>

                    <Text style={styles.text}>
                      Reported at {new Date(report.createdAt).toLocaleString()}
                    </Text>

                    <View
                      style={{
                        width: 'fit-content',
                        marginHorizontal: 'auto',
                        marginTop: '0.5em',
                      }}
                    >
                      <FontAwesome.Button
                        name="map-pin"
                        backgroundColor={colors.palette.neutral300}
                        color="white"
                        onPress={() => navigation.navigate('Reports')}
                      >
                        View on reports page
                      </FontAwesome.Button>
                    </View>
                  </View>
                </InfoWindowF>
              )}
            </MarkerF>
          ))}
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
  text: {
    fontFamily: 'SF Pro',
    fontSize: '12px',
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
  badge: {
    textTransform: 'capitalize',
    backgroundColor: '#cccccc',
    color: 'black',
    borderRadius: '4px',
    display: 'inline',
    width: 'fit-content',
    padding: '0.25em',
    marginEnd: '0.5em',
  },
})
