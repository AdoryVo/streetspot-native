import FontAwesome from '@expo/vector-icons/FontAwesome'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Image } from 'expo-image'
import { router } from 'expo-router'
import {
  getDatabase,
  onValue,
  orderByChild,
  query,
  ref,
  update,
} from 'firebase/database'
import { useEffect, useState } from 'react'
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native'
import { useMediaQuery } from 'react-responsive'
import Balancer from 'react-wrap-balancer'

import { DATABASE_PATH, GRAY_BLURHASH } from '../../constants'
import { colors, components } from '../../constants/theme'

function updateReport(id, report, option) {
  const db = getDatabase()

  const update_values = {
    like: { likes: report.likes + 1 },
    unlike: { likes: report.likes - 1 },
    dislike: { dislikes: report.dislikes + 1 },
    undislike: { dislikes: report.dislikes - 1 },
  }[option]

  update(ref(db, `${DATABASE_PATH}/${id}`), update_values)
}

async function handleRatingPress(id, report, type) {
  const storageItem = await AsyncStorage.getItem(type)
  const ids = new Set(JSON.parse(storageItem))
  console.log(id)
  if (ids.has(id)) {
    // Rated already, un-rate
    ids.delete(id)

    switch (type) {
      case 'likes':
        updateReport(id, report, 'unlike')
        break
      case 'dislikes':
        updateReport(id, report, 'undislike')
        break
      default:
        break
    }
  } else {
    // Not rated, rate
    ids.add(id)

    switch (type) {
      case 'likes':
        updateReport(id, report, 'like')
        break
      case 'dislikes':
        updateReport(id, report, 'dislike')
        break
      default:
        break
    }
  }

  AsyncStorage.setItem(type, JSON.stringify(Array.from(ids)))
}

export default function ReportsScreen() {
  const [reports, setReports] = useState({})
  const [modalImage, setModalImage] = useState('')
  const isMobile = useMediaQuery({
    query: '(max-width: 767px)',
  })

  useEffect(() => {
    const db = getDatabase()
    const reportsRef = query(ref(db, DATABASE_PATH), orderByChild('likes'))
    onValue(reportsRef, (snapshot) => {
      const data = snapshot.val()
      setReports(data)
    })
  }, [])

  return (
    <View style={{ ...components.container, ...styles.container }}>
      {/* Header */}
      <FontAwesome name="binoculars" size={48} color={colors.background} />
      <Text style={components.title}>
        <h1 style={{ margin: '0.25em', textTransform: 'uppercase' }}>
          Reports
        </h1>
      </Text>
      <Text
        style={{
          marginBottom: '0.5rem',
          textAlign: 'center',
        }}
      >
        <h2
          style={{
            fontFamily: 'SF Pro',
            fontWeight: 'normal',
            margin: 0,
          }}
        >
          <Balancer>
            Spot an infrastructure issue?
            <br />
            Take a look at local reports to see if it has been reported yet!
          </Balancer>
        </h2>
      </Text>

      {/* Reports */}
      {Object.keys(reports).length === 0 && (
        <Text style={styles.text}>
          There are either no reports, or reports are loading!
        </Text>
      )}
      {Object.entries(reports).map(([id, report]) => (
        <View
          key={id}
          style={isMobile ? styles.reportCardMobile : styles.reportCard}
        >
          <View style={{ flex: '1 1 auto' }}>
            <Pressable
              onPress={() => setModalImage(report.image)}
              style={{ cursor: 'zoom-in', height: '100%' }}
            >
              <Image
                source={report.image}
                placeholder={GRAY_BLURHASH}
                transition={1000}
                contentFit="cover"
                style={{
                  height: '100%',
                  minHeight: isMobile ? '25vh' : '0',
                  border: '2px solid #cccccc',
                  backgroundColor: '#eeeeee',
                  borderRadius: '5px',
                }}
              />
            </Pressable>
          </View>
          <View style={{ flex: '2 1 auto' }}>
            <View>
              <Text style={styles.text}>
                <h3 style={{ margin: 0, textTransform: 'capitalize' }}>
                  {report.title}
                </h3>
              </Text>
              <Text style={{ ...styles.text, ...styles.category }}>
                {report.category}
              </Text>
              <Text
                style={{
                  ...styles.text,
                  marginVertical: '0.75em',
                }}
              >
                {report.description}
              </Text>
              <Text style={styles.text}>
                Reported at {new Date(report.createdAt).toLocaleString()}
              </Text>
            </View>

            <View style={styles.actionBar}>
              <View style={{ flexDirection: 'row', gap: '0.5em' }}>
                <FontAwesome.Button
                  name="thumbs-up"
                  backgroundColor="#2f855a"
                  color="white"
                  size={14}
                  style={{
                    color: 'white',
                    fontFamily: 'SF Pro',
                  }}
                  onPress={async () => handleRatingPress(id, report, 'likes')}
                >
                  {report.likes}
                </FontAwesome.Button>

                <FontAwesome.Button
                  name="thumbs-down"
                  backgroundColor="#c53030"
                  color="white"
                  size={14}
                  style={{
                    color: 'white',
                    fontFamily: 'SF Pro',
                  }}
                  onPress={async () =>
                    handleRatingPress(id, report, 'dislikes')
                  }
                >
                  {report.dislikes}
                </FontAwesome.Button>
              </View>
              <View style={{ width: 'fit-content' }}>
                <FontAwesome.Button
                  name="map"
                  backgroundColor={colors.palette.neutral400}
                  size={16}
                  onPress={() =>
                    router.replace({
                      pathname: 'map',
                      params: {
                        id,
                        lat: report.lat - 0.0003,
                        lng: report.lng,
                      },
                    })
                  }
                >
                  View On Map
                </FontAwesome.Button>
              </View>
            </View>
          </View>
        </View>
      ))}

      {/* Image modal */}
      <Modal
        animationType="fade"
        visible={modalImage !== ''}
        transparent={true}
      >
        <Pressable
          style={styles.centeredView}
          onPress={() => setModalImage('')}
        >
          <View style={isMobile ? styles.modalViewMobile : styles.modalView}>
            <Image
              source={{ uri: modalImage }}
              contentFit="contain"
              style={{
                width: '100%',
                height: 'inherit',
                borderRadius: '5px',
              }}
            />
          </View>
        </Pressable>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  actionBar: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: '1em',
    justifyContent: 'space-between',
    marginTop: '0.5em',
  },
  container: {
    justifyContent: 'flex-start',
    paddingTop: '2em',
    overflow: 'auto',
  },
  text: {
    fontFamily: 'SF Pro',
    fontSize: '16px',
  },
  reportCard: {
    flexDirection: 'row',
    gap: '1em',
    backgroundColor: 'white',
    border: '1px solid #cccccc',
    borderRadius: '5px',
    width: '75%',
    padding: '1em',
    marginBottom: '1em',
  },
  reportCardMobile: {
    flex: 'grow',
    flexDirection: 'column',
    gap: '1em',
    backgroundColor: 'white',
    border: '1px solid #cccccc',
    borderRadius: '5px',
    width: '85%',
    padding: '1em',
    marginBottom: '1em',
  },
  category: {
    textTransform: 'capitalize',
    backgroundColor: '#cccccc',
    color: 'black',
    borderRadius: '4px',
    fontSize: '13px',
    display: 'inline-block',
    width: 'fit-content',
    padding: '0.25em',
    marginVertical: '0.25em',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 'auto',
    width: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    width: '66vw',
    height: '75vh',
  },
  modalViewMobile: {
    width: '80vw',
    height: '75vh',
  },
})
