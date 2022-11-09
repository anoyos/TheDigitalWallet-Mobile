import React, { useState, useRef } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import SwitchSelector from 'react-native-switch-selector'
import { FullWidthButton, Input } from 'app/components'
import SafeAreaView from 'react-native-safe-area-view'
import { SubHeader } from 'app/components/Headers'
import { percentWidth, percentHeight, colors, fonts, screenWidth, containers } from 'app/styles'
import * as api from 'app/lib/api'
import { Icon } from 'react-native-elements'
import { TextInputMask } from 'react-native-masked-text'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { getState } from 'app/lib/react-simply'

export default function AddBankAccount({ navigation }) {
  const [, dispatch] = getState()
  const amount = navigation.getParam('amount', false)
  const symbol = navigation.getParam('symbol', false)
  const [accountNumber, setAccountNumber] = useState('')
  const [sortCode, setSortCode] = useState('')
  const [IBAN, setIBAN] = useState('')
  const [ABA, setABA] = useState('')
  const [SWIFT, setSWIFT] = useState('')
  const [reference, setReference] = useState('')
  const [usAccount, setUsAccount] = useState(false)

  const switchOptions = [
    { label: 'Other', value: false },
    { label: 'US', value: true },
  ]

  const sortCodeRef = useRef(null)
  const ibanRef = useRef(null)
  const abaRef = useRef(null)

  const handleAddBankAccount = async () => {
    const rawIBAN = !usAccount ? ibanRef.current.getRawValue() : ''
    const rawSortCode = !usAccount ? sortCodeRef.current.getRawValue() : ''
    const rawABA = usAccount ? abaRef.current.getRawValue() : ''
    const bankDetails = {
      account_number: accountNumber,
      swift: SWIFT,
      reference,
    }
    if (usAccount) {
      bankDetails.aba = rawABA
    } else {
      bankDetails.iban = rawIBAN
      bankDetails.sort_code = sortCode
    }
    const { id } = await api.addBankAccount({ bankDetails })
    if (id) {
      const bankAccount = {
        id,
        accountNumber,
        sortCode: bankDetails.sort_code && bankDetails.sort_code.length > 0 ? rawSortCode : '',
        iban: IBAN.length > 0 ? rawIBAN : '',
        aba: ABA.length > 0 ? rawABA : '',
        swift: SWIFT,
        reference,
      }
      dispatch({ type: 'addBankAccount', payload: bankAccount })
      if (amount && symbol) navigation.navigate('WithdrawalConfirmation', { amount, bankAccount, symbol })
      else navigation.goBack()
    }
  }

  return (
    <SafeAreaView forceInset={{ top: 'always' }} style={{ flex: 1 }}>
      <SubHeader title="Add Bank Account" navigation={navigation} />
      <KeyboardAwareScrollView extraScrollHeight={20} style={containers.screenContainer}>
        <View style={{ height: '18%', justifyContent: 'center', alignItems: 'center' }}>
          <Icon
            raised
            type="font-awesome"
            name="bank"
            color={colors.secondaryColor}
          />
        </View>
        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ fontFamily: fonts.avenirBold, fontSize: percentWidth(4.5) }}>
            Bank Details
          </Text>
          <View style={{ width: percentWidth(30), marginTop: percentWidth(6) }}>
            <SwitchSelector
              initial={0}
              onPress={(value) => setUsAccount(value)}
              textColor={colors.text}
              selectedColor={colors.white}
              buttonColor={colors.primaryColor}
              fontSize={percentWidth(3.8)}
              hasPadding
              height={percentWidth(9)}
              options={switchOptions}
            />
          </View>
        </View>
        <View style={{ height: percentHeight(45), justifyContent: 'space-around', alignItems: 'center', marginTop: percentWidth(5) }}>
          <Input
            keyboardType="number-pad"
            returnKeyType="done"
            fontSize={percentWidth(4.1)}
            placeholder="Account Number"
            onChangeText={(value) => setAccountNumber(value)}
            value={accountNumber}
            autoCorrect={false}
            height={12}
            width={80}
            borderRadius={3}
            maxLength={17}
          />
          {!usAccount && (
            <TextInputMask
              ref={sortCodeRef}
              fontSize={percentWidth(4.1)}
              placeholder="Sort Code"
              placeholderTextColor={colors.lightText}
              type="custom"
              options={{
                mask: '99-99-99',
                getRawValue: (value) => value.replace(/-+/g, ''),
              }}
              keyboardType="number-pad"
              returnKeyType="done"
              onChangeText={(value) => setSortCode(value)}
              value={sortCode}
              autoCorrect={false}
              height={12}
              width={80}
              borderRadius={3}
              borderWidth={0}
              style={s.textInput}
            />
          )}
          {usAccount ? (
            <TextInputMask
              ref={abaRef}
              fontSize={percentWidth(4.1)}
              placeholder="Routing Number"
              placeholderTextColor={colors.lightText}
              type="custom"
              options={{
                mask: 'SSSS SSSS SSSS SSSS SSSS SSSS SSSS SSSS SSSS',
                getRawValue: (value) => value.replace(/\s+/g, ''),
              }}
              keyboardType="name-phone-pad"
              returnKeyType="done"
              onChangeText={(value) => setABA(value.toUpperCase())}
              value={ABA}
              autoCorrect={false}
              height={12}
              width={80}
              borderRadius={3}
              borderWidth={0}
              style={s.textInput}
            />
          ) : (
            <TextInputMask
              ref={ibanRef}
              fontSize={percentWidth(4.1)}
              placeholder="IBAN"
              placeholderTextColor={colors.lightText}
              type="custom"
              options={{
                mask: 'SSSS SSSS SSSS SSSS SSSS SSSS SSSS SSSS SSSS',
                getRawValue: (value) => value.replace(/\s+/g, ''),
              }}
              keyboardType="name-phone-pad"
              returnKeyType="done"
              onChangeText={(value) => setIBAN(value.toUpperCase())}
              value={IBAN}
              autoCorrect={false}
              height={12}
              width={80}
              borderRadius={3}
              borderWidth={0}
              style={s.textInput}
            />
          )}
          <TextInputMask
            fontSize={percentWidth(4.1)}
            placeholder="SWIFT"
            placeholderTextColor={colors.lightText}
            type="custom"
            options={{ mask: 'SSSSSSSSSSS' }}
            keyboardType="name-phone-pad"
            returnKeyType="done"
            onChangeText={(value) => setSWIFT(value.toUpperCase())}
            value={SWIFT}
            autoCorrect={false}
            height={12}
            width={80}
            borderRadius={3}
            borderWidth={0}
            style={s.textInput}
          />
          <TextInputMask
            fontSize={percentWidth(4.1)}
            placeholder="Reference (optional)"
            placeholderTextColor={colors.lightText}
            type="custom"
            options={{ mask: 'SSSSSSSSSSSSSSSSSSSSSSSSS' }}
            keyboardType="name-phone-pad"
            returnKeyType="done"
            onChangeText={(value) => setReference(value.toUpperCase())}
            value={reference}
            autoCorrect={false}
            height={12}
            width={80}
            borderRadius={3}
            borderWidth={0}
            style={s.textInput}
          />
        </View>
      </KeyboardAwareScrollView>
      <FullWidthButton
        condition={usAccount ? !accountNumber || !ABA || !SWIFT : !accountNumber || !sortCode || !IBAN || !SWIFT}
        onPress={(handleAddBankAccount)}
        gradient
        title="Add Bank"
        width={screenWidth * 0.7}
        titleSize={percentWidth(4.3)}
        height={screenWidth * 0.14}
        borderRadius={5}
      />
    </SafeAreaView>
  )
}

const s = StyleSheet.create({
  textInput: {
    fontSize: percentWidth(4.1),
    color: colors.text,
    fontFamily: fonts.regular,
    justifyContent: 'center',
    marginVertical: 4,
    borderColor: colors.inputBorder,
    borderWidth: 1,
    borderRadius: percentWidth(3),
    height: percentWidth(12),
    width: percentWidth(80),
    paddingLeft: percentWidth(5),
    paddingRight: percentWidth(5),
    paddingTop: percentWidth(2),
    paddingBottom: percentWidth(2),
  },
})
