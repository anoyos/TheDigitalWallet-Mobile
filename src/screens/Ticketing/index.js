import React from 'react'
import { View, StyleSheet } from 'react-native'
import { colors, percentWidth, fonts, percentHeight, containers } from 'app/styles'
import LinearGradient from 'react-native-linear-gradient'
import { SubHeader } from 'app/components/Headers'
import SafeAreaView from 'react-native-safe-area-view'

export default function Loyalties({ navigation }) {
  const title = navigation.getParam('title', '')
  return (
    <SafeAreaView forceInset={{ top: 'always' }} style={{ flex: 1 }}>
      <SubHeader navigation={navigation} title={title || 'Loyalty Program'} />
      <View style={containers.screenContainer}>
        <LinearGradient
          style={{
            width: percentWidth(93),
            height: percentWidth(45),
            alignSelf: 'center',
            borderRadius: 15,
            marginVertical: percentHeight(2),
          }}
          colors={['rgba(162,139,79,1)', 'rgba(162,139,79,0.7)']}
          useAngle
          angle={40}
        >
        </LinearGradient>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  emptyListText: {
    fontFamily: fonts.avenirBold,
    color: colors.text,
    letterSpacing: -0.3,
    fontSize: 17,
    paddingTop: 20,
    textAlign: 'center',
  },
  userInfoContainer: {
    paddingVertical: 10,
    justifyContent: 'flex-end',
    borderBottomWidth: 0.5,
  },
  userInfoText: {
    left: 17,
    opacity: 0.6,
    color: colors.text,
    fontFamily: fonts.semiBold,
    fontSize: 15,
  },
  walletTotalContainer: {
    width: percentWidth(97),
    height: percentWidth(38.7625482612),
    position: 'absolute',
    top: percentHeight(10.4),
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    zIndex: 6,
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
