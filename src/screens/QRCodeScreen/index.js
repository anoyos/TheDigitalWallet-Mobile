import React from 'react'
import { View, StyleSheet } from 'react-native'
import Clipboard from '@react-native-community/clipboard'
import QRCode from 'react-native-qrcode-svg'
import { SubHeader } from 'app/components/Headers'
import SafeAreaView from 'react-native-safe-area-view'
import { PillButton } from 'app/components'
import { getState } from 'app/lib/react-simply'
import { colors, fonts, screenWidth, percentWidth, percentHeight, containers } from 'app/styles'
import * as toast from 'app/lib/toast'

export default function QRCodeScreen({ navigation }) {
  const [{ user }] = getState()
  const symbol = navigation.getParam('symbol', user.currency.symbol)
  const address = navigation.getParam('address', '')
  const title = navigation.getParam('title', '')
  const name = `${user.firstName} ${user.lastName}`
  const qrText = JSON.stringify({ toAddress: address, name, toSymbol: symbol, toEmail: user.email })

  const copyTransactionToClipboard = () => {
    toast.copyAddress()
    Clipboard.setString(user.walletAddress)
  }

  return (
    <SafeAreaView forceInset={{ top: 'always' }} style={{ flex: 1 }}>
      <SubHeader title={title} navigation={navigation} />
      <View style={containers.screenContainer}>
        <View style={{ height: percentHeight(60), width: screenWidth, justifyContent: 'center', alignItems: 'center' }}>
          { !!qrText && (
            <View style={styles.qrContainer}>
              <QRCode
                value={qrText}
                size={screenWidth * 0.76}
              />
            </View>
          )}
        </View>
        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
          <PillButton
            onPress={() => copyTransactionToClipboard()}
            title="Copy Wallet Address"
            width={percentWidth(60)}
          />
        </View>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  qrScanButtonText: {
    textAlign: 'center',
    fontFamily: fonts.semiBold,
    color: colors.buttonText,
    fontSize: 15,
    letterSpacing: -0.1,
  },
  qrScanButton: {
    height: 42,
    width: 200,
    borderRadius: 25,
    justifyContent: 'center',
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
  section: {
    flexDirection: 'row',
    borderBottomColor: colors.lightText,
    borderBottomWidth: 0.5,
    paddingVertical: 10,
  },
  sectionTitle: {
    color: colors.text,
    fontFamily: fonts.semiBold,
    fontSize: 15,
  },
  sectionText: {
    color: colors.lightText,
    fontFamily: fonts.regular,
    fontSize: 12,
    paddingTop: 10,
  },
  iconContainer: {
    width: '25%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrowContainer: {
    width: '15%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: { width: '60%' },
})
