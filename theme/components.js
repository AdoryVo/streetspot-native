import { StyleSheet } from 'react-native'
import { colors } from './colors'

export const components = StyleSheet.create({
  container: {
    flex: 1,
    backgroundImage:
      'linear-gradient(to bottom right, white, #E0EEFF 70%, #C0DEFF)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: colors.background,
    fontFamily: 'Inter-Black',
    fontSize: '1em',
  },
  input: {
    fontFamily: 'SF Pro',
    fontSize: '16px',
    border: '1px solid #cccccc',
    borderRadius: '5px',
    backgroundColor: 'white',
    padding: '0.75em',
  },
})
