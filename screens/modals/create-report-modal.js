import FontAwesome from '@expo/vector-icons/FontAwesome'
import { randomUUID } from 'expo-crypto'
import * as ImagePicker from 'expo-image-picker'
import { ref as dbRef, getDatabase, set } from 'firebase/database'
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native'
import Select from 'react-select'
import Balancer from 'react-wrap-balancer'

import { DATABASE_PATH } from '../../constants'
import { colors, components } from '../../theme'

const CATEGORY_OPTIONS = [
  { value: 'road', label: 'Road' },
  { value: 'sidewalk', label: 'Sidewalk' },
  { value: 'off-road', label: 'Off-road' },
]

const RequiredText = () => (
  <Text style={{ color: 'red', fontFamily: 'SF Pro' }}>
    Please fill out this field.
  </Text>
)

function addReport(data) {
  const db = getDatabase()
  set(dbRef(db, `${DATABASE_PATH}/` + randomUUID()), data)
}

export default function CreateReportModal({ navigation, route }) {
  const { lat, lng } = route.params

  const [image, setImage] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: '',
      description: '',
      category: '',
      lat,
      lng,
      likes: 0,
      dislikes: 0,
      createdAt: new Date().toUTCString(),
    },
  })

  async function pickImage() {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    })

    if (!result.canceled) {
      setImage(result.assets[0].uri)
    }
  }

  async function uploadImage() {
    const blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest()
      xhr.onload = function () {
        resolve(xhr.response)
      }
      xhr.onerror = function (e) {
        console.log(e)
        reject(new TypeError('Network request failed'))
      }
      xhr.responseType = 'blob'
      xhr.open('GET', image, true)
      xhr.send(null)
    })

    const fileRef = ref(getStorage(), randomUUID())
    const result = await uploadBytes(fileRef, blob)

    console.debug(result)

    return await getDownloadURL(fileRef)
  }

  function onSubmit(data) {
    setSubmitting(true)
    uploadImage().then((uploadURL) => {
      const parsedData = {
        ...data,
        category: data.category.value,
        image: uploadURL,
      }

      console.debug(parsedData)

      addReport(parsedData)
      setSubmitting(false)
      navigation.navigate('Main', { screen: 'Reports' })
    })
  }

  return (
    <View style={{ ...styles.container, ...components.container }}>
      {/* Header */}
      <FontAwesome name="pencil-square" size={48} color={colors.background} />
      <Text style={components.title}>
        <h1 style={{ margin: '0.25em', textTransform: 'uppercase' }}>
          Create a Report
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
            Describe the issue you saw in detail to mark it on the map!
          </Balancer>
        </h2>
      </Text>

      {/* Form */}
      <View style={{ marginTop: '1em', width: '75%', maxWidth: '300px' }}>
        {/* Title */}
        <Controller
          control={control}
          rules={{ required: true }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              placeholder="Title"
              placeholderTextColor="gray"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              style={{
                ...components.input,
              }}
            />
          )}
          name="title"
        />
        {errors.title && <RequiredText />}

        {/* Description */}
        <Controller
          control={control}
          rules={{ required: true }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              placeholder="Description"
              placeholderTextColor="gray"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              multiline
              numberOfLines={4}
              style={{
                ...components.input,
                ...styles.input,
              }}
            />
          )}
          name="description"
        />
        {errors.description && <RequiredText />}

        {/* Image */}
        <View style={styles.input}>
          <FontAwesome.Button
            name="camera"
            backgroundColor={colors.palette.neutral300}
            onPress={pickImage}
          >
            Choose or take a photo
          </FontAwesome.Button>
          {image && (
            <Image
              source={{ uri: image }}
              style={{
                width: 'auto',
                height: 300,
                marginTop: '0.5em',
                resizeMode: 'contain',
                border: '2px solid #cccccc',
                backgroundColor: '#eeeeee',
                borderRadius: '5px',
              }}
            />
          )}
        </View>

        {/* Category */}
        <Controller
          control={control}
          rules={{ required: true }}
          render={({ field }) => (
            <Select
              placeholder="Category"
              {...field}
              options={CATEGORY_OPTIONS}
              styles={{
                control: (baseStyles, state) => ({
                  ...baseStyles,
                  fontFamily: 'SF Pro',
                }),
                container: (baseStyles, state) => ({
                  ...baseStyles,
                  marginTop: '0.5em',
                }),
                menu: (baseStyles, state) => ({
                  ...baseStyles,
                  fontFamily: 'SF Pro',
                }),
              }}
            />
          )}
          name="category"
        />
        {errors.category && <RequiredText />}

        <View style={styles.input}>
          <FontAwesome.Button
            name="check"
            backgroundColor={colors.palette.neutral400}
            onPress={handleSubmit(onSubmit)}
          >
            Submit
          </FontAwesome.Button>
        </View>

        {submitting && (
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              aliignItems: 'center',
              marginTop: '1em',
              gap: '0.5em',
            }}
          >
            <ActivityIndicator />
            <Text
              style={{
                fontFamily: 'SF Pro',
                fontSize: '16px',
                display: 'flex',
              }}
            >
              Submitting...
            </Text>
          </View>
        )}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    overflow: 'auto',
    paddingVertical: '2em',
  },
  input: {
    marginTop: '0.5em',
  },
})
