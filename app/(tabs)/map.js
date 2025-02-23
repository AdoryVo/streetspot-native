import FontAwesome from '@expo/vector-icons/FontAwesome'
import { GoogleMap, InfoWindowF, MarkerF } from '@react-google-maps/api'
import { Image } from 'expo-image'
import * as Location from 'expo-location'
import { router, useLocalSearchParams } from 'expo-router'
import { getDatabase, onValue, ref } from 'firebase/database'
import { useEffect, useMemo, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { StyleSheet, Text, View } from 'react-native'
import Balancer from 'react-wrap-balancer'

import { useMaps } from '../../components/maps-context'
import { DATABASE_PATH, GRAY_BLURHASH } from '../../constants'
import { colors, components } from '../../constants/theme'

const CREATE_MARKER_ID = 'createReport'

export default function MapScreen() {
  const params = useLocalSearchParams()

  const coords = useMemo(
    () => ({ lat: parseFloat(params.lat), lng: parseFloat(params.lng) }),
    [params]
  )

  const [createMarker, setCreateMarker] = useState(null)
  const [activeMarker, setActiveMarker] = useState(
    params.id ?? CREATE_MARKER_ID
  )
  const [reports, setReports] = useState({})
  const { isLoaded } = useMaps()

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
    router.setParams({
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
                        router.push({
                          pathname: 'create-report-modal',
                          params: createMarker.getPosition().toJSON(),
                        })
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
                      source={report.image}
                      placeholder={GRAY_BLURHASH}
                      contentFit="scale-down"
                      style={{
                        width: '100%',
                        height: '300px',
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
                        onPress={() => router.replace('reports')}
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
