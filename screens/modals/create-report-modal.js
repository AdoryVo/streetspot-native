import FontAwesome from '@expo/vector-icons/FontAwesome'
import * as ImagePicker from 'expo-image-picker'
import { StatusBar } from 'expo-status-bar'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { Image, StyleSheet, Text, TextInput, View } from 'react-native'
import Select from 'react-select'
import { Balancer } from 'react-wrap-balancer'
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

export default function CreateReportModal({ route }) {
  const { lat, lng } = route.params

  const [image, setImage] = useState(null)
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

  const pickImage = async () => {
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

  function onSubmit(data) {
    const parsedData = {
      ...data,
      category: data.category.value,
      image,
    }

    console.log(parsedData)
  }

  return (
    <View style={components.container}>
      {/* Header */}
      <FontAwesome name="pencil-square" size={48} color={colors.background} />
      <Text style={components.title}>
        <h1 style={{ margin: '0.25em' }}>Create a Report</h1>
      </Text>
      <Text
        style={{
          marginBottom: '0.5rem',
          textAlign: 'center',
          color: colors.background,
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
      </View>

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
  input: {
    marginTop: '0.5em',
  },
})
