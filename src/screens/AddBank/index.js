import React from 'react'
import { ScrollView, View, Image, Text } from 'react-native'
import { SubHeader } from 'app/components/Headers'
import { getState } from 'app/lib/react-simply'
import { percentWidth, containers, fonts } from 'app/styles'
import SafeAreaView from 'react-native-safe-area-view'
import { WalletCard } from 'app/components'
import Banner from 'app/assets/images/bank-banner.png'
import * as WalletBackgrounds from 'app/assets/images/wallets'

export default function AddBank({ navigation }) {
  const [{ user }] = getState()
  return (
    <SafeAreaView forceInset={{ top: 'always' }} style={{ flex: 1 }}>
      <SubHeader title="Reload with Bank" navigation={navigation} />
      <View style={containers.screenContainer}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={{ height: '15.5%', justifyContent: 'center', alignItems: 'center' }}>
            <Image source={Banner} style={{ width: percentWidth(60), height: percentWidth(23.4) }} />
          </View>
          <View style={{ justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ fontFamily: fonts.avenirBold, fontSize: percentWidth(4.7), marginBottom: percentWidth(5) }}>
              Select Your Chosen Currency
            </Text>
          </View>
          <View>
            <WalletCard image={WalletBackgrounds.GBP} title="Digitall Brit Pound" symbol="GBP" balance={user.GBPBalance} small />
            <WalletCard image={WalletBackgrounds.USD} title="Digitall US Dollar" symbol="USD" balance={user.USDBalance} small />
            <WalletCard image={WalletBackgrounds.EUR} title="Digitall Euro" symbol="EUR" balance={user.EURBalance} small />
            <WalletCard image={WalletBackgrounds.CHF} title="Digitall Swiss Franc" symbol="CHF" balance={user.CHFBalance} small invert />
            <WalletCard image={WalletBackgrounds.CAD} title="Digitall Cad Dollar" symbol="CAD" balance={user.CADBalance} small />
            <WalletCard image={WalletBackgrounds.AUD} title="Digitall Aus Dollar" symbol="AUD" balance={user.AUDBalance} small />
            <WalletCard image={WalletBackgrounds.NZD} title="Digitall NZ Dollar" symbol="NZD" balance={user.NZDBalance} small />
            <WalletCard image={WalletBackgrounds.JPY} title="Digitall Jap Yen" symbol="JPY" balance={user.JPYBalance} small />
            <WalletCard image={WalletBackgrounds.NOK} title="Digitall Nor Krone" symbol="NOK" balance={user.NOKBalance} small invert />
            <WalletCard image={WalletBackgrounds.SEK} title="Digitall Swed Krona" symbol="SEK" balance={user.SEKBalance} small invert />
          </View>
          <View style={{ height: percentWidth(37) }} />
        </ScrollView>
      </View>
    </SafeAreaView>
  )
}

// const styles = StyleSheet.create({
// })
