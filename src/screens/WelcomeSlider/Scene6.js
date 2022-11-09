import React from 'react'
import { View, Image, Text } from 'react-native'
import { PillButton } from 'app/components'
import NavigationService from 'app/lib/NavigationService'
import BackgroundImage from 'app/assets/images/splash.jpg'
import { percentWidth, colors, fonts, percentHeight } from 'app/styles'

export default function Scene1({ style, width }) {
  return (
    <>
      <View style={[style, { width, backgroundColor: colors.bgColor }]}>
        <Image source={BackgroundImage} style={{ height: percentHeight(100), width: percentWidth(100), position: 'absolute' }} resizeMode="cover" />
        <View style={{ height: percentHeight(100), width: percentWidth(100), backgroundColor: 'black', opacity: 0.2, position: 'absolute' }} />
        <View style={{ height: percentHeight(15), alignItems: 'flex-end', justifyContent: 'center', flexDirection: 'row' }}>
          <Text style={{ fontSize: percentWidth(9), fontFamily: fonts.avenirBold, color: 'white' }}>THANK</Text>
          <Text style={{ fontSize: percentWidth(9), fontFamily: fonts.avenirBold, color: '#828282' }}>{` YOU`}</Text>
        </View>
        <View style={{ justifyContent: 'flex-end', alignItems: 'center', marginVertical: percentHeight(4) }}>
          <Text style={{ fontSize: percentWidth(4.5), fontFamily: fonts.avenirBold, color: 'white' }}>FOR HELPING US</Text>
          <Text style={{ fontSize: percentWidth(4.5), fontFamily: fonts.avenirBold, color: '#828282' }}>CHANGE THE WORLD</Text>
        </View>
        <View style={{ alignSelf: 'center' }}>
          <PillButton
            onPress={() => NavigationService.navigate('App')}
            height={percentWidth(10)}
            width={percentWidth(50)}
            title="Get Started"
            bgColor="#828282"
          />
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
