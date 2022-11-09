import React from 'react'
import { View, Text, ScrollView } from 'react-native'
import { Button } from 'react-native-material-buttons'
import { Card, Icon } from 'react-native-elements'
import SafeAreaView from 'react-native-safe-area-view'
import { SubHeader } from 'app/components/Headers'
import { percentWidth, percentHeight, colors, fonts, containers, shadow } from 'app/styles'
import { TouchableOpacity } from 'react-native-gesture-handler'
import NavigationService from 'app/lib/NavigationService'
import { getState } from 'app/lib/react-simply'

const BankAccount = ({ id, accountNumber, sortCode, IBAN, ABA, swift, reference }) => (
  <TouchableOpacity onPress={() => NavigationService.navigate('EditBankAccount', { id, accountNumber, sortCode, IBAN, swift, reference })}>
    <Card containerStyle={shadow}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <Text style={{ fontFamily: fonts.avenirBold, fontSize: percentWidth(4), color: 'rgba(0, 0, 0, 0.8)' }}>
          Account Number
        </Text>
        <Text style={{ fontFamily: fonts.avenir, fontSize: percentWidth(4), color: 'rgba(0, 0, 0, 0.5)' }}>
          {accountNumber}
        </Text>
      </View>
      {!!sortCode && (
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text style={{ fontFamily: fonts.avenirBold, fontSize: percentWidth(4), color: 'rgba(0, 0, 0, 0.8)' }}>
            Sort Code
          </Text>
          <Text style={{ fontFamily: fonts.avenir, fontSize: percentWidth(4), color: 'rgba(0, 0, 0, 0.5)' }}>
            {sortCode}
          </Text>
        </View>
      )}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        {!!IBAN ? (
          <>
            <Text style={{ fontFamily: fonts.avenirBold, fontSize: percentWidth(4), color: 'rgba(0, 0, 0, 0.8)' }}>
              IBAN
            </Text>
            <Text style={{ fontFamily: fonts.avenir, fontSize: percentWidth(4), color: 'rgba(0, 0, 0, 0.5)' }}>
              {IBAN}
            </Text>
          </>
        ) : (
          <>
            <Text style={{ fontFamily: fonts.avenirBold, fontSize: percentWidth(4), color: 'rgba(0, 0, 0, 0.8)' }}>
              ABA
            </Text>
            <Text style={{ fontFamily: fonts.avenir, fontSize: percentWidth(4), color: 'rgba(0, 0, 0, 0.5)' }}>
              {ABA}
            </Text>
          </>
        )}
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <Text style={{ fontFamily: fonts.avenirBold, fontSize: percentWidth(4), color: 'rgba(0, 0, 0, 0.8)' }}>
          Swift
        </Text>
        <Text style={{ fontFamily: fonts.avenir, fontSize: percentWidth(4), color: 'rgba(0, 0, 0, 0.5)' }}>
          {swift}
        </Text>
      </View>
      {!!reference && (
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text style={{ fontFamily: fonts.avenirBold, fontSize: percentWidth(4), color: 'rgba(0, 0, 0, 0.8)' }}>
            Reference
          </Text>
          <Text style={{ fontFamily: fonts.avenir, fontSize: percentWidth(4), color: 'rgba(0, 0, 0, 0.5)' }}>
            {reference}
          </Text>
        </View>
      )}
    </Card>
  </TouchableOpacity>
)

const renderBankAccount = ({ id, accountNumber, sortCode, iban, aba, swift, reference }) => (
  <BankAccount
    key={`bankAccount-${id}`}
    id={id}
    accountNumber={accountNumber}
    sortCode={sortCode}
    IBAN={iban}
    ABA={aba}
    swift={swift}
    reference={reference}
  />
)

export default function BankAccounts({ navigation }) {
  const [{ bankAccounts }] = getState()

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
          {
            bankAccounts.length > 0
              ? (
                <Text style={{ fontFamily: fonts.bold, fontSize: percentWidth(4.5), textAlign: 'center' }}>
                  Select account to edit details
                </Text>
              ) : (
                <Text style={{ fontFamily: fonts.bold, fontSize: percentWidth(4.5), textAlign: 'center' }}>
                  You currently have no bank account details with us.  Please add a bank account.
                </Text>
              )
          }
        </View>
        {bankAccounts.map((item) => renderBankAccount(item))}
      </ScrollView>
      <Button
        color={colors.secondaryColor}
        shadeBorderRadius={50}
        onPress={() => navigation.navigate('AddBankAccount')}
        style={{
          width: percentWidth(35),
          height: percentWidth(10),
          borderRadius: 50,
          justifyContent: 'center',
          alignItems: 'center',
          position: 'absolute',
          bottom: percentHeight(5),
          right: percentWidth(5),
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 4,
          },
          shadowOpacity: 0.30,
          shadowRadius: 4.65,
          elevation: 8,
          flexDirection: 'row',
        }}
      >
        <Icon
          name="bank-plus"
          type="material-community"
          color="white"
          size={percentWidth(5)}
        />
        <Text style={{
          fontFamily: fonts.semiBold,
          fontSize: percentWidth(3.5),
          color: 'white',
          marginLeft: percentWidth(3),
        }}
        >
          Add Bank
        </Text>
      </Button>
    </SafeAreaView>
  )
}
