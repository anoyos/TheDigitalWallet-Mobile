import React from 'react'
import { View, StyleSheet, Image, Text } from 'react-native'
import { Button } from 'react-native-material-buttons'
import { Icon } from 'react-native-elements'
import SafeAreaView from 'react-native-safe-area-view'
import { fonts, colors, percentWidth, shadow, headers } from 'app/styles'
import { getState } from 'app/lib/react-simply'
import Logo from 'app/assets/images/logo.png'

export default function ClubHeader({ navigation }) {
  const [{ cart }] = getState()

  return (
    <SafeAreaView forceInset={{ top: 'always' }}  style={{
      height: 50,

      alignContent: 'center',

      flexDirection: 'row',
    }}>
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
        <Text style={headers.title}>The Club</Text>
      </View>
      <View style={styles.sideContainer}>
        <Button
          shadeBorderRadius={100}
          color="transparent"
          style={styles.button}
          onPress={() => navigation.navigate('ShoppingCart')}
        >
          {cart.length > 0 && (
            <View style={{
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: colors.secondaryColor,
              width: percentWidth(4),
              height: percentWidth(4),
              borderRadius: 100,
              position: 'absolute',
              top: percentWidth(0),
              right: percentWidth(0),
              zIndex: 5,
              ...shadow,
            }}
            >
              <Text style={{ color: colors.buttonText, fontFamily: fonts.semiBold, fontSize: percentWidth(2.7) }}>{cart.length}</Text>
            </View>
          )}
          <Icon
            name="cart-outline"
            type="material-community"
            color="#000000"
            size={23}
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
    paddingBottom: percentWidth(1.5),
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
