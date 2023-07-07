import { useJsApiLoader } from '@react-google-maps/api'
import React from 'react'

const MapsContext = React.createContext(null)
const libraries = ['places']

export function useMaps() {
  return React.useContext(MapsContext)
}

export function MapsProvider(props) {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey:
      process.env.EXPO_PUBLIC_GOOGLE_API_KEY ||
      'AIzaSyDKONPXXmii6ukk84Uioc-B5h1dEzO39YM',
    libraries,
  })

  return (
    <MapsContext.Provider
      value={{
        isLoaded,
      }}
    >
      {props.children}
    </MapsContext.Provider>
  )
}
