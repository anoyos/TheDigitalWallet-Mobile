import React from 'react'
import { View, Text, Image } from 'react-native'
import { colors, percentWidth, fonts, percentHeight, containers, text } from 'app/styles'
import { getState } from 'app/lib/react-simply'
import InOnePlace from 'app/assets/images/iop-membership.png'
import Xclusive from 'app/assets/images/xclusive-membership.png'
import { SubHeader } from 'app/components/Headers'
import { PillButton } from 'app/components'
import SafeAreaView from 'react-native-safe-area-view'

export default function MembershipCard({ navigation }) {
  const [{ user }] = getState()
  const title = navigation.getParam('title', '')

  return (
    <SafeAreaView forceInset={{ top: 'always' }} style={{ flex: 1 }}>
      <SubHeader navigation={navigation} title={title || 'Membership Card'} />
      <View style={containers.screenContainer}>
        <View style={{ marginBottom: percentHeight(5), width: percentWidth(100) }}>
          <View
            style={{
              width: percentWidth(85),
              height: percentWidth(45),
              alignSelf: 'center',
              borderRadius: percentWidth(4),
              marginVertical: percentHeight(2),
            }}
          >
            <Image source={title === 'In One Place Member' ? InOnePlace : Xclusive} style={{ position: 'absolute', alignSelf: 'center' }} />
            <View style={{ top: percentHeight(3), left: percentWidth(6) }}>
              <Text style={{ color: 'white', fontFamily: fonts.avenirBold, fontSize: percentWidth(3) }}>MEMBERSHIP CARD</Text>
            </View>
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
              {/* <Text style={{ color: 'white', fontFamily: fonts.avenirBold, fontSize: percentWidth(7), marginVertical: -percentWidth(1), letterSpacing: -1 }}>XX XX ASSOCIATION</Text> */}
            </View>
            <View style={{ flexDirection: 'row', bottom: percentHeight(3), justifyContent: 'space-between' }}>
              <View style={{ left: percentWidth(6) }}>
                <Text style={{ color: 'white', fontFamily: fonts.avenirBold, fontSize: percentWidth(3) }}>CARD NUMBER</Text>
              </View>
              <View style={{ right: percentWidth(10) }}>
                <Text style={{ color: 'white', fontFamily: fonts.avenirBold, fontSize: percentWidth(4) }}>1234 5678 910</Text>
              </View>
            </View>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'center', width: percentWidth(90), alignSelf: 'center' }}>
            <PillButton
              onPress={() => navigation.navigate('TransferScanner')}
              height={percentWidth(10)}
              width={percentWidth(60)}
              title="SCAN"
              bgColor={colors.primaryColor}
              borderRadius={percentWidth(1)}
            />
          </View>
          <Text style={[text.header, { marginLeft: percentWidth(3.5), marginTop: percentHeight(2) }]}>RECENT TRANSACTIONS</Text>
          <View style={{ marginTop: percentHeight(1.5), width: percentWidth(100), borderBottomWidth: 1.5, borderBottomColor: '#7A1720' }} />
        </View>
      </View>
    </SafeAreaView>
  )
}
