import React from 'react'
import { View, Image, Text } from 'react-native'
import BackgroundImage from 'app/assets/images/slider-4.jpg'
import { percentWidth, colors, fonts, percentHeight } from 'app/styles'

export default function Scene4({ style, width }) {
  return (
    <>
      <View style={[style, { width, backgroundColor: colors.bgColor }]}>
        <Image source={BackgroundImage} style={{ height: percentHeight(100), width: percentWidth(100), position: 'absolute' }} resizeMode="cover" />
        <View style={{ height: percentHeight(100), width: percentWidth(100), backgroundColor: 'black', opacity: 0.7, position: 'absolute' }} />
        <View style={{ height: percentHeight(19), justifyContent: 'flex-end', alignItems: 'center' }}>
          <Text style={{ fontSize: percentWidth(9), fontFamily: fonts.avenirBold, color: 'white', letterSpacing: -percentWidth(0.2) }}>ULTIMATE SECURITY</Text>
        </View>
        <View style={{ justifyContent: 'flex-end', alignItems: 'center', marginVertical: percentHeight(8) }}>
          <Text style={{ fontSize: percentWidth(6), letterSpacing: -percentWidth(0.2), fontFamily: fonts.avenirBold, color: 'white' }}>PROTECTING YOUR WEALTH</Text>
          <Text style={{ fontSize: percentWidth(6), letterSpacing: -percentWidth(0.2), fontFamily: fonts.avenirBold, color: 'white' }}>LIKE NO OTHER STORE</Text>
          <Text style={{ fontSize: percentWidth(6), letterSpacing: -percentWidth(0.2), fontFamily: fonts.avenirBold, color: 'white' }}>OF VALUE</Text>
        </View>
        <View style={{ justifyContent: 'space-between', alignItems: 'center', height: percentHeight(30) }}>
          <View style={{ alignItems: 'center' }}>
            <Text style={{ fontSize: percentWidth(4.5), fontFamily: fonts.avenirBold, color: 'white' }}>All stores of value held within The Digitall</Text>
            <Text style={{ fontSize: percentWidth(4.5), fontFamily: fonts.avenirBold, color: 'white' }}>Wallet, are stored one for one and are</Text>
            <Text style={{ fontSize: percentWidth(4.5), fontFamily: fonts.avenirBold, color: 'white' }}>audited by a third party entity quarterly.</Text>
          </View>
          <View style={{ alignItems: 'center' }}>
            <Text style={{ fontSize: percentWidth(4.5), fontFamily: fonts.avenirBold, color: 'white' }}>The Consesus Network is a closed loop</Text>
            <Text style={{ fontSize: percentWidth(4.5), fontFamily: fonts.avenirBold, color: 'white' }}>system, with all members verified.</Text>
            <Text style={{ fontSize: percentWidth(4.5), fontFamily: fonts.avenirBold, color: 'white' }}>This means that funds stored cannot</Text>
            <Text style={{ fontSize: percentWidth(4.5), fontFamily: fonts.avenirBold, color: 'white' }}>be physically stolen byb any third party.</Text>
          </View>
          <View style={{ alignItems: 'center' }}>
            <Text style={{ fontSize: percentWidth(4.5), fontFamily: fonts.avenirBold, color: 'white' }}>All wallet holders are verified to comply</Text>
            <Text style={{ fontSize: percentWidth(4.5), fontFamily: fonts.avenirBold, color: 'white' }}>with all international AML regulations.</Text>
          </View>
        </View>
        <View style={{ justifyContent: 'center', alignItems: 'center', bottom: percentHeight(11), position: 'absolute', alignSelf: 'center' }}>
          <Text style={{ fontSize: percentWidth(3.6), fontFamily: fonts.avenirBold, color: 'white' }}>
            SECURING YOUR WEALTH LIKE NO OTHER SYSTEM
          </Text>
        </View>
      </View>
    </>
  )
}
