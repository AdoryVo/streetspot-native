import FontAwesome from '@expo/vector-icons/FontAwesome'
import { Link, Stack } from 'expo-router'
import { StyleSheet, Text, View } from 'react-native'
import { Balancer } from 'react-wrap-balancer'

import { colors } from '../theme'

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Page Not Found' }} />
      <View style={styles.container}>
        <FontAwesome name="moon-o" size={48} color={colors.background} />
        <Text style={styles.title}>
          <h1 style={{ margin: 0 }}>404: Not Found</h1>
        </Text>

        <Text style={styles.text}>
          <Balancer>
            It seems like you've stumbled upon an invalid page!
            <br />
            If you expect to find a page here, feel free to email me at{' '}
            <a href="mailto:adoryvo.business@gmail.com">
              adoryvo.business@gmail.com
            </a>{' '}
            detailing the error so that I can fix this. Thanks!
          </Balancer>
        </Text>

        <Link href="/">
          <FontAwesome.Button
            name="arrow-left"
            backgroundColor={colors.palette.neutral400}
          >
            Return home
          </FontAwesome.Button>
        </Link>
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    color: colors.background,
    textFillColor: 'transparent',
    fontFamily: 'Inter-Black',
    fontSize: '1em',
  },
  text: {
    textAlign: 'center',
    marginVertical: '0.75em',
    fontFamily: 'SF Pro',
  },
})
