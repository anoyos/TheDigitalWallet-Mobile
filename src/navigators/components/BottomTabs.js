import React from 'react'
import { StyleSheet, View, Animated, TouchableWithoutFeedback, SafeAreaView } from 'react-native'
// import SafeAreaView from 'react-native-safe-area-view'
import { Icon } from 'react-native-elements'
import { useAnimation } from 'react-native-animation-hooks'
import { getState } from 'app/lib/react-simply'
import { colors, fonts, screenWidth, percentWidth } from 'app/styles'

export default function BottomTabs({ navigation: { navigate, state } }) {
  const { routeName } = state.routes[0].routes.slice(-1)[0]
  const [{ user: { admin, superAdmin } }] = getState()

  const animatedValues = (screen) => ({
    type: 'timing',
    initialValue: 1,
    toValue: routeName && routeName === screen ? 1 : 0,
    duration: routeName && routeName === screen ? 100 : 100,
    useNativeDriver: true,
  })

  const walletsAnimatedValue = useAnimation(animatedValues('Wallets'))
  const myRoomAnimatedValue = useAnimation(animatedValues('Club'))
  const loyaltiesAnimatedValue = useAnimation(animatedValues('Loyalties'))
  const discoverAnimatedValue = useAnimation(animatedValues('Discover'))
  const cashierAnimatedValue = useAnimation(animatedValues('Cashier'))

  const animatedStyle = (animatedValue) => ({
    transform: [{
      translateY: animatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: [0, -screenWidth * 0.02],
      }),
    }],
  })

  const handleTabPress = (screen) => {
    navigate(screen)
  }

  const Tab = ({ screen, animatedValue, label, icon, type = 'entypo', number = 4 }) => (
    <TouchableWithoutFeedback onPress={() => handleTabPress(screen)}>
      <View style={[styles.iconContainer, { width: `${100 / number}%` }]}>
        <Animated.View style={animatedStyle(animatedValue)}>
          <Icon
            name={icon}
            type={type}
            color={routeName === screen ? colors.primaryColor : colors.lightText}
            size={screenWidth * 0.07}
          />
        </Animated.View>
        <Animated.Text style={[{ opacity: animatedValue }, styles.activeIconText]}>{label}</Animated.Text>
      </View>
    </TouchableWithoutFeedback>
  )

  if (superAdmin) {
    return (
      <SafeAreaView>
        <View style={styles.container}>
          <Tab screen="Wallets" animatedValue={walletsAnimatedValue} label="Wallet" icon="wallet" number={1} />
        </View>
      </SafeAreaView>
    )
  }

  if (admin) {
    return (
      <SafeAreaView>
        <View style={styles.container}>
          <Tab screen="Cashier" animatedValue={cashierAnimatedValue} label="Cashier" icon="cash-register" type="material-community" number={2} />
          <Tab screen="Wallets" animatedValue={walletsAnimatedValue} label="Wallet" icon="wallet" number={2} />
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView>
      <View style={styles.container}>
        <Tab screen="Wallets" animatedValue={walletsAnimatedValue} label="Wallet" icon="wallet" />
        <Tab screen="Club" animatedValue={myRoomAnimatedValue} label="The Club" icon="sports-club" />
        <Tab screen="Loyalties" animatedValue={loyaltiesAnimatedValue} label="Loyalties" icon="loyalty" type="material" />
        <Tab screen="Discover" animatedValue={discoverAnimatedValue} label="Discover" icon="location" />
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    height: percentWidth(14),
    backgroundColor: colors.bgColor,
    borderTopColor: 'rgba(0,0,19,0.05)',
    borderTopWidth: 1.3,
    width: screenWidth,
    flexDirection: 'row',
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconText: {
    color: colors.lightText,
    fontSize: 11,
    fontFamily: fonts.regular,
  },
  activeIconText: {
    position: 'absolute',
    bottom: screenWidth * 0.015,
    fontSize: screenWidth * 0.033,
    letterSpacing: -0.1,
    fontFamily: fonts.muliBold,
    color: colors.primaryColor,
  },
})
