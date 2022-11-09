import React from 'react'
import { View, Image, Text } from 'react-native'
import BackgroundImage from 'app/assets/images/slider-3.jpeg'
import { percentWidth, colors, fonts, percentHeight } from 'app/styles'

export default function Scene3({ style, width }) {
  return (
    <>
      <View style={[style, { width, backgroundColor: colors.bgColor }]}>
        <Image source={BackgroundImage} style={{ height: percentHeight(100), width: percentWidth(100), position: 'absolute' }} resizeMode="cover" />
        <View style={{ height: percentHeight(100), width: percentWidth(100), backgroundColor: 'black', opacity: 0.4, position: 'absolute' }} />
        <View style={{ height: percentHeight(16), justifyContent: 'flex-end', alignItems: 'center' }}>
          <Text style={{ fontSize: percentWidth(7), fontFamily: fonts.avenirBold, color: 'white' }}>IT PAYS TO RECOMMEND</Text>
        </View>
        <View style={{ justifyContent: 'flex-end', alignItems: 'center', marginVertical: percentHeight(5) }}>
          <Text style={{ fontSize: percentWidth(4.5), fontFamily: fonts.avenirBold, color: 'white' }}>ALL USERS OF THE DIGITALL WALLET</Text>
          <Text style={{ fontSize: percentWidth(4.5), fontFamily: fonts.avenirBold, color: 'white' }}>CAN EARN A SHARE FROM ALL</Text>
          <Text style={{ fontSize: percentWidth(4.5), fontFamily: fonts.avenirBold, color: 'white' }}>FEES GENERATED, BY ANY USER</Text>
          <Text style={{ fontSize: percentWidth(4.5), fontFamily: fonts.avenirBold, color: 'white' }}>THEY INTRODUCE TO DIGITALL</Text>
        </View>
        <View style={{ justifyContent: 'space-between', alignItems: 'center', height: percentHeight(15) }}>
          <View style={{ alignItems: 'center' }}>
            <Text style={{ fontSize: percentWidth(4.5), fontFamily: fonts.avenirBold, color: 'white' }}>The income is gernated from ALL fees</Text>
            <Text style={{ fontSize: percentWidth(4.5), fontFamily: fonts.avenirBold, color: 'white' }}>charged over The Consesus Network.</Text>
          </View>
          <View style={{ alignItems: 'center' }}>
            <Text style={{ fontSize: percentWidth(4.5), fontFamily: fonts.avenirBold, color: 'white' }}>The income referral is generated from both </Text>
            <Text style={{ fontSize: percentWidth(4.5), fontFamily: fonts.avenirBold, color: 'white' }}>individual and corporate introductions.</Text>
          </View>
        </View>
        <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: percentHeight(5) }}>
          <Text style={{ fontSize: percentWidth(5), fontFamily: fonts.avenirBold, color: 'white' }}>in addition</Text>
        </View>
        <View style={{ justifyContent: 'flex-end', alignItems: 'center', marginVertical: percentHeight(5) }}>
          <Text style={{ fontSize: percentWidth(4.5), fontFamily: fonts.avenirBold, color: 'white' }}>YOU CAN EARN FREE MONEY</Text>
          <Text style={{ fontSize: percentWidth(4.5), fontFamily: fonts.avenirBold, color: 'white' }}>BY SIMPLY OWNING</Text>
          <Text style={{ fontSize: percentWidth(4.5), fontFamily: fonts.avenirBold, color: 'white' }}>THE DIGITALL WALLET</Text>
        </View>
        <View style={{ justifyContent: 'center', alignItems: 'center', bottom: percentHeight(11), position: 'absolute', alignSelf: 'center', flexDirection: 'row' }}>
          <Text style={{ fontSize: percentWidth(4.5), fontFamily: fonts.avenirBold, color: 'white' }}>
            THE DIGIT
          </Text>
          <Text style={{ fontSize: percentWidth(4.5), fontFamily: fonts.avenirBold, color: '#828282', marginLeft: -percentWidth(0.5) }}>
            ALL
          </Text>
          <Text style={{ fontSize: percentWidth(4.5), fontFamily: fonts.avenirBold, color: 'white' }}>
           {` WALLET FOR ALL`}
          </Text>
        </View>
      </View>
    </>
  )
}
