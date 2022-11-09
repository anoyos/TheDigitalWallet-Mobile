import React from 'react'
import { View, StyleSheet, Image, Text } from 'react-native'
import { SubHeader } from 'app/components/Headers'
import { PillButton } from 'app/components'
import SafeAreaView from 'react-native-safe-area-view'
import { colors, percentWidth, percentHeight, fonts, containers } from 'app/styles'
import Image1 from 'app/assets/images/kyc1.png'
import Image2 from 'app/assets/images/kyc2.png'

export default function KYCPending({ navigation }) {
  return (
    <SafeAreaView forceInset={{ top: 'always' }} style={{ flex: 1 }}>
      <SubHeader title="Know your Client" navigation={navigation} />
      <View style={{ flex: 1, justifyContent: 'space-around', alignItems: 'center', paddingLeft: percentWidth(5), paddingRight: percentWidth(5), marginTop: percentWidth(15) }}>
        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
          <Text style={{ fontFamily: fonts.avenirBold, fontSize: percentWidth(5.5), textAlign: 'center' }}>Processing</Text>
        </View>
        <View>
          <Image source={Image1} style={{ width: percentHeight(23), height: percentHeight(23) }} />
        </View>
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            height: percentWidth(40),
            width: percentWidth(80),
            backgroundColor: 'white',
            alignSelf: 'center',
            borderRadius: percentWidth(2),
            padding: percentWidth(5),
          }}
        >
          <Text style={[styles.text, { textAlign: 'center' }]}>Thank you for submitting your documents.  We are currently reviewing your information.</Text>
        </View>
        <PillButton
          title="Back To My Wallet"
          onPress={() => navigation.navigate('Wallets')}
          width={percentWidth(60)}
          bgColor="darkred"
        />
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  text: {
    fontFamily: fonts.avenir,
    fontSize: percentWidth(4.1),
    textAlign: 'center',
  },
})