import React from 'react'
import { View, Image, Text, StyleSheet, ScrollView } from 'react-native'
import { colors, percentWidth, fonts, containers } from 'app/styles'
import { SubHeader } from 'app/components/Headers'
import SafeAreaView from 'react-native-safe-area-view'
import { LoyaltyCard } from 'app/components'
import { Main, BigCat, PWP } from 'app/assets/images/wallets'

export default function Loyalties({ navigation }) {
  return (
    <SafeAreaView forceInset={{ top: 'always' }} style={{ flex: 1 }}>
      <SubHeader navigation={navigation} title="Loyalties" />
      <View style={containers.screenContainer}>
        <View style={{ backgroundColor: 'rgba(255,255,255,0.8)', position: 'absolute', zIndex: 6, height: percentWidth(27), width: percentWidth(100), top: 0 }} />
        <View style={styles.walletTotalContainer}>
          <View style={styles.walletTotalTextContainer}>
            <Text style={styles.walletTotalText}>
              TOTAL POINTS
            </Text>
            <Text style={styles.totalBalance}>
              0
            </Text>
            <Image source={Main} style={{ width: percentWidth(98), height: percentWidth(39.1621621608), alignSelf: 'center' }} />
          </View>
        </View>
        <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1, backgroundColor: colors.bgColor, zIndex: 5 }}>
          <View style={{ height: percentWidth(3) }} />
          <LoyaltyCard image={BigCat} title="In One Place" />
          <LoyaltyCard image={PWP} title="Xclusive" />
          <View style={{ height: percentWidth(25) }} />
        </ScrollView>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  walletTotalContainer: {
    marginTop: percentWidth(1),
    width: percentWidth(97),
    height: percentWidth(38.7625482612),
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    zIndex: 7,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.30,
    shadowRadius: 4.65,
    elevation: 8,
  },
  walletTotalTextContainer: {
    width: percentWidth(96.5),
    height: percentWidth(38.5627413114),
    overflow: 'hidden',
    zIndex: 5,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  walletTotalText: {
    position: 'absolute',
    fontFamily: fonts.avenirBold,
    fontSize: percentWidth(4.2),
    top: percentWidth(10),
    color: '#FFFFFF',
    zIndex: 1,
  },
  totalBalance: {
    position: 'absolute',
    fontFamily: fonts.bold,
    fontSize: percentWidth(7),
    bottom: percentWidth(12),
    color: '#FFFFFF',
    zIndex: 1,
  },
  backButton: {
    position: 'absolute',
    width: percentWidth(9),
    height: percentWidth(9),
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.secondaryColor,
    bottom: percentWidth(5),
    left: percentWidth(8),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.30,
    shadowRadius: 4.65,
    elevation: 8,
  },
  nextButton: {
    position: 'absolute',
    width: percentWidth(9),
    height: percentWidth(9),
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.secondaryColor,
    bottom: percentWidth(5),
    right: percentWidth(8),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.30,
    shadowRadius: 4.65,
    elevation: 8,
  },
})
