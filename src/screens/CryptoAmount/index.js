import React, { useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import SafeAreaView from 'react-native-safe-area-view'
import { SubHeader } from 'app/components/Headers'
import { getState } from 'app/lib/react-simply'
import { format } from 'app/lib/currency'
import { navigateToScreen } from 'app/lib/auth/utils'
import { FullWidthButton } from 'app/components'
import { Icon } from 'react-native-elements'
import * as api from 'app/lib/api'
import { fonts, colors, screenHeight, containers, percentWidth, percentHeight } from 'app/styles'

export default function CryptoAmount({ navigation }) {
  const [amount, setAmount] = useState('')
  const [disabled, setDisabled] = useState(false)
  const [disabledDecimal, setDisabledDecimal] = useState(true)
  const [disabledZero, setDisabledZero] = useState(true)
  const [{ purchase, user: { locales, kyc }, currencies }, dispatch] = getState()

  const handlePurchase = async () => {
    let usAmount = amount
    if (purchase.currency !== 'USD') {
      const response = await api.convertCurrencies({ from: purchase.currency, to: 'USD', amount: parseFloat(amount) })
      usAmount = response.toAmount
    }

    if (usAmount < 1000 || kyc.confirmed === 'verified') {
      dispatch({ type: 'setPurchase', payload: { amount, type: 'one_time_purchase', source: 'coinbase' } })
      navigation.navigate('CryptoReload')
    } else navigateToScreen('CryptoReload', kyc, navigation.navigate)
  }

  const handleNumberPress = (number) => {
    let newNumber
    if (!number) newNumber = amount.slice(0, -1)
    else newNumber = `${amount}${number}`
    if ((!!newNumber.split('.')[1] && newNumber.split('.')[1].length === 2) || newNumber.length >= 7) setDisabled(true)
    else setDisabled(false)
    if (newNumber.includes('.') || !newNumber) setDisabledDecimal(true)
    else setDisabledDecimal(false)
    if (newNumber) setDisabledZero(false)
    else setDisabledZero(true)
    setAmount(newNumber)
  }

  const fontSizer = (fontSize) => {
    if (amount.length === 4) return fontSize * 0.92
    if (amount.length === 5) return fontSize * 0.86
    if (amount.length === 6) return fontSize * 0.80
    if (amount.length === 7) return fontSize * 0.74
    if (amount.length >= 8) return fontSize * 0.7
    return fontSize
  }

  return (
    <SafeAreaView forceInset={{ top: 'always', bottom: 'always' }} style={{ flex: 1 }}>
      <SubHeader title="Enter Amount" navigation={navigation} />
      <View style={[containers.screenContainer, { justifyContent: 'flex-end' }]}>
        <View style={{ width: percentWidth(100), justifyContent: 'center', alignItems: 'center', flexGrow: 1 }}>
          <View style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
            <Text style={[styles.amount, { fontSize: fontSizer(percentWidth(14)) }]}>{`${format(amount, locales, currencies[purchase.currency].decimals)}`}</Text>
            <Text style={[styles.character, { fontSize: fontSizer(percentWidth(7)), bottom: percentWidth(2.1) }]}>{` ${purchase.currency}`}</Text>
          </View>
        </View>
        <View style={{
          height: percentHeight(34),
          width: percentWidth(100),
          flexDirection: 'row',
        }}
        >
          <View style={styles.outsideColumn}>
            <TouchableOpacity
              onPress={() => handleNumberPress('1')}
              disabled={disabled}
              style={styles.numberContainer}
            >
              <Text style={styles.number}>1</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleNumberPress('4')}
              disabled={disabled}
              style={styles.numberContainer}
            >
              <Text style={styles.number}>4</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleNumberPress('7')}
              disabled={disabled}
              style={styles.numberContainer}
            >
              <Text style={styles.number}>7</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleNumberPress('.')}
              disabled={disabledDecimal}
              style={styles.numberContainer}
            >
              <Text style={styles.number}>.</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.insideColumn}>
            <TouchableOpacity
              onPress={() => handleNumberPress('2')}
              disabled={disabled}
              style={styles.numberContainer}
            >
              <Text style={styles.number}>2</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleNumberPress('5')}
              disabled={disabled}
              style={styles.numberContainer}
            >
              <Text style={styles.number}>5</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleNumberPress('8')}
              disabled={disabled}
              style={styles.numberContainer}
            >
              <Text style={styles.number}>8</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleNumberPress('0')}
              disabled={disabled || disabledZero}
              style={styles.numberContainer}
            >
              <Text style={styles.number}>0</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.outsideColumn}>
            <TouchableOpacity
              onPress={() => handleNumberPress('3')}
              disabled={disabled}
              style={styles.numberContainer}
            >
              <Text style={styles.number}>3</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleNumberPress('6')}
              disabled={disabled}
              style={styles.numberContainer}
            >
              <Text style={styles.number}>6</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleNumberPress('9')}
              disabled={disabled}
              style={styles.numberContainer}
            >
              <Text style={styles.number}>9</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleNumberPress(null)}
              style={styles.numberContainer}
            >
              <Icon
                name="backspace"
                type="material-community"
                color={colors.text}
                size={screenHeight * 0.03}
              />
            </TouchableOpacity>
          </View>
        </View>
        <FullWidthButton
          onPress={handlePurchase}
          condition={!amount}
          title="Next"
        />
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  amount: {
    fontFamily: fonts.regular,
    color: colors.text,
    fontSize: percentWidth(15),
  },
  character: {
    fontFamily: fonts.regular,
    color: colors.text,
    fontSize: percentWidth(8),
  },
  numberContainer: {
    height: '25%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  outsideColumn: { width: '33%' },
  insideColumn: { width: '34%' },
  number: {
    fontFamily: fonts.regular,
    fontSize: percentWidth(7),
    color: colors.text,
  },
})
