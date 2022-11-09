import React from 'react'
import { View, StyleSheet, Image, Text } from 'react-native'
import { Button } from 'react-native-material-buttons'
import { Icon } from 'react-native-elements'
import SafeAreaView from 'react-native-safe-area-view'
import { fonts, colors, percentWidth, shadow, headers } from 'app/styles'
import { getState } from 'app/lib/react-simply'
import Logo from 'app/assets/images/logo.png'

export default function AdminMainHeader({ navigation }) {
  const [{ notifications, timer }] = getState()

  return (
    <SafeAreaView forceInset={{ top: 'always' }} style={headers.container}>
      <View style={styles.sideContainer}>
        <Button
          shadeBorderRadius={100}
          color="transparent"
          style={styles.button}
          onPress={navigation.openDrawer}
        >
          <Icon
            name="menu"
            type="material-community"
            color="#000000"
            size={percentWidth(5.2)}
          />
        </Button>
      </View>
      <View style={styles.logoContainer}>
        <Image source={Logo} style={{ width: percentWidth(35), height: percentWidth(6.704545456) }} />
      </View>
      <View style={styles.sideContainer}>
        <Button
          shadeBorderRadius={100}
          color="transparent"
          style={styles.button}
          onPress={() => navigation.navigate('Notifications')}
        >
          {notifications.length > 0 && (
            <View style={{
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: colors.secondaryColor,
              width: percentWidth(4.5),
              height: percentWidth(4.5),
              borderRadius: 100,
              position: 'absolute',
              top: percentWidth(0),
              right: percentWidth(0),
              zIndex: 5,
              ...shadow,
            }}
            >
              <Text style={{ color: colors.buttonText, fontFamily: fonts.semiBold, fontSize: percentWidth(2.5) }}>{notifications.length}</Text>
            </View>
          )}
          <Icon
            name="bell-outline"
            type="material-community"
            color="#000000"
            size={percentWidth(5.2)}
          />
        </Button>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  logoContainer: {
    width: percentWidth(70),
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 6,
  },
  sideContainer: {
    width: percentWidth(15),
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: percentWidth(0.5),
  },
  button: {
    width: percentWidth(8),
    height: percentWidth(8),
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
})
