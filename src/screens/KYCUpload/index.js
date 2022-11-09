import React, { useState } from 'react'
import { View } from 'react-native'
import SafeAreaView from 'react-native-safe-area-view'
import { SubHeader } from 'app/components/Headers'
import { ImageSelect, FullWidthButton } from 'app/components'
import { colors, screenWidth, percentHeight, containers } from 'app/styles'
import PassportImage from 'app/assets/images/passport.jpg'
import BillImage from 'app/assets/images/bill.jpg'

export default function Bill({ navigation }) {
  const [billImage, setBillImage] = useState(BillImage)
  const [passportImage, setPassportImage] = useState(PassportImage)

  return (
    <SafeAreaView forceInset={{ top: 'always' }} style={{ flex: 1 }}>
      <SubHeader title="AML Compliance" navigation={navigation} />
      <View style={[containers.screenContainer, { justifyContent: 'flex-end' }]}>
        <View style={{ height: percentHeight(45), justifyContent: 'flex-end', bottom: percentHeight(5) }}>
          <ImageSelect
            setImage={setPassportImage}
            image={passportImage}
            type="landscape"
            buttonText="Upload Government Issued ID"
          />
        </View>
        <View style={{ height: percentHeight(45), justifyContent: 'center' }}>
          <ImageSelect
            setImage={setBillImage}
            image={billImage}
            type="portrait"
            buttonText="Upload Utility Bill"
          />
        </View>
        <View style={{ flexGrow: 1, justifyContent: 'flex-end' }}>
          <FullWidthButton
            title="Verify Phone"
            onPress={() => navigation.navigate('KYCFinish', { billImage, passportImage })}
            condition={!billImage.path || !passportImage.path}
          />
        </View>
      </View>
    </SafeAreaView>
  )
}
