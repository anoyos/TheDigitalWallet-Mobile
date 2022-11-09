import React from 'react'
import { View, ScrollView } from 'react-native'
import { colors, percentWidth, containers } from 'app/styles'
import { SubHeader } from 'app/components/Headers'
import SafeAreaView from 'react-native-safe-area-view'
import { LoyaltyCard } from 'app/components'
import * as WalletBackgrounds from 'app/assets/images/wallets'

export default function MembershipCards({ navigation }) {
  return (
    <SafeAreaView forceInset={{ top: 'always' }} style={{ flex: 1 }}>
      <SubHeader navigation={navigation} title="Membership Cards" />
      <View style={containers.screenContainer}>
        <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1, backgroundColor: colors.bgColor, zIndex: 5 }}>
          <View style={{ height: percentWidth(3) }} />
          <LoyaltyCard image={WalletBackgrounds.BigCat} title="In One Place Member" membershipCard />
          <LoyaltyCard image={WalletBackgrounds.PWP} title="Xclusive Member" membershipCard />
          {/* <LoyaltyCard image={WalletBackgrounds.Nandos} title="Nandos" membershipCard />
          <LoyaltyCard image={WalletBackgrounds.BP} title="BP" invert membershipCard />
          <LoyaltyCard image={WalletBackgrounds.Tesco} title="Tesco" membershipCard />
          <LoyaltyCard image={WalletBackgrounds.Emirates} title="Emirates" membershipCard /> */}
          <View style={{ height: percentWidth(25) }} />
        </ScrollView>
      </View>
    </SafeAreaView>
  )
}
