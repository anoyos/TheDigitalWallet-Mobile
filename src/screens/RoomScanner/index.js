import React from 'react'
import { View, StyleSheet, Text } from 'react-native'
import QRCodeScanner from 'react-native-qrcode-scanner'
import SafeAreaView from 'react-native-safe-area-view'
import { SubHeader } from 'app/components/Headers'
import { getState } from 'app/lib/react-simply'
import { screenWidth, colors, fonts, containers } from 'app/styles'

export default function RoomScanner({ navigation }) {
  const symbol = navigation.getParam('symbol', false)
  const [, dispatch] = getState()
  const handleQRScanned = ({ data }) => {
    const { toAddress, name, symbol: transferSymbol, email, amount } = JSON.parse(data)
    const payload = { toAddress, name, symbol: transferSymbol, toEmail: email }
    if (amount) {
      payload.amount = amount
      dispatch({ type: 'setTransfer', payload })
      navigation.navigate('ConfirmTransfer')
    } else {
      dispatch({ type: 'setTransfer', payload })
      navigation.navigate('TransferAmount')
    }
  }

  return (
    <SafeAreaView forceInset={{ top: 'always' }} style={{ flex: 1 }}>
      <SubHeader title={symbol ? `Pay with ${symbol}` : 'Pay'} navigation={navigation} />
      <View style={containers.screenContainer}>
        <View style={styles.userInfoContainer}>
          <Text style={styles.userInfoText}>QR code scanner</Text>
          <Text style={{
            color: colors.secondaryColor,
            fontSize: screenWidth * 0.025,
            fontFamily: fonts.regular,
            width: screenWidth * 0.7,
            marginTop: 5,
          }}
          >
            Simply scan a QR code to pay instantly.
          </Text>
        </View>
        <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1, marginBottom: '20%' }}>
          <View style={styles.qrContainer}>
            <QRCodeScanner
              onRead={(data) => handleQRScanned(data)}
              cameraStyle={{ height: screenWidth * 0.75, width: screenWidth * 0.75 }}
              containerStyle={{ alignItems: 'center' }}
            />
            <View style={{
              borderColor: colors.bgColor,
              backgroundColor: 'transparent',
              position: 'absolute',
              height: screenWidth * 0.79,
              width: screenWidth * 0.79,
              alignSelf: 'center',
              borderRadius: 20,
              borderWidth: screenWidth * 0.02430555556,
            }}
            />
            <View style={{
              borderColor: colors.bgColor,
              backgroundColor: 'transparent',
              position: 'absolute',
              height: screenWidth * 0.85,
              width: screenWidth * 0.85,
              alignSelf: 'center',
              borderRadius: 20,
              borderWidth: screenWidth * 0.03889,
            }}
            />
          </View>
        </View>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  userInfoContainer: { left: 17, marginTop: 20 },
  userInfoText: {
    color: colors.text,
    fontFamily: fonts.muliBold,
    fontSize: screenWidth * 0.045,
    marginRight: 5,
  },
  circle: {
    backgroundColor: 'rgba(0,0,0,0)',
    width: screenWidth * 0.037,
    height: screenWidth * 0.037,
    borderWidth: 1,
    borderColor: colors.secondaryColor,
    borderRadius: 50,
    marginHorizontal: 2,
  },
  circleSelected: {
    backgroundColor: colors.secondaryColor,
    width: screenWidth * 0.037,
    height: screenWidth * 0.037,
    borderRadius: 50,
    marginHorizontal: 2,
  },
  qrContainer: {
    overflow: 'hidden',
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    height: screenWidth * 0.85,
    width: screenWidth * 0.85,
    borderWidth: 1,
    borderColor: colors.text,
    borderRadius: 20,
  },
})
