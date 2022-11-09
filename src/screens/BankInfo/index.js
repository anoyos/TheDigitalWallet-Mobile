import React from 'react'
import { View, Text } from 'react-native'
import { Button } from 'react-native-material-buttons'
import Clipboard from '@react-native-community/clipboard'
import SafeAreaView from 'react-native-safe-area-view'
import { getState } from 'app/lib/react-simply'
import { Icon } from 'react-native-elements'
import { SubHeader } from 'app/components/Headers'
import * as toast from 'app/lib/toast'
import { percentWidth, fonts, containers, colors } from 'app/styles'

const LineItem = ({ title, value }) => {
  const handleCopy = () => {
    toast.message(`${title} as been copied to clipboard.`)
    Clipboard.setString(value)
  }

  return (
    <View style={{ flexDirection: 'row', paddingVertical: percentWidth(3), paddingLeft: percentWidth(3) }}>
      <View style={{ width: '80%' }}>
        <Text style={{ fontSize: percentWidth(4.1), fontFamily: fonts.semiBold, color: colors.secondaryColor }}>{title}</Text>
        <Text style={{ fontSize: percentWidth(5.1), fontFamily: fonts.semiBold, marginTop: percentWidth(1) }}>{value}</Text>
      </View>
      <View style={{ width: '20%', justifyContent: 'center', alignItems: 'center' }}>
        <Button
          shadeBorderRadius={100}
          color="transparent"
          style={{ width: percentWidth(12), height: percentWidth(12), borderRadius: 100, justifyContent: 'center', alignItems: 'center' }}
          onPress={handleCopy}
        >
          <Icon
            name="content-copy"
            type="material-community"
            size={percentWidth(5)}
          />
        </Button>
      </View>
    </View>
  )
}

export default function BankInfo({ navigation }) {
  const [{ user }] = getState()
  const symbol = navigation.getParam('symbol', false)
  const accountNumber = '56056532'
  const sortCode = '04-00-75'
  const beneficiary = 'PROJECT CONSENSUS LTD'
  const beneficiaryAddress = '85 Great Portland Street, London W1W 7LT, United Kingdom'
  const IBAN = 'GB07REVO00996995779965'
  const BIC = 'REVOGB21'
  const reference = `${user.lastName.toUpperCase()}${user.walletAddress.slice(-4).toUpperCase()}`

  return (
    <SafeAreaView forceInset={{ top: 'always' }} style={{ flex: 1 }}>
      <SubHeader title="Bank Transfer" navigation={navigation} />
      <View style={containers.screenContainer}>
        <View style={{ width: percentWidth(90), padding: percentWidth(3), paddingBottom: percentWidth(4), marginTop: percentWidth(5) }}>
          <Text style={{ fontSize: percentWidth(6), fontFamily: fonts.bold }}>Bank Account Details</Text>
          <Text style={{ marginTop: percentWidth(2), fontFamily: fonts.avenir, fontSize: percentWidth(4.4), color: 'rgba(0, 0, 0, 0.8)' }}>
            Be sure when sending any transfer to include your reference, failing to include it could delay the loading of your funds to your wallet.
          </Text>
        </View>
        <View style={{ marginTop: percentWidth(2) }}>
          <LineItem title="Reference Number" value={reference} />
          {symbol === 'GBP'
            ? (
              <>
                <LineItem title="Account Number" value={accountNumber} />
                <LineItem title="Sort Code" value={sortCode} />
              </>
            ) : (
              <>
                <LineItem title="IBAN" value={IBAN} />
                <LineItem title="BIC" value={BIC} />
              </>
            )}
          <LineItem title="Beneficiary" value={beneficiary} />
          <LineItem title="Beneficiary Address" value={beneficiaryAddress} />
        </View>
      </View>
    </SafeAreaView>
  )
}
