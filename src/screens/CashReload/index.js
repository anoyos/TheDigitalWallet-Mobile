import React from 'react'
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native'
import QRCode from 'react-native-qrcode-svg'
import { SubHeader } from 'app/components/Headers'
import { PillButton } from 'app/components'
import SafeAreaView from 'react-native-safe-area-view'
import { Icon } from 'react-native-elements'
import { getState } from 'app/lib/react-simply'
import { colors, containers, fonts, percentWidth } from 'app/styles'

export default function CashReload({ navigation }) {
  const [{ user: { firstName, lastName, walletAddress } }] = getState()
  const name = `${firstName} ${lastName.slice(0, 1)}.`
  const qrText = JSON.stringify({ amount: '0', toAddress: walletAddress, name })

  return (
    <SafeAreaView forceInset={{ top: 'always' }} style={{ flex: 1 }}>
      <SubHeader title="Reload with Cash." navigation={navigation} />
      <ScrollView style={containers.screenContainer}>
        <TouchableOpacity
          onPress={() => navigation.navigate('Discover')}
          style={styles.section}
        >
          <View style={styles.iconContainer}>
            <Icon
              name="map-marker"
              type="material-community"
              color={colors.primaryColor}
              size={30}
              containerStyle={{ marginTop: -10 }}
            />
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.sectionTitle}>Reload Locally</Text>
            <Text numberOfLines={3} style={styles.sectionText}>Reload locally with participating merchants.</Text>
          </View>
          <View style={styles.arrowContainer}>
            <Icon
              name="chevron-right"
              type="material-community"
              color={colors.lightText}
              size={22}
              containerStyle={{ marginTop: -10 }}
            />
          </View>
        </TouchableOpacity>
        { !!qrText && (
          <View style={{ paddingTop: 20 }}>
            <View style={styles.qrContainer}>
              <QRCode
                value={qrText}
                size={percentWidth(76)}
              />
            </View>
          </View>
        )}
      </ScrollView>
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
    borderWidth: 1,
    borderColor: colors.text,
    borderRadius: 20,
    height: percentWidth(85),
    width: percentWidth(85),
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
