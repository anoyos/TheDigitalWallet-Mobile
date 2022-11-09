import React from 'react'
import { View, Text, ScrollView } from 'react-native'
import { Card, Icon } from 'react-native-elements'
import SafeAreaView from 'react-native-safe-area-view'
import { SubHeader } from 'app/components/Headers'
import { percentWidth, percentHeight, colors, fonts, containers, shadow } from 'app/styles'
import { TouchableOpacity } from 'react-native-gesture-handler'
import NavigationService from 'app/lib/NavigationService'
import { getState } from 'app/lib/react-simply'

export default function BankAccounts({ navigation }) {
  const [{ bankAccounts }] = getState()
  const symbol = navigation.getParam('symbol')
  const amount = navigation.getParam('amount', 0)

  const renderBankAccount = ({ id, accountNumber, sortCode, iban, swift, reference }) => (
    <BankAccount
      key={`bankAccount-${id}`}
      id={id}
      accountNumber={accountNumber}
      sortCode={sortCode}
      IBAN={iban}
      swift={swift}
      reference={reference}
    />
  )

  const BankAccount = (bankAccount) => (
    <TouchableOpacity onPress={() => NavigationService.navigate('WithdrawalConfirmation', { amount, bankAccount, symbol })}>
      <Card containerStyle={shadow}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text style={{ fontFamily: fonts.avenirBold, fontSize: percentWidth(4), color: 'rgba(0, 0, 0, 0.8)' }}>
            Account Number
          </Text>
          <Text style={{ fontFamily: fonts.avenir, fontSize: percentWidth(4), color: 'rgba(0, 0, 0, 0.5)' }}>
            {bankAccount.accountNumber}
          </Text>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text style={{ fontFamily: fonts.avenirBold, fontSize: percentWidth(4), color: 'rgba(0, 0, 0, 0.8)' }}>
            Sort Code
          </Text>
          <Text style={{ fontFamily: fonts.avenir, fontSize: percentWidth(4), color: 'rgba(0, 0, 0, 0.5)' }}>
            {bankAccount.sortCode}
          </Text>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text style={{ fontFamily: fonts.avenirBold, fontSize: percentWidth(4), color: 'rgba(0, 0, 0, 0.8)' }}>
            IBAN
          </Text>
          <Text style={{ fontFamily: fonts.avenir, fontSize: percentWidth(4), color: 'rgba(0, 0, 0, 0.5)' }}>
            {bankAccount.IBAN}
          </Text>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text style={{ fontFamily: fonts.avenirBold, fontSize: percentWidth(4), color: 'rgba(0, 0, 0, 0.8)' }}>
            Swift
          </Text>
          <Text style={{ fontFamily: fonts.avenir, fontSize: percentWidth(4), color: 'rgba(0, 0, 0, 0.5)' }}>
            {bankAccount.swift}
          </Text>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text style={{ fontFamily: fonts.avenirBold, fontSize: percentWidth(4), color: 'rgba(0, 0, 0, 0.8)' }}>
            Reference
          </Text>
          <Text style={{ fontFamily: fonts.avenir, fontSize: percentWidth(4), color: 'rgba(0, 0, 0, 0.5)' }}>
            {bankAccount.reference}
          </Text>
        </View>
      </Card>
    </TouchableOpacity>
  )

  return (
    <SafeAreaView forceInset={{ top: 'always' }} style={{ flex: 1 }}>
      <SubHeader title="Bank Accounts" navigation={navigation} />
      <ScrollView style={containers.screenContainer}>
        <View style={{ alignSelf: 'center', marginTop: percentHeight(2) }}>
          <Icon
            raised
            type="font-awesome"
            name="bank"
            color={colors.secondaryColor}
            size={percentWidth(5)}
          />
        </View>
        <View style={{ marginBottom: percentHeight(4) }}>
          <Text style={{ fontFamily: fonts.bold, fontSize: percentWidth(4.5), textAlign: 'center' }}>
            Select Bank
          </Text>
        </View>
        {bankAccounts.map((item) => renderBankAccount(item))}
      </ScrollView>
    </SafeAreaView>
  )
}
