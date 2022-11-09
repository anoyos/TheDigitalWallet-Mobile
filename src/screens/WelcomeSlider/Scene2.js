import React from 'react'
import { View, Image, Text } from 'react-native'
import BackgroundImage from 'app/assets/images/slider-2.jpg'
import { percentWidth, colors, fonts, percentHeight } from 'app/styles'

export default function Scene2({ style, width }) {
  return (
    <>
      <View style={[style, { width, backgroundColor: colors.bgColor }]}>
        <Image source={BackgroundImage} style={{ height: percentHeight(100), width: percentWidth(100), position: 'absolute' }} resizeMode="cover" />
        <View style={{ height: percentHeight(100), width: percentWidth(100), backgroundColor: 'black', opacity: 0.6, position: 'absolute' }} />
        <View style={{ height: percentHeight(20), alignItems: 'flex-end', justifyContent: 'center', flexDirection: 'row' }}>
          <Text style={{ fontSize: percentWidth(8), fontFamily: fonts.avenirBold, color: 'white' }}>DIGIT</Text>
          <Text style={{ fontSize: percentWidth(8), fontFamily: fonts.avenirBold, color: '#828282', marginLeft: -percentWidth(0.5) }}>ALL</Text>
          <Text style={{ fontSize: percentWidth(8), fontFamily: fonts.avenirBold, color: 'white' }}>{` CURRENCIES`}</Text>
        </View>
        <View style={{ justifyContent: 'flex-end', alignItems: 'center', marginVertical: percentHeight(5) }}>
          <Text style={{ fontSize: percentWidth(4.5), fontFamily: fonts.avenirBold, color: 'white' }}>THE DIGITALL WALLET ALLOWS USERS</Text>
          <Text style={{ fontSize: percentWidth(4.5), fontFamily: fonts.avenirBold, color: 'white' }}>TO HOLD AND TRANSACT IN ALL OF</Text>
          <Text style={{ fontSize: percentWidth(4.5), fontFamily: fonts.avenirBold, color: 'white' }}>THE FOLLOWING STORES OF VALUE</Text>
        </View>
        <View style={{ justifyContent: 'space-between', alignItems: 'center', height: percentHeight(35) }}>
          <Text style={{ fontSize: percentWidth(4.5), fontFamily: fonts.avenirBold, color: 'white' }}>10 TOP CURRENCIES</Text>
          <Text style={{ fontSize: percentWidth(4.5), fontFamily: fonts.avenirBold, color: 'white' }}>PLATINUM</Text>
          <Text style={{ fontSize: percentWidth(4.5), fontFamily: fonts.avenirBold, color: 'white' }}>GOLD</Text>
          <Text style={{ fontSize: percentWidth(4.5), fontFamily: fonts.avenirBold, color: 'white' }}>SILVER</Text>
          <Text style={{ fontSize: percentWidth(4.5), fontFamily: fonts.avenirBold, color: 'white' }}>BRENT CRUDE OIL</Text>
          <Text style={{ fontSize: percentWidth(4.5), fontFamily: fonts.avenirBold, color: 'white' }}>LISTED STOCK INDICIES</Text>
          <Text style={{ fontSize: percentWidth(4.5), fontFamily: fonts.avenirBold, color: 'white' }}>LISTED STOCKS</Text>
          <Text style={{ fontSize: percentWidth(4.5), fontFamily: fonts.avenirBold, color: 'white' }}>CRYPTO CURRENCIES</Text>
        </View>
        <View style={{ justifyContent: 'center', alignItems: 'center', bottom: percentHeight(11), position: 'absolute', alignSelf: 'center' }}>
          <Text style={{ fontSize: percentWidth(3.5), fontFamily: fonts.avenirBold, color: 'white' }}>
            THE FUTURE OF MONEY TRANSFERS & PURCHASES
          </Text>
        </View>
      </View>
    </>
  )
}
