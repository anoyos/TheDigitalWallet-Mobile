import React from 'react'
import { View, Image, Text } from 'react-native'
import BackgroundImage from 'app/assets/images/splash.jpg'
import { percentWidth, colors, fonts, percentHeight } from 'app/styles'

export default function Scene1({ style, width }) {
  return (
    <>
      <View style={[style, { width, backgroundColor: colors.bgColor }]}>
        <Image source={BackgroundImage} style={{ height: percentHeight(100), width: percentWidth(100), position: 'absolute' }} resizeMode="cover" />
        <View style={{ height: percentHeight(100), width: percentWidth(100), backgroundColor: 'black', opacity: 0.2, position: 'absolute' }} />
        <View style={{ height: percentHeight(20), alignItems: 'flex-end', justifyContent: 'center', flexDirection: 'row' }}>
          <Text style={{ fontSize: percentWidth(8), fontFamily: fonts.avenirBold, color: 'white' }}>THE DIGIT</Text>
          <Text style={{ fontSize: percentWidth(8), fontFamily: fonts.avenirBold, color: '#828282', marginLeft: -percentWidth(0.5) }}>ALL</Text>
          <Text style={{ fontSize: percentWidth(8), fontFamily: fonts.avenirBold, color: 'white' }}>{` WALLET`}</Text>
        </View>
        <View style={{ justifyContent: 'center', alignItems: 'center', bottom: percentHeight(15), position: 'absolute', alignSelf: 'center', flexDirection: 'row' }}>
          <Text style={{ fontSize: percentWidth(7), fontFamily: fonts.avenirBold, color: 'white' }}>
            DIGIT
          </Text>
          <Text style={{ fontSize: percentWidth(7), fontFamily: fonts.avenirBold, color: '#828282', marginLeft: -percentWidth(0.5) }}>
            ALL
          </Text>
        </View>
        <View style={{ justifyContent: 'center', alignItems: 'center', bottom: percentHeight(11), position: 'absolute', alignSelf: 'center' }}>
          <Text style={{ fontSize: percentWidth(4), fontFamily: fonts.avenirBold, color: 'white' }}>
            THE CURRENCY OF THE FUTURE
          </Text>
        </View>
      </View>
    </>
  )
}
